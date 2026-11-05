import { ModuleInfo, JsonFieldExplanation, ToolOption, QuizQuestion } from '../types';

export const MODULES: ModuleInfo[] = [
  {
    id: 'que-es-observabilidad',
    number: 1,
    title: '¿Qué es la Observabilidad?',
    shortTitle: 'Conceptos Clave',
    tagline: 'De la caja negra probabilística a la telemetría inteligente',
    estimatedMinutes: 6,
    pillarBadge: 'Fundamentos',
    summary: 'La capacidad de inferir el estado interno de un agente a partir de sus salidas externas y telemetría estructurada.'
  },
  {
    id: 'fallo-en-silencio',
    number: 2,
    title: 'Fallo en Silencio en Agentes',
    shortTitle: 'Fallos en Silencio',
    tagline: 'Por qué el código devuelve HTTP 200 mientras el agente colapsa',
    estimatedMinutes: 8,
    pillarBadge: 'Diagnóstico',
    summary: 'Diferencia crucial entre errores sintácticos tradicionales y fallas cognitivas elocuentes, bucles ReAct y deriva de contexto.'
  },
  {
    id: 'tres-pilares',
    number: 3,
    title: 'Los Tres Pilares de la Observabilidad',
    shortTitle: 'Los 3 Pilares',
    tagline: 'Logs, Métricas y Trazas en perfecta sincronía',
    estimatedMinutes: 7,
    pillarBadge: 'Arquitectura',
    summary: 'La tríada clásica adaptada a sistemas de agentes: qué ocurrió (Logs), cuánto y qué tan rápido (Métricas) y la causalidad temporal (Trazas).'
  },
  {
    id: 'logs-json',
    number: 4,
    title: 'Implementación de Logs en JSON',
    shortTitle: 'Logs Estructurados',
    tagline: 'De texto plano ilegible a esquemas consultables por máquinas',
    estimatedMinutes: 8,
    pillarBadge: 'Implementación',
    summary: 'Estructuración estricta de eventos: reasoning, tool calls, latencias y consumo de tokens para indexación y alertas automáticas.'
  },
  {
    id: 'metricas-kpis',
    number: 5,
    title: 'Métricas Clave y KPIs (Las 5 Familias)',
    shortTitle: 'KPIs y Métricas',
    tagline: 'Latencia, Costo, Precisión, Éxito y Uso de Herramientas',
    estimatedMinutes: 9,
    pillarBadge: 'Métricas',
    summary: 'Medición multidimensional: TTFT, latencia por token, costos acumulados, precisión RAG y confiabilidad operativa.'
  },
  {
    id: 'trazas-spans',
    number: 6,
    title: 'Trazas (Traces) y Spans',
    shortTitle: 'Trazas y Spans',
    tagline: 'Desentrañando el árbol de ejecución y los cuellos de botella',
    estimatedMinutes: 8,
    pillarBadge: 'Trazabilidad',
    summary: 'Grafos acíclicos dirigidos de spans jerárquicos: visualización en cascada (Waterfall) y linaje causal entre LLM y llamadas a APIs.'
  },
  {
    id: 'ecosistema-herramientas',
    number: 7,
    title: 'Ecosistema de Herramientas',
    shortTitle: 'Herramientas',
    tagline: 'LangSmith vs Langfuse vs OpenTelemetry vs APM tradicional',
    estimatedMinutes: 7,
    pillarBadge: 'Ecosistema',
    summary: 'Matriz comparativa técnica y asistente de decisión para elegir la infraestructura adecuada según tu stack y requerimientos de privacidad.'
  },
  {
    id: 'caso-integrador',
    number: 8,
    title: 'Caso Integrador: "El Agente que no terminaba"',
    shortTitle: 'Caso Forense Real',
    tagline: 'Factura triplicada, 0 excepciones: resuelve el misterio',
    estimatedMinutes: 10,
    pillarBadge: 'Laboratorio Forense',
    summary: 'Investigación técnica paso a paso de un agente en producción que colapsó en silencio: inspecciona telemetría y resuelve el incidente.'
  },
  {
    id: 'autoevaluacion-lab',
    number: 9,
    title: 'Autoevaluación y Laboratorio Práctico',
    shortTitle: 'Quiz y Laboratorio',
    tagline: 'Valida tus conocimientos y diseña tus propias defensas',
    estimatedMinutes: 8,
    pillarBadge: 'Certificación',
    summary: 'Quiz interactivo con explicaciones detalladas y retos prácticos para diseñar logs, umbrales y planes de observabilidad.'
  }
];

