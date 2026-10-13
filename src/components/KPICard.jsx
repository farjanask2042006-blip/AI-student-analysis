import React from 'react';

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue', 
  badge = null,
  onClick = null,
  active = false
}) {
  const colorStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600',
      borderHover: 'hover:border-blue-400',
      activeBorder: 'border-blue-500 ring-2 ring-blue-100',
    },
    teal: {
      iconBg: 'bg-teal-50 text-teal-600',
      borderHover: 'hover:border-teal-400',
      activeBorder: 'border-teal-500 ring-2 ring-teal-100',
    },
    violet: {
      iconBg: 'bg-violet-50 text-violet-600',
      borderHover: 'hover:border-violet-400',
      activeBorder: 'border-violet-500 ring-2 ring-violet-100',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600',
      borderHover: 'hover:border-rose-400',
      activeBorder: 'border-rose-500 ring-2 ring-rose-100',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      borderHover: 'hover:border-amber-400',
      activeBorder: 'border-amber-500 ring-2 ring-amber-100',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-600',
      borderHover: 'hover:border-slate-400',
      activeBorder: 'border-slate-500 ring-2 ring-slate-100',
    },
  };

  const scheme = colorStyles[color] || colorStyles.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${active ? scheme.activeBorder : 'border-slate-200'} ${onClick ? scheme.borderHover : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {badge && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg shrink-0 ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
