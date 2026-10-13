import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  PlusCircle, 
  Calendar, 
  UserCheck, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Trophy, 
  FileCheck,
  TrendingUp,
  ShieldAlert,
  Info
} from 'lucide-react';
import { 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useStudentData } from '../context/StudentContext.jsx';
import { Header } from '../components/Header.jsx';
import { ScoreBreakdown } from '../components/ScoreBreakdown.jsx';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { InterventionModal } from '../components/InterventionModal.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { getAIInsights } from '../lib/aiService.js';
import { formatPercentage, formatScore, formatCGPA, formatDate } from '../utils/formatters.js';

export function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, interventions, addIntervention, updateIntervention } = useStudentData();

  // Find student by ID
  const student = useMemo(() => {
    return students.find((s) => s.student_id === id);
  }, [students, id]);

  // Interventions for this student
  const studentInterventions = useMemo(() => {
    return interventions.filter((i) => i.student_id === id);
  }, [interventions, id]);

  // AI Insights State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Intervention Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Trigger AI analysis
  const handleGenerateAIInsights = async () => {
    if (!student) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await getAIInsights('student', {
        student_id: student.student_id,
        name: student.name,
        department: student.department,
        semester: student.semester || 7,
        cgpa: student.cgpa,
        attendance_pct: student.attendance_pct,
        assignment_completion_pct: student.assignment_completion_pct,
        placement_readiness_pct: student.placement_readiness_pct,
        skills_score: student.skills_score,
        engagement_score: student.engagement_score,
        score: student.success_score,
        is_score_complete: student.is_score_complete,
        segment: student.student_segment,
        academicRisk: student.academic_risk_status,
        placementRisk: student.placement_risk_status,
        missingFields: student.scoreResult?.missingFields || [],
      });
      setAiInsights(result);
    } catch (err) {
      console.error('Failed to generate insights:', err);
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <Header title="Student Profile" subtitle="Student not found" />
        <div className="p-12 text-center max-w-md mx-auto">
          <p className="text-slate-600 mb-4">No student record found with ID: <strong>{id}</strong></p>
          <button
            onClick={() => navigate('/students')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Student Explorer
          </button>
        </div>
      </div>
    );
  }

  const { scoreResult, riskResult, segmentResult } = student;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Header
        title={`Student Profile: ${student.name}`}
        subtitle={`${student.department} • Semester ${student.semester || 7} • Demo ID: ${student.student_id}`}
      />

      <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/students')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateAIInsights}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs shadow-indigo-500/20 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
              <span>{aiLoading ? 'Analyzing Insights...' : 'Generate AI Explanation'}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs shadow-blue-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Intervention</span>
            </button>
          </div>
        </div>

        {/* Top Profile Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white text-xl font-bold tracking-wider shadow-sm shrink-0">
                {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {student.student_id}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${segmentResult?.badgeClass || 'bg-slate-100'}`}>
                    {student.student_segment}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    {student.department}
                  </span>
                  <span>•</span>
                  <span>Semester {student.semester || 7}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    Advisor: {student.mentor || 'Assigned Faculty'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Academic</span>
                <RiskBadge type="academic" status={student.academic_risk_status} isMissing={!student.is_score_complete && student.cgpa === null} />
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Placement</span>
                <RiskBadge type="placement" status={student.placement_risk_status} isMissing={student.placement_readiness_pct === null} />
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Priority Review</span>
                <RiskBadge type="priority" status={student.priority_review_status} />
              </div>
            </div>
          </div>
        </div>

        {/* Explainable "Why this score?" Engine Breakdown */}
        <ScoreBreakdown scoreResult={scoreResult} />

        {/* Risk Indicators & Transparent Reasons */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-slate-700" />
              <h3 className="text-base font-semibold text-slate-900">
                Transparent Risk Heuristics &amp; Trigger Reasons
              </h3>
            </div>
            <span className="text-xs text-slate-500">Decision-Support Rules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic Reasons */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800">Academic Review Rule Check</span>
                <RiskBadge type="academic" status={riskResult.academic.status} />
              </div>
              {riskResult.academic.reasons.length > 0 ? (
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {riskResult.academic.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">
                  ✓ Meets both institutional criteria (CGPA ≥ 6.0 and Attendance ≥ 75%).
                </p>
              )}
            </div>

            {/* Placement Reasons */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800">Placement Support Rule Check</span>
                <RiskBadge type="placement" status={riskResult.placement.status} />
              </div>
              {riskResult.placement.reasons.length > 0 ? (
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {riskResult.placement.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-teal-700 font-medium">
                  ✓ Placement readiness (≥50%) satisfies standard campus recruitment guidelines.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AI-Generated Explanation Section (If Triggered) */}
        {aiInsights && (
          <div className="bg-white rounded-xl border border-indigo-200 p-6 shadow-md animate-in fade-in duration-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-100 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  AI-Powered Student Success Explanation &amp; Action Plan
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                aiInsights.isFallback 
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}>
                Engine: {aiInsights.model}
              </span>
            </div>

            {/* AI Summary */}
            <div className="p-3.5 bg-indigo-50/50 rounded-lg text-sm text-slate-800 leading-relaxed font-medium">
              {aiInsights.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Supporting Indicators */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Observed Indicators Supporting Summary
                </h4>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {aiInsights.supportingIndicators?.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>

              {/* Potential Concerns */}
              <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-200 space-y-2">
                <h4 className="font-semibold text-rose-900 uppercase tracking-wider text-[11px]">
                  Specific Areas of Concern
                </h4>
                <ul className="space-y-1 text-rose-800 list-disc list-inside">
                  {aiInsights.potentialConcerns?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Suggested Actions */}
              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 space-y-2">
                <h4 className="font-semibold text-blue-900 uppercase tracking-wider text-[11px]">
                  Recommended Faculty Interventions
                </h4>
                <ul className="space-y-1 text-blue-800 list-disc list-inside">
                  {aiInsights.suggestedActions?.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Faculty Questions */}
              <div className="p-4 rounded-lg bg-teal-50/50 border border-teal-200 space-y-2">
                <h4 className="font-semibold text-teal-900 uppercase tracking-wider text-[11px]">
                  Recommended Questions for 1-on-1 Meeting
                </h4>
                <ul className="space-y-1 text-teal-800 list-disc list-inside">
                  {aiInsights.facultyQuestions?.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Limitations Notice */}
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span><strong>Decision Support Limitation: </strong>{aiInsights.limitations}</span>
            </div>
          </div>
        )}

        {/* Detailed Performance Breakdowns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Subject-wise Performance */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Coursework &amp; Subject Assessments
            </h3>
            {student.subject_marks && student.subject_marks.length > 0 ? (
              <div className="space-y-3">
                {student.subject_marks.map((sub, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{sub.subject}</span>
                      <span className="font-semibold font-mono text-slate-900">
                        {sub.marks} / {sub.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sub.marks >= 80 ? 'bg-blue-600' : sub.marks >= 60 ? 'bg-teal-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${(sub.marks / sub.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-lg">
                No granular subject exam scores recorded for this semester. Overall CGPA: {formatCGPA(student.cgpa)}.
              </p>
            )}
          </div>

          {/* Section 2: Placement Prep Assessments */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Placement Preparation Assessments
            </h3>
            {student.placement_assessments && student.placement_assessments.length > 0 ? (
              <div className="space-y-3">
                {student.placement_assessments.map((prep, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{prep.type}</span>
                      <span className="font-semibold font-mono text-slate-900">
                        {prep.score} / {prep.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          prep.score >= 70 ? 'bg-emerald-500' : prep.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${(prep.score / prep.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-lg">
                No mock placement assessment records on file. Placement Readiness: {formatPercentage(student.placement_readiness_pct)}.
              </p>
            )}
          </div>

          {/* Section 3: Historical Progress (Never manufacture if not available) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Longitudinal Historical Trends
            </h3>
            {student.history && student.history.length > 1 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={student.history} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                              <p className="font-semibold">{d.semester}</p>
                              <p className="text-blue-300">Success Score: {d.score}/100</p>
                              <p className="text-slate-300">CGPA: {d.cgpa} | Attendance: {d.attendance}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="score" name="Success Score" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-lg text-center border border-dashed border-slate-200">
                <Clock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">Historical Trend Unavailable</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Only current Semester {student.semester || 7} snapshot is currently ingested. Longitudinal trend graphs require multi-semester database snapshots.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Extracurricular & Certifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Engagement, Hackathons &amp; Activities
            </h3>
            {student.activities && student.activities.length > 0 ? (
              <div className="space-y-2.5">
                {student.activities.map((act, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{act.title}</span>
                      <span className="block text-[11px] text-slate-500">{act.type} • {act.date}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-lg">
                No extracurricular hackathons, certifications, or club leadership registered. Engagement Score: {formatScore(student.engagement_score)}.
              </p>
            )}
          </div>
        </div>

        {/* Section 5: Recorded Faculty Interventions & Follow-up History */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Faculty Interventions &amp; Mentoring Logs
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track status and outcome notes for supportive faculty actions taken for {student.name}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Action</span>
            </button>
          </div>

          {studentInterventions.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <p className="text-xs text-slate-600">No interventions currently recorded for this student.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
              >
                + Record first supportive intervention
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {studentInterventions.map((inv) => (
                <div key={inv.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{inv.intervention_type}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        inv.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>Advisor: <strong>{inv.assigned_faculty}</strong></span>
                      <span>Target: {formatDate(inv.due_date)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{inv.description}</p>

                  {inv.follow_up_notes && (
                    <div className="text-xs text-slate-600 bg-white p-2.5 rounded-md border border-slate-200">
                      <strong>Follow-up: </strong> {inv.follow_up_notes}
                    </div>
                  )}

                  {/* Status Toggle buttons */}
                  <div className="pt-2 flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400">Update Status:</span>
                    {['Pending', 'In Progress', 'Completed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => updateIntervention(inv.id, { status: st })}
                        className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                          inv.status === st
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <InterventionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addIntervention}
        initialStudent={student}
      />
    </div>
  );
}
