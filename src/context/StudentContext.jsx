import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStudents, saveStudents, resetDemoStudents } from '../lib/studentService.js';
import { getInterventions, createIntervention, updateIntervention } from '../lib/interventionService.js';

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [dataSource, setDataSource] = useState('demo');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const studentRes = await getStudents();
      const interventionRes = await getInterventions();
      setStudents(studentRes.students);
      setDataSource(studentRes.source);
      setInterventions(interventionRes.interventions);
      setError(null);
    } catch (err) {
      console.error('Failed to load EduPulse data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleAddIntervention = async (interventionData) => {
    const created = await createIntervention(interventionData);
    setInterventions((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateIntervention = async (id, updates) => {
    const updated = await updateIntervention(id, updates);
    if (updated) {
      setInterventions((prev) => prev.map((item) => (item.id === id ? updated : item)));
    }
    return updated;
  };

  const handleImportStudents = async (newOrUpdatedList) => {
    // Merge or replace
    const currentMap = new Map(students.map((s) => [s.student_id, s]));
    newOrUpdatedList.forEach((s) => {
      currentMap.set(s.student_id, { ...(currentMap.get(s.student_id) || {}), ...s });
    });
    const merged = Array.from(currentMap.values());
    const enriched = await saveStudents(merged);
    setStudents(enriched);
    return enriched;
  };

  const handleResetDemo = () => {
    const resetList = resetDemoStudents();
    setStudents(resetList);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        interventions,
        dataSource,
        loading,
        error,
        refreshData: loadAllData,
        addIntervention: handleAddIntervention,
        updateIntervention: handleUpdateIntervention,
        importStudents: handleImportStudents,
        resetDemo: handleResetDemo,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentData() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentData must be used within a StudentProvider');
  }
  return context;
}
