import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  User, 
  Building2, 
  Layers, 
  Globe, 
  Send, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useStudentData } from '../context/StudentContext.jsx';
import { Header } from '../components/Header.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { getAIInsights } from '../lib/aiService.js';
import { SEGMENTS } from '../analytics/segmentation.js';

export function AIInsights() {
  const { students, loading } = useStudentData();

  // Mode: 'student' | 'segment' | 'department' | 'cohort'
  const [insightMode, setInsightMode] = useState('student');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSegment, setSelectedSegment] = useState(SEGMENTS.STRONG_ACADEMICS_LOW_PLACEMENT);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [insightsResult, setInsightsResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Departments
  const departments = useMemo(() => {
    const set = new Set(students.map((s) => s.department).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);

  // Set defaults when students load
  useMemo(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].student_id);
    }
    if (departments.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departments[0]);
    }
  }, [students, departments, selectedStudentId, selectedDepartment]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setInsightsResult(null);

    try {
      if (insightMode === 'student') {
        const student = students.find((s) => s.student_id === selectedStudentId);
        if (!student) throw new Error('Selected student not found.');

        const res = await getAIInsights('student', {
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
        setInsightsResult(res);
      } else if (insightMode === 'department') {
        const deptStudents = students.filter((s) => s.department === selectedDepartment);
        const complete = deptStudents.filter((s) => s.is_score_complete);
        const avgScore = complete.length > 0
          ? (complete.reduce((acc, s) => acc + s.success_score, 0) / complete.length).toFixed(1)
          : 'N/A';
        const avgCGPA = deptStudents.filter(s => s.cgpa).length > 0
          ? (deptStudents.reduce((acc, s) => acc + Number(s.cgpa), 0) / deptStudents.filter(s => s.cgpa).length).toFixed(2)
          : 'N/A';
        const avgAttendance = deptStudents.filter(s => s.attendance_pct).length > 0
          ? Math.round(deptStudents.reduce((acc, s) => acc + Number(s.attendance_pct), 0) / deptStudents.filter(s => s.attendance_pct).length)
          : 'N/A';
        const avgPlacement = deptStudents.filter(s => s.placement_readiness_pct).length > 0
          ? Math.round(deptStudents.reduce((acc, s) => acc + Number(s.placement_readiness_pct), 0) / deptStudents.filter(s => s.placement_readiness_pct).length)
          : 'N/A';

        const res = await getAIInsights('department', {
          department: selectedDepartment,
          totalStudents: deptStudents.length,
          avgScore,
          avgCGPA,
          avgAttendance,
          avgPlacement,
          academicFlagCount: deptStudents.filter((s) => s.is_academic_risk).length,
          placementFlagCount: deptStudents.filter((s) => s.is_placement_risk).length,
        });
        setInsightsResult(res);
      } else if (insightMode === 'segment') {
        const segStudents = students.filter((s) => s.student_segment === selectedSegment);
        const pct = Math.round((segStudents.length / students.length) * 100);

        const res = await getAIInsights('segment', {
          segmentName: selectedSegment,
          count: segStudents.length,
          pct,
          traits: 'Students matching rule-based criteria for this institutional cohort.',
          gaps: selectedSegment.includes('low placement')
            ? 'Coursework is strong but technical assessment scores and mock interviews are under 50%.'
            : 'Standard cohort parameters.',
        });
        setInsightsResult(res);
      } else {
        // Overall Cohort
        const complete = students.filter((s) => s.is_score_complete);
        const avgScore = complete.length > 0
          ? (complete.reduce((acc, s) => acc + s.success_score, 0) / complete.length).toFixed(1)
          : 'N/A';

        const res = await getAIInsights('segment', {
          segmentName: 'Institutional Campus Aggregate',
          count: students.length,
          pct: 100,
          traits: `Full cohort across ${departments.length} departments. Average Success Score: ${avgScore}/100.`,
          gaps: `${students.filter(s => s.is_priority_review).length} students flagged for priority faculty review.`,
        });
        setInsightsResult(res);
      }
    } catch (err) {
      console.error('Insights generation error:', err);
      setErrorMsg(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Header
        title="AI Insights Workspace"
        subtitle="Explainable student analytics, cohort synthesis, and actionable faculty guidance powered by OpenAI & heuristic intelligence"
      />

      <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Governance & Privacy Notice */}
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-xs flex items-start gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-900">Privacy &amp; Algorithmic Decision-Support Safeguards:</span>
            <p className="text-slate-600 leading-relaxed">
              EduPulse AI operates strictly as a decision-support copilot. AI models never invent student marks, alter deterministic scores, or predict absolute failure. All insights are explainable and paired with transparent limitations.
            </p>
          </div>
        </div>

        {/* Control Panel Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Insight Scope
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setInsightMode('student')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
                  insightMode === 'student'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <User className="w-4 h-4" />
                Individual Student
              </button>

              <button
                type="button"
                onClick={() => setInsightMode('segment')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
                  insightMode === 'segment'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                Cohort Segment
              </button>

              <button
                type="button"
                onClick={() => setInsightMode('department')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
                  insightMode === 'department'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Department Aggregate
              </button>

              <button
                type="button"
                onClick={() => setInsightMode('cohort')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
                  insightMode === 'cohort'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Globe className="w-4 h-4" />
                Overall Dataset
              </button>
            </div>
          </div>

          {/* Conditional Target Selector */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              {insightMode === 'student' && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                    Select Student to Analyze:
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full sm:max-w-md px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {students.map((s) => (
                      <option key={s.student_id} value={s.student_id}>
                        {s.student_id} — {s.name} ({s.department} • CGPA: {s.cgpa || 'N/A'} • Score: {s.success_score || 'Inc'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {insightMode === 'segment' && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                    Select Target Cohort Segment:
                  </label>
                  <select
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value)}
                    className="w-full sm:max-w-md px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(SEGMENTS).map((seg) => (
                      <option key={seg} value={seg}>
                        {seg} ({students.filter((s) => s.student_segment === seg).length} students)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {insightMode === 'department' && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                    Select Campus Department:
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full sm:max-w-md px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d} ({students.filter((s) => s.department === d).length} students)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {insightMode === 'cohort' && (
                <div className="text-xs text-slate-600">
                  Synthesizing complete institutional dataset comprising <strong>{students.length} students</strong> across {departments.length} academic departments.
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all shrink-0"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Explainable Insights'}</span>
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="p-8 bg-white rounded-xl border border-slate-200">
            <LoadingState message="Generating structured decision-support insights via Edge Function..." />
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Structured Results Display */}
        {insightsResult && !isGenerating && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  AI-Generated Decision-Support Report
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2.5 py-1 rounded-md font-semibold border ${
                  insightsResult.isFallback
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {insightsResult.model}
                </span>
              </div>
            </div>

            {/* 1. Executive Summary */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Executive Synthesis
              </h4>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-sm font-medium text-slate-900 leading-relaxed">
                {insightsResult.summary}
              </div>
            </div>

            {/* 2 & 3. Supporting Indicators and Concerns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Key Supporting Indicators
                </h4>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {insightsResult.supportingIndicators?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Potential Concern Areas
                </h4>
                <ul className="text-xs text-rose-800 space-y-1.5 list-disc list-inside">
                  {insightsResult.potentialConcerns?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4 & 5. Actions and Faculty Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-900">
                  Suggested Pedagogical &amp; Mentorship Actions
                </h4>
                <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
                  {insightsResult.suggestedActions?.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-900">
                  Exploratory Questions for Faculty Advisor Sessions
                </h4>
                <ul className="text-xs text-teal-800 space-y-1.5 list-disc list-inside">
                  {insightsResult.facultyQuestions?.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 6. Limitations Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong>Scope Limitation &amp; Data Notice: </strong>
                {insightsResult.limitations}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
