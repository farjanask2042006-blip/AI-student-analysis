import { supabase, isSupabaseConfigured } from './supabase.js';
import { INITIAL_DEMO_STUDENTS } from '../data/demoStudents.js';
import { calculateStudentSuccessScore } from '../analytics/scoring.js';
import { evaluateAllRisks } from '../analytics/riskRules.js';
import { classifyStudentSegment } from '../analytics/segmentation.js';

const STORAGE_KEY_STUDENTS = 'edupulse_students_data_v1';

/**
 * Enriches a raw student record with calculated score, risks, and segment
 * @param {Object} rawStudent 
 * @returns {Object} Enriched student object
 */
export function enrichStudent(rawStudent) {
  const scoreResult = calculateStudentSuccessScore(rawStudent);
  const riskResult = evaluateAllRisks(rawStudent, scoreResult);
  const segmentResult = classifyStudentSegment(rawStudent, scoreResult, riskResult);

  return {
    ...rawStudent,
    scoreResult,
    riskResult,
    segmentResult,
    // Flattened convenient properties for tables/charts
    success_score: scoreResult.roundedScore,
    is_score_complete: scoreResult.isComplete,
    academic_risk_status: riskResult.academic.status,
    is_academic_risk: riskResult.academic.flagged,
    placement_risk_status: riskResult.placement.status,
    is_placement_risk: riskResult.placement.flagged,
    priority_review_status: riskResult.priority.status,
    is_priority_review: riskResult.priority.flagged,
    student_segment: segmentResult.segment,
  };
}

/**
 * Fetches all students either from Supabase or local storage / demo dataset
 * @returns {Promise<{ students: Array, source: 'supabase' | 'demo', error: Error|null }>}
 */
export async function getStudents() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('student_id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        return {
          students: data.map(enrichStudent),
          source: 'supabase',
          error: null,
        };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local demo data:', err.message);
    }
  }

  // Fallback to local storage or initial demo data
  let stored = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (raw) stored = JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read from localStorage', e);
  }

  const rawList = stored && stored.length > 0 ? stored : INITIAL_DEMO_STUDENTS;
  return {
    students: rawList.map(enrichStudent),
    source: 'demo',
    error: null,
  };
}

/**
 * Saves a list of students to local storage (or Supabase if enabled)
 * @param {Array} studentList 
 */
export async function saveStudents(studentList) {
  // Always update local cache
  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(studentList));
  } catch (e) {
    console.warn('Failed to cache to localStorage', e);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // Upsert into Supabase
      const toUpsert = studentList.map(s => ({
        student_id: s.student_id,
        name: s.name,
        department: s.department,
        semester: s.semester || 7,
        cgpa: s.cgpa,
        attendance_pct: s.attendance_pct,
        assignment_completion_pct: s.assignment_completion_pct,
        placement_readiness_pct: s.placement_readiness_pct,
        skills_score: s.skills_score,
        engagement_score: s.engagement_score,
        mentor: s.mentor || null,
      }));

      const { error } = await supabase.from('students').upsert(toUpsert, { onConflict: 'student_id' });
      if (error) console.error('Supabase upsert error:', error);
    } catch (err) {
      console.error('Supabase write error:', err);
    }
  }

  return studentList.map(enrichStudent);
}

/**
 * Resets student data back to initial demo dataset
 */
export function resetDemoStudents() {
  try {
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
  } catch (e) {
    // no-op
  }
  return INITIAL_DEMO_STUDENTS.map(enrichStudent);
}
