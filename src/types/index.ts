/**
 * Type definitions for AI Automation Workflows
 */

/**
 * Message structure for chatbot conversations
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Conversation history structure
 */
export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

/**
 * AI Assistant configuration
 */
export interface AIAssistantConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  enableLogging?: boolean;
}

/**
 * Chatbot workflow configuration
 */
export interface ChatbotConfig extends AIAssistantConfig {
  name: string;
  description?: string;
  persona?: string;
  maxHistoryLength?: number;
}

/**
 * AI response structure
 */
export interface AIResponse {
  content: string;
  tokensUsed?: number;
  model?: string;
  finishReason?: string;
}

/**
 * Privacy and compliance settings
 */
export interface PrivacySettings {
  enableDataLogging: boolean;
  gdprCompliance: boolean;
  dataRetentionDays: number;
  anonymizeData: boolean;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxTokensPerRequest: number;
}
