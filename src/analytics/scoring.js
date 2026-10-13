/**
 * EduPulse AI - Student Success Scoring Engine
 * 
 * Note: These weights and formulas are illustrative prototype assumptions designed for 
 * educational decision-support, not an automated judgment system or official KPMG formula.
 * The platform is an explainable decision-support tool.
 */

export const DEFAULT_WEIGHTS = {
  academic: 0.30,      // Academic performance (CGPA normalized to 0-100)
  attendance: 0.20,    // Attendance percentage
  assignment: 0.15,    // Assignment completion / LMS engagement percentage
  placement: 0.20,     // Placement readiness percentage
  skills: 0.10,        // Technical / soft skills assessment score (0-100)
  engagement: 0.05,    // Campus & extracurricular engagement score (0-100)
};

/**
 * Normalizes CGPA (0-10 scale) to 0-100 scale
 * @param {number|null|undefined} cgpa 
 * @returns {number|null}
 */
export function normalizeCGPA(cgpa) {
  if (cgpa === null || cgpa === undefined || isNaN(cgpa)) return null;
  const num = Number(cgpa);
  if (num < 0 || num > 10) return null;
  return Number(((num / 10) * 100).toFixed(2));
}

/**
 * Validates whether a percentage or metric is in valid [0, 100] range
 * @param {number|null|undefined} val 
 * @returns {boolean}
 */
export function isValidPercentage(val) {
  if (val === null || val === undefined || isNaN(val)) return false;
  const num = Number(val);
  return num >= 0 && num <= 100;
}

/**
 * Calculates the explainable Student Success Score
 * 
 * Formula:
 * Success Score = (CGPA / 10 * 100) * 0.30 + Attendance * 0.20 + 
 *                 Assignment Completion * 0.15 + Placement Readiness * 0.20 + 
 *                 Skills * 0.10 + Engagement * 0.05
 * 
 * @param {Object} student 
 * @param {Object} customWeights 
 * @returns {Object} Structured calculation result
 */
export function calculateStudentSuccessScore(student = {}, customWeights = DEFAULT_WEIGHTS) {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  const missingFields = [];
  
  // 1. Academic (CGPA)
  const normCGPA = normalizeCGPA(student.cgpa);
  if (normCGPA === null) {
    missingFields.push('cgpa');
  }

  // 2. Attendance
  const hasAttendance = isValidPercentage(student.attendance_pct);
  if (!hasAttendance) {
    missingFields.push('attendance_pct');
  }

  // 3. Assignment Completion
  const hasAssignment = isValidPercentage(student.assignment_completion_pct);
  if (!hasAssignment) {
    missingFields.push('assignment_completion_pct');
  }

  // 4. Placement Readiness
  const hasPlacement = isValidPercentage(student.placement_readiness_pct);
  if (!hasPlacement) {
    missingFields.push('placement_readiness_pct');
  }

  // 5. Skills Score
  const hasSkills = isValidPercentage(student.skills_score);
  if (!hasSkills) {
    missingFields.push('skills_score');
  }

  // 6. Engagement Score
  const hasEngagement = isValidPercentage(student.engagement_score);
  if (!hasEngagement) {
    missingFields.push('engagement_score');
  }

  const components = {
    academic: {
      name: 'Academic Performance',
      raw: student.cgpa !== undefined && student.cgpa !== null ? Number(student.cgpa) : null,
      rawUnit: 'CGPA (0-10)',
      normalized: normCGPA,
      weight: weights.academic,
      contribution: normCGPA !== null ? Number((normCGPA * weights.academic).toFixed(2)) : null,
      isMissing: normCGPA === null,
    },
    attendance: {
      name: 'Attendance',
      raw: hasAttendance ? Number(student.attendance_pct) : null,
      rawUnit: '%',
      normalized: hasAttendance ? Number(student.attendance_pct) : null,
      weight: weights.attendance,
      contribution: hasAttendance ? Number((Number(student.attendance_pct) * weights.attendance).toFixed(2)) : null,
      isMissing: !hasAttendance,
    },
    assignment: {
      name: 'Assignment & LMS Completion',
      raw: hasAssignment ? Number(student.assignment_completion_pct) : null,
      rawUnit: '%',
      normalized: hasAssignment ? Number(student.assignment_completion_pct) : null,
      weight: weights.assignment,
      contribution: hasAssignment ? Number((Number(student.assignment_completion_pct) * weights.assignment).toFixed(2)) : null,
      isMissing: !hasAssignment,
    },
    placement: {
      name: 'Placement Readiness',
      raw: hasPlacement ? Number(student.placement_readiness_pct) : null,
      rawUnit: '%',
      normalized: hasPlacement ? Number(student.placement_readiness_pct) : null,
      weight: weights.placement,
      contribution: hasPlacement ? Number((Number(student.placement_readiness_pct) * weights.placement).toFixed(2)) : null,
      isMissing: !hasPlacement,
    },
    skills: {
      name: 'Technical & Professional Skills',
      raw: hasSkills ? Number(student.skills_score) : null,
      rawUnit: 'Score (0-100)',
      normalized: hasSkills ? Number(student.skills_score) : null,
      weight: weights.skills,
      contribution: hasSkills ? Number((Number(student.skills_score) * weights.skills).toFixed(2)) : null,
      isMissing: !hasSkills,
    },
    engagement: {
      name: 'Campus & Extracurricular Engagement',
      raw: hasEngagement ? Number(student.engagement_score) : null,
      rawUnit: 'Score (0-100)',
      normalized: hasEngagement ? Number(student.engagement_score) : null,
      weight: weights.engagement,
      contribution: hasEngagement ? Number((Number(student.engagement_score) * weights.engagement).toFixed(2)) : null,
      isMissing: !hasEngagement,
    },
  };

  // If any required field is missing, we return status 'INCOMPLETE'
  // and we do NOT fabricate an official score
  if (missingFields.length > 0) {
    // We provide a partialScore calculation strictly for exploratory reference with a disclaimer
    let availableWeight = 0;
    let accumulatedContribution = 0;

    Object.values(components).forEach((comp) => {
      if (!comp.isMissing && comp.contribution !== null) {
        availableWeight += comp.weight;
        accumulatedContribution += comp.contribution;
      }
    });

    const partialScore = availableWeight > 0 
      ? Math.round((accumulatedContribution / availableWeight)) 
      : null;

    return {
      score: null,
      roundedScore: null,
      status: 'INCOMPLETE',
      isComplete: false,
      missingFields,
      components,
      partialScore,
      explanation: `Student record has ${missingFields.length} missing indicator(s): ${missingFields.join(', ')}. Official Success Score cannot be calculated without complete input data to avoid bias.`,
    };
  }

  // Complete calculation
  const totalSum = 
    components.academic.contribution +
    components.attendance.contribution +
    components.assignment.contribution +
    components.placement.contribution +
    components.skills.contribution +
    components.engagement.contribution;

  const roundedScore = Math.round(totalSum);

  return {
    score: Number(totalSum.toFixed(2)),
    roundedScore,
    status: 'COMPLETE',
    isComplete: true,
    missingFields: [],
    components,
    partialScore: roundedScore,
    explanation: `Success Score of ${roundedScore}/100 calculated across 6 verified dimensions: Academic (${components.academic.contribution} pts), Attendance (${components.attendance.contribution} pts), Assignment (${components.assignment.contribution} pts), Placement (${components.placement.contribution} pts), Skills (${components.skills.contribution} pts), Engagement (${components.engagement.contribution} pts).`,
  };
}
