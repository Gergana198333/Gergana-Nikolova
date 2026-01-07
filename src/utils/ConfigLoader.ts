/**
 * Configuration loader utility
 */

import * as dotenv from 'dotenv';
import { AIConfig, GDPRConfig, ChatbotConfig } from '../types';

// Load environment variables
dotenv.config();

export class ConfigLoader {
  /**
   * Load AI configuration
   */
  static loadAIConfig(): AIConfig {
    return {
      apiKey: process.env.AI_API_KEY,
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.AI_MAX_TOKENS || '500', 10)
    };
  }

  /**
   * Load GDPR configuration
   */
  static loadGDPRConfig(): GDPRConfig {
    return {
      dataRetentionDays: parseInt(process.env.DATA_RETENTION_DAYS || '30', 10),
      enableAuditLog: process.env.ENABLE_AUDIT_LOG === 'true',
      anonymizeLogs: process.env.ANONYMIZE_LOGS === 'true',
      allowDataExport: process.env.ALLOW_DATA_EXPORT === 'true' || 
                       process.env.ALLOW_DATA_EXPORT === undefined
    };
  }

  /**
   * Load chatbot configuration
   */
  static loadChatbotConfig(): ChatbotConfig {
    return {
      name: process.env.CHATBOT_NAME || 'Business Assistant',
      language: process.env.CHATBOT_LANGUAGE || 'en',
      maxConversationHistory: parseInt(process.env.MAX_CONVERSATION_HISTORY || '10', 10),
      systemPrompt: process.env.CHATBOT_SYSTEM_PROMPT
    };
  }

  /**
   * Validate configuration
   */
  static validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check critical environment variables
    if (!process.env.AI_API_KEY && process.env.NODE_ENV === 'production') {
      errors.push('AI_API_KEY is required in production');
    }

    const retentionDays = parseInt(process.env.DATA_RETENTION_DAYS || '30', 10);
    if (retentionDays < 1 || retentionDays > 365) {
      errors.push('DATA_RETENTION_DAYS must be between 1 and 365');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
