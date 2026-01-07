/**
 * Type definitions for the AI automation workflows system
 */

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ConversationContext {
  conversationId: string;
  messages: Message[];
  metadata?: Record<string, unknown>;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category?: string;
}

export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  enabled: boolean;
}

export interface WorkflowStep {
  id: string;
  type: 'prompt' | 'transform' | 'validate' | 'action';
  config: Record<string, unknown>;
}

export interface AIConfig {
  apiKey?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GDPRConfig {
  dataRetentionDays: number;
  enableAuditLog: boolean;
  anonymizeLogs: boolean;
  allowDataExport: boolean;
}

export interface ChatbotConfig {
  name: string;
  language: string;
  maxConversationHistory: number;
  systemPrompt?: string;
}

export interface WorkflowResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogEntry {
  timestamp: Date;
  action: string;
  userId?: string;
  dataProcessed?: boolean;
  gdprCompliant: boolean;
  details?: Record<string, unknown>;
}
