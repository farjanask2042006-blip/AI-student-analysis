import React from 'react';
import { SearchX } from 'lucide-react';

export function EmptyState({ 
  title = 'No student records match', 
  message = 'Try modifying your search criteria or resetting filters to view active cohort records.', 
  action = null 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
      <div className="p-3 bg-slate-100 rounded-full text-slate-500 mb-3">
        <SearchX className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{message}</p>
      {action}
    </div>
  );
}
