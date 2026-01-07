/**
 * Simple AI Chatbot Assistant
 * Provides conversational interface for business workflows
 * 
 * Note: This is a mock implementation showing the structure.
 * In production, integrate with actual AI APIs (OpenAI, Anthropic, etc.)
 */

import { Message, ConversationContext, ChatbotConfig } from '../types';
import { PromptManager } from '../prompts/PromptManager';
import { GDPRManager } from '../utils/GDPRManager';

export class ChatbotAssistant {
  private config: ChatbotConfig;
  private promptManager: PromptManager;
  private gdprManager: GDPRManager;
  private conversations: Map<string, ConversationContext>;

  constructor(
    config: ChatbotConfig,
    promptManager: PromptManager,
    gdprManager: GDPRManager
  ) {
    this.config = config;
    this.promptManager = promptManager;
    this.gdprManager = gdprManager;
    this.conversations = new Map();
  }

  /**
   * Start a new conversation
   */
  startConversation(conversationId: string, systemPrompt?: string): void {
    const context: ConversationContext = {
      conversationId,
      messages: [],
      metadata: {
        startedAt: new Date(),
        language: this.config.language
      }
    };

    // Add system message
    const systemMessage: Message = {
      role: 'system',
      content: systemPrompt || this.getDefaultSystemPrompt(),
      timestamp: new Date()
    };

    context.messages.push(systemMessage);
    this.conversations.set(conversationId, context);

    // Log for GDPR compliance
    this.gdprManager.logAction('conversation_started', {
      conversationId,
      timestamp: new Date()
    });
  }

  /**
   * Send a message and get a response
   */
  async sendMessage(
    conversationId: string,
    userMessage: string
  ): Promise<string> {
    const context = this.conversations.get(conversationId);
    if (!context) {
      throw new Error('Conversation not found. Please start a conversation first.');
    }

    // Add user message
    const message: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    context.messages.push(message);

    // Maintain conversation history limit (GDPR: data minimization)
    this.enforceHistoryLimit(context);

    // Generate AI response (mock implementation)
    const aiResponse = await this.generateResponse(context);

    // Add assistant message
    const assistantMessage: Message = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    context.messages.push(assistantMessage);

    // Log interaction (anonymized if configured)
    this.gdprManager.logAction('message_exchanged', {
      conversationId: this.gdprManager.anonymizeIfEnabled(conversationId),
      messageLength: userMessage.length,
      timestamp: new Date()
    });

    return aiResponse;
  }

  /**
   * Generate AI response (mock implementation)
   * In production, this would call actual AI APIs
   */
  private async generateResponse(context: ConversationContext): Promise<string> {
    // This is a mock implementation demonstrating the structure
    // In production, you would integrate with OpenAI, Anthropic, or similar
    
    const lastMessage = context.messages[context.messages.length - 1];
    const userInput = lastMessage.content.toLowerCase();

    // Simple rule-based responses for demonstration
    if (userInput.includes('hello') || userInput.includes('hi')) {
      return `Hello! I'm ${this.config.name}, your business automation assistant. How can I help you today?`;
    }

    if (userInput.includes('help')) {
      return `I can assist you with:
- Customer support inquiries
- Email drafting
- Data analysis
- Meeting summaries
- Content review

What would you like help with?`;
    }

    if (userInput.includes('email')) {
      return `I can help you draft a professional email. Please provide:
1. Recipient name
2. Subject
3. Key points you want to include
4. Desired tone (formal, friendly, etc.)`;
    }

    if (userInput.includes('analyze') || userInput.includes('data')) {
      return `I can help analyze your business data. Please share:
1. Type of data (sales, customer feedback, metrics, etc.)
2. The data or a summary
3. What specific insights you're looking for`;
    }

    // Default response
    return `I understand you said: "${lastMessage.content}". I'm here to help with business automation tasks. Could you provide more details about what you need?`;
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId: string): Message[] {
    const context = this.conversations.get(conversationId);
    if (!context) {
      return [];
    }
    // Don't include system messages in user-facing history
    return context.messages.filter(m => m.role !== 'system');
  }

  /**
   * End conversation and clean up (GDPR compliance)
   */
  endConversation(conversationId: string): void {
    const context = this.conversations.get(conversationId);
    if (context) {
      this.gdprManager.logAction('conversation_ended', {
        conversationId: this.gdprManager.anonymizeIfEnabled(conversationId),
        messageCount: context.messages.length,
        duration: Date.now() - (context.metadata?.startedAt as Date).getTime()
      });
    }
    this.conversations.delete(conversationId);
  }

  /**
   * Export conversation data (GDPR right to data portability)
   */
  exportConversationData(conversationId: string): ConversationContext | null {
    return this.conversations.get(conversationId) || null;
  }

  /**
   * Delete all user data (GDPR right to erasure)
   */
  deleteConversation(conversationId: string): boolean {
    this.gdprManager.logAction('conversation_deleted', {
      conversationId: this.gdprManager.anonymizeIfEnabled(conversationId),
      timestamp: new Date()
    });
    return this.conversations.delete(conversationId);
  }

  /**
   * Get default system prompt
   */
  private getDefaultSystemPrompt(): string {
    return `You are ${this.config.name}, a professional business automation assistant.
You help users with various business workflows including customer support, email drafting, 
data analysis, and meeting summaries. Always be helpful, professional, and concise.
Respect user privacy and handle all data according to GDPR principles.`;
  }

  /**
   * Enforce conversation history limit (GDPR: data minimization)
   */
  private enforceHistoryLimit(context: ConversationContext): void {
    const maxMessages = this.config.maxConversationHistory;
    const systemMessages = context.messages.filter(m => m.role === 'system');
    const otherMessages = context.messages.filter(m => m.role !== 'system');

    if (otherMessages.length > maxMessages) {
      // Keep system messages and last N messages
      context.messages = [
        ...systemMessages,
        ...otherMessages.slice(-maxMessages)
      ];
    }
  }

  /**
   * Use a prompt template in conversation
   */
  async sendTemplatedMessage(
    conversationId: string,
    templateId: string,
    variables: Record<string, string>
  ): Promise<string> {
    const prompt = this.promptManager.renderPrompt(templateId, variables);
    return this.sendMessage(conversationId, prompt);
  }
}
