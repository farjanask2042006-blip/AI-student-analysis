import React, { useState, useRef } from 'react';
import { 
  Database, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RotateCcw, 
  Table, 
  FileCheck,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useStudentData } from '../context/StudentContext.jsx';
import { Header } from '../components/Header.jsx';
import { 
  parseCSV, 
  validateCSVRecords, 
  getCSVTemplateContent, 
  exportStudentsToCSV, 
  downloadFile 
} from '../utils/csvHelper.js';
import { formatPercentage, formatScore, formatCGPA } from '../utils/formatters.js';

export function DataManagement() {
  const { students, importStudents, resetDemo, dataSource } = useStudentData();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [validationReport, setValidationReport] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Download official CSV template
  const handleDownloadTemplate = () => {
    const templateContent = getCSVTemplateContent();
    downloadFile(templateContent, 'EduPulse_Student_Import_Template.csv');
  };

  // Export current active dataset to CSV
  const handleExportActiveData = () => {
    const csvContent = exportStudentsToCSV(students);
    downloadFile(csvContent, `EduPulse_All_Students_${Date.now()}.csv`);
  };

  // Handle file selection and parsing
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImportSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const rows = parseCSV(text);
        setParsedRows(rows);
        const report = validateCSVRecords(rows, students);
        setValidationReport(report);
      }
    };
    reader.readAsText(file);
  };

  // Trigger import
  const handleConfirmImport = async () => {
    if (!validationReport || validationReport.validRecords.length === 0) return;
    setIsImporting(true);
    setShowConfirmModal(false);

    try {
      await importStudents(validationReport.validRecords);
      setImportSuccessMessage(
        `Successfully imported ${validationReport.validRecords.length} student record(s) into the system!`
      );
      // Reset upload state
      setSelectedFile(null);
      setParsedRows([]);
      setValidationReport(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Import failed:', err);
    } finally {
      setIsImporting(false);
    }
  };

  // Department breakdown counts
  const deptStats = React.useMemo(() => {
    const counts = {};
    students.forEach((s) => {
      counts[s.department] = (counts[s.department] || 0) + 1;
    });
    return Object.entries(counts);
  }, [students]);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <Header
        title="Data Management &amp; Ingestion Hub"
        subtitle="Manage student datasets, validate CSV imports, audit data completeness, and download templates"
      />

      <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Dataset Status Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Active Repository Status: {students.length} Students Loaded
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono uppercase font-semibold ${
                dataSource === 'supabase'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {dataSource === 'supabase' ? 'Supabase PostgreSQL' : 'Local Fictional Dataset'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Complete Profiles: <strong>{students.filter(s => s.is_score_complete).length}</strong> • Incomplete: <strong>{students.filter(s => !s.is_score_complete).length}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Template</span>
            </button>

            <button
              onClick={handleExportActiveData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All to CSV</span>
            </button>

            <button
              onClick={resetDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset dataset back to standard synthetic 55 records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {importSuccessMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{importSuccessMessage}</span>
            </div>
            <button
              onClick={() => setImportSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* CSV Upload & Validation Area */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload &amp; Validate Student CSV Data
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload new student records or update existing metric snapshots. Strict schema validation prevents corrupt records.
              </p>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-8 text-center transition-colors bg-slate-50/50">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-upload"
            />
            <label
              htmlFor="csv-file-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {selectedFile ? selectedFile.name : 'Click to select or drag and drop a student CSV file'}
              </p>
              <p className="text-xs text-slate-500">
                Required columns: <code>student_id</code>, <code>name</code>, <code>department</code>
              </p>
            </label>
          </div>

          {/* Validation Report */}
          {validationReport && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Rows</span>
                  <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                    {validationReport.totalRows}
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase">Valid Records</span>
                  <div className="text-xl font-bold text-emerald-900 font-mono mt-0.5">
                    {validationReport.validCount}
                  </div>
                </div>

                <div className="p-3.5 bg-rose-50 rounded-lg border border-rose-200">
                  <span className="text-[11px] font-semibold text-rose-700 uppercase">Invalid Rows</span>
                  <div className="text-xl font-bold text-rose-900 font-mono mt-0.5">
                    {validationReport.invalidCount}
                  </div>
                </div>
              </div>

              {/* Errors Breakdown (if any) */}
              {validationReport.invalidRecords.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Validation Errors Detected ({validationReport.invalidCount} invalid rows will be skipped):
                  </div>
                  <ul className="text-xs text-rose-800 space-y-1 list-disc list-inside max-h-36 overflow-y-auto">
                    {validationReport.invalidRecords.map((inv, idx) => (
                      <li key={idx}>
                        Row {inv.row} (ID: {inv.student_id}): {inv.errors.join('; ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Duplicate ID Warning */}
              {validationReport.duplicateIds.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  Duplicate student IDs found in file: <strong>{validationReport.duplicateIds.join(', ')}</strong>.
                </div>
              )}

              {/* Preview Table of Valid Records */}
              {validationReport.validRecords.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Preview Valid Records ({validationReport.validRecords.length})
                    </h4>

                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={isImporting}
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm"
                    >
                      {isImporting ? 'Importing...' : `Import ${validationReport.validRecords.length} Records`}
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 uppercase font-semibold tracking-wider sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Student ID</th>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Department</th>
                          <th className="py-2 px-2 text-center">CGPA</th>
                          <th className="py-2 px-2 text-center">Att %</th>
                          <th className="py-2 px-2 text-center">Assign %</th>
                          <th className="py-2 px-2 text-center">Place %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {validationReport.validRecords.slice(0, 15).map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-bold text-blue-600">{r.student_id}</td>
                            <td className="py-2 px-3 text-slate-900 font-medium">{r.name}</td>
                            <td className="py-2 px-3 text-slate-600">{r.department}</td>
                            <td className="py-2 px-2 text-center font-mono">{r.cgpa ?? '—'}</td>
                            <td className="py-2 px-2 text-center font-mono">{r.attendance_pct ?? '—'}</td>
                            <td className="py-2 px-2 text-center font-mono">{r.assignment_completion_pct ?? '—'}</td>
                            <td className="py-2 px-2 text-center font-mono">{r.placement_readiness_pct ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {validationReport.validRecords.length > 15 && (
                    <p className="text-[11px] text-slate-400 italic">Showing first 15 of {validationReport.validRecords.length} records in preview.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Department Roster Breakdown Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Department Cohort Distribution
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deptStats.map(([dept, count]) => (
              <div key={dept} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">{dept}</span>
                <span className="font-bold font-mono text-blue-600 px-2 py-0.5 rounded-md bg-white border border-slate-200">
                  {count} students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explicit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-blue-50 text-blue-600">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Data Ingestion</h3>
                <p className="text-xs text-slate-500">Explicit verification before dataset modification</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              You are about to import <strong>{validationReport?.validCount} verified student record(s)</strong> into EduPulse AI. If a student ID already exists, the record will be updated with the newly provided metrics.
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Confirm &amp; Ingest Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
