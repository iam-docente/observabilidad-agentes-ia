import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BarChart3, 
  GitFork, 
  UtensilsCrossed, 
  Play, 
  RotateCcw, 
  Check, 
  Clock, 
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  Flame
} from 'lucide-react';

interface RestaurantStep {
  id: number;
  title: string;
  component: string;
  durationMs: number;
  startTimeOffsetMs: number;
  logJson: Record<string, any>;
  metricDelta: { orderCount: number; avgLatencyMs: number; errorRate: string; throughputTps: number };
  spanInfo: { spanName: string; parentSpan: string; depth: number };
}

const RESTAURANT_STEPS: RestaurantStep[] = [
  {
    id: 1,
    title: '1. Comanda tomada en mesa',
    component: 'Camarero (Prompt del Usuario)',
    durationMs: 140,
    startTimeOffsetMs: 0,
    logJson: {
      timestamp: '2026-11-05T19:30:00.140Z',
      event: 'order_received',
      table_id: 'table_12',
      dish: 'Risotto de Hongos Silvestres',
      modifications: 'Sin gluten',
      level: 'INFO'
    },
    metricDelta: { orderCount: 1, avgLatencyMs: 140, errorRate: '0.0%', throughputTps: 7.1 },
    spanInfo: { spanName: 'order_intake', parentSpan: 'root_order_lifecycle', depth: 1 }
  },
  {
    id: 2,
    title: '2. Verificación de stock en despensa',
    component: 'Despensa (Tool Call: check_inventory)',
    durationMs: 320,
    startTimeOffsetMs: 140,
    logJson: {
      timestamp: '2026-11-05T19:30:00.460Z',
      event: 'inventory_check',
      ingredients_checked: ['arroz_arborio', 'boletus_edulis', 'caldo_trufa'],
      stock_status: 'AVAILABLE',
      duration_ms: 320
    },
    metricDelta: { orderCount: 1, avgLatencyMs: 230, errorRate: '0.0%', throughputTps: 4.3 },
    spanInfo: { spanName: 'check_inventory_api', parentSpan: 'root_order_lifecycle', depth: 1 }
  },
  {
    id: 3,
    title: '3. Preparación y cocción en cocina',
    component: 'Fogones (Inferencia Central LLM)',
    durationMs: 1450,
    startTimeOffsetMs: 460,
    logJson: {
      timestamp: '2026-11-05T19:30:01.910Z',
      event: 'dish_cooking',
      heat_temp_celsius: 195,
      tokens_processed: 2840,
      phase: 'sauted_and_reduced',
      status: 'COMPLETE'
    },
    metricDelta: { orderCount: 1, avgLatencyMs: 636, errorRate: '0.0%', throughputTps: 1.5 },
    spanInfo: { spanName: 'cook_dish_inference', parentSpan: 'root_order_lifecycle', depth: 1 }
  },
  {
    id: 4,
    title: '4. Control de calidad del Chef',
    component: 'Chef Principal (Guardrails / Evaluation)',
    durationMs: 210,
    startTimeOffsetMs: 1910,
    logJson: {
      timestamp: '2026-11-05T19:30:02.120Z',
      event: 'quality_assurance',
      plating_score: 9.8,
      hallucination_check: 'PASSED',
      gluten_free_certified: true
    },
    metricDelta: { orderCount: 1, avgLatencyMs: 530, errorRate: '0.0%', throughputTps: 3.8 },
    spanInfo: { spanName: 'chef_guardrail_eval', parentSpan: 'root_order_lifecycle', depth: 2 }
  },
  {
    id: 5,
    title: '5. Entrega al cliente en mesa',
    component: 'Servicio Final (Output al Usuario)',
    durationMs: 180,
    startTimeOffsetMs: 2120,
    logJson: {
      timestamp: '2026-11-05T19:30:02.300Z',
      event: 'order_delivered',
      total_experience_seconds: 2.3,
      customer_satisfaction: '5_STARS',
      status: 'SUCCESS'
    },
    metricDelta: { orderCount: 1, avgLatencyMs: 460, errorRate: '0.0%', throughputTps: 4.8 },
    spanInfo: { spanName: 'deliver_response', parentSpan: 'root_order_lifecycle', depth: 1 }
  }
];

