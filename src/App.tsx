import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ModuleView } from './components/ModuleView';
import { MODULES } from './data/modulesData';
import { ModuleId } from './types';
import { downloadMarkdownFile } from './utils/exportMarkdown';
import { Menu, X, BookOpen, Terminal, Sparkles } from 'lucide-react';

export default function App() {
  const [currentModule, setCurrentModule] = useState<ModuleId>(() => {
    const saved = localStorage.getItem('agent_obs_current_module');
    return (saved as ModuleId) || 'que-es-observabilidad';
  });

  const [completedModules, setCompletedModules] = useState<Set<ModuleId>>(() => {
    try {
      const saved = localStorage.getItem('agent_obs_completed_modules');
      if (saved) {
        return new Set<ModuleId>(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore
    }
    return new Set<ModuleId>(['que-es-observabilidad']);
  });

  const [studyMode, setStudyMode] = useState<'guided' | 'lab'>('guided');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('agent_obs_current_module', currentModule);
  }, [currentModule]);

  useEffect(() => {
    localStorage.setItem(
      'agent_obs_completed_modules',
      JSON.stringify(Array.from(completedModules))
    );
  }, [completedModules]);

  const handleSelectModule = (id: ModuleId) => {
    setCurrentModule(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleComplete = (id: ModuleId) => {
    setCompletedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExportMarkdown = () => {
    downloadMarkdownFile();
  };

  const progressPercent = Math.round(
    (completedModules.size / MODULES.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 flex flex-col font-sans">
      {/* Top Header with fixed position, responsive hamburger and visible progress indicator */}
      <Header
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        progressPercent={progressPercent}
        completedCount={completedModules.size}
        totalModules={MODULES.length}
        onExportMarkdown={handleExportMarkdown}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
      />

      {/* Mobile Sub-bar with Syllabus Drawer toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="flex items-center gap-2 text-slate-300 font-medium py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ver Temario Completo (9 Módulos)</span>
        </button>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Telemetría Live</span>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={handleSelectModule}
          completedModules={completedModules}
          studyMode={studyMode}
          onToggleStudyMode={setStudyMode}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 lg:pl-72 p-4 sm:p-8 overflow-y-auto">
          <ModuleView
            currentModule={currentModule}
            onSelectModule={handleSelectModule}
            completedModules={completedModules}
            onToggleComplete={handleToggleComplete}
            onExportMarkdown={handleExportMarkdown}
          />
        </main>
      </div>
    </div>
  );
}
