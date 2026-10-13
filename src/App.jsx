import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudentProvider } from './context/StudentContext.jsx';
import { Sidebar } from './components/Sidebar.jsx';

import { Dashboard } from './pages/Dashboard.jsx';
import { StudentExplorer } from './pages/StudentExplorer.jsx';
import { StudentDetail } from './pages/StudentDetail.jsx';
import { Interventions } from './pages/Interventions.jsx';
import { AIInsights } from './pages/AIInsights.jsx';
import { DataManagement } from './pages/DataManagement.jsx';
import { Methodology } from './pages/Methodology.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <StudentProvider>
        <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
          {/* Main Left Navigation Sidebar */}
          <Sidebar />

          {/* Main Dynamic Page Content */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/students" element={<StudentExplorer />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/interventions" element={<Interventions />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/data-management" element={<DataManagement />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </StudentProvider>
    </BrowserRouter>
  );
}
