import React, { useState } from 'react';
import { 
  Gauge, 
  DollarSign, 
  Target, 
  CheckCircle, 
  Wrench, 
  Calculator, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Cpu,
  Zap,
  HelpCircle,
  AlertOctagon,
  Flame,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ModelPricingPreset {
  id: string;
  name: string;
  ratePer1k: number; // USD per 1,000 tokens
  description: string;
}

const PRICING_PRESETS: ModelPricingPreset[] = [
  { id: 'guide-default', name: 'Preset de la Guía ($0.002 / 1k)', ratePer1k: 0.002, description: 'Tarifa de referencia del temario pedagógico' },
  { id: 'gemini-flash', name: 'Gemini 1.5 Flash (~$0.00015 / 1k)', ratePer1k: 0.00015, description: 'Ultra-económico para alta concurrencia' },
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro (~$0.0025 / 1k)', ratePer1k: 0.0025, description: 'Razonamiento complejo con gran ventana' },
  { id: 'gpt-4o', name: 'GPT-4o (~$0.005 / 1k)', ratePer1k: 0.005, description: 'Modelo insignia multimodal' },
  { id: 'claude-sonnet', name: 'Claude 3.5 Sonnet (~$0.006 / 1k)', ratePer1k: 0.006, description: 'Capacidad avanzada de codificación' }
];

export const Module5KpisAndMetrics: React.FC = () => {
  // Latency Calculator state
  const [calcTokens, setCalcTokens] = useState<number>(420);
  const [calcTotalSeconds, setCalcTotalSeconds] = useState<number>(3.2);
  const [calcTtftMs, setCalcTtftMs] = useState<number>(550);

  // Active Family Tab
  const [activeKpiTab, setActiveKpiTab] = useState<'latency' | 'cost' | 'accuracy' | 'success' | 'tools'>('latency');

  // Interactive Financial Calculator state
  const [requestsPerDay, setRequestsPerDay] = useState<number>(5000000); // 5,000,000 by default matching prompt example
  const [inputTokensPerReq, setInputTokensPerReq] = useState<number>(600);
  const [outputTokensPerReq, setOutputTokensPerReq] = useState<number>(400); // 1,000 tokens total per req
  const [pricingMode, setPricingMode] = useState<string>('guide-default');
  const [customRatePer1k, setCustomRatePer1k] = useState<number>(0.002);
  const [patternLoopActive, setPatternLoopActive] = useState<boolean>(false);

  // Compute Latency Calculations
  const ttftSeconds = calcTtftMs / 1000;
  const generationTimeSeconds = Math.max(calcTotalSeconds - ttftSeconds, 0.01);
  const tokensPerSecond = Math.round(calcTokens / generationTimeSeconds);
  const ttftPercentage = Math.round((ttftSeconds / calcTotalSeconds) * 100);

  let latencyVerdict = '';
  let latencyVerdictClass = 'text-emerald-400';
  if (ttftPercentage > 60) {
    latencyVerdict = 'Cuello de Botella en TTFT (Red o Cola del Modelo). El retraso se produjo antes de comenzar la generación. Revisa el tamaño del prompt inicial o la latencia del proveedor.';
    latencyVerdictClass = 'text-amber-400';
  } else if (tokensPerSecond < 25) {
    latencyVerdict = 'Generación Lenta de Inferencia. La red respondió rápido pero el modelo produce menos de 25 tokens/s. Considera migrar a un modelo destilado más veloz (ej. Flash o Haiku).';
    latencyVerdictClass = 'text-rose-400';
  } else {
    latencyVerdict = 'Rendimiento Nominal Óptimo. Distribución equilibrada entre tiempo inicial y tasa fluida de generación (>50 tokens/s).';
    latencyVerdictClass = 'text-emerald-400';
  }

  // Active rate per 1,000 tokens
  const activeRate = pricingMode === 'custom' 
    ? customRatePer1k 
    : (PRICING_PRESETS.find(p => p.id === pricingMode)?.ratePer1k ?? 0.002);

  // Tokens calculation
  const baseTokensPerReq = inputTokensPerReq + outputTokensPerReq;
  // If Pattern Loop is active, ReAct agent loops 3.5x extra iterations
  const loopMultiplier = patternLoopActive ? 3.5 : 1.0;
  const effectiveTokensPerReq = Math.round(baseTokensPerReq * loopMultiplier);
  const totalDailyTokens = requestsPerDay * effectiveTokensPerReq;
  
  // Formula: (Tokens Totales / 1,000) * Precio
  const dailyCostUsd = (totalDailyTokens / 1000) * activeRate;
  const monthlyCostUsd = dailyCostUsd * 30;
  const normalDailyCostUsd = (requestsPerDay * baseTokensPerReq / 1000) * activeRate;
  const wastedCostUsd = dailyCostUsd - normalDailyCostUsd;
  const tokensPerSecThroughput = Math.round(totalDailyTokens / 86400);

  // Quick preset handlers for daily requests
  const quickRequestPresets = [
    { label: '1K', value: 1000 },
    { label: '50K', value: 50000 },
    { label: '500K', value: 500000 },
    { label: '1M', value: 1000000 },
    { label: '5M', value: 5000000 },
    { label: '10M', value: 10000000 },
  ];

  return (
    <div className="space-y-8">
      {/* Module Hero */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <span>Módulo 05</span>
          <span>·</span>
          <span>Métricas y KPIs Fundamentales</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Las 5 Familias de Métricas Clave y KPIs
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Monitorear solo "número de peticiones" es ceguera operativa. La observabilidad moderna clasifica las métricas de agentes en <strong className="text-amber-300 font-semibold">5 familias complementarias</strong> para gobernar experiencia de usuario, fiabilidad y sostenibilidad económica.
        </p>
      </div>

      {/* The 5 Families Interactive Tabs */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100">
            Explorador de las 5 Familias de KPIs
          </h2>
          <span className="text-xs text-slate-400">Selecciona una categoría para ver sus métricas clave</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveKpiTab('latency')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeKpiTab === 'latency' ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>1. Latencia y Rendimiento</span>
          </button>
          <button
            onClick={() => setActiveKpiTab('cost')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeKpiTab === 'cost' ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>2. Costos Financieros</span>
          </button>
          <button
            onClick={() => setActiveKpiTab('accuracy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeKpiTab === 'accuracy' ? 'bg-violet-950/80 border border-violet-500/50 text-violet-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>3. Precisión y RAG</span>
          </button>
          <button
            onClick={() => setActiveKpiTab('success')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeKpiTab === 'success' ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>4. Tasa de Éxito</span>
          </button>
          <button
            onClick={() => setActiveKpiTab('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeKpiTab === 'tools' ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>5. Salud de Herramientas</span>
          </button>
        </div>

        {/* Tab Content Cards */}
        {activeKpiTab === 'latency' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold block">Total Request Latency (E2E)</span>
              <p className="text-xs text-slate-300">Tiempo total desde que el usuario envía el prompt hasta que el último token o acción finaliza.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">SLO Recomendado: p95 &lt; 4.0s</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold block">Time to First Token (TTFT)</span>
              <p className="text-xs text-slate-300">Tiempo que transcurre antes de que el usuario vea comenzar la respuesta en streaming. Afecta drásticamente la percepción de fluidez.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">SLO Recomendado: TTFT &lt; 600ms</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold block">Throughput (Tokens / Seg)</span>
              <p className="text-xs text-slate-300">Velocidad pura de generación de la GPU durante el streaming. Permite detectar congestión del proveedor.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">SLO Recomendado: &gt; 45 tokens/s</div>
            </div>
          </div>
        )}

        {activeKpiTab === 'cost' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-amber-400 font-semibold block">Costo por Sesión Completa</span>
              <p className="text-xs text-slate-300">Gasto total en dólares sumando todas las llamadas a LLM y embeddings requeridas para resolver el ticket.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Alerta: &gt; 3x promedio histórico</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-amber-400 font-semibold block">Ratio Tokens Input / Output</span>
              <p className="text-xs text-slate-300">Evalúa la eficiencia del prompt engineering. Ratios muy altos (15:1) indican contexto redundante o RAG no filtrado.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Target Saludable: ~ 4:1 a 6:1</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-amber-400 font-semibold block">Costo de Reintentos de Tools</span>
              <p className="text-xs text-slate-300">Dólares malgastados en iteraciones de agentes causadas por errores de sintaxis en APIs externas.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Meta Operativa: &lt; 2% del gasto total</div>
            </div>
          </div>
        )}

        {activeKpiTab === 'accuracy' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-violet-400 font-semibold block">Context Precision</span>
              <p className="text-xs text-slate-300">Mide si los fragmentos de documentos recuperados por la base de datos vectorial fueron verdaderamente relevantes para el problema.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Benchmark: &gt; 0.85</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-violet-400 font-semibold block">Faithfulness (Alineación)</span>
              <p className="text-xs text-slate-300">Evalúa si cada afirmación de la respuesta final se deriva de los hechos documentados, sin inventar información (Zero Hallucination).</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Benchmark: &gt; 0.95</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-violet-400 font-semibold block">Answer Relevance</span>
              <p className="text-xs text-slate-300">Comprueba si el agente respondió directamente a lo que el usuario preguntó, sin desvíos ni rodeos evasivos.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Benchmark: &gt; 0.90</div>
            </div>
          </div>
        )}

        {activeKpiTab === 'success' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">Goal Completion Rate (GCR)</span>
              <p className="text-xs text-slate-300">Porcentaje de interacciones en las que el objetivo del usuario se resolvió de forma satisfactoria sin abandono.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Meta: &gt; 92%</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">Human Escalation Rate</span>
              <p className="text-xs text-slate-300">Frecuencia con la que el agente tuvo que rendirse y transferir la conversación a un operador de soporte humano.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Alerta: &gt; 8%</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">Plan Adherence</span>
              <p className="text-xs text-slate-300">Porcentaje de pasos en los que el agente respetó el plan formulado en su reasoning inicial sin desviaciones caóticas.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Benchmark: &gt; 88%</div>
            </div>
          </div>
        )}

        {activeKpiTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-rose-400 font-semibold block">Tool Execution Failure Rate</span>
              <p className="text-xs text-slate-300">Ratio de errores HTTP, timeouts o parámetros inválidos al invocar funciones externas (APIs, SQL, bash).</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Alerta: &gt; 2.5%</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-rose-400 font-semibold block">Tool Selection Precision</span>
              <p className="text-xs text-slate-300">Mide si el LLM eligió la herramienta adecuada para la tarea o intentó usar una tool irrelevante por confusión de nombres.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">Benchmark: &gt; 96%</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-rose-400 font-semibold block">Average Tool Call Latency</span>
              <p className="text-xs text-slate-300">Tiempo de respuesta de cada API integrada. Permite detectar si la lentitud proviene del backend propio o del modelo.</p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">SLO: &lt; 800ms por llamada</div>
            </div>
          </div>
        )}
      </div>

      {/* WIDGET INTERACTIVO REQUERIDO: Calculadora de Costos Financieros y Consumo de Tokens */}
      <div className="p-6 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/20 text-amber-400 font-mono text-sm font-bold">💲</span>
              <h2 className="text-lg font-bold text-slate-100">
                Calculadora de Costos Financieros y Consumo de Tokens
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Calcula en vivo el costo acumulado y Token Throughput según la fórmula <code className="text-amber-300 font-mono">(Tokens Totales / 1,000) * Precio</code> para evitar sorpresas y neutralizar bucles infinitos.
            </p>
          </div>

          {/* Toggle: Simular Pattern Loop / Bucle Infinito */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-200 block">Simular Pattern Loop</span>
              <span className="text-[10px] text-slate-400 block font-mono">Bucle ReAct Infinito</span>
            </div>
            <button
              onClick={() => setPatternLoopActive(prev => !prev)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                patternLoopActive ? 'bg-rose-600 justify-end' : 'bg-slate-800 justify-start'
              }`}
              title="Activar bucle Pensamiento → Acción → Observación para simular explosión de costos"
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>
        </div>

        {/* NEON ALERT BANNER IF PATTERN LOOP ACTIVE */}
        {patternLoopActive && (
          <div className="p-4 rounded-xl bg-rose-950/60 border-2 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.35)] animate-pulse space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                <span>🚨 ALERTA DE COSTO: Detección de Bucle Infinito. Consumo triplicado en ejecución</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-900 text-rose-100 border border-rose-400">
                FACTOR: x3.5 TOKENS
              </span>
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              El agente ReAct ha quedado atrapado en el ciclo <strong className="text-white font-mono">Pensamiento → Acción → Observación</strong> sin Circuit Breaker. 
              El consumo por consulta aumentó de <span className="font-mono font-bold text-white">{baseTokensPerReq.toLocaleString()}</span> a <span className="font-mono font-bold text-white">{effectiveTokensPerReq.toLocaleString()}</span> tokens. 
              Estás perdiendo <strong className="text-amber-300 font-mono">${wastedCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD diarios</strong> en iteraciones redundantes.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Section */}
          <div className="lg:col-span-6 space-y-4">
            {/* Control 1: Consultas Diarias (1,000 a 10,000,000) */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <span>1. Consultas Diarias</span>
                  <span className="text-slate-500 text-[11px]">(1K a 10M / día)</span>
                </span>
                <span className="font-mono text-amber-300 font-bold text-sm tabular-nums">
                  {requestsPerDay.toLocaleString()} req/día
                </span>
              </div>

              <input
                type="range"
                min="1000"
                max="10000000"
                step="50000"
                value={requestsPerDay}
                onChange={(e) => setRequestsPerDay(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              {/* Quick selector buttons */}
              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                <span className="text-[10px] text-slate-500 font-mono">Presets:</span>
                {quickRequestPresets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setRequestsPerDay(p.value)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      requestsPerDay === p.value 
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold' 
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Tokens por Consulta (Input vs Output) */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold">2. Tokens por Consulta (Desglose)</span>
                <span className="font-mono text-cyan-300 font-bold text-xs tabular-nums">
                  Total: {baseTokensPerReq} tokens {patternLoopActive && <span className="text-rose-400">(→ {effectiveTokensPerReq} en bucle)</span>}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Tokens Prompt (Entrada)</span>
                    <span className="font-mono text-slate-200">{inputTokensPerReq}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="8000"
                    step="100"
                    value={inputTokensPerReq}
                    onChange={(e) => setInputTokensPerReq(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Tokens Completion (Salida)</span>
                    <span className="font-mono text-slate-200">{outputTokensPerReq}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="4000"
                    step="50"
                    value={outputTokensPerReq}
                    onChange={(e) => setOutputTokensPerReq(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Control 3: Tarifa del Modelo (USD por 1,000 tokens) */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold">3. Tarifa del Modelo (USD por 1,000 tokens)</span>
                <span className="font-mono text-emerald-400 font-bold text-xs">
                  ${activeRate.toFixed(5)} / 1k
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRICING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setPricingMode(preset.id);
                      setCustomRatePer1k(preset.ratePer1k);
                    }}
                    className={`p-2 rounded-lg text-left border text-xs transition-colors cursor-pointer ${
                      pricingMode === preset.id 
                        ? 'bg-amber-950/70 border-amber-500/50 text-amber-200 font-medium' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate font-semibold">{preset.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{preset.description}</div>
                  </button>
                ))}
              </div>

              {/* Custom rate input toggle */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setPricingMode('custom')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    pricingMode === 'custom' 
                      ? 'bg-amber-600 text-white font-bold' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Personalizado:
                </button>
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-xs text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.00001"
                    max="0.1"
                    value={customRatePer1k}
                    onChange={(e) => {
                      setPricingMode('custom');
                      setCustomRatePer1k(Number(e.target.value));
                    }}
                    className="w-28 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs text-slate-500 font-mono">USD / 1k tokens</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Outputs Section */}
          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-mono">RESULTADOS FINANCIEROS EN VIVO</span>
                <span className="font-mono text-amber-400 font-semibold">FORMULA: (TOKENS / 1,000) * PRECIO</span>
              </div>

              {/* Total Tokens & Throughput */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Tokens Diarios Totales</span>
                  <span className="text-lg font-mono font-bold text-slate-100 tabular-nums">
                    {(totalDailyTokens / 1_000_000).toFixed(2)} M <span className="text-xs text-slate-500 font-sans">tokens</span>
                  </span>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {totalDailyTokens.toLocaleString()} tokens/día
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Token Throughput</span>
                  <span className="text-lg font-mono font-bold text-cyan-300 tabular-nums">
                    {tokensPerSecThroughput.toLocaleString()} <span className="text-xs text-slate-500 font-sans">t/s</span>
                  </span>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    Ritmo de consumo continuo
                  </div>
                </div>
              </div>

              {/* Daily & Monthly Cost Display */}
              <div className="space-y-3 mt-3">
                <div className={`p-4 rounded-xl border transition-all ${
                  patternLoopActive 
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.2)]' 
                    : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Costo Diario Acumulado (USD)</span>
                      <span className={`text-3xl font-mono font-extrabold tabular-nums ${patternLoopActive ? 'text-rose-400' : 'text-slate-100'}`}>
                        ${dailyCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-xs font-sans text-slate-400 font-normal ml-1">USD/día</span>
                      </span>
                    </div>
                    <div className="text-right text-[11px] font-mono text-slate-400">
                      <div>({(totalDailyTokens / 1000).toLocaleString()} k-tokens)</div>
                      <div className="text-amber-400">x ${activeRate}</div>
                    </div>
                  </div>

                  {/* Verification Note for Prompt Example: 5,000,000 tokens a $0.002/1k = $10.00 USD/día */}
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Ejemplo Guía: 5M tokens a $0.002/1k</span>
                    <span className="text-emerald-400 font-mono font-semibold">= $10.00 USD/día</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-300 block font-semibold">Proyección Mensual (30 días)</span>
                    <span className="text-3xl font-mono font-bold text-amber-300 tabular-nums">
                      ${monthlyCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-xs font-sans text-amber-400 font-normal ml-1">USD/mes</span>
                    </span>
                  </div>
                  <DollarSign className="w-8 h-8 text-amber-400/80" />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              💡 <strong className="text-slate-200">Recomendación de FinOps de IA:</strong> Un pico sostenido en el ratio de costo diario frente a peticiones es el indicador #1 de que una versión nueva de un agente está entrando en bucles no detectados.
            </div>
          </div>
        </div>
      </div>

      {/* Latency Calculator Section */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Calculadora Interactiva de Latencia por Token y Diagnóstico
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ingresa los parámetros de tu agente para aislar si el cuello de botella es de red/cola (TTFT) o de generación (Throughput).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>Tokens Generados (Salida)</span>
                <span className="font-mono text-cyan-300 font-bold">{calcTokens} tokens</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={calcTokens}
                onChange={(e) => setCalcTokens(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>Tiempo Total de la Petición (Segundos)</span>
                <span className="font-mono text-cyan-300 font-bold">{calcTotalSeconds.toFixed(2)} s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                value={calcTotalSeconds}
                onChange={(e) => setCalcTotalSeconds(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>Time to First Token - TTFT (Milisegundos)</span>
                <span className="font-mono text-cyan-300 font-bold">{calcTtftMs} ms</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={calcTtftMs}
                onChange={(e) => setCalcTtftMs(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-mono">DIAGNÓSTICO TELEMÉTRICO</span>
                <span className="font-mono font-semibold text-cyan-400">ANÁLISIS INSTANTÁNEO</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Velocidad Neta</span>
                  <span className="text-xl font-mono font-bold text-slate-100 tabular-nums">
                    {tokensPerSecond} <span className="text-xs text-cyan-400 font-sans">tokens/s</span>
                  </span>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">% Tiempo en TTFT</span>
                  <span className="text-xl font-mono font-bold text-amber-300 tabular-nums">
                    {ttftPercentage}% <span className="text-xs text-slate-400 font-sans">del total</span>
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                  <span>TTFT ({calcTtftMs}ms)</span>
                  <span>Generación ({Math.round(generationTimeSeconds * 1000)}ms)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                  <div className="bg-amber-400 h-full" style={{ width: `${ttftPercentage}%` }} />
                  <div className="bg-cyan-400 h-full" style={{ width: `${100 - ttftPercentage}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-xs space-y-1">
              <span className="font-semibold block text-slate-200">Veredicto Forense:</span>
              <p className={`leading-relaxed ${latencyVerdictClass}`}>
                {latencyVerdict}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
