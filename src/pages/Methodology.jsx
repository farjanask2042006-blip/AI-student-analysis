import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Award, 
  ShieldAlert, 
  Sparkles, 
  Lock, 
  HelpCircle,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { Header } from '../components/Header.jsx';
import { DEFAULT_WEIGHTS } from '../analytics/scoring.js';
import { DEFAULT_THRESHOLDS } from '../analytics/riskRules.js';
import { SEGMENTS } from '../analytics/segmentation.js';

export function Methodology() {
  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Header
        title="Methodology, Scoring Engine &amp; Governance"
        subtitle="Transparent documentation of mathematical weights, risk heuristics, ethical safeguards, and system limitations"
      />

      <div className="px-6 py-6 space-y-6 max-w-5xl mx-auto">
        {/* Core Principles Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Institutional Decision-Support Principles
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            EduPulse AI is designed strictly as an <strong>explainable decision-support copilot for university faculty, academic mentors, and placement cells</strong>. It is not an automated judgment engine, and it never makes punitive decisions or deterministic predictions about student failure or dropouts.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Ethical Notice: </strong>The weights, risk cutoffs, and segmentation heuristics represent prototype assumptions formulated for educational hackathon demonstration. They do not constitute an official KPMG formula or a psychometrically certified clinical standard.
            </span>
          </div>
        </div>

        {/* 1. Score Engine Formula & Weights */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              1. Student Success Score Engine Formula &amp; Weightings
            </h3>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs space-y-2">
            <p className="text-blue-400 font-bold">// Normalization step</p>
            <p>Academic Score = (CGPA / 10.0) × 100</p>
            <p className="text-blue-400 font-bold pt-1">// Weighted Composite Formula</p>
            <p className="leading-relaxed">
              Success Score = (Academic Score × 0.30) + (Attendance % × 0.20) + (Assignment % × 0.15) + (Placement Readiness % × 0.20) + (Skills Score × 0.10) + (Engagement × 0.05)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800">Academic (CGPA)</span>
              <span className="block text-blue-600 font-mono font-bold mt-0.5">30% Weight</span>
              <p className="text-slate-500 mt-1">Measures cumulative grade performance normalized to 100.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800">Attendance</span>
              <span className="block text-blue-600 font-mono font-bold mt-0.5">20% Weight</span>
              <p className="text-slate-500 mt-1">Classroom engagement and regulatory minimum threshold.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800">Assignment / LMS</span>
              <span className="block text-blue-600 font-mono font-bold mt-0.5">15% Weight</span>
              <p className="text-slate-500 mt-1">Continuous formative assessment completion.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800">Placement Readiness</span>
              <span className="block text-blue-600 font-mono font-bold mt-0.5">20% Weight</span>
              <p className="text-slate-500 mt-1">Timed coding rounds, mock HR &amp; aptitude benchmarks.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800">Technical Skills</span>
              <span className="block text-blue-600 font-mono font-bold mt-0.5">10% Weight</span>
              <p className="text-slate-500 mt-1">Verified assessments in algorithms and frameworks.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-800">Engagement</span>
              <span className="block text-blue-600 font-mono font-bold mt-0.5">5% Weight</span>
              <p className="text-slate-500 mt-1">Hackathon participation, certifications, and clubs.</p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
            <strong>Missing Data Rule: </strong>If any dimension is unavailable in institutional databases, the official score is returned as <code>INCOMPLETE</code>. Missing values are <strong>never automatically imputed as zero</strong>, preventing unfair bias against students with delayed biometric or registrar syncs.
          </div>
        </div>

        {/* 2. Risk Heuristics */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              2. Transparent Early-Warning Risk Heuristics
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-rose-700">Academic Review Flag:</span>
              <p className="text-slate-600 mt-1">
                Triggered if student's <strong>CGPA &lt; 6.0</strong> OR <strong>Attendance &lt; 75%</strong>. Prompts early subject tutoring or review of commute/health barriers before final exams.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-amber-700">Placement Support Flag:</span>
              <p className="text-slate-600 mt-1">
                Triggered if student's <strong>Placement Readiness &lt; 50%</strong>. Identifies students requiring resume review, aptitude drills, or live mock interview practice.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-purple-700">Priority Follow-Up Review:</span>
              <p className="text-slate-600 mt-1">
                Triggered if <strong>Success Score &lt; 50/100</strong> OR <strong>Both Academic and Placement flags are concurrently active</strong>. Prompts 1-on-1 counselor and advisor meeting.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Student Segmentation */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              3. Student Segmentation Matrix
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="font-bold text-emerald-900">Strong academics, placement ready</span>
              <p className="text-emerald-800 mt-0.5">CGPA ≥ 7.5 and Placement ≥ 70%. Candidates for tier-1 tech roles and research opportunities.</p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="font-bold text-amber-900">Strong academics, low placement readiness</span>
              <p className="text-amber-800 mt-0.5">CGPA ≥ 7.5 but Placement &lt; 50%. Critical cohort: High theoretical knowledge but struggles with timed DSA rounds or mock interviews.</p>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="font-bold text-orange-900">Needs academic support</span>
              <p className="text-orange-800 mt-0.5">Academic review flag active while placement readiness remains baseline or above.</p>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <span className="font-bold text-rose-900">Needs academic and placement support</span>
              <p className="text-rose-800 mt-0.5">Dual flag: Both academic coursework and career readiness need coordinated faculty assistance.</p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="font-bold text-blue-900">Balanced progress / Developing</span>
              <p className="text-blue-800 mt-0.5">Steady progress within institutional baseline parameters across all 6 dimensions.</p>
            </div>

            <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg">
              <span className="font-bold text-slate-800">Insufficient data</span>
              <p className="text-slate-600 mt-0.5">Missing core indicators prevent objective categorization. Priority is administrative audit.</p>
            </div>
          </div>
        </div>

        {/* 4. AI Security & Limitations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              4. Secure Server-Side OpenAI Edge Integration
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            OpenAI API calls are mediated exclusively through secure Supabase Edge Functions (<code>supabase/functions/student-insights</code>) using server-side secrets. The frontend never accesses or exposes the OpenAI API key.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            When OpenAI credentials are not provided or network access is restricted, EduPulse AI seamlessly activates its <strong>deterministic heuristic fallback engine</strong>, guaranteeing a 100% reliable hackathon presentation without downtime or missing outputs.
          </p>
        </div>
      </div>
    </div>
  );
}
