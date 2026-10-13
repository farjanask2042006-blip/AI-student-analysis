import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Database, 
  BookOpen, 
  GraduationCap, 
  RotateCcw,
  Layers
} from 'lucide-react';
import { useStudentData } from '../context/StudentContext.jsx';

export function Sidebar() {
  const { students, resetDemo, dataSource } = useStudentData();

  const navItems = [
    { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Student Explorer', path: '/students', icon: Users },
    { name: 'Risk & Interventions', path: '/interventions', icon: ShieldAlert },
    { name: 'AI Insights Workspace', path: '/ai-insights', icon: Sparkles },
    { name: 'Data Management', path: '/data-management', icon: Database },
    { name: 'Methodology & Score', path: '/methodology', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 selection:bg-blue-500 selection:text-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              EduPulse <span className="text-blue-400 text-xs px-1.5 py-0.5 rounded-sm bg-blue-900/60 font-mono">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Predict • Optimize • Guide</p>
          </div>
        </div>

        <div className="mt-3 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Active
          </span>
          <span className="font-mono text-slate-400">{students.length} Students</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Dataset Source & Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-slate-400">Data Pipeline</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-semibold ${
              dataSource === 'supabase'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-blue-950 text-blue-400 border border-blue-800'
            }`}
          >
            {dataSource === 'supabase' ? 'Supabase Live' : 'Local Dataset'}
          </span>
        </div>

        <button
          onClick={resetDemo}
          className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium"
          title="Reset dataset back to standard 55 synthetic student profiles"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Data
        </button>

        <p className="mt-3 text-[10px] text-slate-400 text-center leading-relaxed">
          Decision Support System<br />
          Institutional Records
        </p>
      </div>
    </aside>
  );
}
