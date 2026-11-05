import React, { useState } from 'react';
import { 
  Terminal, 
  GitFork, 
  BarChart3, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  ShieldAlert, 
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CaseQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CASE_QUESTIONS: CaseQuestion[] = [
  {
    id: 1,
    question: '1. ¿Qué anomalía principal revelan las métricas de telemetría de las sesiones afectadas?',
    options: [
      'Un pico de errores de servidor HTTP 500 que tumbó el cluster de Kubernetes.',
      'Una explosión masiva de tokens de entrada acumulados (de 1,200 a más de 24,000 por sesión) acompañada de una latencia p95 que escaló hasta los 42 segundos.',
      'Un ataque masivo de inyección SQL que borró la tabla de pedidos.',
      'Que el proveedor de la API de OpenAI bloqueó las cuentas por falta de pago.'
    ],
    correctIndex: 1,
    explanation: 'Correcto. La clave de los fallos en silencio es que no hay errores 500: el sistema sigue respondiendo con éxito (HTTP 200), pero cada sesión quema 20 veces más tokens y satura la experiencia con esperas de 40 segundos.'
  },
  {
    id: 2,
    question: '2. Al inspeccionar el árbol de la traza distribuida, ¿qué patrón anómalo confirma el diagnóstico?',
    options: [
      'No se generó ninguna traza porque el servidor estaba apagado.',
      'La llamada inicial de red tardó 40 segundos en conectar el socket.',
      'Un patrón de bucle ReAct repetitivo con 8 spans secuenciales de reintento de la herramienta "check_order_status" encadenados sin condición de escape.',
      'El modelo LLM cambió de versión automáticamente en mitad de la llamada.'
    ],
    correctIndex: 2,
    explanation: 'Exacto. En la traza en cascada se observa una hilera idéntica de spans de reintento (`retry_tool_execution_1` a `8`). El agente quedó atrapado en un ciclo infinito de prueba y error.'
  },
  {
    id: 3,
    question: '3. Al revisar el log JSON de la herramienta "check_order_status", ¿cuál fue la causa raíz técnica?',
    options: [
      'La herramienta devolvió un mensaje de error no estructurado ("Error: order_id must be integer, received \'ORD-99124\'") y el LLM asumió que podía "adivinar" el entero en vez de fallar de inmediato.',
      'El usuario no tenía cuenta en la tienda.',
      'El modelo LLM se quedó sin memoria RAM.',
      'El servidor de base de datos respondió con una tabla vacía sin columnas.'
    ],
    correctIndex: 0,
    explanation: '¡Brillante deducción! Cuando las tools devuelven strings caóticos en vez de schemas de error tipados, los LLMs intentan "reparar" la situación con razonamientos circulares, generando una espiral de reintentos fallidos en silencio.'
  },
  {
    id: 4,
    question: '4. ¿Cuáles son las medidas arquitectónicas obligatorias para resolver el incidente y prevenir su repetición?',
    options: [
      'Aumentar el límite de presupuesto de la tarjeta de crédito en OpenAI.',
      'Configurar un Circuit Breaker con max_iterations <= 3, tipado estricto con Pydantic/Zod en las entradas y salidas de las herramientas, y fallback con handoff a operador humano.',
      'Desactivar los logs para no registrar la lentitud.',
      'Reescribir todo el backend en lenguaje C++ sin usar agentes.'
    ],
    correctIndex: 1,
    explanation: '¡Misterio Resuelto! Con un límite duro de 3 iteraciones (Circuit Breaker) y validación de tipos estricta antes de invocar la tool, el agente jamás volverá a quemar $2,000 en bucles ciegos.'
  }
];

export const Module8CaseStudy: React.FC = () => {
  const [telemetryTab, setTelemetryTab] = useState<'logs' | 'traces' | 'metrics'>('logs');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});

  const handleSelectOption = (qId: number, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleVerifyQuestion = (qId: number) => {
    setSubmittedAnswers(prev => ({ ...prev, [qId]: true }));
  };

  const handleResetChallenge = () => {
    setUserAnswers({});
    setSubmittedAnswers({});
  };

  const allAnswered = CASE_QUESTIONS.every(q => submittedAnswers[q.id]);
  const allCorrect = CASE_QUESTIONS.every(q => userAnswers[q.id] === q.correctIndex);

  return (
    <div className="space-y-8">
      {/* Module Hero */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <span>Módulo 08</span>
          <span>·</span>
          <span>Laboratorio Forense Integrador</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Caso Forense: "El Agente que no terminaba"
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          <strong className="text-amber-300 font-semibold">El Incidente:</strong> En la empresa de retail "ElectroStore", la factura mensual de modelos de lenguaje se triplicó de $450 a $2,380 USD en solo 12 días. Los usuarios en redes sociales comenzaron a quejarse de que el bot de soporte "tardaba una eternidad en responder". Sin embargo, <span className="text-rose-400 font-semibold">el dashboard de Sentry y los servidores reportaban 0 excepciones y 100% de uptime</span>.
        </p>
        <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Como Ingeniero de Observabilidad, tu misión es inspeccionar la consola de telemetría real (logs, trazas y métricas) y responder las 4 preguntas forenses para descubrir la causa raíz y proponer la solución definitiva.
        </p>
      </div>

      {/* Forensic Telemetry Terminal Console */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-base font-bold text-slate-100">
              Consola Forense de Telemetría (Incidente #INC-7721)
            </h2>
          </div>

          {/* Console Tabs */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setTelemetryTab('logs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                telemetryTab === 'logs' ? 'bg-slate-800 text-emerald-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal de Logs JSON</span>
            </button>
            <button
              onClick={() => setTelemetryTab('traces')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                telemetryTab === 'traces' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Visor de Trazas (Waterfall)</span>
            </button>
            <button
              onClick={() => setTelemetryTab('metrics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                telemetryTab === 'metrics' ? 'bg-slate-800 text-amber-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Métricas de Sesión</span>
            </button>
          </div>
        </div>

        {/* Console Tab Content */}
        {telemetryTab === 'logs' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 max-h-[300px] overflow-y-auto">
            <div className="text-slate-500 pb-1 border-b border-slate-800 text-[11px]">
              EVIDENCIA DE LOGS: Sesión ID sess_4192b_ticket_88291
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">14:02:10.120</span> [USER_PROMPT] "Hola, quiero saber cuándo llega mi pedido ORD-99124"
            </div>
            <div className="text-violet-300">
              <span className="text-cyan-400">14:02:11.450</span> [LLM_COT] "Debo consultar la herramienta check_order_status pasando el ID de pedido..."
            </div>
            <div className="text-amber-300">
              <span className="text-cyan-400">14:02:11.890</span> [TOOL_CALL] check_order_status({"{"}"order_id": "ORD-99124"{"}"})
            </div>
            <div className="text-rose-400 bg-rose-950/40 p-1.5 rounded border border-rose-900/60">
              <span className="text-rose-300 font-bold">14:02:12.110 [TOOL_OUTPUT_ERROR]</span>: "Error: order_id must be an integer, received 'ORD-99124'. Please provide numeric ID."
            </div>
            <div className="text-violet-300">
              <span className="text-cyan-400">14:02:13.200</span> [LLM_COT] "El sistema espera un entero. Intentaré limpiar las letras y enviar solo 99124..."
            </div>
            <div className="text-amber-300">
              <span className="text-cyan-400">14:02:13.620</span> [TOOL_CALL_RETRY_1] check_order_status({"{"}"order_id": 99124{"}"})
            </div>
            <div className="text-rose-400 bg-rose-950/40 p-1.5 rounded border border-rose-900/60">
              <span className="text-rose-300 font-bold">14:02:13.880 [TOOL_OUTPUT_ERROR]</span>: "Error 404: Order 99124 not found in store database."
            </div>
            <div className="text-violet-300">
              <span className="text-cyan-400">14:02:15.100</span> [LLM_COT] "No se encontró. Reintentaré con prefijo guión bajo '_99124'..."
            </div>
            <div className="text-slate-500 italic">
              ... [Se repite 6 veces más con variaciones inventadas por el modelo, inflando el contexto hasta 24,000 tokens] ...
            </div>
          </div>
        )}

        {telemetryTab === 'traces' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-1 border-b border-slate-800">
              <span>ÁRBOL DE SPANS DEL TICKET (Duración: 42.8 segundos)</span>
              <span className="text-rose-400 font-bold">8 CICLOS DE REINTENTO</span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
              ROOT: support_ticket_interaction [Total: 42,800ms]
            </div>

            <div className="space-y-1 pl-4 border-l-2 border-rose-900 font-mono text-[11px]">
              <div className="p-1 rounded bg-slate-900/60 text-slate-300 flex justify-between">
                <span>01. llm_reasoning_step</span> <span>1,330ms</span>
              </div>
              <div className="p-1 rounded bg-rose-950/50 text-rose-300 border border-rose-800/40 flex justify-between">
                <span>02. tool_call: check_order_status (FAILED)</span> <span>220ms</span>
              </div>
              <div className="p-1 rounded bg-slate-900/60 text-slate-300 flex justify-between">
                <span>03. llm_reasoning_retry_1</span> <span>1,820ms</span>
              </div>
              <div className="p-1 rounded bg-rose-950/50 text-rose-300 border border-rose-800/40 flex justify-between">
                <span>04. tool_call: check_order_status (FAILED)</span> <span>260ms</span>
              </div>
              <div className="p-1 rounded bg-slate-900/60 text-slate-300 flex justify-between">
                <span>05. llm_reasoning_retry_2</span> <span>2,410ms</span>
              </div>
              <div className="p-1 rounded bg-rose-950/50 text-rose-300 border border-rose-800/40 flex justify-between">
                <span>06. tool_call: check_order_status (FAILED)</span> <span>310ms</span>
              </div>
              <div className="p-1 rounded bg-rose-950/70 text-rose-200 border border-rose-500/50 flex justify-between font-bold">
                <span>... [REPETICIÓN EN BUCLE SIN CIRCUIT BREAKER]</span> <span>+35,000ms</span>
              </div>
            </div>
          </div>
        )}

        {telemetryTab === 'metrics' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-slate-500 pb-1 border-b border-slate-800">
              SERIES TEMPORALES (PICO DE CONSUMO INCIDENTE)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-rose-900/60">
                <span className="text-[10px] text-slate-400 block font-mono">Tokens Input Promedio / Sesión</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-mono font-bold text-rose-400 tabular-nums">24,800</span>
                  <span className="text-xs text-rose-300 font-mono">(Normal: 1,200)</span>
                </div>
                <span className="text-[10px] text-rose-400 mt-1 block font-semibold">+1,966% Aumento</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-amber-900/60">
                <span className="text-[10px] text-slate-400 block font-mono">Latencia Media p95</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-mono font-bold text-amber-300 tabular-nums">42.8s</span>
                  <span className="text-xs text-amber-400 font-mono">(SLO: &lt; 3.0s)</span>
                </div>
                <span className="text-[10px] text-amber-400 mt-1 block font-semibold">Degradación Crítica</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-emerald-900/60">
                <span className="text-[10px] text-slate-400 block font-mono">Tasa de Errores HTTP 500</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-mono font-bold text-emerald-400 tabular-nums">0.0%</span>
                  <span className="text-xs text-slate-500 font-mono">(Status 200 OK)</span>
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">Falsa Sensación de Éxito</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forensic Diagnostic Questions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Desafío Interactivo: Resuelve el Misterio Forense</span>
          </h2>
          <button
            onClick={handleResetChallenge}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reiniciar Caso</span>
          </button>
        </div>

        <div className="space-y-4">
          {CASE_QUESTIONS.map((q) => {
            const isSubmitted = submittedAnswers[q.id];
            const selectedOpt = userAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div 
                key={q.id}
                className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-semibold text-slate-100">
                    {q.question}
                  </h3>
                  {isSubmitted && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                      isCorrect 
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' 
                        : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                    }`}>
                      {isCorrect ? 'CORRECTO' : 'INCORRECTO'}
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx;
                    let optionStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';

                    if (isSubmitted) {
                      if (oIdx === q.correctIndex) {
                        optionStyle = 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-950/50 border-rose-500/60 text-rose-200';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-slate-800 border-cyan-500/50 text-cyan-200';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, oIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${optionStyle}`}
                      >
                        <span className="font-mono text-slate-500 shrink-0 mt-0.5 font-semibold">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit button / Explanation */}
                <div className="pt-2 flex items-center justify-between">
                  {!isSubmitted ? (
                    <button
                      disabled={selectedOpt === undefined}
                      onClick={() => handleVerifyQuestion(q.id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Verificar Hallazgo
                    </button>
                  ) : (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed w-full">
                      <span className="font-semibold block text-cyan-300 mb-0.5">Nota Pedagógica:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Incident Post-Mortem Report Card */}
        {allAnswered && (
          <div className={`p-6 rounded-xl border space-y-4 ${
            allCorrect 
              ? 'bg-emerald-950/30 border-emerald-500/50' 
              : 'bg-amber-950/30 border-amber-500/50'
          }`}>
            <div className="flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">
                Reporte Forense Oficial Post-Mortem (#PMR-7721)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Causa Raíz Identificada</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Contrato de tool desalineado: el frontend de usuarios enviaba strings tipo "ORD-99124" mientras que la función de backend exigía un integer. Sin circuit breaker, el agente iteró indefinidamente intentando reparar el error.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Impacto Financiero Evitado</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  La implementación de las alertas de ratio de tokens y circuit breaker redujo el costo mensual proyectado de $2,380 a $385 USD (un ahorro directo del 84%).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Planes de Mitigación</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  1) Límite estricto `max_steps: 3`. 2) Tipado estricto con Zod en inputs de herramientas. 3) Handoff automático a operador humano tras el 2do fallo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