export const JSON_FIELDS: JsonFieldExplanation[] = [
  {
    field: 'timestamp',
    type: 'string (ISO 8601 UTC)',
    importance: 'Crítico',
    description: 'Momento exacto en que inició o finalizó el paso del agente. Imprescindible para correlacionar con eventos en el servidor.',
    filterExample: "timestamp >= '2026-11-05T00:00:00Z'",
    impactIfMissing: 'Imposible ordenar cronológicamente eventos o calcular latencia diferencial en incidentes.'
  },
  {
    field: 'session_id',
    type: 'string (UUID)',
    importance: 'Crítico',
    description: 'Identificador único de la conversación o ciclo de vida completo del agente con el usuario.',
    filterExample: "session_id = 'sess_88a9c3e2-411a'",
    impactIfMissing: 'Los logs quedan huérfanos; no se puede reconstruir la sesión completa de un usuario que reportó una falla.'
  },
  {
    field: 'prompt',
    type: 'string',
    importance: 'Crítico',
    description: 'La entrada exacta recibida por el LLM en ese paso, incluyendo las instrucciones del sistema y memoria contextual inyectada.',
    filterExample: "prompt LIKE '%devolución garantía%'",
    impactIfMissing: 'No se puede reproducir la alucinación en un entorno de pruebas ni auditar prompt injection.'
  },
  {
    field: 'reasoning',
    type: 'string',
    importance: 'Crítico',
    description: 'El pensamiento o cadena de razonamiento (Chain-of-Thought / CoT) interno que precedió a la acción.',
    filterExample: "reasoning LIKE '%no encontré el ID%'",
    impactIfMissing: 'El agente se vuelve una caja negra impenetrable; no sabemos por qué decidió invocar una herramienta equivocada.'
  },
  {
    field: 'tool_called',
    type: 'string | null',
    importance: 'Crítico',
    description: 'Nombre de la función o herramienta externa invocada (p.ej. search_inventory, execute_sql, send_email).',
    filterExample: "tool_called = 'refund_payment'",
    impactIfMissing: 'Incapacidad de auditar qué acciones de efecto secundario ejecutó el agente sobre sistemas externos.'
  },
  {
    field: 'tool_status',
    type: "'success' | 'error' | 'timeout'",
    importance: 'Crítico',
    description: 'Resultado de la ejecución de la herramienta externa. Vital para capturar fallas silenciosas donde el LLM oculta el error de la tool.',
    filterExample: "tool_status = 'error' AND tool_called = 'sql_query'",
    impactIfMissing: 'No se pueden configurar alertas automáticas cuando fallan APIs de terceros.'
  },
  {
    field: 'tokens_input / tokens_output',
    type: 'integer',
    importance: 'Crítico',
    description: 'Conteo preciso de tokens consumidos en el prompt y generados en la respuesta para control financiero inmediato.',
    filterExample: 'tokens_input > 12000',
    impactIfMissing: 'Facturas sorpresa a final de mes y ceguera ante fenómenos de contexto inflado (Context Explosion).'
  },
  {
    field: 'latency_seconds',
    type: 'float',
    importance: 'Crítico',
    description: 'Tiempo total en segundos que tomó este paso, desglosado entre inferencia y llamada de herramienta.',
    filterExample: 'latency_seconds > 4.5',
    impactIfMissing: 'Incapacidad de detectar degradación de experiencia de usuario o cuellos de botella en APIs de terceros.'
  },
  {
    field: 'model',
    type: 'string',
    importance: 'Recomendado',
    description: 'Identificador específico de la versión del modelo (p.ej. gemini-1.5-pro-002, gpt-4o-2024-08-06).',
    filterExample: "model = 'gemini-1.5-flash'",
    impactIfMissing: 'No se pueden comparar costos, calidad y regresiones tras actualizaciones de modelos por parte de los proveedores.'
  }
];

