import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  BookOpen, 
  Terminal, 
  Clock, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { MODULES } from '../data/modulesData';
import { ModuleId } from '../types';

interface SidebarProps {
  currentModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  completedModules: Set<ModuleId>;
  studyMode: 'guided' | 'lab';
  onToggleStudyMode: (mode: 'guided' | 'lab') => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  completedModules,
  studyMode,
  onToggleStudyMode,
  mobileOpen,
  onCloseMobile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = MODULES.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-[57px] bottom-0 left-0 z-40 w-72 bg-[#0B0F17] border-r border-slate-800 flex flex-col transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top utility section: Search & Study Mode */}
        <div className="p-3.5 border-b border-slate-800/80 space-y-3">
          {/* Mode switch */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => onToggleStudyMode('guided')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors ${
                studyMode === 'guided' 
                  ? 'bg-slate-800 text-cyan-300 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guía Teórica</span>
            </button>
            <button
              onClick={() => onToggleStudyMode('lab')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-colors ${
                studyMode === 'lab' 
                  ? 'bg-slate-800 text-emerald-300 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Laboratorio</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar tema, KPI o log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Syllabus Module List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <div className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400 flex items-center justify-between">
            <span>Temario de Telemetría</span>
            <span className="font-mono text-slate-400">{filteredModules.length} módulos</span>
          </div>

          {filteredModules.map((m) => {
            const isActive = currentModule === m.id;
            const isCompleted = completedModules.has(m.id);

            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectModule(m.id);
                  onCloseMobile();
                }}
                className={`w-full text-left p-2.5 rounded-lg transition-all group flex items-start gap-2.5 cursor-pointer ${
                  isActive 
                    ? 'bg-slate-800/90 border border-cyan-500/40 text-slate-100' 
                    : 'hover:bg-slate-900/80 text-slate-300 border border-transparent'
                }`}
              >
                {/* Number / Status indicator */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-slate-400 group-hover:text-slate-300">
                      {String(m.number).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Module Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {m.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {m.tagline}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{m.estimatedMinutes} min</span>
                    </span>
                    <span>·</span>
                    <span className="text-slate-300">{m.pillarBadge}</span>
                  </div>
                </div>

                <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-1 transition-transform ${
                  isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Footer info box */}
        <div className="p-3 border-t border-slate-800/80 text-xs text-slate-400 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Estado de Telemetría</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-mono text-emerald-400 font-semibold text-[11px]">ONLINE</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Métricas ReAct, Logs JSON estructurados y Waterfall Spans en tiempo real.
          </p>
        </div>
      </aside>
    </>
  );
};
