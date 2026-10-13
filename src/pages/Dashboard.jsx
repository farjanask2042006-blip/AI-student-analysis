import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  Briefcase, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  Filter, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, Pie, Cell, 
  ScatterChart, Scatter, ZAxis, Legend,
  LineChart, Line
} from 'recharts';
import { useStudentData } from '../context/StudentContext.jsx';
import { Header } from '../components/Header.jsx';
import { KPICard } from '../components/KPICard.jsx';
import { ChartCard } from '../components/ChartCard.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { formatPercentage, formatScore, formatCGPA } from '../utils/formatters.js';

const PALETTE = ['#2563eb', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export function Dashboard() {
  const { students, loading } = useStudentData();
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Filter students by department if selected
  const filteredStudents = useMemo(() => {
    if (selectedDept === 'ALL') return students;
    return students.filter((s) => s.department === selectedDept);
  }, [students, selectedDept]);

  // Departments list
  const departments = useMemo(() => {
    const set = new Set(students.map((s) => s.department).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);

  // 1. KPI Calculations from actual filtered dataset
  const kpis = useMemo(() => {
    const total = filteredStudents.length;
    if (total === 0) {
      return {
        total: 0,
        avgScore: 'N/A',
        academicRiskCount: 0,
        placementRiskCount: 0,
        incompleteCount: 0,
        priorityCount: 0,
      };
    }

    const completeStudents = filteredStudents.filter((s) => s.is_score_complete);
    const avgScore = completeStudents.length > 0
      ? (completeStudents.reduce((acc, s) => acc + s.success_score, 0) / completeStudents.length).toFixed(1)
      : 'N/A';

    const academicRiskCount = filteredStudents.filter((s) => s.is_academic_risk).length;
    const placementRiskCount = filteredStudents.filter((s) => s.is_placement_risk).length;
    const incompleteCount = filteredStudents.filter((s) => !s.is_score_complete).length;
    const priorityCount = filteredStudents.filter((s) => s.is_priority_review).length;

    return {
      total,
      avgScore,
      academicRiskCount,
      placementRiskCount,
      incompleteCount,
      priorityCount,
      completeCount: completeStudents.length,
    };
  }, [filteredStudents]);

  // 2. Chart 1: Success Score Distribution (Histogram buckets: <50, 50-64, 65-79, 80-89, 90-100)
  const scoreDistributionData = useMemo(() => {
    const buckets = [
      { range: '< 50 (Critical)', count: 0, fill: '#ef4444' },
      { range: '50-64 (Moderate)', count: 0, fill: '#f59e0b' },
      { range: '65-79 (Proficient)', count: 0, fill: '#0d9488' },
      { range: '80-89 (High)', count: 0, fill: '#2563eb' },
      { range: '90-100 (Exemplary)', count: 0, fill: '#7c3aed' },
    ];

    filteredStudents.forEach((s) => {
      if (s.is_score_complete && s.success_score !== null) {
        const sc = s.success_score;
        if (sc < 50) buckets[0].count++;
        else if (sc < 65) buckets[1].count++;
        else if (sc < 80) buckets[2].count++;
        else if (sc < 90) buckets[3].count++;
        else buckets[4].count++;
      }
    });

    return buckets;
  }, [filteredStudents]);

  // 3. Chart 2: Department-wise Average Success Score
  const deptAverageData = useMemo(() => {
    const deptMap = {};
    students.forEach((s) => {
      if (!s.department) return;
      if (!deptMap[s.department]) {
        deptMap[s.department] = { sum: 0, count: 0, cgpaSum: 0 };
      }
      if (s.is_score_complete && s.success_score !== null) {
        deptMap[s.department].sum += s.success_score;
        deptMap[s.department].count++;
      }
      if (s.cgpa) {
        deptMap[s.department].cgpaSum += Number(s.cgpa);
      }
    });

    return Object.entries(deptMap).map(([dept, data]) => ({
      department: dept.length > 20 ? dept.replace('Engineering', 'Eng.').replace('Computer Science &', 'CS &') : dept,
      fullDept: dept,
      avgScore: data.count > 0 ? Number((data.sum / data.count).toFixed(1)) : 0,
      studentsCount: data.count,
    })).sort((a, b) => b.avgScore - a.avgScore);
  }, [students]);

  // 4. Chart 3: Academic Risk vs Placement Risk Quadrants
  const riskQuadrantData = useMemo(() => {
    let bothClear = 0;
    let acadOnly = 0;
    let placeOnly = 0;
    let bothRisks = 0;

    filteredStudents.forEach((s) => {
      if (!s.is_score_complete) return;
      const isA = s.is_academic_risk;
      const isP = s.is_placement_risk;

      if (!isA && !isP) bothClear++;
      else if (isA && !isP) acadOnly++;
      else if (!isA && isP) placeOnly++;
      else bothRisks++;
    });

    return [
      { name: 'On Track (Both Met)', value: bothClear, fill: '#10b981' },
      { name: 'High Academics, Low Placement', value: placeOnly, fill: '#f59e0b' },
      { name: 'Needs Academic Support', value: acadOnly, fill: '#f97316' },
      { name: 'Dual Risk (Critical)', value: bothRisks, fill: '#ef4444' },
    ];
  }, [filteredStudents]);

  // 5. Chart 4: Attendance vs CGPA Scatter / Correlation
  const attendanceCgpaData = useMemo(() => {
    return filteredStudents
      .filter((s) => s.cgpa !== null && s.attendance_pct !== null)
      .map((s) => ({
        id: s.student_id,
        name: s.name,
        cgpa: Number(s.cgpa),
        attendance: Number(s.attendance_pct),
        score: s.success_score || 50,
        risk: s.is_priority_review ? 'Priority' : s.is_academic_risk ? 'Academic' : 'Standard',
      }));
  }, [filteredStudents]);

  // 6. Chart 5: Placement Readiness Distribution
  const placementDistributionData = useMemo(() => {
    const buckets = [
      { range: '< 50% (Support Needed)', count: 0, fill: '#f59e0b' },
      { range: '50-69% (Developing)', count: 0, fill: '#0d9488' },
      { range: '70-84% (Job Ready)', count: 0, fill: '#2563eb' },
      { range: '85-100% (High Placement)', count: 0, fill: '#10b981' },
    ];

    filteredStudents.forEach((s) => {
      if (s.placement_readiness_pct !== null && s.placement_readiness_pct !== undefined) {
        const val = Number(s.placement_readiness_pct);
        if (val < 50) buckets[0].count++;
        else if (val < 70) buckets[1].count++;
        else if (val < 85) buckets[2].count++;
        else buckets[3].count++;
      }
    });

    return buckets;
  }, [filteredStudents]);

  // 7. Chart 6: Student Segmentation Breakdown
  const segmentData = useMemo(() => {
    const counts = {};
    filteredStudents.forEach((s) => {
      const seg = s.student_segment || 'Other';
      counts[seg] = (counts[seg] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      shortName: name.length > 25 ? name.slice(0, 24) + '...' : name,
      count,
      fill: PALETTE[idx % PALETTE.length],
    })).sort((a, b) => b.count - a.count);
  }, [filteredStudents]);

  // Priority attention students for quick action cards
  const priorityActionStudents = useMemo(() => {
    return filteredStudents
      .filter((s) => s.is_priority_review || (s.cgpa >= 8.0 && s.is_placement_risk))
      .slice(0, 4);
  }, [filteredStudents]);

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50">
        <Header title="Overview Dashboard" subtitle="Loading institutional student metrics..." />
        <div className="p-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-12">
      <Header
        title="Institutional Overview Dashboard"
        subtitle="Aggregated multi-dimensional student analytics and decision support metrics"
      />

      <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Department Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Department Filter:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Departments ({students.length} students)</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span>Showing <strong>{filteredStudents.length}</strong> of {students.length} records</span>
            {selectedDept !== 'ALL' && (
              <button
                onClick={() => setSelectedDept('ALL')}
                className="text-blue-600 hover:underline font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Top KPI Cards (Calculated from active dataset) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Total Students"
            value={kpis.total}
            subtitle="Enrolled in cohort"
            icon={Users}
            color="blue"
          />
          <KPICard
            title="Avg Success Score"
            value={kpis.avgScore !== 'N/A' ? `${kpis.avgScore}/100` : 'N/A'}
            subtitle={`Based on ${kpis.completeCount} verified`}
            icon={Award}
            color="violet"
          />
          <KPICard
            title="Academic Review"
            value={kpis.academicRiskCount}
            subtitle="CGPA < 6.0 or Att. < 75%"
            icon={AlertTriangle}
            color="rose"
            onClick={() => navigate('/interventions?tab=academic')}
          />
          <KPICard
            title="Placement Support"
            value={kpis.placementRiskCount}
            subtitle="Readiness < 50%"
            icon={Briefcase}
            color="amber"
            onClick={() => navigate('/interventions?tab=placement')}
          />
          <KPICard
            title="Incomplete Data"
            value={kpis.incompleteCount}
            subtitle="Missing 1+ metrics"
            icon={Clock}
            color="slate"
            onClick={() => navigate('/data-management')}
          />
          <KPICard
            title="Priority Review"
            value={kpis.priorityCount}
            subtitle="Score < 50 or Dual Flag"
            icon={ShieldAlert}
            color="rose"
            onClick={() => navigate('/interventions?tab=priority')}
          />
        </div>

        {/* Interactive Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Success Score Distribution */}
          <ChartCard
            title="Student Success Score Distribution"
            subtitle="Frequency distribution across performance brackets (complete records)"
            tooltip="Calculated from normalized CGPA, attendance, LMS, placement readiness, skills, and engagement"
            badge="Calculated"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={scoreDistributionData} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} angle={-15} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                          <p className="font-semibold">{payload[0].payload.range}</p>
                          <p className="text-slate-300 mt-0.5">{payload[0].value} students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 2: Department-wise Average Success Score */}
          <ChartCard
            title="Department-wise Average Success Score"
            subtitle="Comparative success benchmarks across campus departments"
            tooltip="Aggregated score from students with complete metric profiles"
            badge="Institutional"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deptAverageData} layout="vertical" margin={{ top: 10, right: 25, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 10, fill: '#334155' }} width={120} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                          <p className="font-semibold">{data.fullDept}</p>
                          <p className="text-blue-300 mt-0.5">Average Score: {data.avgScore}/100</p>
                          <p className="text-slate-400">Sample size: {data.studentsCount} students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgScore" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 3: Academic Risk vs Placement Risk Quadrants */}
          <ChartCard
            title="Academic Risk vs. Placement Risk Quadrants"
            subtitle="Cross-tabulation of academic standing versus career readiness"
            tooltip="Identifies critical divergent cohorts (e.g., high CGPA but lagging placement readiness)"
            badge="Cohort Analysis"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[260px]">
              <div className="w-full sm:w-1/2 h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskQuadrantData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {riskQuadrantData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                              <p className="font-semibold">{payload[0].name}</p>
                              <p className="text-slate-300">{payload[0].value} students</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full sm:w-1/2 space-y-2 text-xs">
                {riskQuadrantData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Chart 4: Attendance vs CGPA Correlation Scatter */}
          <ChartCard
            title="Attendance vs. Academic Performance (CGPA)"
            subtitle="Visualizing the correlation between attendance percentage and semester CGPA"
            tooltip="Helps identify whether attendance gaps correlate directly with CGPA declines"
            badge="Correlation"
          >
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 15, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  dataKey="attendance" 
                  name="Attendance" 
                  unit="%" 
                  domain={[50, 100]} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  label={{ value: 'Attendance %', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#94a3b8' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="cgpa" 
                  name="CGPA" 
                  domain={[4, 10]} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  label={{ value: 'CGPA', angle: -90, position: 'insideLeft', offset: 15, fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                          <p className="font-semibold">{d.name} ({d.id})</p>
                          <p className="text-slate-300">CGPA: {d.cgpa.toFixed(2)} | Attendance: {d.attendance}%</p>
                          <p className="text-blue-300">Success Score: {d.score}/100</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Students" data={attendanceCgpaData} fill="#2563eb" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 5: Placement Readiness Distribution */}
          <ChartCard
            title="Placement Readiness Distribution"
            subtitle="Campus hiring preparedness levels assessed from technical and mock rounds"
            tooltip="Benchmark: <50% requires faculty intervention before company recruitment drives"
            badge="Career Readiness"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={placementDistributionData} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} angle={-10} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                          <p className="font-semibold">{payload[0].payload.range}</p>
                          <p className="text-slate-300">{payload[0].value} students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {placementDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 6: Student Segmentation Breakdown */}
          <ChartCard
            title="Student Segmentation Breakdown"
            subtitle="Distribution across 6 actionable institutional cohorts"
            tooltip="Transparent segment rules configured in segmentation engine"
            badge="Cohort Engine"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={segmentData} layout="vertical" margin={{ top: 10, right: 25, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="shortName" tick={{ fontSize: 10, fill: '#334155' }} width={140} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-blue-300">{data.count} students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Insights & Actionable Patterns Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  Data-Driven Institutional Insights &amp; Early Action Triggers
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Explainable patterns identified automatically by the analytics engine
              </p>
            </div>
            <button
              onClick={() => navigate('/ai-insights')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Open AI Workspace <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pattern 1 */}
            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Placement Divergence Cohort
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Found <strong>{students.filter(s => s.cgpa >= 7.5 && s.is_placement_risk).length} students</strong> with high CGPA (≥7.5) but low placement readiness (&lt;50%). High academic theory is not translating into practical interview benchmarks.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/students?segment=Strong+academics%2C+low+placement+readiness')}
                  className="text-[11px] font-semibold text-amber-900 hover:underline inline-flex items-center gap-1"
                >
                  Explore Divergence Cohort →
                </button>
              </div>
            </div>

            {/* Pattern 2 */}
            <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-900">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Priority Follow-up Required
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                <strong>{kpis.priorityCount} students</strong> triggered priority flags due to compound factors (CGPA &lt; 6.0 and Attendance &lt; 75%). Early mentoring is essential before semester exams.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/interventions?tab=priority')}
                  className="text-[11px] font-semibold text-rose-900 hover:underline inline-flex items-center gap-1"
                >
                  Review Priority Students →
                </button>
              </div>
            </div>

            {/* Pattern 3 */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Clock className="w-4 h-4 text-slate-600" />
                Data Quality &amp; Audit Notice
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>{kpis.incompleteCount} records</strong> have missing biometric attendance, LMS sync, or placement slots. Scores are withheld to avoid false algorithmic judgment.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/data-management')}
                  className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Manage Data &amp; Imports →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Spotlight on Key Demo Students */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Sample Students Requiring Faculty Mentorship Review
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {priorityActionStudents.map((s) => (
                <div
                  key={s.student_id}
                  onClick={() => navigate(`/students/${s.student_id}`)}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600">{s.student_id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-xs font-medium bg-slate-100 text-slate-600">
                        {s.department.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      CGPA: {formatCGPA(s.cgpa)} • Att: {formatPercentage(s.attendance_pct)}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Placement:</span>
                    <span className={`font-semibold ${s.is_placement_risk ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {formatPercentage(s.placement_readiness_pct)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
