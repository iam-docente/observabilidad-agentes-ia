import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Cpu, 
  Zap, 
  DollarSign, 
  ShieldAlert, 
  Gauge, 
  HelpCircle, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RotateCcw,
  Sliders
} from 'lucide-react';

export const Module1Concept: React.FC = () => {
  const [carMode, setCarMode] = useState<'blackbox' | 'observable'>('blackbox');
  const [carSpeed, setCarSpeed] = useState<number>(45);
  const [engineFault, setEngineFault] = useState<boolean>(false);
  const [rpm, setRpm] = useState<number>(2400);

  const handleAccelerate = () => {
    setCarSpeed(prev => Math.min(prev + 15, 120));
    setRpm(prev => Math.min(prev + 600, 5800));
  };

  const handleBrake = () => {
    setCarSpeed(prev => Math.max(prev - 20, 0));
    setRpm(prev => Math.max(prev - 800, 900));
  };

  const handleResetCar = () => {
    setCarSpeed(45);
    setRpm(2400);
    setEngineFault(false);
  };

  return (
    <div className="space-y-8">
      {/* Module Hero Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
          <span>Módulo 01</span>
          <span>·</span>
          <span>Fundamentos de Telemetría Cognitiva</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          ¿Qué es la Observabilidad en Agentes de IA?
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          En ingeniería de software clásica y teoría de control (Rudolf Kalman), la <strong className="text-cyan-300 font-semibold">Observabilidad</strong> se 
          define como la capacidad de <em className="text-slate-100 not-italic font-medium">inferir el estado interno de un sistema basándose únicamente en sus salidas y telemetría externa</em>.
        </p>
        <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
          A diferencia del monitoreo convencional (que solo avisa si el servidor está vivo o caído mediante un ping), la observabilidad te permite responder la pregunta fundamental: <span className="text-amber-300 font-mono">¿Por qué el agente decidió tomar esa acción específica en ese instante preciso?</span>
        </p>
      </div>

      {/* Interactive Widget: Auto con Capó Soldado vs Auto con Tablero Digital */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Analogía Interactiva: El Auto con Capó Soldado vs Tablero Inteligente
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Comprueba la diferencia entre operar un sistema a ciegas frente a disponer de telemetría granular en tiempo real.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setCarMode('blackbox')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                carMode === 'blackbox' 
                  ? 'bg-rose-950/70 border border-rose-500/50 text-rose-300 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Capó Soldado (Caja Negra)</span>
            </button>
            <button
              onClick={() => setCarMode('observable')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                carMode === 'observable' 
                  ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tablero Observable (Telemetría)</span>
            </button>
          </div>
        </div>

        {/* Simulator Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Vehicle State Graphic */}
          <div className="lg:col-span-5 p-5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span className="font-mono">VEHÍCULO / AGENTE SIMULADO</span>
              <span className={`font-mono font-semibold ${carMode === 'observable' ? 'text-cyan-400' : 'text-slate-500'}`}>
                {carMode === 'observable' ? 'TELEMETRÍA ACTIVA' : 'SISTEMA OPACO'}
              </span>
            </div>

            {/* Visual Vehicle Representation */}
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className={`relative w-44 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                carMode === 'blackbox' 
                  ? 'bg-slate-900 border-slate-800 shadow-inner' 
                  : engineFault 
                    ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                    : 'bg-cyan-950/30 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              }`}>
                {carMode === 'blackbox' ? (
                  <div className="space-y-1">
                    <span className="font-mono text-3xl font-bold text-slate-600">⬛ [ ? ]</span>
                    <p className="text-[11px] text-slate-500">Capó Sellado y Soldado</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="font-mono text-3xl font-bold text-cyan-300">
                      {carSpeed} <span className="text-xs text-cyan-400 font-sans">km/h</span>
                    </span>
                    <p className="text-[11px] text-cyan-400/80 font-mono">
                      {rpm} RPM · {engineFault ? '⚠️ Fallo Activo' : 'Óptimo'}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Message */}
              <div className="mt-4 min-h-[48px] flex items-center justify-center text-center px-4">
                {carMode === 'blackbox' ? (
                  engineFault ? (
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/30 px-3 py-1.5 rounded border border-rose-900/50">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>El auto vibra violentamente y echa humo, pero no hay forma de saber qué sensor o cilindro falló.</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      El auto se desplaza, pero ignoras la temperatura del aceite, mezcla de aire o presión de frenos.
                    </span>
                  )
                ) : (
                  engineFault ? (
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/30 px-3 py-1.5 rounded border border-amber-900/50">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Diagnóstico ECU: Código P0171 (Mezcla pobre en Banco 1). Sensor MAF reporta flujo anómalo.</span>
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-400/90 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Todos los subsistemas dentro de los umbrales nominales (SLO 99.9%).</span>
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={handleAccelerate}
                className="flex-1 py-1.5 px-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Acelerar (+15)
              </button>
              <button
                onClick={handleBrake}
                className="flex-1 py-1.5 px-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Frenar (-20)
              </button>
              <button
                onClick={() => setEngineFault(prev => !prev)}
                className={`py-1.5 px-2.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  engineFault 
                    ? 'bg-amber-900/80 text-amber-200 hover:bg-amber-800' 
                    : 'bg-rose-950/60 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60'
                }`}
                title="Inyectar anomalía para comparar el diagnóstico"
              >
                {engineFault ? 'Corregir Fallo' : 'Inyectar Fallo'}
              </button>
              <button
                onClick={handleResetCar}
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Reiniciar vehículo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Telemetry Panel / Blackout Comparison */}
          <div className="lg:col-span-7 p-5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span className="font-mono">PANEL DE CONTROL DEL SISTEMA</span>
              <span className="text-[11px] text-slate-400">
                {carMode === 'observable' ? 'Sensores OBD-II / OpenInference' : 'Panel Apagado'}
              </span>
            </div>

            {carMode === 'blackbox' ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <EyeOff className="w-6 h-6" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-sm font-semibold text-slate-300">Caja Negra: Ceguera Diagnóstica</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Si tu agente de IA es una caja negra, solo sabes que el usuario recibió una respuesta o que el proceso se congeló.
                    No puedes saber si consumió 5,000 tokens innecesarios, si consultó la base de datos equivocada o si entró en bucle.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Velocidad / Throughput</span>
                    <span className="text-base font-mono font-bold text-cyan-300 tabular-nums">
                      {carSpeed} <span className="text-xs font-sans text-slate-400">t/s</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Régimen / Tokens</span>
                    <span className="text-base font-mono font-bold text-slate-200 tabular-nums">
                      {rpm} <span className="text-xs font-sans text-slate-400">RPM</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Temperatura Inferencia</span>
                    <span className={`text-base font-mono font-bold tabular-nums ${engineFault ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {engineFault ? '108 °C' : '89 °C'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Salud de Herramientas</span>
                    <span className={`text-base font-mono font-bold ${engineFault ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {engineFault ? 'DEGRADADO' : 'NOMINAL'}
                    </span>
                  </div>
                </div>

                {/* Live Diagnostic Stream */}
                <div className="p-3 rounded bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-1">
                  <div className="text-slate-400 flex items-center justify-between text-[11px]">
                    <span>STREAM DE EVENTOS VIVOS</span>
                    <span className="text-emerald-400">POLL: 50ms</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-cyan-400">00:01.240</span> [AGENT_STEP] Reasoning context window: 4,120 / 128,000 tokens
                  </div>
                  <div className="text-slate-300">
                    <span className="text-cyan-400">00:01.480</span> [TOOL_EXEC] check_sensor_bus() → status: {engineFault ? '503_SERVICE_UNAVAILABLE' : '200_OK'}
                  </div>
                  {engineFault && (
                    <div className="text-amber-400">
                      <span className="text-amber-400 font-bold">00:01.510</span> [ALERT] Sensor MAF fuera de rango. Activando contingencia de fallback.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Principio: La observabilidad no previene el error; lo hace visible y diagnosticable al instante.</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Key Reasons Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>Las 4 Razones Cruciales para Implementar Observabilidad</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reason 1 */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                1. Paradigma de Caja Negra Probabilística
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              El software clásico es determinista: si la entrada es $x$, la salida siempre es $f(x)$. En los LLMs, el muestreo probabilístico (temperatura, top-p) hace que una misma entrada genere trayectorias cognitivas distintas. Sin observabilidad, no hay forma de auditar por qué una ejecución específica divergió.
            </p>
            <div className="text-[11px] font-mono text-violet-300 pt-2 border-t border-slate-800/60">
              Impacto: No-determinismo auditado mediante rastreo de semillas y prompts exactos.
            </div>
          </div>

          {/* Reason 2 */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-950/70 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                2. Debugging Avanzado de Alucinaciones
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Una alucinación rara vez nace en el paso final. Suele ser el resultado acumulativo de un mal parámetro en una llamada a herramienta en el paso 2, o un fragmento de contexto irrelevante recuperado en el RAG. Inspeccionar la cadena paso a paso permite aislar el eslabón roto.
            </p>
            <div className="text-[11px] font-mono text-rose-300 pt-2 border-t border-slate-800/60">
              Impacto: Detección temprana de alucinaciones en los nodos intermedios de razonamiento.
            </div>
          </div>

          {/* Reason 3 */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                3. Optimización de Costos Financieros y Velocidad
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cada llamada a un LLM tiene un costo directo en dólares y en segundos de latencia. Registrar los tokens de entrada/salida y el Time to First Token (TTFT) permite saber qué herramienta o modelo está sangrando el presupuesto o arruinando la experiencia de usuario.
            </p>
            <div className="text-[11px] font-mono text-amber-300 pt-2 border-t border-slate-800/60">
              Impacto: Reducción de hasta un 65% en facturación de tokens identificando redundancias.
            </div>
          </div>

          {/* Reason 4 */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                4. Evaluación Continua (LLM-as-a-Judge & Guardrails)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Los agentes interactúan con usuarios impredecibles en el mundo real. La observabilidad alimenta datasets de producción reales para evaluar continuamente métricas de fidelidad (Faithfulness), relevancia de respuestas y prevención de inyecciones de prompts maliciosos.
            </p>
            <div className="text-[11px] font-mono text-emerald-300 pt-2 border-t border-slate-800/60">
              Impacto: Mejora continua respaldada por datos cuantitativos, no por intuición.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
