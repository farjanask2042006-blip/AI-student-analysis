/**
 * EduPulse AI - Risk Identification Engine
 * 
 * Configurable, explainable heuristic thresholds for academic and placement flags.
 * Used for early support recommendations, not automated student judgment or punishment.
 */

export const DEFAULT_THRESHOLDS = {
  academicCGPABenchmark: 6.0,          // CGPA below 6.0 triggers academic review
  attendanceBenchmarkPct: 75,          // Attendance below 75% triggers attendance review
  placementReadinessBenchmarkPct: 50,  // Placement readiness below 50% triggers placement support
  priorityScoreThreshold: 50,          // Calculated score below 50 triggers priority review
};

/**
 * Evaluates academic review need
 * @param {Object} student 
 * @param {Object} thresholds 
 * @returns {Object}
 */
export function evaluateAcademicRisk(student, thresholds = DEFAULT_THRESHOLDS) {
  const reasons = [];
  const missing = [];

  const hasCGPA = student.cgpa !== null && student.cgpa !== undefined && !isNaN(student.cgpa);
  const hasAttendance = student.attendance_pct !== null && student.attendance_pct !== undefined && !isNaN(student.attendance_pct);

  if (!hasCGPA) missing.push('CGPA');
  if (!hasAttendance) missing.push('Attendance');

  if (missing.length > 0 && (!hasCGPA && !hasAttendance)) {
    return {
      flagged: false,
      status: 'Incomplete Data',
      badgeColor: 'amber',
      reasons: [`Missing essential indicators: ${missing.join(', ')}`],
      isMissingData: true,
    };
  }

  if (hasCGPA && Number(student.cgpa) < thresholds.academicCGPABenchmark) {
    reasons.push(`CGPA (${Number(student.cgpa).toFixed(2)}) is below institutional review threshold (${thresholds.academicCGPABenchmark.toFixed(1)})`);
  }

  if (hasAttendance && Number(student.attendance_pct) < thresholds.attendanceBenchmarkPct) {
    reasons.push(`Attendance rate (${Number(student.attendance_pct)}%) is below mandatory threshold (${thresholds.attendanceBenchmarkPct}%)`);
  }

  const flagged = reasons.length > 0;

  return {
    flagged,
    status: flagged ? 'Review Recommended' : 'No Current Flag',
    badgeColor: flagged ? 'rose' : 'emerald',
    reasons,
    isMissingData: missing.length > 0,
  };
}

/**
 * Evaluates placement readiness support need
 * @param {Object} student 
 * @param {Object} thresholds 
 * @returns {Object}
 */
export function evaluatePlacementRisk(student, thresholds = DEFAULT_THRESHOLDS) {
  const reasons = [];
  const hasPlacement = student.placement_readiness_pct !== null && 
                       student.placement_readiness_pct !== undefined && 
                       !isNaN(student.placement_readiness_pct);

  if (!hasPlacement) {
    return {
      flagged: false,
      status: 'Incomplete Data',
      badgeColor: 'amber',
      reasons: ['Placement readiness assessment data unavailable'],
      isMissingData: true,
    };
  }

  const val = Number(student.placement_readiness_pct);
  if (val < thresholds.placementReadinessBenchmarkPct) {
    reasons.push(`Placement readiness score (${val}%) is below recommended threshold (${thresholds.placementReadinessBenchmarkPct}%)`);
  }

  const flagged = reasons.length > 0;

  return {
    flagged,
    status: flagged ? 'Support Recommended' : 'On Track',
    badgeColor: flagged ? 'amber' : 'teal',
    reasons,
    isMissingData: false,
  };
}

/**
 * Evaluates overall priority review flag
 * @param {Object} student 
 * @param {Object} scoreResult (from scoring engine)
 * @param {Object} academicRiskResult 
 * @param {Object} placementRiskResult 
 * @param {Object} thresholds 
 * @returns {Object}
 */
export function evaluatePriorityReview(
  student, 
  scoreResult, 
  academicRiskResult, 
  placementRiskResult, 
  thresholds = DEFAULT_THRESHOLDS
) {
  const reasons = [];

  if (scoreResult && scoreResult.isComplete && scoreResult.roundedScore < thresholds.priorityScoreThreshold) {
    reasons.push(`Overall Success Score (${scoreResult.roundedScore}/100) is below priority threshold (${thresholds.priorityScoreThreshold})`);
  }

  if (academicRiskResult.flagged && placementRiskResult.flagged) {
    reasons.push('Co-occurring academic review and placement support flags require consolidated faculty mentorship');
  }

  const flagged = reasons.length > 0;

  return {
    flagged,
    status: flagged ? 'Priority Follow-Up' : 'Standard Routine',
    badgeColor: flagged ? 'purple' : 'slate',
    reasons,
  };
}

/**
 * Comprehensive risk summary for a student
 * @param {Object} student 
 * @param {Object} scoreResult 
 * @param {Object} thresholds 
 * @returns {Object}
 */
export function evaluateAllRisks(student, scoreResult, thresholds = DEFAULT_THRESHOLDS) {
  const academic = evaluateAcademicRisk(student, thresholds);
  const placement = evaluatePlacementRisk(student, thresholds);
  const priority = evaluatePriorityReview(student, scoreResult, academic, placement, thresholds);

  return {
    academic,
    placement,
    priority,
    needsSupport: academic.flagged || placement.flagged || priority.flagged,
  };
}
