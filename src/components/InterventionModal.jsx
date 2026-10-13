import React, { useState, useEffect } from 'react';
import { X, Calendar, UserCheck, FileText, CheckCircle2 } from 'lucide-react';
import { INTERVENTION_TYPES, INTERVENTION_STATUSES } from '../lib/interventionService.js';

export function InterventionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialStudent = null, 
  availableStudents = [] 
}) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('');
  const [interventionType, setInterventionType] = useState(INTERVENTION_TYPES[0]);
  const [description, setDescription] = useState('');
  const [assignedFaculty, setAssignedFaculty] = useState('Dr. Suresh Varma');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialStudent) {
      setStudentId(initialStudent.student_id);
      setStudentName(initialStudent.name);
      setDepartment(initialStudent.department);
      if (initialStudent.mentor) {
        setAssignedFaculty(initialStudent.mentor);
      }
    } else if (availableStudents.length > 0) {
      const first = availableStudents[0];
      setStudentId(first.student_id);
      setStudentName(first.name);
      setDepartment(first.department);
      if (first.mentor) setAssignedFaculty(first.mentor);
    }

    // Default due date: 14 days in future
    const defDate = new Date();
    defDate.setDate(defDate.getDate() + 14);
    setDueDate(defDate.toISOString().split('T')[0]);
    setDescription('');
    setFollowUpNotes('');
    setStatus('Pending');
  }, [initialStudent, availableStudents, isOpen]);

  const handleStudentSelect = (e) => {
    const id = e.target.value;
    setStudentId(id);
    const found = availableStudents.find((s) => s.student_id === id);
    if (found) {
      setStudentName(found.name);
      setDepartment(found.department);
      if (found.mentor) setAssignedFaculty(found.mentor);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      await onSave({
        student_id: studentId,
        student_name: studentName,
        department,
        intervention_type: interventionType,
        description,
        assigned_faculty: assignedFaculty,
        due_date: dueDate,
        status,
        follow_up_notes: followUpNotes,
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit intervention:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Record Faculty Intervention</h3>
            <p className="text-xs text-slate-300">Empowering student success through targeted academic guidance</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Student Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Target Student
            </label>
            {initialStudent ? (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium flex justify-between">
                <span>{initialStudent.name} ({initialStudent.student_id})</span>
                <span className="text-xs text-slate-500 font-normal">{initialStudent.department}</span>
              </div>
            ) : (
              <select
                value={studentId}
                onChange={handleStudentSelect}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {availableStudents.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.student_id} - {s.name} ({s.department})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Intervention Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Intervention Action Type
            </label>
            <select
              value={interventionType}
              onChange={(e) => setInterventionType(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {INTERVENTION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Action Plan / Context <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Discuss attendance drop, provide makeup labs, or assign targeted LeetCode problem sets..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Faculty & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Assigned Advisor
              </label>
              <input
                type="text"
                value={assignedFaculty}
                onChange={(e) => setAssignedFaculty(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Target Resolution Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status & Follow-up notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {INTERVENTION_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Follow-up Notes
              </label>
              <input
                type="text"
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                placeholder="Optional mentor note..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Intervention'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
