export type ModuleId = 
  | 'que-es-observabilidad'
  | 'fallo-en-silencio'
  | 'tres-pilares'
  | 'logs-json'
  | 'metricas-kpis'
  | 'trazas-spans'
  | 'ecosistema-herramientas'
  | 'caso-integrador'
  | 'autoevaluacion-lab';

export interface ModuleInfo {
  id: ModuleId;
  number: number;
  title: string;
  shortTitle: string;
  tagline: string;
  estimatedMinutes: number;
  pillarBadge?: string;
  summary: string;
}

export interface JsonFieldExplanation {
  field: string;
  type: string;
  importance: 'Crítico' | 'Recomendado' | 'Opcional';
  description: string;
  filterExample: string;
  impactIfMissing: string;
}

export interface SpanNode {
  id: string;
  name: string;
  component: string;
  type: 'root' | 'llm' | 'retrieval' | 'tool' | 'synthesis';
  startTimeMs: number;
  durationMs: number;
  status: 'ok' | 'warning' | 'error';
  isBottleneck?: boolean;
  tokens?: { input: number; output: number };
  costUsd?: number;
  attributes: Record<string, string | number | boolean>;
  children?: SpanNode[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface ToolOption {
  id: string;
  name: string;
  category: 'LLM-Native' | 'APM Tradicional' | 'Open Source / Open Standard';
  license: 'Open Source' | 'Comercial SaaS' | 'Híbrido';
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
  pricingNote: string;
  website: string;
}