export const Module3ThreePillars: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isAnimatingStep, setIsAnimatingStep] = useState<boolean>(false);

  const currentStep = RESTAURANT_STEPS.find(s => s.id === activeStepId) || RESTAURANT_STEPS[0];
  const executedSteps = RESTAURANT_STEPS.filter(s => s.id <= activeStepId);
  const totalLifecycleMs = 2300;

  // Flash animation trigger on step change
  useEffect(() => {
    setIsAnimatingStep(true);
    const t = setTimeout(() => setIsAnimatingStep(false), 350);
    return () => clearTimeout(t);
  }, [activeStepId]);

  const handleSelectStep = (stepId: number) => {
    setActiveStepId(stepId);
  };

  const handleNextStep = () => {
    setActiveStepId(prev => Math.min(prev + 1, RESTAURANT_STEPS.length));
  };

  const handleReset = () => {
    setActiveStepId(1);
    setIsAutoPlaying(false);
  };

  const handleAutoRun = () => {
    setIsAutoPlaying(true);
    setActiveStepId(1);
    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step <= RESTAURANT_STEPS.length) {
        setActiveStepId(step);
      } else {
        clearInterval(interval);
        setIsAutoPlaying(false);
      }
    }, 1400);
  };

  return (
    <div className="space-y-8">
      {/* Module Hero */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <span>Módulo 03</span>
          <span>·</span>
          <span>Arquitectura de la Tríada</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Los Tres Pilares de la Observabilidad
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Ningún pilar por sí solo es suficiente para diagnosticar un agente complejo. La verdadera observabilidad nace de la <strong className="text-emerald-300 font-semibold">correlación sincronizada</strong> entre:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0 animate-pulse" />
            <div>
              <span className="font-semibold text-emerald-400 text-xs block">1. LOGS (El Qué y Cuándo)</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Eventos atómicos inmutables en instantes discretos.</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0 animate-pulse" />
            <div>
              <span className="font-semibold text-amber-400 text-xs block">2. MÉTRICAS (El Cuánto)</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Agregaciones numéricas: contadores, promedios y percentiles.</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0 animate-pulse" />
            <div>
              <span className="font-semibold text-cyan-400 text-xs block">3. TRAZAS (El Dónde y Causalidad)</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">El viaje completo a través de spans con duraciones $\Delta t$.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Widget: El Pedido del Restaurante */}
      <div className="p-6 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <UtensilsCrossed className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                Laboratorio Interactivo: La Analogía del Pedido del Restaurante
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Haz clic en los pasos del pedido para animar simultáneamente el <span className="text-emerald-400 font-semibold">Log</span> emitido, la actualización en el <span className="text-amber-400 font-semibold">Gráfico de Métricas</span> y el dibujo de la <span className="text-cyan-400 font-semibold">Traza</span> en cascada.
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAutoRun}
              disabled={isAutoPlaying}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer shadow-md ${
                isAutoPlaying 
                  ? 'bg-emerald-700 opacity-80 cursor-wait' 
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950'
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isAutoPlaying ? 'animate-spin' : ''}`} />
              <span>{isAutoPlaying ? 'Simulando en Vivo...' : 'Simular Flujo Completo'}</span>
            </button>
            <button
              onClick={handleNextStep}
              disabled={isAutoPlaying || activeStepId >= RESTAURANT_STEPS.length}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Paso {activeStepId < RESTAURANT_STEPS.length ? activeStepId + 1 : 'Fin'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Reiniciar simulación"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Selector Ribbon with Dynamic Visual Pulse */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {RESTAURANT_STEPS.map((s) => {
            const isCompleted = s.id < activeStepId;
            const isSelected = s.id === activeStepId;

            return (
              <button
                key={s.id}
                onClick={() => handleSelectStep(s.id)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500' 
                    : isCompleted 
                      ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700' 
                      : 'bg-slate-950 border-slate-900 text-slate-600 hover:border-slate-800'
                }`}
              >
                {/* Active scan radar indicator */}
                {isSelected && (
                  <span className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 rounded-full blur-sm" />
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-mono">PASO 0{s.id}</span>
                  {isSelected ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                  ) : isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : null}
                </div>

                <div className={`text-xs font-semibold truncate ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {s.title.split('. ')[1]}
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-cyan-400">
                  <span>{s.durationMs}ms</span>
                  {isSelected && <span className="text-[9px] text-emerald-400 uppercase font-sans">Activo</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* The 3 Synchronized Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: LOGS (Verde Neón) with Animated JSON Entry */}
          <div className={`p-4 rounded-xl bg-slate-950 border transition-all duration-300 flex flex-col justify-between space-y-3 ${
            isAnimatingStep 
              ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]' 
              : 'border-emerald-500/30'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    1. LOG ESTRUCTURADO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STREAMING VIVO</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Fotografía inmutable emitida en el paso {activeStepId}: <strong className="text-slate-200">{currentStep.component}</strong>.
              </p>

              {/* Animated JSON Container */}
              <div className={`mt-3 p-3 rounded-lg bg-[#0B0F17] border font-mono text-[11px] text-emerald-300 overflow-x-auto transition-all ${
                isAnimatingStep 
                  ? 'border-emerald-400 bg-emerald-950/20' 
                  : 'border-slate-800'
              }`}>
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-500">
                  <span>BUFFER_FLUSH: #EVT_{activeStepId}</span>
                  <span className="text-emerald-400">JSON RFC-8259</span>
                </div>
                <pre className="leading-relaxed">{JSON.stringify(currentStep.logJson, null, 2)}</pre>
              </div>

              {/* Mini Log Stream Breadcrumbs */}
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Historial de Eventos del Pedido:</span>
                <div className="space-y-1">
                  {executedSteps.map((s) => (
                    <div 
                      key={s.id} 
                      className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center justify-between transition-colors ${
                        s.id === activeStepId ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900/60 text-slate-400'
                      }`}
                    >
                      <span className="truncate">{s.logJson.event}</span>
                      <span className="text-slate-500">+{s.startTimeOffsetMs}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800/80 flex items-center justify-between">
              <span>Uso: Filtrar por table_id o status de inventario.</span>
              <span className="text-emerald-400 font-mono font-semibold">OK</span>
            </div>
          </div>

          {/* Column 2: METRICS (Ámbar) with Small Dynamic Visual Chart */}
          <div className={`p-4 rounded-xl bg-slate-950 border transition-all duration-300 flex flex-col justify-between space-y-3 ${
            isAnimatingStep 
              ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]' 
              : 'border-amber-500/30'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    2. MÉTRICAS AGREGADAS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">TIME-SERIES</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Valores consolidados y distribución de latencia por cada etapa.
              </p>

              {/* Dynamic Mini Bar Chart of Latency across the 5 steps */}
              <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>GRÁFICO: LATENCIA POR PASO (ms)</span>
                  <span className="text-amber-300">Pico: 1,450ms</span>
                </div>

                <div className="h-20 flex items-end justify-between gap-1.5 pt-2 px-1">
                  {RESTAURANT_STEPS.map((s) => {
                    const isExecuted = s.id <= activeStepId;
                    const isCurrent = s.id === activeStepId;
                    // Scale relative to max step (1450ms)
                    const heightPercent = Math.max(Math.round((s.durationMs / 1450) * 100), 12);

                    return (
                      <div key={s.id} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                        <span className={`text-[9px] font-mono tabular-nums transition-opacity ${
                          isCurrent ? 'opacity-100 text-amber-300 font-bold' : isExecuted ? 'opacity-80 text-slate-400' : 'opacity-30 text-slate-600'
                        }`}>
                          {s.durationMs}
                        </span>

                        <div className="w-full bg-slate-800 rounded-t-sm h-14 relative flex items-end">
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-500 ${
                              isCurrent 
                                ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse' 
                                : isExecuted 
                                  ? 'bg-amber-500/70' 
                                  : 'bg-slate-800'
                            }`}
                            style={{ height: isExecuted ? `${heightPercent}%` : '6%' }}
                          />
                        </div>

                        <span className={`text-[10px] font-mono ${isCurrent ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                          P{s.id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metrics Numeric Counters */}
              <div className="mt-3 space-y-2">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Latencia Media Acumulada</span>
                    <span className="text-base font-mono font-bold text-amber-300 tabular-nums">
                      {currentStep.metricDelta.avgLatencyMs} <span className="text-xs font-sans text-slate-400">ms/paso</span>
                    </span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Throughput Estimado</span>
                    <span className="text-base font-mono font-bold text-cyan-300 tabular-nums">
                      {currentStep.metricDelta.throughputTps} <span className="text-xs font-sans text-slate-400">t/s</span>
                    </span>
                  </div>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800/80">
              Uso: Alertas SLO si la latencia promedio excede 1.5s.
            </div>
          </div>

          {/* Column 3: TRACES (Cian Eléctrico) with Animated Waterfall Drawing */}
          <div className={`p-4 rounded-xl bg-slate-950 border transition-all duration-300 flex flex-col justify-between space-y-3 ${
            isAnimatingStep 
              ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]' 
              : 'border-cyan-500/30'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    3. TRAZA JERÁRQUICA
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold">WATERFALL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Dibujo dinámico de spans y causalidad temporal ($\Delta t$).
              </p>

              {/* Waterfall Drawing Canvas */}
              <div className="mt-3 space-y-2">
                {/* Root Span with scan bar */}
                <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-xs font-mono">
                  <div className="flex items-center justify-between text-cyan-300">
                    <span className="font-semibold truncate">ROOT: order_restaurant_service</span>
                    <span>2,300ms</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full mt-1.5 overflow-hidden relative">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '100%' }} />
                    <span className="absolute top-0 right-0 w-2 h-full bg-white animate-ping" />
                  </div>
                </div>

                {/* Animated Waterfall Spans */}
                <div className="space-y-1.5 pl-3 border-l-2 border-slate-800 pt-1">
                  {RESTAURANT_STEPS.map((s) => {
                    const isExecuted = s.id <= activeStepId;
                    const isCurrent = s.id === activeStepId;
                    const leftOffsetPercent = (s.startTimeOffsetMs / totalLifecycleMs) * 100;
                    const widthPercent = Math.max((s.durationMs / totalLifecycleMs) * 100, 8);

                    return (
                      <div 
                        key={s.id} 
                        className={`p-1.5 rounded text-[11px] font-mono transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-slate-900 border border-cyan-500/60 shadow-sm' 
                            : isExecuted 
                              ? 'bg-slate-900/60 border border-slate-800/80 text-slate-300' 
                              : 'bg-slate-950/40 border border-slate-900 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="truncate">{s.spanInfo.spanName}</span>
                          <span className={`tabular-nums ${isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                            {s.durationMs}ms
                          </span>
                        </div>

                        {/* Animated Gantt progress line */}
                        <div className="w-full h-1.5 bg-slate-950 rounded-full relative overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                              s.id === 3 
                                ? 'bg-amber-400' 
                                : isCurrent 
                                  ? 'bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                                  : 'bg-cyan-500'
                            }`} 
                            style={{ 
                              marginLeft: isExecuted ? `${leftOffsetPercent}%` : '0%', 
                              width: isExecuted ? `${widthPercent}%` : '0%' 
                            }} 
                          >
                            {isCurrent && (
                              <span className="absolute -right-0.5 top-0 w-1.5 h-full bg-white rounded-full animate-ping" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800/80">
              Uso: Identificar cuellos de botella exactos en la cascada temporal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
