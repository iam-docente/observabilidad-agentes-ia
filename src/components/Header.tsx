import React, { useState } from 'react';
import { Activity, ShieldCheck, Download, Menu, X, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { ModuleId } from '../types';
import { MODULES } from '../data/modulesData';

interface HeaderProps {
  currentModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  progressPercent: number;
  completedCount: number;
  totalModules: number;
  onExportMarkdown: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onSelectModule,
  progressPercent,
  completedCount,
  totalModules,
  onExportMarkdown,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  // Determine active section category for visual cues
  const getActiveCategory = (modId: ModuleId) => {
    if (modId === 'que-es-observabilidad' || modId === 'fallo-en-silencio') return 'fundamentos';
    if (modId === 'tres-pilares' || modId === 'logs-json') return 'pilares';
    if (modId === 'metricas-kpis' || modId === 'trazas-spans') return 'metricas';
    if (modId === 'ecosistema-herramientas' || modId === 'caso-integrador') return 'caso';
    return 'lab';
  };

  const activeCategory = getActiveCategory(currentModule);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800 transition-colors">
      {/* Main Top Row Contract */}
      <div className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Mobile Hamburger + Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-cyan-400" />
            ) : (
              <Menu className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Brand Wordmark */}
          <div 
            onClick={() => onSelectModule('que-es-observabilidad')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/70 transition-colors">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {/* Subtle pulsing live indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-100 whitespace-nowrap">
              AgentObservability<span className="text-cyan-400">.io</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Desktop 4-5 concise single-line text links with active visual cues */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={() => onSelectModule('que-es-observabilidad')}
            className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'fundamentos' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fundamentos
            {activeCategory === 'fundamentos' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>

          <button 
            onClick={() => onSelectModule('tres-pilares')}
            className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'pilares' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Los 3 Pilares
            {activeCategory === 'pilares' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>

          <button 
            onClick={() => onSelectModule('metricas-kpis')}
            className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'metricas' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            KPIs & Trazas
            {activeCategory === 'metricas' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            )}
          </button>

          <button 
            onClick={() => onSelectModule('caso-integrador')}
            className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'caso' ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Caso Forense
            {activeCategory === 'caso' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-400 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            )}
          </button>

          <button 
            onClick={() => onSelectModule('autoevaluacion-lab')}
            className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'lab' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Laboratorio & Quiz
            {activeCategory === 'lab' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            )}
          </button>
        </nav>

        {/* Zone 3: Progress Indicator (VISIBLE ON ALL DEVICES) + Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Always Visible Progress Indicator with glowing pulse */}
          <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-mono tabular-nums text-emerald-400 font-bold text-xs sm:text-[13px]">
                {completedCount}/{totalModules}
              </span>
              <span className="hidden sm:inline text-slate-500 text-[11px]">módulos</span>
            </div>

            <div className="w-12 sm:w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-300 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <span className="font-mono tabular-nums text-slate-400 text-[10px] sm:text-[11px] font-semibold">
              {progressPercent}%
            </span>
          </div>

          {/* Export Action */}
          <button
            onClick={onExportMarkdown}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Descargar resumen técnico en formato Markdown"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Exportar Guía</span>
          </button>
        </div>
      </div>

      {/* Responsive Collapsible Mobile Menu Drawer with Smooth Transitions */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/90 bg-[#0B0F17]/98 px-4 py-3 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-800">
            <span>Navegación Rápida</span>
            <span className="text-cyan-400">{completedCount} de {totalModules} Aprendidos</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => { onSelectModule('que-es-observabilidad'); onToggleMobileMenu(); }}
              className={`p-2 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeCategory === 'fundamentos' ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>1. Fundamentos</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={() => { onSelectModule('tres-pilares'); onToggleMobileMenu(); }}
              className={`p-2 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeCategory === 'pilares' ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>2. Los 3 Pilares</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={() => { onSelectModule('metricas-kpis'); onToggleMobileMenu(); }}
              className={`p-2 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeCategory === 'metricas' ? 'bg-amber-950/70 border border-amber-500/50 text-amber-300' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>3. KPIs & Trazas</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={() => { onSelectModule('caso-integrador'); onToggleMobileMenu(); }}
              className={`p-2 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeCategory === 'caso' ? 'bg-rose-950/70 border border-rose-500/50 text-rose-300' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>4. Caso Forense</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={() => { onSelectModule('autoevaluacion-lab'); onToggleMobileMenu(); }}
              className={`col-span-2 p-2 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeCategory === 'lab' ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>5. Laboratorio Práctico & Quiz de Certificación</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
