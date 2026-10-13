import { supabase, isSupabaseConfigured } from './supabase.js';

/**
 * Deterministic rule-based insights generator (Guaranteed offline / credential-free fallback)
 * @param {string} type 
 * @param {Object} payload 
 * @returns {Object} Structured insights
 */
export function generateRuleBasedInsights(type, payload) {
  if (type === 'student') {
    const { 
      student_id, 
      name, 
      cgpa, 
      attendance_pct, 
      placement_readiness_pct, 
      score, 
      is_score_complete, 
      segment, 
      riskResult,
      missingFields 
    } = payload;

    const summaryParts = [];
    if (!is_score_complete) {
      summaryParts.push(`Student record has missing fields (${missingFields?.join(', ')}). Comprehensive Success Score could not be finalized.`);
    } else {
      summaryParts.push(`Calculated Success Score is ${score}/100 with active classification in the '${segment}' cohort.`);
    }

    const concerns = [];
    const actions = [];
    const questions = [];
    const indicators = [];

    if (cgpa !== null && cgpa !== undefined) {
      indicators.push(`CGPA: ${cgpa}/10.0 (${cgpa < 6.0 ? 'Below benchmark 6.0' : 'Satisfactory'})`);
      if (cgpa < 6.0) {
        concerns.push(`Academic CGPA (${cgpa}) indicates struggle in core curricular subjects.`);
        actions.push('Recommend remedial subject tutoring sessions and peer study groups.');
        questions.push('Which specific theoretical courses or exam formats feel most demanding this semester?');
      }
    } else {
      concerns.push('CGPA record is currently unrecorded in institution data.');
      actions.push('Request immediate credit audit from registrar to confirm academic standing.');
    }

    if (attendance_pct !== null && attendance_pct !== undefined) {
      indicators.push(`Attendance: ${attendance_pct}% (${attendance_pct < 75 ? 'Below 75% threshold' : 'Regular'})`);
      if (attendance_pct < 75) {
        concerns.push(`Attendance at ${attendance_pct}% breaches the standard 75% requirement, risking exam debarment.`);
        actions.push('Conduct an attendance barrier review to assess health, commute, or personal challenges.');
        questions.push('Are there persistent logistical, schedule, or health factors impacting classroom attendance?');
      }
    }

    if (placement_readiness_pct !== null && placement_readiness_pct !== undefined) {
      indicators.push(`Placement Readiness: ${placement_readiness_pct}% (${placement_readiness_pct < 50 ? 'Below 50% target' : 'Job Ready'})`);
      if (placement_readiness_pct < 50) {
        concerns.push(`Placement readiness score (${placement_readiness_pct}%) falls short of campus hiring benchmarks.`);
        actions.push('Enroll student into intensive Data Structures coding sprints and mock interview simulations.');
        questions.push('Have you practiced live whiteboard coding or participated in departmental mock HR interviews?');
      }
    }

    // High academics but low placement readiness special cohort
    if (cgpa >= 7.5 && placement_readiness_pct < 50) {
      concerns.unshift('Divergence detected: High academic achievement is not translating to practical placement benchmarks.');
      actions.unshift('Prioritize practical hands-on assessments over additional textbook memorization.');
    }

    if (actions.length === 0) {
      actions.push('Maintain current positive academic trajectory.');
      actions.push('Encourage student to mentor junior peers or pursue high-tier competitive hackathons.');
      questions.push('Are you interested in exploring research publications or specialized industry certifications?');
    }

    return {
      summary: summaryParts.join(' '),
      supportingIndicators: indicators.length > 0 ? indicators : ['Standard baseline indicators logged.'],
      potentialConcerns: concerns.length > 0 ? concerns : ['No critical risk flags currently triggered.'],
      suggestedActions: actions,
      facultyQuestions: questions.length > 0 ? questions : ['What target industry domains are you planning to apply for?'],
      limitations: !is_score_complete 
        ? 'Data is incomplete. Insights are restricted to observed parameters and require administrative data completion.'
        : 'Rule-based heuristic insights derived strictly from institutional test datasets.',
      isFallback: true,
      model: 'Deterministic Rule-Based Fallback Engine',
    };
  }

  if (type === 'department') {
    const { department, totalStudents, avgScore, avgCGPA, avgAttendance, avgPlacement, academicFlagCount, placementFlagCount } = payload;
    return {
      summary: `Departmental analytics for ${department} indicate an average success score of ${avgScore}/100 across ${totalStudents} enrolled students.`,
      supportingIndicators: [
        `Average CGPA: ${avgCGPA} / 10.0`,
        `Average Attendance: ${avgAttendance}%`,
        `Average Placement Readiness: ${avgPlacement}%`,
        `Students flagged for Academic Review: ${academicFlagCount} (${Math.round((academicFlagCount / totalStudents) * 100)}%)`,
        `Students flagged for Placement Support: ${placementFlagCount} (${Math.round((placementFlagCount / totalStudents) * 100)}%)`,
      ],
      potentialConcerns: [
        placementFlagCount > totalStudents * 0.35 
          ? `High proportion (${placementFlagCount} students) require placement readiness interventions before the upcoming recruitment season.` 
          : 'Monitor attendance adherence in lower-performing lecture sections.',
      ],
      suggestedActions: [
        'Organize department-wide weekly coding contests and algorithmic problem-solving labs.',
        'Pair students identified in the "Needs Academic Support" segment with departmental teaching assistants.',
        'Schedule targeted alumni mock-interview clinics tailored for this discipline.',
      ],
      facultyQuestions: [
        `How can curriculum pacing in ${department} incorporate more practical project deliverables?`,
      ],
      limitations: 'Department-level aggregate synthesized from cross-sectional sample records.',
      isFallback: true,
      model: 'Deterministic Rule-Based Fallback Engine',
    };
  }

  // Segment or Cohort summary
  const { segmentName, count, pct } = payload;
  return {
    summary: `Cohort analysis for '${segmentName}' comprising ${count} students (${pct}% of active student body).`,
    supportingIndicators: [
      `Cohort size: ${count} students`,
      `Share of student population: ${pct}%`,
      'Calculated based on unified multi-dimensional scoring engine rules.',
    ],
    potentialConcerns: [
      segmentName.includes('low placement') 
        ? 'Significant gap between theoretical grade averages and live technical interview preparedness.'
        : segmentName.includes('academic support')
        ? 'Risk of falling behind course learning outcomes or experiencing attendance shortages.'
        : 'Sustaining high engagement throughout final semester recruitment cycles.',
    ],
    suggestedActions: [
      'Deploy targeted group workshop tailored specifically to this cohort profile.',
      'Notify respective faculty advisors for proactive check-ins during upcoming office hours.',
    ],
    facultyQuestions: [
      'What common prerequisite gaps or external constraints are shared by students in this cohort?',
    ],
    limitations: 'Segment level insights are heuristic recommendations for advisor guidance.',
    isFallback: true,
    model: 'Deterministic Rule-Based Fallback Engine',
  };
}

/**
 * Generates explainable insights using Supabase Edge Function (OpenAI) with automatic fallback
 * @param {'student'|'department'|'segment'} type 
 * @param {Object} payload 
 * @returns {Promise<Object>}
 */
export async function getAIInsights(type, payload) {
  // Check if Supabase Edge Function is reachable
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('student-insights', {
        body: { type, payload },
      });

      if (!error && data) {
        if (data.isFallback === false && data.insights) {
          return {
            ...data.insights,
            isFallback: false,
            model: data.model || 'OpenAI (via Edge Function)',
          };
        }
        if (data.isFallback) {
          console.info('Edge function returned fallback flag:', data.message || data.error);
        }
      }
    } catch (err) {
      console.warn('Supabase edge function invocation failed, using rule-based engine:', err.message);
    }
  }

  // Return guaranteed deterministic fallback
  return generateRuleBasedInsights(type, payload);
}
