import React from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export function RiskBadge({ type = 'academic', status, isMissing = false, className = '' }) {
  if (isMissing || status === 'Incomplete Data') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 ${className}`}>
        <Clock className="w-3.5 h-3.5" />
        Incomplete Data
      </span>
    );
  }

  if (type === 'academic') {
    const isFlagged = status === 'Review Recommended';
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isFlagged
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        } ${className}`}
      >
        {isFlagged ? <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
        {status || (isFlagged ? 'Review Recommended' : 'No Current Flag')}
      </span>
    );
  }

  if (type === 'placement') {
    const isFlagged = status === 'Support Recommended';
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isFlagged
            ? 'bg-amber-50 text-amber-800 border border-amber-200'
            : 'bg-teal-50 text-teal-700 border border-teal-200'
        } ${className}`}
      >
        {isFlagged ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> : <CheckCircle className="w-3.5 h-3.5 text-teal-600" />}
        {status || (isFlagged ? 'Support Recommended' : 'On Track')}
      </span>
    );
  }

  if (type === 'priority') {
    const isPriority = status === 'Priority Follow-Up';
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isPriority
            ? 'bg-purple-100 text-purple-800 border border-purple-300 font-semibold shadow-xs'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        } ${className}`}
      >
        {isPriority && <AlertCircle className="w-3.5 h-3.5 text-purple-600" />}
        {status || (isPriority ? 'Priority Follow-Up' : 'Standard Routine')}
      </span>
    );
  }

  // Segment badge
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${className}`}>
      {status}
    </span>
  );
}
