/**
 * EduPulse AI - CSV Import, Validation, and Export Utilities
 */

export const REQUIRED_COLUMNS = ['student_id', 'name', 'department'];

export const OPTIONAL_NUMERIC_COLUMNS = [
  { field: 'cgpa', min: 0, max: 10, label: 'CGPA (0-10)' },
  { field: 'attendance_pct', min: 0, max: 100, label: 'Attendance %' },
  { field: 'assignment_completion_pct', min: 0, max: 100, label: 'Assignment Completion %' },
  { field: 'placement_readiness_pct', min: 0, max: 100, label: 'Placement Readiness %' },
  { field: 'skills_score', min: 0, max: 100, label: 'Skills Score' },
  { field: 'engagement_score', min: 0, max: 100, label: 'Engagement Score' },
];

/**
 * Standard CSV Template string for downloading
 */
export function getCSVTemplateContent() {
  const headers = [
    'student_id',
    'name',
    'department',
    'semester',
    'cgpa',
    'attendance_pct',
    'assignment_completion_pct',
    'placement_readiness_pct',
    'skills_score',
    'engagement_score',
    'mentor',
  ];

  const sampleRows = [
    'EP-201,Ankit Sharma,Computer Science & Engineering,7,8.45,88.5,92.0,78.0,85.0,70.0,Dr. Suresh Varma',
    'EP-202,Tanvi Deshmukh,Information Technology,7,7.20,72.0,80.0,45.0,60.0,55.0,Prof. Radhika Rao',
    'EP-203,Rishi Kapoor,AI & Data Science,7,5.80,68.0,60.0,38.0,50.0,40.0,Prof. Radhika Rao',
  ];

  return [headers.join(','), ...sampleRows].join('\n');
}

/**
 * Parses raw CSV string into array of objects with headers
 * @param {string} csvText 
 * @returns {Array<Object>}
 */
export function parseCSV(csvText) {
  const lines = csvText
    .split(/\r\n|\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple regex or split for comma separation
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
      const char = rawLine[charIdx];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));

    const rowObj = { _rowNumber: i + 1 };
    headers.forEach((header, idx) => {
      rowObj[header] = values[idx] !== undefined ? values[idx] : '';
    });
    records.push(rowObj);
  }

  return records;
}

/**
 * Validates parsed CSV rows against schema constraints
 * @param {Array<Object>} rows 
 * @param {Array<Object>} existingStudents 
 * @returns {Object} Validation report
 */
export function validateCSVRecords(rows, existingStudents = []) {
  const validRecords = [];
  const invalidRecords = [];
  const duplicateIdsInFile = new Set();
  const seenIds = new Set();

  // Map of existing IDs for duplicate check
  const existingIds = new Set(existingStudents.map((s) => s.student_id));

  rows.forEach((row) => {
    const errors = [];
    const studentId = row.student_id?.trim();

    // 1. Check required ID
    if (!studentId) {
      errors.push('Missing required student_id');
    } else {
      if (seenIds.has(studentId)) {
        duplicateIdsInFile.add(studentId);
        errors.push(`Duplicate student_id '${studentId}' found within uploaded CSV file`);
      } else {
        seenIds.add(studentId);
      }

      if (existingIds.has(studentId)) {
        // Warning or error: let user know it will overwrite
        row._willOverwrite = true;
      }
    }

    // 2. Check Name
    if (!row.name || !row.name.trim()) {
      errors.push('Missing student name');
    }

    // 3. Check Department
    if (!row.department || !row.department.trim()) {
      errors.push('Missing department');
    }

    // 4. Numeric range validation
    const parsedRow = {
      student_id: studentId,
      name: row.name?.trim(),
      department: row.department?.trim(),
      semester: row.semester ? parseInt(row.semester, 10) : 7,
      mentor: row.mentor?.trim() || null,
      _rowNumber: row._rowNumber,
    };

    OPTIONAL_NUMERIC_COLUMNS.forEach(({ field, min, max, label }) => {
      const rawVal = row[field];
      if (rawVal === undefined || rawVal === '' || rawVal === null) {
        parsedRow[field] = null; // legitimately missing
      } else {
        const num = Number(rawVal);
        if (isNaN(num)) {
          errors.push(`Invalid non-numeric value '${rawVal}' for ${label}`);
          parsedRow[field] = null;
        } else if (num < min || num > max) {
          errors.push(`Value ${num} for ${label} is outside valid boundary [${min}, ${max}]`);
          parsedRow[field] = null;
        } else {
          parsedRow[field] = num;
        }
      }
    });

    if (errors.length > 0) {
      invalidRecords.push({
        row: row._rowNumber,
        student_id: studentId || 'N/A',
        errors,
        raw: row,
      });
    } else {
      validRecords.push(parsedRow);
    }
  });

  return {
    totalRows: rows.length,
    validCount: validRecords.length,
    invalidCount: invalidRecords.length,
    validRecords,
    invalidRecords,
    duplicateIds: Array.from(duplicateIdsInFile),
  };
}

/**
 * Exports students list to CSV format
 * @param {Array<Object>} students 
 * @returns {string} CSV content
 */
export function exportStudentsToCSV(students) {
  const headers = [
    'Student ID',
    'Name',
    'Department',
    'CGPA',
    'Attendance %',
    'Assignment %',
    'Placement Readiness %',
    'Success Score',
    'Data Status',
    'Academic Flag',
    'Placement Flag',
    'Segment',
  ];

  const rows = students.map((s) => [
    `"${s.student_id}"`,
    `"${s.name}"`,
    `"${s.department}"`,
    s.cgpa !== null && s.cgpa !== undefined ? s.cgpa : '',
    s.attendance_pct !== null && s.attendance_pct !== undefined ? s.attendance_pct : '',
    s.assignment_completion_pct !== null && s.assignment_completion_pct !== undefined ? s.assignment_completion_pct : '',
    s.placement_readiness_pct !== null && s.placement_readiness_pct !== undefined ? s.placement_readiness_pct : '',
    s.success_score !== null && s.success_score !== undefined ? s.success_score : 'N/A',
    `"${s.scoreResult?.status || 'UNKNOWN'}"`,
    `"${s.academic_risk_status || 'No Current Flag'}"`,
    `"${s.placement_risk_status || 'On Track'}"`,
    `"${s.student_segment || 'Unassigned'}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Triggers browser download of a text/csv file
 * @param {string} content 
 * @param {string} filename 
 */
export function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
