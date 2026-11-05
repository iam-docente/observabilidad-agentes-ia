import React, { useState } from 'react';
import { 
  GitFork, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  ArrowRight, 
  Info,
  Maximize2,
  Cpu,
  Database,
  Globe,
  Sparkles,
  Zap,
  RotateCcw,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  Wrench
} from 'lucide-react';

interface InteractiveSpan {
  id: string;
  name: string;
  type: 'root' | 'llm' | 'tool';
  typeLabel: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  optimizedDuration?: number;
  status: 'ok' | 'bottleneck' | 'optimized';
  isBottleneckInitial?: boolean;
  component: string;
  payload: {
    spanId: string;
    parentSpanId: string | null;
    kind: string;
    startTimestamp: string;
    endTimestamp: string;
    deltaT: string;
    statusCode: string;
    attributes: Record<string, string | number>;
  };
}

export const Module6TracesAndSpans: React.FC = () => {
  // Optimization Simulator state
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  
  // View mode: 'waterfall' (Gantt tree) vs 'logs' (Flat chronological JSON logs)
  const [viewMode, setViewMode] = useState<'waterfall' | 'logs'>('waterfall');

  // Hovered / Selected span for inspector tooltip
  const [hoveredSpanId, setHoveredSpanId] = useState<string | null>(null);
  const [selectedSpanId, setSelectedSpanId] = useState<string>('span_child_02'); // Select bottleneck by default

  // Compute active durations based on optimization
  const rootDuration = isOptimized ? 2.0 : 4.2;
  const toolDuration = isOptimized ? 0.4 : 2.6;
  const toolPercentage = ((toolDuration / rootDuration) * 100).toFixed(1);

  // Spans data based on the real example requested
  const spans: InteractiveSpan[] = [
    {
      id: 'span_root',
      name: '🌳 Traza: "¿Cuál fue mi gasto en marzo?"',
      type: 'root',
      typeLabel: 'Span Raíz (Padre)',
      startTime: 0.0,
      duration: isOptimized ? 2.0 : 4.2,
      status: 'ok',
      component: 'Agent Root Orchestrator',
      payload: {
        spanId: 'span_root_77a9',
        parentSpanId: null,
        kind: 'SERVER_REQUEST',
        startTimestamp: '2026-11-05T14:30:00.000Z',
        endTimestamp: isOptimized ? '2026-11-05T14:30:02.000Z' : '2026-11-05T14:30:04.200Z',
        deltaT: isOptimized ? '2.000 s (Δt)' : '4.200 s (Δt)',
        statusCode: 'OK_200',
        attributes: {
          'user.prompt': '¿Cuál fue mi gasto en marzo?',
          'session.id': 'sess_fin_991',
          'total.spans_count': 3,
          'status': isOptimized ? 'Optimizado (2.0s)' : 'Latencia Elevada por API externa'
        }
      }
    },
    {
      id: 'span_child_01',
      name: 'Interpretar la pregunta (LLM)',
      type: 'llm',
      typeLabel: 'Span Hijo 1 (LLM)',
      startTime: 0.0,
      duration: 0.8,
      status: 'ok',
      component: 'Inferencia LLM Router',
      payload: {
        spanId: 'span_child_01_parse',
        parentSpanId: 'span_root_77a9',
        kind: 'LLM_INFERENCE',
        startTimestamp: '2026-11-05T14:30:00.000Z',
        endTimestamp: '2026-11-05T14:30:00.800Z',
        deltaT: '0.800 s (Δt)',
        statusCode: 'OK',
        attributes: {
          'model.name': 'gemini-1.5-pro',
          'intent.classified': 'EXPENSE_REPORT_MONTHLY',
          'extracted.params': '{"month": "marzo", "year": 2026}',
          'tokens.prompt': 450,
          'tokens.completion': 85
        }
      }
    },
    {
      id: 'span_child_02',
      name: 'Consultar API de finanzas (Herramienta)',
      type: 'tool',
      typeLabel: 'Span Hijo 2 (Herramienta)',
      startTime: 0.8,
      duration: toolDuration,
      status: isOptimized ? 'optimized' : 'bottleneck',
      isBottleneckInitial: true,
      component: 'External Finance Banking API',
      payload: {
        spanId: 'span_child_02_tool',
        parentSpanId: 'span_root_77a9',
        kind: 'TOOL_EXECUTION',
        startTimestamp: '2026-11-05T14:30:00.800Z',
        endTimestamp: isOptimized ? '2026-11-05T14:30:01.200Z' : '2026-11-05T14:30:03.400Z',
        deltaT: `${toolDuration.toFixed(1)}00 s (Δt)`,
        statusCode: isOptimized ? 'OK_CACHE_HIT' : 'LATENCY_WARNING',
        attributes: {
          'tool.name': 'query_financial_ledger',
          'http.target_url': 'https://api.banco-finanzas.com/v2/ledger',
          'http.status': 200,
          'bottleneck.metric': isOptimized ? 'Optimizado con Redis Cache (0.4s)' : `¡Cuello de botella! Representa el ${toolPercentage}% del tiempo total`
        }
      }
    },
    {
      id: 'span_child_03',
      name: 'Redactar respuesta final (LLM)',
      type: 'llm',
      typeLabel: 'Span Hijo 3 (LLM)',
      startTime: 0.8 + toolDuration,
      duration: 0.8,
      status: 'ok',
      component: 'Inferencia LLM Síntesis',
      payload: {
        spanId: 'span_child_03_synth',
        parentSpanId: 'span_root_77a9',
        kind: 'LLM_INFERENCE',
        startTimestamp: isOptimized ? '2026-11-05T14:30:01.200Z' : '2026-11-05T14:30:03.400Z',
        endTimestamp: isOptimized ? '2026-11-05T14:30:02.000Z' : '2026-11-05T14:30:04.200Z',
        deltaT: '0.800 s (Δt)',
        statusCode: 'OK',
        attributes: {
          'model.name': 'gemini-1.5-pro',
          'tokens.prompt': 1280,
          'tokens.completion': 340,
          'result.summary': 'Gasto total de marzo: $1,420.50 USD desglosado en 4 categorías.'
        }
      }
    }
  ];

  // Flat JSON logs for the Comparative "Log vs Span" mode
  const flatLogsList = [
    {
      logNumber: 1,
      pointInTime: '2026-11-05T14:30:00.800Z (t1)',
      component: 'LLM Parser',
      event: 'QUESTION_INTERPRETED',
      data: {
        event: 'llm_query_interpretation_finished',
        duration_note: 'No tiene contexto jerárquico ni sabe qué componente se ejecutará a continuación',
        tokens_used: 535
      }
    },
    {
      logNumber: 2,
      pointInTime: '2026-11-05T14:30:03.400Z (t2)',
      component: 'Finance Tool',
      event: 'API_QUERY_SUCCESS',
      data: {
        event: 'finance_api_ledger_retrieved',
        duration_note: 'Aislado: un log puntual no muestra gráficamente que tardó 2.6 segundos salvo calculando manualmente t2 - t1',
        records: 48
      }
    },
    {
      logNumber: 3,
      pointInTime: '2026-11-05T14:30:04.200Z (t3)',
      component: 'LLM Synthesis',
      event: 'ANSWER_GENERATED',
      data: {
        event: 'final_response_rendered_to_user',
        duration_note: 'Punto discreto final; no permite ver cuellos de botella distribuidos a simple vista',
        total_tokens: 1620
      }
    }
  ];

  const activeSpan = spans.find(s => s.id === (hoveredSpanId || selectedSpanId)) || spans[2];

  return (
    <div className="space-y-8">
      {/* Module Hero */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
          <span>Módulo 06</span>
          <span>·</span>
          <span>Trazabilidad Distribuida</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Trazas (Traces) y Spans en Sistemas Multi-Paso
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Cuando un usuario consulta a un agente, se desencadena una cascada de eventos: tokenización, consulta a bases de datos vectoriales, llamada a herramientas HTTP y múltiples inferencias LLM. 
          Una <strong className="text-cyan-300 font-semibold">Traza</strong> es el grafo acíclico dirigido (DAG) que documenta el recorrido completo, compuesto por unidades indivisibles llamadas <strong className="text-cyan-300 font-semibold">Spans</strong>.
        </p>
      </div>

      {/* WIDGET INTERACTIVO REQUERIDO: Visualizador de Árbol de Trazas (Waterfall / Spans) */}
      <div className="p-6 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 font-mono text-sm font-bold">🌳</span>
              <h2 className="text-lg font-bold text-slate-100">
                Visualizador de Árbol de Trazas (Waterfall Gantt & Spans)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ciclo de vida de una solicitud: <code className="text-cyan-300 font-mono">"¿Cuál fue mi gasto en marzo?"</code> demostrando la diferencia entre un Log (punto $t$) y un Span (intervalo $\Delta t$).
            </p>
          </div>

          {/* Action cluster: Log vs Span toggle + Optimization Simulator */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Modo Comparativo Log vs Span Toggle */}
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('waterfall')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'waterfall' 
                    ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Árbol Gantt (Spans)</span>
              </button>
              <button
                onClick={() => setViewMode('logs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'logs' 
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Logs Planos (Puntos t)</span>
              </button>
            </div>

            {/* Simulador de Optimización Button */}
            {!isOptimized ? (
              <button
                onClick={() => setIsOptimized(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-md shadow-emerald-950"
                title="Reducir la latencia de la API de Finanzas de 2.6s a 0.4s usando caching y optimización"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Optimizar API de Finanzas</span>
              </button>
            ) : (
              <button
                onClick={() => setIsOptimized(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Restaurar estado con cuello de botella original"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deshacer Optimización</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Metric Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Duración Total de la Traza</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-mono font-bold tabular-nums ${isOptimized ? 'text-emerald-400' : 'text-slate-100'}`}>
                {rootDuration.toFixed(1)} s
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {isOptimized ? '(⚡ -52.4% Aceleración)' : '(Baseline)'}
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border transition-all ${
            !isOptimized 
              ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
              : 'bg-emerald-950/20 border-emerald-500/40'
          }`}>
            <span className="text-[10px] text-slate-400 block font-mono">Latencia Span Hijo 2 (API Finanzas)</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-mono font-bold tabular-nums ${!isOptimized ? 'text-amber-300' : 'text-emerald-300'}`}>
                {toolDuration.toFixed(1)} s
              </span>
              <span className={`text-xs font-mono font-semibold ${!isOptimized ? 'text-amber-400' : 'text-emerald-400'}`}>
                ({toolPercentage}% del total)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Diagnóstico de Cuello de Botella</span>
            <div className="flex items-center gap-1.5 mt-1">
              {!isOptimized ? (
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>¡Cuello de botella detectado en API!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Equilibrio óptimo alcanzado (20% share)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Mode 1: Waterfall Gantt Chart */}
        {viewMode === 'waterfall' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Waterfall Canvas */}
            <div className="lg:col-span-7 space-y-3">
              {/* Timeline Horizontal Ruler */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-3 pb-1 border-b border-slate-800">
                <span>0.0s (Inicio)</span>
                <span>1.0s</span>
                <span>2.0s</span>
                <span>3.0s</span>
                <span>{rootDuration.toFixed(1)}s (Fin)</span>
              </div>

              {/* Spans List in Waterfall */}
              <div className="space-y-2.5">
                {spans.map((span) => {
                  const isSelected = selectedSpanId === span.id || hoveredSpanId === span.id;
                  const isBottleneck = span.status === 'bottleneck';
                  const isRoot = span.type === 'root';
                  
                  // Calculate Gantt bar geometry relative to rootDuration
                  const leftPercent = (span.startTime / rootDuration) * 100;
                  const widthPercent = Math.max((span.duration / rootDuration) * 100, 5);

                  let barColor = 'bg-cyan-400';
                  let containerBorder = 'border-slate-800/80 bg-slate-950/80';

                  if (isRoot) {
                    barColor = 'bg-cyan-500';
                    containerBorder = 'border-cyan-500/30 bg-slate-950';
                  } else if (isBottleneck) {
                    barColor = 'bg-gradient-to-r from-amber-400 to-rose-500 animate-pulse';
                    containerBorder = 'border-amber-500/80 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.25)]';
                  } else if (span.status === 'optimized') {
                    barColor = 'bg-emerald-400';
                    containerBorder = 'border-emerald-500/40 bg-emerald-950/20';
                  } else if (span.type === 'llm') {
                    barColor = 'bg-violet-400';
                    containerBorder = 'border-slate-800/80 bg-slate-950/80';
                  }

                  return (
                    <div
                      key={span.id}
                      onMouseEnter={() => setHoveredSpanId(span.id)}
                      onMouseLeave={() => setHoveredSpanId(null)}
                      onClick={() => setSelectedSpanId(span.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${containerBorder} ${
                        isSelected ? 'ring-2 ring-cyan-400/80 shadow-lg' : 'hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <div className="flex items-center gap-2 truncate">
                          {isBottleneck ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-500 font-bold shrink-0 animate-pulse">
                              ⚠️ ¡CUELLO DE BOTELLA! (61.9%)
                            </span>
                          ) : span.status === 'optimized' ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold shrink-0">
                              ⚡ OPTIMIZADO (0.4s)
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                              [{span.typeLabel}]
                            </span>
                          )}

                          <span className="text-slate-200 font-medium truncate">
                            {span.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`font-bold tabular-nums ${isBottleneck ? 'text-amber-300' : 'text-slate-300'}`}>
                            {span.duration.toFixed(1)} s
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            (Δt)
                          </span>
                        </div>
                      </div>

                      {/* Gantt Bar representation */}
                      <div className="w-full h-3 rounded-full bg-slate-900 relative overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                          style={{
                            marginLeft: `${leftPercent}%`,
                            width: `${widthPercent}%`
                          }}
                        />
                      </div>

                      {/* Hover Pill Tooltip Preview */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                        <span>Inicio: {span.startTime.toFixed(1)}s</span>
                        <span>Fin: {(span.startTime + span.duration).toFixed(1)}s</span>
                        <span className="text-cyan-400 group-hover:underline">Click para inspeccionar</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Span Inspector Panel & Tooltip Display */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      INSPECTOR DE SPAN (PAYLOAD)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                    {activeSpan.payload.spanId}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Nombre de Operación</span>
                  <span className="text-xs font-semibold text-slate-200 block mt-0.5">{activeSpan.name}</span>
                </div>

                {/* Key Span Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Tipo de Operación</span>
                    <span className="text-xs font-bold text-slate-200">{activeSpan.typeLabel}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Intervalo Temporal (Δt)</span>
                    <span className={`text-xs font-bold ${activeSpan.status === 'bottleneck' ? 'text-amber-300' : 'text-cyan-300'}`}>
                      {activeSpan.payload.deltaT}
                    </span>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span className="text-slate-500">Timestamp Inicio (t_start):</span>
                    <span>{activeSpan.payload.startTimestamp}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span className="text-slate-500">Timestamp Fin (t_end):</span>
                    <span>{activeSpan.payload.endTimestamp}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <span className="text-slate-500">Estado de Operación:</span>
                    <span className={activeSpan.status === 'bottleneck' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {activeSpan.payload.statusCode}
                    </span>
                  </div>
                </div>

                {/* Bottleneck Warning Callout if active */}
                {activeSpan.status === 'bottleneck' && (
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/60 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>¡Cuello de botella! Representa el 61.9% del tiempo total</span>
                    </div>
                    <p className="text-amber-200/90 text-[11px] leading-relaxed">
                      El LLM de interpretación (0.8s) y el LLM de redacción (0.8s) operaron a gran velocidad. El 61.9% de la espera del usuario (2.6s) se debió íntegramente a la latencia de red de la API externa de finanzas.
                    </p>
                  </div>
                )}

                {/* Attributes breakdown */}
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Atributos Semánticos</span>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1 max-h-32 overflow-y-auto">
                    {Object.entries(activeSpan.payload.attributes).map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between gap-2">
                        <span className="text-cyan-400 shrink-0">{k}:</span>
                        <span className="text-slate-300 truncate text-right">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                Principio: El Span Raíz hereda la duración total de sus spans hijos y permite atribuir cuellos de botella exactos.
              </div>
            </div>
          </div>
        ) : (
          /* View Mode 2: Flat Chronological JSON Logs */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold block">
                  MODO COMPARATIVO: 3 LOGS JSON CRONOLÓGICOS (EVENTOS PUNTUALES)
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Observa cómo los logs solo capturan un punto en el tiempo ($t_1, t_2, t_3$) sin reflejar la relación padre-hijo ni la duración visual $\Delta t$.
                </p>
              </div>
              <button
                onClick={() => setViewMode('waterfall')}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer"
              >
                Volver a Diagrama en Árbol Gantt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {flatLogsList.map((log) => (
                <div key={log.logNumber} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-emerald-400 font-bold">Log #0{log.logNumber}</span>
                    <span className="text-[10px] text-slate-500">{log.component}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px] block">Momento Exacto (t):</span>
                    <span className="text-cyan-300 font-semibold block text-[11px]">{log.pointInTime}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px] block">Evento Emitido:</span>
                    <span className="text-amber-300 font-semibold block text-[11px]">{log.event}</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-sans">
                    <strong className="text-rose-400 block font-mono text-[10px] mb-0.5">Limitación del Log Plano:</strong>
                    {log.data.duration_note}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
              💡 <strong className="text-cyan-300">Conclusión Pedagógica Clave:</strong> Un log es una fotografía en un instante (t). Un span es una película con inicio y fin (Δt = t_final - t_inicio). Para encontrar cuellos de botella en arquitecturas de agentes, los spans y las trazas son insustituibles.
            </div>
          </div>
        )}
      </div>

      {/* Comparative Table: Log vs Span */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span>Tabla Comparativa Rigurosa: Log vs Span</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Dimensión</th>
                <th className="py-2.5 px-3 text-emerald-400">Log (Registro Atómico)</th>
                <th className="py-2.5 px-3 text-cyan-400">Span (Intervalo Temporal)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Dimensión Temporal</td>
                <td className="py-2.5 px-3 font-mono">Punto exacto en el tiempo (t)</td>
                <td className="py-2.5 px-3 font-mono">Intervalo continuo (Δt = t_final - t_inicio)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Contexto y Jerarquía</td>
                <td className="py-2.5 px-3">Aislado. Solo conoce lo que ocurrió en ese instante específico.</td>
                <td className="py-2.5 px-3">Jerárquico. Conoce a su padre (parent_id), hijos y posición en el árbol.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Detección de Cuellos de Botella</td>
                <td className="py-2.5 px-3">Difícil; requiere restar manualmente timestamps entre dos logs.</td>
                <td className="py-2.5 px-3">Directo y visual en diagramas de cascada (Gantt waterfall).</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Propagación Distribuida</td>
                <td className="py-2.5 px-3">Suele quedarse en el servidor donde fue emitido.</td>
                <td className="py-2.5 px-3">Se propaga entre microservicios vía cabeceras HTTP W3C TraceContext.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
