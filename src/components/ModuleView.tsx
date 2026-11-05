import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Layers 
} from 'lucide-react';
import { MODULES } from '../data/modulesData';
import { ModuleId } from '../types';
import { Module1Concept } from './modules/Module1Concept';
import { Module2SilentFailures } from './modules/Module2SilentFailures';
import { Module3ThreePillars } from './modules/Module3ThreePillars';
import { Module4JsonLogs } from './modules/Module4JsonLogs';
import { Module5KpisAndMetrics } from './modules/Module5KpisAndMetrics';
import { Module6TracesAndSpans } from './modules/Module6TracesAndSpans';
import { Module7ToolsEcosystem } from './modules/Module7ToolsEcosystem';
import { Module8CaseStudy } from './modules/Module8CaseStudy';
import { Module9QuizAndLab } from './modules/Module9QuizAndLab';

interface ModuleViewProps {
  currentModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  completedModules: Set<ModuleId>;
  onToggleComplete: (id: ModuleId) => void;
  onExportMarkdown: () => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  currentModule,
  onSelectModule,
  completedModules,
  onToggleComplete,
  onExportMarkdown,
}) => {
  const currentIndex = MODULES.findIndex(m => m.id === currentModule);
  const activeModuleInfo = MODULES[currentIndex] || MODULES[0];
  const isCompleted = completedModules.has(currentModule);

  const prevModule = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Module Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-mono text-cyan-400 font-semibold">MÓDULO {String(activeModuleInfo.number).padStart(2, '0')} DE 09</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{activeModuleInfo.estimatedMinutes} minutos</span>
          </span>
          <span>·</span>
          <span className="text-slate-300 font-medium">{activeModuleInfo.pillarBadge}</span>
        </div>

        {/* Mark as Completed Button */}
        <button
          onClick={() => onToggleComplete(currentModule)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isCompleted 
              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 shadow-sm' 
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>{isCompleted ? 'Módulo Completado' : 'Marcar como Aprendido'}</span>
        </button>
      </div>

      {/* Dynamic Module Component Rendering */}
      <div>
        {currentModule === 'que-es-observabilidad' && <Module1Concept />}
        {currentModule === 'fallo-en-silencio' && <Module2SilentFailures />}
        {currentModule === 'tres-pilares' && <Module3ThreePillars />}
        {currentModule === 'logs-json' && <Module4JsonLogs />}
        {currentModule === 'metricas-kpis' && <Module5KpisAndMetrics />}
        {currentModule === 'trazas-spans' && <Module6TracesAndSpans />}
        {currentModule === 'ecosistema-herramientas' && <Module7ToolsEcosystem />}
        {currentModule === 'caso-integrador' && <Module8CaseStudy />}
        {currentModule === 'autoevaluacion-lab' && <Module9QuizAndLab onExportMarkdown={onExportMarkdown} />}
      </div>

      {/* Bottom Sequential Navigation Bar */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
        {prevModule ? (
          <button
            onClick={() => onSelectModule(prevModule.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-mono block">ANTERIOR</span>
              <span className="truncate max-w-[150px] sm:max-w-[200px] block">{prevModule.title}</span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextModule ? (
          <button
            onClick={() => {
              if (!isCompleted) onToggleComplete(currentModule);
              onSelectModule(nextModule.id);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors cursor-pointer group shadow-lg shadow-cyan-950"
          >
            <div className="text-right">
              <span className="text-[10px] text-cyan-200 font-mono block">SIGUIENTE MÓDULO</span>
              <span className="truncate max-w-[150px] sm:max-w-[200px] block">{nextModule.title}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onExportMarkdown}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-emerald-950"
          >
            <span>Descargar Guía Completa</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
