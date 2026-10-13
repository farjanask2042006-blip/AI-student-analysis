import { describe, it, expect } from 'vitest';
import { 
  normalizeCGPA, 
  isValidPercentage, 
  calculateStudentSuccessScore, 
  DEFAULT_WEIGHTS 
} from '../scoring.js';
import { 
  evaluateAcademicRisk, 
  evaluatePlacementRisk, 
  evaluatePriorityReview, 
  evaluateAllRisks 
} from '../riskRules.js';
import { 
  classifyStudentSegment, 
  SEGMENTS 
} from '../segmentation.js';

describe('Scoring Engine (scoring.js)', () => {
  it('normalizes CGPA accurately from 0-10 to 0-100 scale', () => {
    expect(normalizeCGPA(8.5)).toBe(85);
    expect(normalizeCGPA(10.0)).toBe(100);
    expect(normalizeCGPA(0.0)).toBe(0);
    expect(normalizeCGPA(5.23)).toBe(52.3);
  });

  it('rejects invalid or out-of-range CGPA values', () => {
    expect(normalizeCGPA(11.0)).toBeNull();
    expect(normalizeCGPA(-1.5)).toBeNull();
    expect(normalizeCGPA(null)).toBeNull();
    expect(normalizeCGPA(undefined)).toBeNull();
    expect(normalizeCGPA('invalid')).toBeNull();
  });

  it('validates percentages properly', () => {
    expect(isValidPercentage(85)).toBe(true);
    expect(isValidPercentage(0)).toBe(true);
    expect(isValidPercentage(100)).toBe(true);
    expect(isValidPercentage(105)).toBe(false);
    expect(isValidPercentage(-5)).toBe(false);
    expect(isValidPercentage(null)).toBe(false);
  });

  it('calculates exact Student Success Score with complete data', () => {
    // Student: CGPA 8.0 (80), Attendance 90, Assignment 80, Placement 70, Skills 85, Engagement 60
    // Expected: 80*0.3 + 90*0.2 + 80*0.15 + 70*0.2 + 85*0.1 + 60*0.05
    // = 24 + 18 + 12 + 14 + 8.5 + 3 = 79.5 -> rounds to 80
    const student = {
      cgpa: 8.0,
      attendance_pct: 90,
      assignment_completion_pct: 80,
      placement_readiness_pct: 70,
      skills_score: 85,
      engagement_score: 60,
    };

    const res = calculateStudentSuccessScore(student);
    expect(res.status).toBe('COMPLETE');
    expect(res.isComplete).toBe(true);
    expect(res.score).toBe(79.5);
    expect(res.roundedScore).toBe(80);
    expect(res.missingFields.length).toBe(0);
    expect(res.components.academic.contribution).toBe(24);
    expect(res.components.attendance.contribution).toBe(18);
  });

  it('handles missing fields without fabricating a false score or treating missing as 0', () => {
    const studentWithMissingData = {
      cgpa: 8.0,
      attendance_pct: 90,
      assignment_completion_pct: null, // missing
      placement_readiness_pct: 70,
      skills_score: 85,
      engagement_score: 60,
    };

    const res = calculateStudentSuccessScore(studentWithMissingData);
    expect(res.status).toBe('INCOMPLETE');
    expect(res.isComplete).toBe(false);
    expect(res.score).toBeNull();
    expect(res.roundedScore).toBeNull();
    expect(res.missingFields).toContain('assignment_completion_pct');
    expect(res.components.assignment.isMissing).toBe(true);
    expect(res.partialScore).not.toBeNull(); // informative partial score provided
  });
});

describe('Risk Rules Engine (riskRules.js)', () => {
  it('flags academic review if CGPA is below 6.0', () => {
    const student = { cgpa: 5.4, attendance_pct: 88 };
    const risk = evaluateAcademicRisk(student);
    expect(risk.flagged).toBe(true);
    expect(risk.status).toBe('Review Recommended');
    expect(risk.reasons[0]).toContain('CGPA');
  });

  it('flags academic review if attendance is below 75%', () => {
    const student = { cgpa: 7.8, attendance_pct: 68 };
    const risk = evaluateAcademicRisk(student);
    expect(risk.flagged).toBe(true);
    expect(risk.status).toBe('Review Recommended');
    expect(risk.reasons[0]).toContain('Attendance');
  });

  it('passes academic review when both CGPA and attendance meet benchmarks', () => {
    const student = { cgpa: 7.5, attendance_pct: 82 };
    const risk = evaluateAcademicRisk(student);
    expect(risk.flagged).toBe(false);
    expect(risk.status).toBe('No Current Flag');
  });

  it('flags placement risk if placement readiness is below 50%', () => {
    const student = { placement_readiness_pct: 42 };
    const risk = evaluatePlacementRisk(student);
    expect(risk.flagged).toBe(true);
    expect(risk.status).toBe('Support Recommended');
  });

  it('marks priority review if both academic and placement flags are active', () => {
    const student = { cgpa: 5.2, attendance_pct: 68, placement_readiness_pct: 35 };
    const scoreRes = { isComplete: true, roundedScore: 48 };
    const acad = evaluateAcademicRisk(student);
    const place = evaluatePlacementRisk(student);
    const priority = evaluatePriorityReview(student, scoreRes, acad, place);
    
    expect(priority.flagged).toBe(true);
    expect(priority.status).toBe('Priority Follow-Up');
  });
});

describe('Student Segmentation Engine (segmentation.js)', () => {
  it('classifies Strong academics, low placement readiness (CGPA >= 7.5, Placement < 50)', () => {
    const student = { cgpa: 8.8, attendance_pct: 85, placement_readiness_pct: 40 };
    const scoreRes = calculateStudentSuccessScore({
      ...student,
      assignment_completion_pct: 90,
      skills_score: 80,
      engagement_score: 70,
    });
    const risks = evaluateAllRisks(student, scoreRes);
    const seg = classifyStudentSegment(student, scoreRes, risks);
    
    expect(seg.segment).toBe(SEGMENTS.STRONG_ACADEMICS_LOW_PLACEMENT);
  });

  it('classifies Strong academics, placement ready (CGPA >= 7.5, Placement >= 70)', () => {
    const student = { cgpa: 9.1, attendance_pct: 95, placement_readiness_pct: 88 };
    const scoreRes = calculateStudentSuccessScore({
      ...student,
      assignment_completion_pct: 95,
      skills_score: 90,
      engagement_score: 85,
    });
    const risks = evaluateAllRisks(student, scoreRes);
    const seg = classifyStudentSegment(student, scoreRes, risks);
    
    expect(seg.segment).toBe(SEGMENTS.STRONG_ACADEMICS_PLACEMENT_READY);
  });

  it('classifies Insufficient data when metrics are missing', () => {
    const student = { cgpa: 8.0 };
    const scoreRes = calculateStudentSuccessScore(student);
    const risks = evaluateAllRisks(student, scoreRes);
    const seg = classifyStudentSegment(student, scoreRes, risks);
    
    expect(seg.segment).toBe(SEGMENTS.INSUFFICIENT_DATA);
  });
});
