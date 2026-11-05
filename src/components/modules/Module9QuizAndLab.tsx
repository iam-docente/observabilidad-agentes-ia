import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Download, 
  RotateCcw, 
  FileCode, 
  ShieldCheck, 
  Copy, 
  Check, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/modulesData';

interface Module9Props {
  onExportMarkdown: () => void;
}

export const Module9QuizAndLab: React.FC<Module9Props> = ({ onExportMarkdown }) => {
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeLabTab, setActiveLabTab] = useState<'level1' | 'level2' | 'level3' | 'level4'>('level1');
  
  // Custom certificate state
  const [studentName, setStudentName] = useState<string>('Ingeniero de IA');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);

  // Level 1 Lab: JSON Schema Validator
  const [userJsonInput, setUserJsonInput] = useState<string>(`{
  "timestamp": "2026-11-05T21:00:00Z",
  "session_id": "sess_demo_101",
  "prompt": "¿Cuál es el pronóstico de ventas?",
  "reasoning": "Debo consultar la base de datos SQL de finanzas...",
  "tool_called": "run_sql_query",
  "tool_status": "success",
  "tokens_input": 1200,
  "tokens_output": 280,
  "latency_seconds": 1.45
}`);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; missing: string[] } | null>(null);

  const handleSelectQuizOption = (questionId: number, optionIndex: number) => {
    if (!quizSubmitted) {
      setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    }
  };

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const correctCount = QUIZ_QUESTIONS.filter(q => selectedAnswers[q.id] === q.correctIndex).length;
  const isPassed = correctCount >= 4;

  const handleValidateJson = () => {
    try {
      const parsed = JSON.parse(userJsonInput);
      const required = ['timestamp', 'session_id', 'prompt', 'reasoning', 'tool_called', 'tool_status', 'tokens_input', 'tokens_output', 'latency_seconds'];
      const missing = required.filter(k => !(k in parsed));
      setValidationResult({ valid: missing.length === 0, missing });
    } catch (e) {
      setValidationResult({ valid: false, missing: ['Sintaxis JSON inválida (Error de comillas o llaves)'] });
    }
  };

  const handleCopyAlertTemplate = () => {
    const template = `# POLÍTICA DE ALERTAS Y SLOS DE AGENTES IA (PRODUCCIÓN)
1. LATENCIA CRÍTICA:
   - Alerta Amarilla: p95 E2E Latency > 5.0s durante 3 minutos consecutivos.
   - Alerta Roja: TTFT > 2.5s en más del 10% de las peticiones activas.

2. DETECCIÓN DE BUCLES REACT:
   - Alerta Roja Instantánea: agent_iterations >= 4 en una misma sesión.
   - Acción Automática: Disparo de Circuit Breaker y fallback a handoff humano.

3. CONTROL FINANCIERO:
   - Alerta Amarilla: tokens_input por sesión > 15,000 tokens.
   - Alerta Roja: Gasto horario de API supera el 250% de la media semanal.`;
    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Module Hero */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
          <span>Módulo 09</span>
          <span>·</span>
          <span>Certificación y Laboratorio Práctico</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Autoevaluación Técnica y Laboratorio de Desafíos
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Pon a prueba tus conocimientos con el <strong className="text-emerald-300 font-semibold">Quiz de Certificación</strong> de 5 preguntas técnicas y completa los <strong className="text-cyan-300 font-semibold">4 Laboratorios de Desafíos Prácticos</strong> para diseñar esquemas de logs, políticas de alerta y diagramas de spans.
        </p>
      </div>

      {/* Part 1: Interactive Quiz */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Quiz Técnico de Certificación (5 Preguntas)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Responde las preguntas y califica para evaluar tu dominio de telemetría, métricas y diagnóstico de agentes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {quizSubmitted ? (
              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar Quiz</span>
              </button>
            ) : (
              <button
                onClick={handleGradeQuiz}
                disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Calificar Respuestas</span>
              </button>
            )}
          </div>
        </div>

        {/* Score banner if submitted */}
        {quizSubmitted && (
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isPassed ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-amber-950/40 border-amber-500/50'
          }`}>
            <div>
              <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Resultado: {correctCount} de {QUIZ_QUESTIONS.length} Correctas</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${isPassed ? 'bg-emerald-900 text-emerald-200' : 'bg-amber-900 text-amber-200'}`}>
                  {isPassed ? 'APROBADO' : 'REQUIERE REPASO'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isPassed 
                  ? '¡Excelente! Has demostrado un dominio riguroso de observabilidad para agentes de inteligencia artificial.' 
                  : 'Has completado el examen. Revisa las notas pedagógicas abajo para afianzar los conceptos clave.'}
              </p>
            </div>

            {isPassed && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
              >
                Ver Mi Certificado
              </button>
            )}
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-5">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = userChoice === q.correctIndex;

            return (
              <div 
                key={q.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm font-semibold text-slate-100 flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold shrink-0">0{idx + 1}.</span>
                    <span className="leading-relaxed">{q.question}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {q.category}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userChoice === oIdx;
                    let optClass = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (quizSubmitted) {
                      if (oIdx === q.correctIndex) {
                        optClass = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200';
                      } else if (isSelected && !isCorrect) {
                        optClass = 'bg-rose-950/60 border-rose-500/60 text-rose-200';
                      }
                    } else if (isSelected) {
                      optClass = 'bg-slate-800 border-cyan-500/50 text-cyan-200 shadow-sm';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectQuizOption(q.id, oIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${optClass}`}
                      >
                        <span className="font-mono text-slate-500 shrink-0 font-semibold mt-0.5">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="pt-2 text-xs text-slate-400 border-t border-slate-800/60">
                    <span className="font-semibold text-cyan-300 font-mono">Explicación: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Practical Challenge Labs (4 Levels) */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Laboratorio de Desafíos Prácticos (4 Niveles)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ejercicios prácticos con plantillas e interactividad para diseñar tu propia arquitectura de observabilidad.
            </p>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveLabTab('level1')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeLabTab === 'level1' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nivel 1: Diseñar Log JSON
            </button>
            <button
              onClick={() => setActiveLabTab('level2')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeLabTab === 'level2' ? 'bg-slate-800 text-amber-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nivel 2: Umbrales y SLOs
            </button>
            <button
              onClick={() => setActiveLabTab('level3')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeLabTab === 'level3' ? 'bg-slate-800 text-violet-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nivel 3: Esquema de Trazas
            </button>
            <button
              onClick={() => setActiveLabTab('level4')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeLabTab === 'level4' ? 'bg-slate-800 text-emerald-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nivel 4: Matriz de Stack
            </button>
          </div>
        </div>

        {/* Level 1: JSON Schema Playground */}
        {activeLabTab === 'level1' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Laboratorio Básico: Validador de Schema de Log para Agentes
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Edita el JSON a continuación y pulsa "Validar Estructura". El validador verificará que incluya los campos indispensables: <code className="text-cyan-300 font-mono">timestamp</code>, <code className="text-cyan-300 font-mono">session_id</code>, <code className="text-cyan-300 font-mono">prompt</code>, <code className="text-cyan-300 font-mono">reasoning</code>, <code className="text-cyan-300 font-mono">tool_called</code>, <code className="text-cyan-300 font-mono">tool_status</code>, <code className="text-cyan-300 font-mono">tokens_input</code>, <code className="text-cyan-300 font-mono">tokens_output</code> y <code className="text-cyan-300 font-mono">latency_seconds</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <textarea
                  value={userJsonInput}
                  onChange={(e) => setUserJsonInput(e.target.value)}
                  rows={10}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500/50 leading-relaxed"
                />
              </div>

              <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <button
                    onClick={handleValidateJson}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Validar Estructura JSON
                  </button>

                  {validationResult && (
                    <div className="mt-3 p-3 rounded-lg text-xs">
                      {validationResult.valid ? (
                        <div className="text-emerald-300 bg-emerald-950/40 p-2.5 rounded border border-emerald-500/40 space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            <span>¡Schema 100% Válido!</span>
                          </div>
                          <p className="text-[11px] text-emerald-200">
                            Tu log cumple con los estándares de indexación para Elasticsearch, Datadog y ClickHouse.
                          </p>
                        </div>
                      ) : (
                        <div className="text-rose-300 bg-rose-950/40 p-2.5 rounded border border-rose-500/40 space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" />
                            <span>Faltan campos obligatorios:</span>
                          </div>
                          <ul className="text-[11px] list-disc pl-4 space-y-0.5">
                            {validationResult.missing.map(m => <li key={m}>{m}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-500">
                  Tip: Guarda este template en tu repositorio para estandarizar los logs de todos los agentes de tu equipo.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Level 2: Umbrales y SLOs */}
        {activeLabTab === 'level2' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  Nivel Intermedio: Plantilla de Política de Alertas y SLOs
                </h3>
                <p className="text-xs text-slate-400">
                  Copia esta plantilla lista para configurar en Datadog, Prometheus Alertmanager o Langfuse.
                </p>
              </div>
              <button
                onClick={handleCopyAlertTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Copiado' : 'Copiar Plantilla'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 leading-relaxed overflow-x-auto">
              <pre>{`# POLÍTICA DE ALERTAS Y SLOS DE AGENTES IA (PRODUCCIÓN)
1. LATENCIA CRÍTICA:
   - Alerta Amarilla: p95 E2E Latency > 5.0s durante 3 minutos consecutivos.
   - Alerta Roja: TTFT > 2.5s en más del 10% de las peticiones activas.

2. DETECCIÓN DE BUCLES REACT:
   - Alerta Roja Instantánea: agent_iterations >= 4 en una misma sesión.
   - Acción Automática: Disparo de Circuit Breaker y fallback a handoff humano.

3. CONTROL FINANCIERO:
   - Alerta Amarilla: tokens_input por sesión > 15,000 tokens.
   - Alerta Roja: Gasto horario de API supera el 250% de la media semanal.`}</pre>
            </div>
          </div>
        )}

        {/* Level 3: Esquema de Trazas */}
        {activeLabTab === 'level3' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Nivel Avanzado: Arquitectura de Trazabilidad OpenTelemetry
              </h3>
              <p className="text-xs text-slate-400">
                Esquema canónico de propagación de contexto distribuido en agentes jerárquicos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-violet-300 leading-relaxed overflow-x-auto space-y-2">
              <div className="text-cyan-400">[TRACE_ID: 4bf92f3577b34da6a3ce929d0e0e4736]</div>
              <div className="pl-4">└── [SPAN_ROOT] agent_orchestrator (Parent: None)</div>
              <div className="pl-8">├── [SPAN_CHILD_1] guardrail_input_eval (Duration: 45ms)</div>
              <div className="pl-8">├── [SPAN_CHILD_2] pinecone_vector_search (Duration: 180ms)</div>
              <div className="pl-8">├── [SPAN_CHILD_3] llm_reasoning_step (Duration: 620ms)</div>
              <div className="pl-12">└── [SPAN_SUB_TOOL] crm_api_call (Duration: 140ms)</div>
              <div className="pl-8">└── [SPAN_CHILD_4] llm_synthesis_output (Duration: 550ms)</div>
            </div>
          </div>
        )}

        {/* Level 4: Matriz de Stack */}
        {activeLabTab === 'level4' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Nivel Investigación: Guía Rápida de Elección de Stack
              </h3>
              <p className="text-xs text-slate-400">
                Resumen ejecutivo de decisión para presentar a líderes técnicos y CTOs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-violet-400 block">Si usas LangChain / LangGraph:</span>
                <p className="text-slate-300">Elige <strong>LangSmith</strong>. Es el que mejor serializa los grafos y estado cíclico sin configuración manual.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">Si necesitas On-Premise / Open Source:</span>
                <p className="text-slate-300">Elige <strong>Langfuse</strong>. Se instala con Docker Compose en 10 minutos y garantiza cumplimiento estricto de GDPR/HIPAA.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 block">Si ya tienes Datadog / Grafana:</span>
                <p className="text-slate-300">Elige <strong>OpenTelemetry + OpenInference</strong>. No dupliques costos de herramientas; canaliza tus trazas hacia tu stack actual.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">Si buscas Evaluación Continua RAG:</span>
                <p className="text-slate-300">Combina tus trazas con frameworks de evaluación como <strong>Ragas</strong> o <strong>DeepEval</strong> para auditar alucinaciones periódicamente.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/50 rounded-2xl p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 border-b border-slate-800 pb-6">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 mb-2">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
                Certificado de Especialista en Observabilidad de Agentes IA
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                VERIFICADO · TELEMETRÍA AVANZADA · INCIDENT RESPONSE
              </p>
            </div>

            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-slate-400">Se certifica formalmente que:</p>
              <div className="inline-block px-4 py-2 rounded-lg bg-slate-900 border border-slate-800">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="text-center text-xl font-bold text-slate-100 bg-transparent focus:outline-none"
                  placeholder="Tu Nombre Completo"
                />
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Ha completado satisfactoriamente los 9 módulos de la guía, dominando logs JSON estructurados, métricas multidimensionales, análisis forense de bucles ReAct y trazas jerárquicas OpenTelemetry.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-4 border-t border-slate-800">
              <span>FECHA: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>SCORE: {correctCount}/{QUIZ_QUESTIONS.length} (100% Verificado)</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Imprimir Certificado
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Actions Footer */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">
            ¿Deseas descargar la Guía Completa de Observabilidad?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Descarga un archivo Markdown consolidado con todos los conceptos, esquemas y checklists técnicos.
          </p>
        </div>
        <button
          onClick={onExportMarkdown}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer shadow-lg shadow-cyan-950"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Guía en Markdown</span>
        </button>
      </div>
    </div>
  );
};
