import React from 'react';
import { HelpCircle, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';

export function ScoreBreakdown({ scoreResult }) {
  if (!scoreResult) return null;

  const { isComplete, roundedScore, components, missingFields, explanation, partialScore } = scoreResult;

  const componentList = Object.entries(components || {}).map(([key, data]) => ({
    key,
    ...data,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">Why this score?</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Explainable Methodology
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculated deterministically from 6 institutional dimensions. Weights are illustrative prototype assumptions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Final Score</div>
            <div className="text-2xl font-bold text-slate-900">
              {isComplete ? `${roundedScore}/100` : 'Incomplete'}
            </div>
          </div>
          {isComplete ? (
            <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
          )}
        </div>
      </div>

      {/* Incomplete Warning */}
      {!isComplete && (
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold">Missing required metrics: </span>
            {missingFields.join(', ')}. Official score withheld to prevent automated bias.
            {partialScore !== null && (
              <span className="block mt-1 text-amber-800">
                Informative Partial Score from available dimensions: <strong>{partialScore}/100</strong> (Caution: Not official benchmark).
              </span>
            )}
          </div>
        </div>
      )}

      {/* Component Breakdown Table & Progress Bars */}
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
          <div className="col-span-4 sm:col-span-3">Dimension</div>
          <div className="col-span-2 text-center">Raw Input</div>
          <div className="col-span-2 text-center">Normalized</div>
          <div className="col-span-2 text-center">Weight</div>
          <div className="col-span-2 sm:col-span-3 text-right">Contribution</div>
        </div>

        {componentList.map((comp) => {
          const maxContr = (100 * comp.weight).toFixed(1);
          const contrPct = comp.contribution !== null ? Math.min(100, (comp.contribution / maxContr) * 100) : 0;

          return (
            <div key={comp.key} className="py-2.5 border-b border-slate-50 last:border-0">
              <div className="grid grid-cols-12 items-center text-xs">
                <div className="col-span-4 sm:col-span-3 font-medium text-slate-800 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${comp.isMissing ? 'bg-amber-400' : 'bg-blue-500'}`} />
                  {comp.name}
                </div>

                <div className="col-span-2 text-center text-slate-600">
                  {comp.raw !== null ? `${comp.raw} ${comp.rawUnit}` : <span className="text-amber-600 font-medium">Missing</span>}
                </div>

                <div className="col-span-2 text-center text-slate-600">
                  {comp.normalized !== null ? `${comp.normalized} / 100` : '—'}
                </div>

                <div className="col-span-2 text-center text-slate-500 font-mono">
                  {Math.round(comp.weight * 100)}%
                </div>

                <div className="col-span-2 sm:col-span-3 text-right font-semibold text-slate-800">
                  {comp.contribution !== null ? (
                    <span>
                      {comp.contribution} <span className="text-slate-400 font-normal">/ {maxContr} pts</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">0 pts (Missing)</span>
                  )}
                </div>
              </div>

              {/* Progress Bar showing contribution vs maximum */}
              <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    comp.isMissing
                      ? 'bg-amber-300'
                      : contrPct >= 75
                      ? 'bg-blue-600'
                      : contrPct >= 50
                      ? 'bg-teal-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${comp.isMissing ? 0 : contrPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Banner */}
      <div className="mt-5 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong>Calculation Audit: </strong>
        {explanation}
      </div>
    </div>
  );
}
