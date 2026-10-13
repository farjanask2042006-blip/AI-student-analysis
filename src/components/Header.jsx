import React, { useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useStudentData } from '../context/StudentContext.jsx';
import { InterventionModal } from './InterventionModal.jsx';

export function Header({ title, subtitle }) {
  const { refreshData, loading, addIntervention, students } = useStudentData();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        {/* Main Header Bar */}
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="Refresh dataset from storage or database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs shadow-blue-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Intervention</span>
            </button>
          </div>
        </div>
      </header>

      <InterventionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addIntervention}
        availableStudents={students}
      />
    </>
  );
}
