import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Eye, 
  Sparkles,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useStudentData } from '../context/StudentContext.jsx';
import { Header } from '../components/Header.jsx';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { InterventionModal } from '../components/InterventionModal.jsx';
import { formatPercentage, formatScore, formatCGPA } from '../utils/formatters.js';
import { exportStudentsToCSV, downloadFile } from '../utils/csvHelper.js';
import { SEGMENTS } from '../analytics/segmentation.js';

export function StudentExplorer() {
  const { students, loading, addIntervention } = useStudentData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('dept') || 'ALL');
  const [selectedAcademicRisk, setSelectedAcademicRisk] = useState(searchParams.get('academic') || 'ALL');
  const [selectedPlacementRisk, setSelectedPlacementRisk] = useState(searchParams.get('placement') || 'ALL');
  const [selectedScoreRange, setSelectedScoreRange] = useState(searchParams.get('scoreRange') || 'ALL');
  const [selectedSegment, setSelectedSegment] = useState(searchParams.get('segment') || 'ALL');

  // Sorting State
  const [sortField, setSortField] = useState('student_id');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Intervention Modal State
  const [modalStudent, setModalStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync segment param if passed from Dashboard
  useEffect(() => {
    const segParam = searchParams.get('segment');
    if (segParam) setSelectedSegment(segParam);
  }, [searchParams]);

  // Unique Departments
  const departments = useMemo(() => {
    const set = new Set(students.map((s) => s.department).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);

  // Unique Segments
  const segmentOptions = Object.values(SEGMENTS);

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = s.student_id?.toLowerCase().includes(query);
        const matchesName = s.name?.toLowerCase().includes(query);
        if (!matchesId && !matchesName) return false;
      }

      // 2. Department
      if (selectedDept !== 'ALL' && s.department !== selectedDept) return false;

      // 3. Academic Risk
      if (selectedAcademicRisk !== 'ALL') {
        if (selectedAcademicRisk === 'FLAGGED' && !s.is_academic_risk) return false;
        if (selectedAcademicRisk === 'CLEAR' && (s.is_academic_risk || !s.is_score_complete)) return false;
      }

      // 4. Placement Risk
      if (selectedPlacementRisk !== 'ALL') {
        if (selectedPlacementRisk === 'FLAGGED' && !s.is_placement_risk) return false;
        if (selectedPlacementRisk === 'CLEAR' && (s.is_placement_risk || s.placement_readiness_pct === null)) return false;
      }

      // 5. Success Score Range
      if (selectedScoreRange !== 'ALL') {
        if (selectedScoreRange === 'INCOMPLETE') {
          if (s.is_score_complete) return false;
        } else {
          if (!s.is_score_complete || s.success_score === null) return false;
          if (selectedScoreRange === 'CRITICAL' && s.success_score >= 50) return false;
          if (selectedScoreRange === 'MODERATE' && (s.success_score < 50 || s.success_score >= 70)) return false;
          if (selectedScoreRange === 'HIGH' && s.success_score < 70) return false;
        }
      }

      // 6. Segment
      if (selectedSegment !== 'ALL' && s.student_segment !== selectedSegment) return false;

      return true;
    });
  }, [students, searchQuery, selectedDept, selectedAcademicRisk, selectedPlacementRisk, selectedScoreRange, selectedSegment]);

  // Sort Logic
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle nulls in sorting
      if (valA === null || valA === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (valB === null || valB === undefined) return sortDirection === 'asc' ? -1 : 1;

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredStudents, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  // Handle sort column toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedAcademicRisk('ALL');
    setSelectedPlacementRisk('ALL');
    setSelectedScoreRange('ALL');
    setSelectedSegment('ALL');
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const csvData = exportStudentsToCSV(filteredStudents);
    downloadFile(csvData, `EduPulse_Students_Export_${Date.now()}.csv`);
  };

  const openInterventionForStudent = (student, e) => {
    e.stopPropagation();
    setModalStudent(student);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50">
        <Header title="Student Explorer" subtitle="Loading roster..." />
        <div className="p-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-12">
      <Header
        title="Student Explorer"
        subtitle="Search, filter, and inspect institutional student metrics, success scores, and risk indicators"
      />

      <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Search & Filter Controls Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name or demo ID (e.g., EP-104)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
                title="Export current filtered view to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({filteredStudents.length})</span>
              </button>

              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
            {/* Department */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Academic Risk */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Academic Risk
              </label>
              <select
                value={selectedAcademicRisk}
                onChange={(e) => {
                  setSelectedAcademicRisk(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="FLAGGED">Review Recommended</option>
                <option value="CLEAR">No Current Flag</option>
              </select>
            </div>

            {/* Placement Risk */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Placement Risk
              </label>
              <select
                value={selectedPlacementRisk}
                onChange={(e) => {
                  setSelectedPlacementRisk(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="FLAGGED">Support Recommended (&lt;50%)</option>
                <option value="CLEAR">On Track (≥50%)</option>
              </select>
            </div>

            {/* Success Score Range */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Success Score
              </label>
              <select
                value={selectedScoreRange}
                onChange={(e) => {
                  setSelectedScoreRange(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Scores</option>
                <option value="CRITICAL">Critical (&lt; 50 pts)</option>
                <option value="MODERATE">Moderate (50 - 69 pts)</option>
                <option value="HIGH">High (≥ 70 pts)</option>
                <option value="INCOMPLETE">Incomplete Data Only</option>
              </select>
            </div>

            {/* Student Segment */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Student Cohort / Segment
              </label>
              <select
                value={selectedSegment}
                onChange={(e) => {
                  setSelectedSegment(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 truncate"
              >
                <option value="ALL">All Segments</option>
                {segmentOptions.map((seg) => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong>{sortedStudents.length}</strong> student records matching current filters
          </span>
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs font-medium bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {sortedStudents.length === 0 ? (
          <EmptyState
            title="No matching students found"
            message="No records matched your search terms or active filters. Try clearing filters or search terms."
            action={
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            }
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th 
                      onClick={() => handleSort('student_id')} 
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Student ID
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('name')} 
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Name &amp; Dept
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('cgpa')} 
                      className="py-3 px-3 text-center cursor-pointer hover:text-slate-900 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1">
                        CGPA
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('attendance_pct')} 
                      className="py-3 px-3 text-center cursor-pointer hover:text-slate-900 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1">
                        Attendance
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('placement_readiness_pct')} 
                      className="py-3 px-3 text-center cursor-pointer hover:text-slate-900 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1">
                        Placement
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('success_score')} 
                      className="py-3 px-3 text-center cursor-pointer hover:text-slate-900 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1">
                        Success Score
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center">Academic Flag</th>
                    <th className="py-3 px-3 text-center">Placement Flag</th>
                    <th className="py-3 px-4">Cohort Segment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedStudents.map((s) => (
                    <tr
                      key={s.student_id}
                      onClick={() => navigate(`/students/${s.student_id}`)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {s.student_id}
                      </td>

                      {/* Name & Department */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.department}</div>
                      </td>

                      {/* CGPA */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        {s.cgpa !== null && s.cgpa !== undefined ? (
                          <span className={Number(s.cgpa) < 6.0 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                            {formatCGPA(s.cgpa)}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">N/A</span>
                        )}
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        {s.attendance_pct !== null && s.attendance_pct !== undefined ? (
                          <span className={Number(s.attendance_pct) < 75 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                            {formatPercentage(s.attendance_pct)}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">N/A</span>
                        )}
                      </td>

                      {/* Placement */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        {s.placement_readiness_pct !== null && s.placement_readiness_pct !== undefined ? (
                          <span className={Number(s.placement_readiness_pct) < 50 ? 'text-amber-700 font-bold' : 'text-teal-700'}>
                            {formatPercentage(s.placement_readiness_pct)}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">N/A</span>
                        )}
                      </td>

                      {/* Success Score */}
                      <td className="py-3.5 px-3 text-center">
                        {s.is_score_complete ? (
                          <div className="inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-800 font-mono">
                            {s.success_score} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Incomplete
                          </span>
                        )}
                      </td>

                      {/* Academic Flag */}
                      <td className="py-3.5 px-3 text-center">
                        <RiskBadge 
                          type="academic" 
                          status={s.academic_risk_status} 
                          isMissing={!s.is_score_complete && s.cgpa === null && s.attendance_pct === null} 
                        />
                      </td>

                      {/* Placement Flag */}
                      <td className="py-3.5 px-3 text-center">
                        <RiskBadge 
                          type="placement" 
                          status={s.placement_risk_status} 
                          isMissing={s.placement_readiness_pct === null} 
                        />
                      </td>

                      {/* Segment */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md border ${s.segmentResult?.badgeClass || 'bg-slate-100'}`}>
                          {s.student_segment}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/students/${s.student_id}`)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Full Student Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => openInterventionForStudent(s, e)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Record Faculty Intervention"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="text-slate-500">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <InterventionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addIntervention}
        initialStudent={modalStudent}
      />
    </div>
  );
}
