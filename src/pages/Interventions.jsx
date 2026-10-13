import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Briefcase, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  Filter, 
  UserCheck, 
  Calendar, 
  MessageSquare,
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { useStudentData } from '../context/StudentContext.jsx';
import { Header } from '../components/Header.jsx';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { InterventionModal } from '../components/InterventionModal.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { formatPercentage, formatScore, formatCGPA, formatDate } from '../utils/formatters.js';

export function Interventions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { students, interventions, loading, addIntervention, updateIntervention } = useStudentData();

  const activeTab = searchParams.get('tab') || 'academic';

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // Intervention Status Filter for Log view
  const [statusFilter, setStatusFilter] = useState('ALL');

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // 1. Academic Review Cohort (CGPA < 6.0 or Attendance < 75%)
  const academicCohort = useMemo(() => {
    return students.filter((s) => s.is_academic_risk);
  }, [students]);

  // 2. Placement Support Cohort (Placement < 50%)
  const placementCohort = useMemo(() => {
    return students.filter((s) => s.is_placement_risk);
  }, [students]);

  // 3. Combined / Priority Support Needs
  const combinedCohort = useMemo(() => {
    return students.filter((s) => s.is_priority_review);
  }, [students]);

  // 4. Incomplete Data Cohort
  const incompleteCohort = useMemo(() => {
    return students.filter((s) => !s.is_score_complete);
  }, [students]);

  // Filtered Interventions List
  const filteredInterventions = useMemo(() => {
    if (statusFilter === 'ALL') return interventions;
    return interventions.filter((i) => i.status === statusFilter);
  }, [interventions, statusFilter]);

  const handleOpenModal = (student = null) => {
    setSelectedStudentForModal(student);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <Header title="Risk & Intervention Center" subtitle="Loading cohorts..." />
        <div className="p-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Header
        title="Risk &amp; Intervention Center"
        subtitle="Review prioritized student cohorts and manage timely, supportive faculty actions"
      />

      <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Top Overview Action Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Proactive Faculty Decision-Support Workflow
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a risk category below to inspect students requiring early intervention and log structured follow-ups.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal(null)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs shadow-blue-500/20 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Intervention</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-medium">
          <button
            onClick={() => setTab('academic')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'academic'
                ? 'border-rose-600 text-rose-700 bg-rose-50/60'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Academic Review ({academicCohort.length})
          </button>

          <button
            onClick={() => setTab('placement')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'placement'
                ? 'border-amber-600 text-amber-700 bg-amber-50/60'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-600" />
            Placement Support ({placementCohort.length})
          </button>

          <button
            onClick={() => setTab('priority')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'priority'
                ? 'border-purple-600 text-purple-700 bg-purple-50/60'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-purple-600" />
            Priority / Combined Support ({combinedCohort.length})
          </button>

          <button
            onClick={() => setTab('incomplete')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'incomplete'
                ? 'border-slate-600 text-slate-800 bg-slate-100'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            Incomplete Data ({incompleteCohort.length})
          </button>

          <button
            onClick={() => setTab('logs')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-700 bg-blue-50/60'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListTodo className="w-4 h-4 text-blue-600" />
            Active Interventions Log ({interventions.length})
          </button>
        </div>

        {/* Tab 1: Academic Review View */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Academic Review Benchmark: </strong>
                Students triggered when CGPA &lt; 6.0 (out of 10.0) or Attendance rate &lt; 75%. Remedial tutoring or schedule review recommended.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academicCohort.map((s) => (
                <div key={s.student_id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{s.student_id}</span>
                      <RiskBadge type="academic" status={s.academic_risk_status} />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">{s.name}</h4>
                    <p className="text-xs text-slate-500">{s.department}</p>

                    <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">CGPA:</span>
                        <span className={`font-bold font-mono ${Number(s.cgpa) < 6.0 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {formatCGPA(s.cgpa)} / 10.0
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Attendance:</span>
                        <span className={`font-bold font-mono ${Number(s.attendance_pct) < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {formatPercentage(s.attendance_pct)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Success Score:</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {s.is_score_complete ? `${s.success_score}/100` : 'Incomplete'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[11px] font-semibold text-slate-600 uppercase">Trigger Reasons:</span>
                      <ul className="mt-1 text-xs text-rose-800 list-disc list-inside space-y-0.5">
                        {s.riskResult?.academic?.reasons?.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/students/${s.student_id}`)}
                      className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      View Profile →
                    </button>
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Intervene
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Placement Support View */}
        {activeTab === 'placement' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Briefcase className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Placement Support Benchmark: </strong>
                Students triggered when Placement Readiness &lt; 50%. Often includes students with strong classroom grades who need focused live coding, DSA sprints, or mock interview practice.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placementCohort.map((s) => (
                <div key={s.student_id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{s.student_id}</span>
                      <RiskBadge type="placement" status={s.placement_risk_status} />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">{s.name}</h4>
                    <p className="text-xs text-slate-500">{s.department}</p>

                    <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Placement Readiness:</span>
                        <span className="font-bold font-mono text-amber-700">
                          {formatPercentage(s.placement_readiness_pct)} (Target: 50%+)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">CGPA:</span>
                        <span className="font-bold font-mono text-slate-800">
                          {formatCGPA(s.cgpa)} / 10.0
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Technical Skills Score:</span>
                        <span className="font-bold font-mono text-slate-800">
                          {formatScore(s.skills_score)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[11px] font-semibold text-slate-600 uppercase">Recommendation:</span>
                      <p className="text-xs text-amber-900 mt-0.5">
                        {s.cgpa >= 7.5 
                          ? 'Divergence Cohort: Strong academic foundation. Fast-track with DSA pattern drills and mock HR interview simulation.'
                          : 'Comprehensive coaching in aptitude tests, resume structuring, and fundamental coding rounds.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/students/${s.student_id}`)}
                      className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      View Profile →
                    </button>
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Assign Career Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Priority Review View */}
        {activeTab === 'priority' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong>Overall Priority Review Rule: </strong>
                Students triggered when calculated Success Score &lt; 50/100 OR both Academic and Placement flags are concurrently active. Requires unified faculty mentorship.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {combinedCohort.map((s) => (
                <div key={s.student_id} className="bg-white rounded-xl border border-purple-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{s.student_id}</span>
                      <RiskBadge type="priority" status="Priority Follow-Up" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">{s.name}</h4>
                    <p className="text-xs text-slate-500">{s.department}</p>

                    <div className="mt-3 p-3 bg-purple-50/40 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Calculated Score:</span>
                        <span className="font-bold font-mono text-purple-900">{s.success_score}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">CGPA:</span>
                        <span className="font-bold font-mono text-rose-600">{formatCGPA(s.cgpa)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Attendance:</span>
                        <span className="font-bold font-mono text-rose-600">{formatPercentage(s.attendance_pct)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Placement:</span>
                        <span className="font-bold font-mono text-amber-700">{formatPercentage(s.placement_readiness_pct)}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[11px] font-semibold text-purple-900 uppercase">Priority Action Protocol:</span>
                      <p className="text-xs text-slate-700 mt-0.5">
                        Schedule mandatory parent-faculty consultation and establish individual learning remediation contract.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/students/${s.student_id}`)}
                      className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      View Profile →
                    </button>
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Record Priority Intervention
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Incomplete Data View */}
        {activeTab === 'incomplete' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <strong>Data Governance &amp; Ethics Audit: </strong>
                Official success scores are strictly withheld for these students to avoid false automated inferences. Faculty or admins must verify missing records.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incompleteCohort.map((s) => (
                <div key={s.student_id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{s.student_id}</span>
                      <RiskBadge type="academic" status="Incomplete Data" isMissing={true} />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">{s.name}</h4>
                    <p className="text-xs text-slate-500">{s.department}</p>

                    <div className="mt-3 p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs space-y-1 text-amber-900">
                      <strong>Missing Required Indicators: </strong>
                      <span className="font-mono">{s.scoreResult?.missingFields?.join(', ') || 'Unspecified'}</span>
                      {s.scoreResult?.partialScore !== null && (
                        <p className="text-[11px] text-slate-600 mt-1">
                          Informative partial score from recorded dimensions: {s.scoreResult.partialScore}/100.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => navigate('/data-management')}
                      className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Update via Data Management →
                    </button>
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Record Audit Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Active Interventions Log View */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Filter by Status */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status Filter:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-800"
                >
                  <option value="ALL">All Statuses ({interventions.length})</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <span className="text-xs text-slate-500">
                Showing {filteredInterventions.length} intervention records
              </span>
            </div>

            {filteredInterventions.length === 0 ? (
              <EmptyState
                title="No interventions found"
                message="No faculty intervention records match the selected status filter."
                action={
                  <button
                    onClick={() => handleOpenModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Create First Intervention
                  </button>
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredInterventions.map((inv) => (
                  <div key={inv.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-sm text-slate-900">{inv.intervention_type}</span>
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {inv.student_name} ({inv.student_id})
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          inv.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-4">
                        <span>Advisor: <strong>{inv.assigned_faculty}</strong></span>
                        <span>Due: {formatDate(inv.due_date)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {inv.description}
                    </p>

                    {inv.follow_up_notes && (
                      <div className="text-xs text-slate-600 pl-3 border-l-2 border-blue-500">
                        <strong>Advisor Notes: </strong>{inv.follow_up_notes}
                      </div>
                    )}

                    {/* Quick Status and Follow-up Update Controls */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Change Status:</span>
                        {['Pending', 'In Progress', 'Completed'].map((st) => (
                          <button
                            key={st}
                            onClick={() => updateIntervention(inv.id, { status: st })}
                            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                              inv.status === st
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate(`/students/${inv.student_id}`)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Inspect Student Profile →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <InterventionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addIntervention}
        initialStudent={selectedStudentForModal}
        availableStudents={students}
      />
    </div>
  );
}
