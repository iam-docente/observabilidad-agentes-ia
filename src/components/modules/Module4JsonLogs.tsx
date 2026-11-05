import React, { useState } from 'react';
import { 
  FileCode, 
  FileText, 
  Check, 
  Copy, 
  Search, 
  HelpCircle, 
  Info, 
  AlertCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { JSON_FIELDS } from '../../data/modulesData';
import { JsonFieldExplanation } from '../../types';

export const Module4JsonLogs: React.FC = () => {
  const [logFormat, setLogFormat] = useState<'plain' | 'json'>('json');
  const [selectedField, setSelectedField] = useState<JsonFieldExplanation>(JSON_FIELDS[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleJsonLog = {
    timestamp: "2026-11-05T20:14:32.481Z",
    session_id: "sess_91b7e408-2c49-43aa",
    user_id: "usr_corpo_8842",
    model: "gemini-1.5-pro-002",
    prompt: "Por favor revisa el estado de mi reembolso #REF-9921 y actualiza mi dirección a Calle Mayor 14.",
    reasoning: "El usuario solicita dos intenciones: consultar reembolso y actualizar dirección. Primero debo verificar la política de actualización de direcciones cuando hay reembolsos pendientes en curso.",
    tool_called: "query_refund_status",
    tool_status: "success",
    tokens_input: 1420,
    tokens_output: 310,
    latency_seconds: 1.84
  };

  const plainTextLogSample = `[2026-11-05 20:14:32] AGENT_EXEC session=sess_91b7e408-2c49-43aa user=usr_corpo_8842 model=gemini-1.5-pro-002 prompt="Por favor revisa el estado de mi reembolso #REF-9921 y actualiza mi dirección a Calle Mayor 14." CoT="El usuario solicita dos intenciones..." tool=query_refund_status status=success tokens_in=1420 tokens_out=310 latency=1.84s`;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleJsonLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Module Hero */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
          <span>Módulo 04</span>
          <span>·</span>
          <span>Ingeniería de Logs Estructurados</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Implementación de Logs en Formato JSON
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Escribir líneas de texto plano con <code className="text-rose-400 font-mono text-xs bg-slate-950 px-1 py-0.5 rounded">print()</code> o <code className="text-rose-400 font-mono text-xs bg-slate-950 px-1 py-0.5 rounded">console.log()</code> es la sentencia de muerte para la observabilidad en producción. 
          Los logs deben emitirse como <strong className="text-cyan-300 font-semibold">objetos JSON estrictos y tipados</strong>, listos para ser ingeridos por motores de indexación como Elasticsearch, ClickHouse, Datadog o Grafana Loki.
        </p>
      </div>

      {/* Comparison: Plain Text vs JSON */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Comparativa Interactiva: Texto Plano vs JSON Estructurado
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evalúa la diferencia entre un formato ilegible para parsers y una estructura optimizada para analítica masiva.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setLogFormat('plain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                logFormat === 'plain' 
                  ? 'bg-rose-950/70 border border-rose-500/50 text-rose-300 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Texto Plano (Anti-Patrón)</span>
            </button>
            <button
              onClick={() => setLogFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                logFormat === 'json' 
                  ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON Estructurado (Estándar)</span>
            </button>
          </div>
        </div>

        {/* Display Container */}
        {logFormat === 'plain' ? (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-slate-950 border border-rose-900/50 font-mono text-xs text-rose-300/80 break-all leading-relaxed">
              {plainTextLogSample}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-300">
                <span className="font-bold block mb-1">❌ Inmune a Búsquedas SQL</span>
                <p className="text-[11px] text-slate-400">Filtrar por "todos los errores de tool donde tokens &gt; 1000" requiere expresiones regulares lentas y frágiles.</p>
              </div>
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-300">
                <span className="font-bold block mb-1">❌ Corrupción por Comillas</span>
                <p className="text-[11px] text-slate-400">Si el usuario ingresa comillas o saltos de línea en el prompt, el analizador de logs colapsa o trunca el mensaje.</p>
              </div>
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-300">
                <span className="font-bold block mb-1">❌ Tipado Inexistente</span>
                <p className="text-[11px] text-slate-400">La latencia "1.84s" y los tokens "1420" se guardan como cadenas de texto: imposible calcular medias y percentiles.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-slate-950 border border-cyan-500/30 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre>{JSON.stringify(sampleJsonLog, null, 2)}</pre>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-300">
                <span className="font-bold block mb-1">✅ Indexación Instantánea</span>
                <p className="text-[11px] text-slate-400">Cada propiedad se convierte en una columna consultable con filtros numéricos directos y agregaciones.</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-300">
                <span className="font-bold block mb-1">✅ Tipos Nativos (Integer / Float)</span>
                <p className="text-[11px] text-slate-400">Permite calcular percentiles p95 de latencia y costo acumulado en USD en tiempo real mediante queries simples.</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-300">
                <span className="font-bold block mb-1">✅ Esquema RFC 8259 Robusto</span>
                <p className="text-[11px] text-slate-400">Soporta cadenas multilínea con escaping seguro para prompts extensos y razonamiento Chain-of-Thought.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Interactive JSON Inspector */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Inspector Interactivo de Campos del Payload JSON
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Haz clic sobre cualquier propiedad para comprender su propósito técnico, sintaxis de consulta y por qué es crítica para alertas.
            </p>
          </div>

          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado al portapapeles' : 'Copiar Payload JSON'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Highlighted JSON Visualizer */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs leading-relaxed overflow-x-auto">
            <div className="text-slate-500 pb-2 border-b border-slate-800/80 text-[11px] flex items-center justify-between">
              <span>PAYLOAD INTERACTIVO (Haz clic en una clave)</span>
              <span className="text-cyan-400 text-[10px]">CLICKABLE KEYS</span>
            </div>

            <div className="pt-3 text-slate-400 space-y-1">
              <span>{"{"}</span>
              
              {JSON_FIELDS.map((f, i) => {
                const isSelected = selectedField.field === f.field;
                let valueRepresentation = '...';
                if (f.field === 'timestamp') valueRepresentation = '"2026-11-05T20:14:32.481Z"';
                else if (f.field === 'session_id') valueRepresentation = '"sess_91b7e408-2c49-43aa"';
                else if (f.field === 'prompt') valueRepresentation = '"Por favor revisa el estado de mi reembolso..."';
                else if (f.field === 'reasoning') valueRepresentation = '"El usuario solicita dos intenciones..."';
                else if (f.field === 'tool_called') valueRepresentation = '"query_refund_status"';
                else if (f.field === 'tool_status') valueRepresentation = '"success"';
                else if (f.field.includes('tokens')) valueRepresentation = '1420 / 310';
                else if (f.field === 'latency_seconds') valueRepresentation = '1.84';
                else if (f.field === 'model') valueRepresentation = '"gemini-1.5-pro-002"';

                return (
                  <div 
                    key={f.field}
                    onClick={() => setSelectedField(f)}
                    className={`pl-4 py-1 rounded transition-colors cursor-pointer flex items-baseline justify-between group ${
                      isSelected 
                        ? 'bg-cyan-950/60 border border-cyan-500/50 text-slate-100' 
                        : 'hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className={`font-semibold ${isSelected ? 'text-cyan-300 underline' : 'text-slate-200 group-hover:text-cyan-400'}`}>
                        "{f.field}"
                      </span>
                      <span className="text-slate-500">: </span>
                      <span className="text-amber-300/90">{valueRepresentation}</span>
                      <span className="text-slate-500">{i < JSON_FIELDS.length - 1 ? ',' : ''}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 group-hover:text-cyan-400 font-sans pr-2">
                      {f.importance}
                    </span>
                  </div>
                );
              })}

              <span>{"}"}</span>
            </div>
          </div>

          {/* Right: Field Explanation Detail Card */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-cyan-500/40 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  CAMPO: {selectedField.field}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                  selectedField.importance === 'Crítico' 
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40' 
                    : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {selectedField.importance.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-mono">TIPO DE DATO</span>
                <span className="text-xs font-mono text-slate-200 font-semibold">{selectedField.type}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-mono">DESCRIPCIÓN TÉCNICA</span>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  {selectedField.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-mono font-semibold flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>EJEMPLO DE CONSULTA (SQL / LogQL):</span>
                </span>
                <code className="text-xs font-mono text-amber-300 block break-all">
                  SELECT * FROM agent_logs WHERE {selectedField.filterExample};
                </code>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 space-y-1">
                <span className="text-[10px] text-rose-400 font-mono font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>IMPACTO SI SE OMITE ESTE CAMPO:</span>
                </span>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {selectedField.impactIfMissing}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              Estándar recomendado: Adopta las especificaciones semánticas de OpenInference para compatibilidad total con Datadog y OpenTelemetry.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
