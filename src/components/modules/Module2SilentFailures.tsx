import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  AlertOctagon, 
  ArrowRight, 
  BrainCircuit, 
  Wrench, 
  FileText, 
  Layers,
  Flame,
  Bug,
  HelpCircle
} from 'lucide-react';

interface LoopStep {
  cycle: number;
  phase: 'Thought' | 'Action' | 'Observation';
  text: string;
  tokensThisStep: number;
  cumulativeTokens: number;
  costUsd: number;
  contextUsagePercent: number;
}

const LOOP_STEPS_SCRIPT: { phase: 'Thought' | 'Action' | 'Observation'; text: string; tokenIncrement: number }[] = [
  {
    phase: 'Thought',
    text: 'El usuario solicita consultar el saldo de su cuenta. Debo invocar la herramienta "get_account_balance" con el ID de usuario.',
    tokenIncrement: 420
  },
  {
    phase: 'Action',
    text: 'Tool Call: get_account_balance({ "user_id": "usr_9921", "auth": null })',
    tokenIncrement: 180
  },
  {
    phase: 'Observation',
    text: 'Tool Output: Error 401 Unauthorized - Missing bearer token.',
    tokenIncrement: 120
  },
  {
    phase: 'Thought',
    text: 'La herramienta falló por autenticación. Intentaré volver a llamar a "get_account_balance" enviando un token dummy "test_token".',
    tokenIncrement: 640
  },
  {
    phase: 'Action',
    text: 'Tool Call: get_account_balance({ "user_id": "usr_9921", "token": "test_token" })',
    tokenIncrement: 210
  },
  {
    phase: 'Observation',
    text: 'Tool Output: Error 403 Forbidden - Token "test_token" no tiene permisos suficientes.',
    tokenIncrement: 150
  },
  {
    phase: 'Thought',
    text: 'El token dummy fue rechazado. Reintentaré una vez más pero formateando el payload con mayúsculas en el ID de usuario...',
    tokenIncrement: 950
  },
  {
    phase: 'Action',
    text: 'Tool Call: get_account_balance({ "USER_ID": "USR_9921", "retry_count": 3 })',
    tokenIncrement: 260
  },
  {
    phase: 'Observation',
    text: 'Tool Output: Error 400 Bad Request - Payload schema unrecognized.',
    tokenIncrement: 190
  },
  {
    phase: 'Thought',
    text: 'El payload fue rechazado. Seguiré reintentando generando variaciones del schema hasta que funcione...',
    tokenIncrement: 1450
  },
  {
    phase: 'Action',
    text: 'Tool Call: get_account_balance({ "id": "9921", "format": "raw_json" })',
    tokenIncrement: 310
  },
  {
    phase: 'Observation',
    text: 'Tool Output: Error 400 Bad Request - Unrecognized parameter "format".',
    tokenIncrement: 220
  }
];

