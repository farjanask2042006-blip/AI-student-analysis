/**
 * EduPulse AI - Formatting Utilities
 */

export function formatPercentage(val) {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${Math.round(Number(val))}%`;
}

export function formatScore(val) {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${Math.round(Number(val))}/100`;
}

export function formatCGPA(val) {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return Number(val).toFixed(2);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}
