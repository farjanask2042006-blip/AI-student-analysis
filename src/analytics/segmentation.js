/**
 * EduPulse AI - Student Segmentation Engine
 * 
 * Partitions students into meaningful, actionable cohorts to allow targeted faculty interventions.
 */

export const SEGMENTS = {
  STRONG_ACADEMICS_PLACEMENT_READY: 'Strong academics, placement ready',
  STRONG_ACADEMICS_LOW_PLACEMENT: 'Strong academics, low placement readiness',
  NEEDS_ACADEMIC_SUPPORT: 'Needs academic support',
  NEEDS_ACADEMIC_AND_PLACEMENT: 'Needs academic and placement support',
  BALANCED_DEVELOPING: 'Balanced progress / Developing',
  INSUFFICIENT_DATA: 'Insufficient data',
};

/**
 * Classifies a student into a cohort segment
 * @param {Object} student 
 * @param {Object} scoreResult 
 * @param {Object} riskResult 
 * @returns {Object} { segment, description, recommendedFocus, badgeClass }
 */
export function classifyStudentSegment(student, scoreResult, riskResult) {
  // 1. Check for insufficient data
  if (!scoreResult || !scoreResult.isComplete) {
    return {
      segment: SEGMENTS.INSUFFICIENT_DATA,
      description: 'Incomplete metric profiles prevent objective categorization. Priority is data completion.',
      recommendedFocus: 'Audit missing institutional data points (LMS, attendance logs, or assessment scores).',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      color: '#64748b',
    };
  }

  const cgpa = Number(student.cgpa);
  const placement = Number(student.placement_readiness_pct);
  const isAcademicRisk = riskResult?.academic?.flagged ?? (cgpa < 6.0 || Number(student.attendance_pct) < 75);
  const isPlacementRisk = riskResult?.placement?.flagged ?? (placement < 50);

  // 2. High CGPA with low placement readiness (Critical segment for placement cells)
  if (cgpa >= 7.5 && isPlacementRisk) {
    return {
      segment: SEGMENTS.STRONG_ACADEMICS_LOW_PLACEMENT,
      description: 'Solid conceptual understanding but requires practical coding interview, aptitude, or soft skills coaching.',
      recommendedFocus: 'Enroll in coding bootcamps, resume review, and mock HR/technical interviews.',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      color: '#f59e0b',
    };
  }

  // 3. High CGPA and strong placement readiness
  if (cgpa >= 7.5 && placement >= 70) {
    return {
      segment: SEGMENTS.STRONG_ACADEMICS_PLACEMENT_READY,
      description: 'High-performing student excelling in coursework and career benchmarks.',
      recommendedFocus: 'Mentorship for Tier-1 companies, research opportunities, peer tutoring leadership.',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      color: '#10b981',
    };
  }

  // 4. Dual academic and placement support needed
  if (isAcademicRisk && isPlacementRisk) {
    return {
      segment: SEGMENTS.NEEDS_ACADEMIC_AND_PLACEMENT,
      description: 'Facing compounding challenges in both coursework/attendance and career readiness.',
      recommendedFocus: 'Schedule comprehensive 1-on-1 faculty counseling to identify root causes and build remedial plan.',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      color: '#ef4444',
    };
  }

  // 5. Academic support needed alone
  if (isAcademicRisk) {
    return {
      segment: SEGMENTS.NEEDS_ACADEMIC_SUPPORT,
      description: 'Coursework or attendance challenges warrant academic monitoring, despite reasonable placement prep.',
      recommendedFocus: 'Subject-specific tutoring, attendance barrier review, and assignment catch-up schedule.',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      color: '#f97316',
    };
  }

  // 6. Balanced progress / developing
  return {
    segment: SEGMENTS.BALANCED_DEVELOPING,
    description: 'Steady progression within expected baseline institutional parameters.',
    recommendedFocus: 'Encourage technical skill certifications and project building to boost placement readiness.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    color: '#3b82f6',
  };
}