export const Module2SilentFailures: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [circuitBreakerTriggered, setCircuitBreakerTriggered] = useState<boolean>(false);

  // Auto loop ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !circuitBreakerTriggered) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= LOOP_STEPS_SCRIPT.length - 1) {
            setIsRunning(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isRunning, circuitBreakerTriggered]);

  // Calculate cumulative stats
  const visibleSteps = LOOP_STEPS_SCRIPT.slice(0, currentStepIndex + 1);
  const totalTokens = visibleSteps.reduce((acc, curr) => acc + curr.tokenIncrement, 850); // Initial prompt base 850 tokens
  const totalCost = (totalTokens / 1000) * 0.003; // ~$0.003 / 1k tokens
  const contextCapacityMax = 8000;
  const contextUsagePercent = Math.min(Math.round((totalTokens / contextCapacityMax) * 100), 100);
  const iterationNumber = Math.floor(currentStepIndex / 3) + 1;

  const handleNextStep = () => {
    if (currentStepIndex < LOOP_STEPS_SCRIPT.length - 1 && !circuitBreakerTriggered) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setCircuitBreakerTriggered(false);
  };

  const handleTriggerCircuitBreaker = () => {
    setIsRunning(false);
    setCircuitBreakerTriggered(true);
  };

  return (
    <div className="space-y-8">
      {/* Module Hero */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
          <span>Módulo 02</span>
          <span>·</span>
          <span>Diagnóstico de Fallos Silenciosos</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Fallo en Silencio (Silent Failures) en Agentes
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          En el software tradicional, los errores son <strong className="text-rose-300 font-semibold">ruidosos y explícitos</strong>: una excepción de puntero nulo interrumpe la ejecución, arroja un código HTTP 500 y emite un stack trace a Sentry.
        </p>
        <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
          En un agente de IA, los fallos son <strong className="text-amber-300 font-semibold">silenciosos, elocuentes y financieramente caros</strong>. El servidor responde con código <code className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono text-xs">HTTP 200 OK</code>, el modelo redacta párrafos impecablemente educados, pero internamente ha caído en un <span className="text-rose-400 font-medium">bucle ReAct circular</span> o ha sufrido una <span className="text-cyan-300 font-medium">deriva de contexto irreversible</span>.
        </p>
      </div>

      {/* Comparison: Tradicional vs Agente LLM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Traditional Software */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Software Clásico</span>
            <span className="text-xs font-mono text-rose-400 font-semibold">HTTP 500 ERROR</span>
          </div>
          <div className="p-3 rounded bg-slate-950 font-mono text-xs text-rose-300/90 space-y-1">
            <div className="text-slate-500">Traceback (most recent call last):</div>
            <div>&gt; File "auth_service.py", line 42, in get_user</div>
            <div>&gt; KeyError: 'session_token' is undefined</div>
            <div className="text-rose-400 font-bold">Process terminated with exit code 1</div>
          </div>
          <p className="text-xs text-slate-300">
            El error es evidente al 100%. Las herramientas de monitoreo tradicionales (APM clásico) activan una alerta inmediata y el desarrollador sabe exactamente qué archivo y línea inspeccionar.
          </p>
        </div>

        {/* LLM Agent Silent Failure */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agente de IA</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">HTTP 200 OK (Engañoso)</span>
          </div>
          <div className="p-3 rounded bg-slate-950 font-mono text-xs text-emerald-300/90 space-y-1">
            <div className="text-slate-500">{"{"} "status": 200, "role": "assistant" {"}"}</div>
            <div className="text-slate-300">"He verificado su solicitud cuidadosamente y..."</div>
            <div className="text-amber-400">/* Internamente realizó 9 llamadas fallidas a APIs sin avisar */</div>
            <div className="text-rose-400 font-bold">Gasto innecesario: 14,800 tokens ($0.044) en 35 segundos</div>
          </div>
          <p className="text-xs text-slate-300">
            El sistema externo cree que todo marchó con éxito. Sin telemetría interna, nunca te enterarás de que el cliente esperó 40 segundos ni de que tu factura mensual se triplicará.
          </p>
        </div>
      </div>

      {/* Interactive Simulator: ReAct Pattern Loops & Context Drift */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Simulador Interactivo de Bucles ReAct y Deriva de Contexto
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Observa cómo un agente cae en el ciclo <code className="text-violet-300 font-mono">Pensamiento → Acción → Observación</code> quemando tokens y memoria.
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {!isRunning ? (
              <button
                onClick={() => {
                  setCircuitBreakerTriggered(false);
                  setIsRunning(true);
                }}
                disabled={currentStepIndex >= LOOP_STEPS_SCRIPT.length - 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar Ciclo</span>
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </button>
            )}

            <button
              onClick={handleNextStep}
              disabled={isRunning || currentStepIndex >= LOOP_STEPS_SCRIPT.length - 1 || circuitBreakerTriggered}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Paso a Paso</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={handleTriggerCircuitBreaker}
              disabled={circuitBreakerTriggered}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Detener el bucle implementando una condición de parada estricta"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Inyectar Circuit Breaker</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Reiniciar simulador"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Running Simulation Radar / Telemetry Pulse Badge */}
        {isRunning && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="font-semibold">SIMULACIÓN EN EJECUCIÓN CONTINUA</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 text-[11px]">Iterando cadena de pensamiento ReAct</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
              POLLING: 1600ms
            </span>
          </div>
        )}

        {/* Live Counters Banner with Subtle Light Pulses */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 relative overflow-hidden group">
            <span className="text-[11px] text-slate-400 block">Iteración ReAct</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-mono font-bold text-violet-400 tabular-nums">
                #{iterationNumber}
              </span>
              <span className="text-xs text-slate-500 font-sans">/ máx 3</span>
              {isRunning && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping ml-auto" />
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 relative overflow-hidden group">
            <span className="text-[11px] text-slate-400 block">Tokens Consumidos</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
                {totalTokens.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-sans">tok</span>
              {isRunning && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-auto" />
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 relative overflow-hidden group">
            <span className="text-[11px] text-slate-400 block">Costo Acumulado</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl font-mono font-bold text-rose-400 tabular-nums">
                ${totalCost.toFixed(4)}
              </span>
              <span className="text-xs text-slate-500 font-sans">USD</span>
              {contextUsagePercent > 70 && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping ml-auto" />
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Saturación de Contexto</span>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xl font-mono font-bold tabular-nums ${contextUsagePercent > 70 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                {contextUsagePercent}%
              </span>
              <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden relative">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    contextUsagePercent > 70 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${contextUsagePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ReAct Execution Stream & Context Drift Explainer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Step History */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">EJECUCIÓN DEL AGENTE EN VIVO</span>
              <span>Paso {currentStepIndex + 1} de {LOOP_STEPS_SCRIPT.length}</span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {visibleSteps.map((step, idx) => {
                const isCurrent = idx === currentStepIndex;
                let badgeColor = 'bg-slate-800 text-slate-300';
                let IconComponent = BrainCircuit;

                if (step.phase === 'Thought') {
                  badgeColor = 'bg-violet-950/70 border-violet-500/40 text-violet-300';
                  IconComponent = BrainCircuit;
                } else if (step.phase === 'Action') {
                  badgeColor = 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300';
                  IconComponent = Wrench;
                } else if (step.phase === 'Observation') {
                  badgeColor = 'bg-amber-950/70 border-amber-500/40 text-amber-300';
                  IconComponent = FileText;
                }

                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border transition-all text-xs ${
                      isCurrent 
                        ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'bg-slate-950/70 border-slate-800/80 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/50">
                      <div className="flex items-center gap-1.5">
                        <IconComponent className="w-3.5 h-3.5 text-slate-400" />
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${badgeColor}`}>
                          {step.phase.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        +{step.tokenIncrement} tokens
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-mono">
                      {step.text}
                    </p>
                  </div>
                );
              })}

              {circuitBreakerTriggered && (
                <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>CIRCUIT BREAKER ACTIVADO</span>
                  </div>
                  <p className="text-emerald-200/90 leading-relaxed">
                    El sistema de observabilidad interceptó el bucle al alcanzar el límite configurado (Max Steps: 3). Se abortó la llamada recursiva y se derivó la petición a un operador humano o mensaje de error controlado, ahorrando $0.18 en tokens proyectados.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Context Drift Phenomenon Explanation */}
          <div className="lg:col-span-5 p-5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 pb-2 border-b border-slate-800">
                <Flame className="w-4 h-4" />
                <span>El Fenómeno de "Deriva de Contexto" (Context Drift)</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Cuando un agente reintenta llamadas fallidas, cada error anterior permanece en el historial de mensajes que se envía al LLM en el siguiente turno.
              </p>

              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs space-y-2">
                <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider">
                  Consecuencias Clínicas de la Deriva:
                </span>
                <ul className="space-y-2 text-slate-400 text-[11px] leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">1.</span>
                    <span><strong className="text-slate-200">Lost in the Middle</strong>: El prompt original del usuario queda sepultado por 8 páginas de payloads JSON de error de servidor.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">2.</span>
                    <span><strong className="text-slate-200">Fijación Alucinatoria</strong>: El LLM asume que el error es su culpa e intenta inventar campos que no existen en la API externa.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">3.</span>
                    <span><strong className="text-slate-200">Costo Cuadrático</strong>: Enviar 12k tokens en cada iteración hace que una sola consulta de $0.002 termine costando $0.15.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3 rounded bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200 space-y-1">
              <span className="font-semibold block text-cyan-300">Regla de Oro de Observabilidad:</span>
              <p>
                Todo agente en producción DEBE contar con telemetría de iteraciones en tiempo real y una política estricta de <em className="not-italic text-slate-100 font-mono">max_iterations &le; 4</em>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
