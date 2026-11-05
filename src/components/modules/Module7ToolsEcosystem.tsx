import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Shield, 
  ExternalLink, 
  Check, 
  X, 
  Filter, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TOOLS_LIST } from '../../data/modulesData';
import { ToolOption } from '../../types';

export const Module7ToolsEcosystem: React.FC = () => {
  // Wizard state
  const [selectedFramework, setSelectedFramework] = useState<'langchain' | 'llamaindex' | 'custom'>('custom');
  const [selectedPrivacy, setSelectedPrivacy] = useState<'saas' | 'selfhosted'>('selfhosted');
  const [hasExistingApm, setHasExistingApm] = useState<boolean>(true);
  const [budgetTier, setBudgetTier] = useState<'free' | 'enterprise'>('free');

  // Calculate recommended tool
  let recommendedToolId = 'langfuse';
  let rationale = '';

  if (selectedPrivacy === 'selfhosted') {
    if (hasExistingApm) {
      recommendedToolId = 'opentelemetry';
      rationale = 'Al requerir Self-Hosted estricto y ya contar con infraestructura APM (Datadog/Grafana), la mejor estrategia es OpenTelemetry + OpenInference: instrumentas con un estándar abierto neutral sin pagar licencias adicionales.';
    } else {
      recommendedToolId = 'langfuse';
      rationale = 'Langfuse es la opción Open Source más madura y fácil de desplegar en tus propios servidores (Docker/Kubernetes), ofreciendo interfaz web completa para inspeccionar trazas y costos sin enviar datos a terceros.';
    }
  } else {
    // SaaS
    if (selectedFramework === 'langchain') {
      recommendedToolId = 'langsmith';
      rationale = 'Al utilizar LangChain o LangGraph en la nube, LangSmith ofrece integración nativa de cero configuración, soporte para hilos de agentes cíclicos y suites de evaluación de datasets.';
    } else if (hasExistingApm && budgetTier === 'enterprise') {
      recommendedToolId = 'datadog';
      rationale = 'Si tu empresa ya tiene Datadog y presupuesto Enterprise, Datadog LLM Observability unifica en una sola pantalla tus bases de datos, clusters de Kubernetes y las llamadas a los modelos de lenguaje.';
    } else {
      recommendedToolId = 'langfuse';
      rationale = 'Langfuse Cloud ofrece un generoso tier gratuito, compatibilidad agnóstica con cualquier SDK (Python/TypeScript) y visualización limpia de trazas sin casarte con ningún framework.';
    }
  }

  const recommendedTool = TOOLS_LIST.find(t => t.id === recommendedToolId) || TOOLS_LIST[0];

  return (
    <div className="space-y-8">
      {/* Module Hero */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 mb-2">
          <span>Módulo 07</span>
          <span>·</span>
          <span>Ecosistema Tecnológico y Selección</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Ecosistema de Herramientas de Observabilidad
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          El mercado de telemetría para IA se divide en dos grandes vertientes: <strong className="text-violet-300 font-semibold">Herramientas Nativas de LLMs</strong> (diseñadas para cadenas de pensamiento, datasets y evaluación de prompts) y <strong className="text-cyan-300 font-semibold">APMs de Infraestructura Tradicional</strong> (diseñados para servidores, pods de Kubernetes y redes).
        </p>
      </div>

      {/* Interactive Stack Decision Wizard */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Asistente de Decisión: "¿Cuál debería elegir según mi stack?"
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Selecciona los requerimientos técnicos y de negocio de tu organización para obtener la recomendación arquitectónica ideal.
            </p>
          </div>
        </div>

        {/* Wizard Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Criterion 1 */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">1. Framework Base</span>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedFramework('langchain')}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  selectedFramework === 'langchain' ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LangChain / LangGraph
              </button>
              <button
                onClick={() => setSelectedFramework('llamaindex')}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  selectedFramework === 'llamaindex' ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LlamaIndex
              </button>
              <button
                onClick={() => setSelectedFramework('custom')}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  selectedFramework === 'custom' ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom / SDKs Oficiales
              </button>
            </div>
          </div>

          {/* Criterion 2 */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">2. Privacidad y Despliegue</span>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedPrivacy('saas')}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  selectedPrivacy === 'saas' ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cloud SaaS Gestionado
              </button>
              <button
                onClick={() => setSelectedPrivacy('selfhosted')}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  selectedPrivacy === 'selfhosted' ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Self-Hosted / On-Premise
              </button>
            </div>
          </div>

          {/* Criterion 3 */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">3. APM Existente</span>
            <div className="space-y-1.5">
              <button
                onClick={() => setHasExistingApm(true)}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  hasExistingApm ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sí (Datadog / Grafana)
              </button>
              <button
                onClick={() => setHasExistingApm(false)}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  !hasExistingApm ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                No / Empezando desde cero
              </button>
            </div>
          </div>

          {/* Criterion 4 */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">4. Presupuesto</span>
            <div className="space-y-1.5">
              <button
                onClick={() => setBudgetTier('free')}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  budgetTier === 'free' ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Open Source / Free Tier
              </button>
              <button
                onClick={() => setBudgetTier('enterprise')}
                className={`w-full py-1.5 px-2 text-xs rounded text-left transition-colors cursor-pointer ${
                  budgetTier === 'enterprise' ? 'bg-violet-950/70 border border-violet-500/50 text-violet-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Presupuesto Enterprise
              </button>
            </div>
          </div>
        </div>

        {/* Wizard Recommendation Output Banner */}
        <div className="p-5 rounded-xl bg-violet-950/30 border border-violet-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">RECOMENDACIÓN ARQUITECTÓNICA</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-violet-900/60 text-violet-200 font-mono font-semibold">
                MATCH: 98%
              </span>
            </div>
            <a 
              href={recommendedTool.website} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-violet-300 hover:text-white transition-colors"
            >
              <span>Ver sitio oficial</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>{recommendedTool.name}</span>
            <span className="text-xs font-normal text-slate-400 font-mono">({recommendedTool.license} · {recommendedTool.category})</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {rationale}
          </p>
        </div>
      </div>

      {/* Comparative Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-100">
          Matriz Detallada de Herramientas Líderes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS_LIST.map((tool) => (
            <div 
              key={tool.id}
              className={`p-5 rounded-xl bg-slate-900/70 border transition-all space-y-3 ${
                tool.id === recommendedToolId ? 'border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-100">{tool.name}</span>
                  {tool.id === recommendedToolId && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-900/80 text-violet-200 font-mono font-bold">
                      RECOMENDADO
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-400">{tool.license}</span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-500 block mb-1">Puntos Fuertes</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {tool.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-500 block mb-1">Limitaciones / Retos</span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {tool.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <strong className="text-slate-300">Precio / Modelo:</strong> {tool.pricingNote}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
