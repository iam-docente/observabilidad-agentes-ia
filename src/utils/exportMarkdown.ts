import { MODULES } from '../data/modulesData';

export const generateMarkdownGuide = (): string => {
  return `# GUÍA DE OBSERVABILIDAD DE AGENTES DE IA (EDICIÓN OFICIAL)
*Manual de Ingeniería de Telemetría, Logs Estructurados, Métricas Clave y Trazas Distribuidas*
Fecha de Generación: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}

---

## 1. ¿Qué es la Observabilidad en Agentes de IA?
La Observabilidad (Rudolf Kalman) se define como la capacidad de inferir el estado interno de un agente basándose únicamente en sus salidas y telemetría externa.

### Diferencia Clave: Monitoreo vs Observabilidad
- **Monitoreo**: "¿Está vivo el servidor?" (Salud externa binaria, pings de uptime).
- **Observabilidad**: "¿Por qué el agente decidió llamar a la herramienta 'execute_refund' en el paso 3 y por qué alucinó el monto?" (Comprensión causal del razonamiento no-determinista).

### Las 4 Razones Fundamentales:
1. **Paradigma de Caja Negra Probabilística**: Los LLMs tienen muestreo estocástico (temperatura, top-p); dos llamadas con el mismo prompt pueden tomar caminos divergentes.
2. **Debugging Avanzado de Alucinaciones**: Aislar qué nodo intermedio (un fragmento RAG irrelevante o una respuesta de tool mal parseada) originó el fallo.
3. **Optimización Financiera y de Latencia**: Los tokens cuestan dinero real por llamada; la telemetría previene facturas sorpresa y latencias excesivas.
4. **Evaluación Continua (Guardrails)**: Medir sistemáticamente fidelidad (Faithfulness), precisión contextual y relevancia en producción.

---

## 2. El Problema del "Fallo en Silencio" (Silent Failures)
En software determinista tradicional, los errores arrojan una excepción (HTTP 500, NullPointerException) con stack trace.
En agentes de IA:
- El servidor responde **HTTP 200 OK**.
- El agente genera texto cortés y bien estructurado.
- **Pero internamente ha fallado cognitivamente**: entró en un bucle ReAct infinito, alucinó argumentos de API o sufrió una **Deriva de Contexto (Context Drift)** que sepultó las instrucciones del usuario bajo miles de tokens de error.

### Solución Arquitectónica Obligatoria:
- Implementar **Circuit Breakers** con un tope estricto de iteraciones (\`max_iterations <= 3\`).
- Timeout duro y fallback a un operador humano tras fallos repetidos.

---

## 3. La Tríada Clásica de la Observabilidad
1. **Logs (El Qué y Cuándo)**: Eventos discretos e inmutables registrados en instantes puntuales.
2. **Métricas (El Cuánto)**: Agregaciones numéricas en series de tiempo (contadores, histogramas, percentiles p95/p99).
3. **Trazas (El Dónde y Causalidad)**: El grafo acíclico dirigido (DAG) que descompone una consulta de usuario en Spans con duraciones delta-t y linaje padre-hijo.

---

## 4. Estándar de Logs Estructurados en JSON (RFC 8259)
Nunca utilices texto plano en producción. Emite payloads JSON con campos tipados:

\`\`\`json
{
  "timestamp": "2026-11-05T20:14:32.481Z",
  "session_id": "sess_91b7e408-2c49-43aa",
  "user_id": "usr_corpo_8842",
  "model": "gemini-1.5-pro-002",
  "prompt": "Consultar saldo y actualizar dirección",
  "reasoning": "Debo primero validar la política de devoluciones antes de cambiar la dirección...",
  "tool_called": "query_refund_status",
  "tool_status": "success",
  "tokens_input": 1420,
  "tokens_output": 310,
  "latency_seconds": 1.84
}
\`\`\`

---

## 5. Las 5 Familias de Métricas y KPIs
1. **Latencia**: Total E2E Latency, Time to First Token (TTFT < 600ms), Tokens por segundo (> 45 t/s).
2. **Costos Financieros**: Costo por sesión, ratio tokens input/output (4:1 ideal), gasto horario acumulado.
3. **Precisión / RAG**: Context Precision (> 0.85), Faithfulness / Groundedness (> 0.95), Answer Relevance (> 0.90).
4. **Tasa de Éxito**: Goal Completion Rate (> 92%), Human Escalation Rate (< 8%).
5. **Salud de Herramientas**: Tool Failure Rate (< 2.5%), Tool Selection Precision (> 96%).

---

## 6. Trazas Distribuidas y Spans
- **Log**: Punto en el tiempo ($t$).
- **Span**: Intervalo temporal continuo ($\Delta t = t_{end} - t_{start}$).
- Visualizar en gráficos en cascada (Waterfall) permite detectar de inmediato si el 70% del tiempo de espera provino de una API externa lenta o de la inferencia del modelo.

---

## 7. Matriz de Selección de Herramientas
- **LangSmith**: Ideal para proyectos acoplados a LangChain y LangGraph en la nube.
- **Langfuse**: Ideal para empresas que exigen código abierto, self-hosted (GDPR/HIPAA) y SDKs neutrales.
- **OpenTelemetry + OpenInference**: Estándar abierto CNCF para integrar trazas de LLMs en infraestructuras existentes de Datadog, Grafana Tempo o Jaeger.
- **Datadog LLM Observability**: Ideal para entornos enterprise con toda la flota ya monitoreada en Datadog.

---

## 8. Caso de Estudio Forense: "El Agente que no terminaba"
- **Síntoma**: Factura triplicada, 0 errores 500, latencia de 42 segundos por ticket.
- **Causa Raíz**: Contrato de herramienta roto; la tool devolvió texto plano con error y el agente intentó adivinar el formato en un bucle circular sin circuit breaker.
- **Remediación**: Validación tipada con Zod/Pydantic, límite estricto de 3 iteraciones y alerta de ratio de tokens anómalo.

---

## 9. Checklist de Puesta en Producción
- [ ] Logs emitidos estrictamente en formato JSON tipado (RFC 8259).
- [ ] Atributos semánticos OpenInference presentes en cada Span.
- [ ] Circuit Breaker configurado (\`max_iterations <= 3\`).
- [ ] Alerta de latencia p95 configurada (Threshold: 5.0s).
- [ ] Alerta de pico de tokens configurada (> 15,000 tokens por sesión).
- [ ] Handoff graceful a soporte humano en caso de fallos repetidos.

---
*Fin de la Guía de Observabilidad.*
`;
};

export const downloadMarkdownFile = (filename: string = 'Guia_Observabilidad_Agentes_IA.md'): void => {
  const content = generateMarkdownGuide();
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