export const TOOLS_LIST: ToolOption[] = [
  {
    id: 'langsmith',
    name: 'LangSmith',
    category: 'LLM-Native',
    license: 'Comercial SaaS',
    strengths: [
      'Integración nativa sin fricción con LangChain y LangGraph',
      'Dataset curation y flujos de evaluación continua asistida por LLMs',
      'Excelente visualización de árboles de agentes y llamadas a herramientas'
    ],
    weaknesses: [
      'Costo elevado a escala masiva',
      'Fuerte acoplamiento si no usas el ecosistema LangChain'
    ],
    bestFor: 'Equipos que construyen sobre LangChain/LangGraph y buscan la experiencia integrada más rápida.',
    pricingNote: 'Free tier generoso para prototipos, luego $0.005 por traza en planes pagos.',
    website: 'https://www.langchain.com/langsmith'
  },
  {
    id: 'langfuse',
    name: 'Langfuse',
    category: 'LLM-Native',
    license: 'Open Source',
    strengths: [
      '100% Código Abierto con opción Self-Hosted en Docker/Kubernetes',
      'Agnóstico a frameworks (soporta SDKs de OpenAI, Anthropic, LiteLLM, Raw APIs)',
      'Excelente gestión de costos por modelo, prompt engineering y versionado'
    ],
    weaknesses: [
      'El despliegue self-hosted requiere mantenimiento de infraestructura (Postgres + ClickHouse)',
      'Ecosistema de plugins más joven comparado con LangSmith'
    ],
    bestFor: 'Empresas con requisitos estrictos de privacidad de datos (HIPAA, GDPR) y equipos que quieren evitar vendor lock-in.',
    pricingNote: 'Open Source gratis; Cloud SaaS con tier gratuito y planes por consumo.',
    website: 'https://langfuse.com'
  },
  {
    id: 'opentelemetry',
    name: 'OpenTelemetry + OpenInference',
    category: 'Open Source / Open Standard',
    license: 'Open Source',
    strengths: [
      'Estándar oficial de la industria (CNCF), sin ataduras a ningún vendedor',
      'Exporta trazas hacia cualquier APM: Jaeger, Grafana Tempo, Datadog, Honeycomb',
      'Semántica unificada de GenAI para spans de LLM, embeddings y vectores'
    ],
    weaknesses: [
      'Mayor complejidad de instrumentación inicial',
      'Requiere montar o pagar por un backend de visualización (no incluye UI propia para evaluar prompts)'
    ],
    bestFor: 'Arquitecturas empresariales que ya poseen infraestructura de observabilidad (Grafana/Datadog) y quieren integrar LLMs en el mismo dashboard.',
    pricingNote: '100% Libre y gratuito (los costos dependen del backend receptor).',
    website: 'https://opentelemetry.io'
  },
  {
    id: 'datadog',
    name: 'Datadog LLM Observability',
    category: 'APM Tradicional',
    license: 'Comercial SaaS',
    strengths: [
      'Visión unificada: une la infraestructura del servidor, bases de datos y LLMs en un solo panel',
      'Alertas de producción ultra robustas, dashboards ejecutivos y detección de anomalías',
      'Soporte corporativo de nivel Enterprise (SLA 99.99%)'
    ],
    weaknesses: [
      'Costo enterprise elevado',
      'Menos granularidad pedagógica para inspeccionar cadenas de pensamiento (CoT) frente a herramientas dedicadas'
    ],
    bestFor: 'Empresas medianas y grandes que ya tienen Datadog desplegado en toda su flota de microservicios.',
    pricingNote: 'Planes empresariales basados en hosts + costo por millón de tokens procesados.',
    website: 'https://www.datadoghq.com'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '¿Por qué un sistema de agentes de IA puede experimentar un "Fallo en Silencio" a pesar de que el servidor devuelva código HTTP 200?',
    options: [
      'Porque la conexión TCP se desconectó antes de recibir la cabecera.',
      'Porque el LLM genera texto elocuente y con sintaxis válida, pero con una premisa de razonamiento falsa o una acción que viola las instrucciones del sistema sin arrojar una excepción de código.',
      'Porque la memoria RAM del servidor se sobrecalienta sin apagar el proceso.',
      'Porque los modelos LLM siempre devuelven excepciones HTTP 500 cuando cometen errores lógicos.'
    ],
    correctIndex: 1,
    explanation: 'A diferencia del software determinista donde un fallo de índice o tipo arroja una excepción explícita, los LLMs son probabilísticos: siempre generan texto creíble aunque internamente alucinen parámetros o entren en bucles circulares.',
    category: 'Fallos Cognitivos'
  },
  {
    id: 2,
    question: 'En la tríada de observabilidad, ¿cuál es la diferencia fundamental entre un Log y un Span?',
    options: [
      'Un log cuesta dinero y un span es gratuito.',
      'Un log solo registra errores mientras que un span registra peticiones exitosas.',
      'Un log representa un evento discreto puntual (un momento exacto), mientras que un span representa un intervalo de tiempo continuo (Δt) con un inicio, fin, y relaciones padre-hijo.',
      'Un log se escribe en texto plano y un span se envía únicamente por protocolo UDP.'
    ],
    correctIndex: 2,
    explanation: 'Efectivamente. Un Log registra qué ocurrió en un instante t, mientras que un Span mide la duración Δt de una operación distribuida y permite construir árboles de causalidad jerárquica.',
    category: 'Arquitectura de Telemetría'
  },
  {
    id: 3,
    question: '¿Qué mide el Time to First Token (TTFT) y qué indica si este valor es anormalmente alto pero la velocidad posterior de tokens por segundo es excelente?',
    options: [
      'Mide el tiempo de conexión a la base de datos SQL.',
      'Mide el tiempo desde que se envía la petición hasta que se recibe el primer token generado. Un TTFT alto con alta velocidad posterior indica que el cuello de botella está en el pre-procesamiento del prompt (ej. búsqueda vectorial lenta o prompt masivo) o en la cola del proveedor del LLM, no en la generación.',
      'Mide cuántos tokens caben en la caché de la GPU.',
      'Indica que el cliente tiene una mala conexión WiFi únicamente.'
    ],
    correctIndex: 1,
    explanation: 'El TTFT refleja el tiempo de ingesta, enrutamiento, procesamiento del prompt y cola de inferencia. Si el TTFT es alto, optimizar la cantidad de tokens de salida no resolverá el problema: el retraso ocurrió antes de que empezara a escribir.',
    category: 'Métricas y KPIs'
  },
  {
    id: 4,
    question: '¿Qué fenómeno destructivo ocurre cuando un agente ReAct atrapado en un bucle sigue reintentando una llamada a herramienta fallida sin un Circuit Breaker?',
    options: [
      'El modelo olvida automáticamente sus instrucciones para ahorrar memoria.',
      'Deriva de Contexto (Context Drift) y Explosión de Costos: el historial se llena de mensajes de error repetidos, sepultando el objetivo inicial del usuario y consumiendo tokens de forma cuadrática/exponencial.',
      'El servidor API bloquea para siempre la dirección IP del usuario.',
      'El modelo reduce automáticamente su temperatura a 0.0.'
    ],
    correctIndex: 1,
    explanation: 'En cada iteración del bucle, la conversación acumula el error anterior. Esto no solo triplica la factura por enviar prompts gigantescos en cada paso, sino que degrada la atención del modelo (Lost in the Middle), haciéndolo cada vez menos capaz de recuperarse.',
    category: 'Patrones de Fallo'
  },
  {
    id: 5,
    question: 'Si tu organización ya utiliza Grafana y Datadog para monitorear microservicios en Kubernetes y busca incorporar observabilidad de agentes de IA con gobernanza y sin vendor lock-in, ¿cuál es la estrategia más recomendada?',
    options: [
      'Eliminar Datadog y migrar toda la empresa a un producto cerrado.',
      'Adoptar el estándar abierto OpenTelemetry con instrumentación semántica OpenInference, canalizando las trazas hacia la infraestructura existente.',
      'No registrar ninguna traza para no sobrecargar el almacenamiento.',
      'Usar únicamente impresiones por consola con `console.log` en el backend.'
    ],
    correctIndex: 1,
    explanation: 'OpenTelemetry + OpenInference es el estándar neutral de la Cloud Native Computing Foundation (CNCF). Permite capturar llamadas a LLMs, embeddings y herramientas usando la misma tubería de datos y dashboards corporativos que el resto de los microservicios.',
    category: 'Ecosistema y Decisión'
  }
];
