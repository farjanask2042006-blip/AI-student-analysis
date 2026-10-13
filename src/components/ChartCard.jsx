import React from 'react';
import { Info } from 'lucide-react';

export function ChartCard({ 
  title, 
  subtitle, 
  tooltip = null, 
  badge = null, 
  action = null, 
  children,
  className = ''
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {badge && (
              <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {badge}
              </span>
            )}
            {tooltip && (
              <div className="group relative cursor-help">
                <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                <div className="pointer-events-none absolute left-0 bottom-full mb-1.5 hidden w-56 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100 z-30">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        {children}
      </div>
    </div>
  );
}
