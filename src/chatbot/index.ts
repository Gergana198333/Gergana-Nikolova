/**
 * Chatbot Workflow Module
 * Provides a complete chatbot workflow with conversation management
 */

import { ChatbotConfig, Conversation, Message } from '../types';
import { AIAssistant } from '../ai-assistant';
import { Logger, generateId, sanitizeInput } from '../utils';

/**
 * Chatbot class with full workflow support
 */
export class Chatbot {
  private assistant: AIAssistant;
  private config: ChatbotConfig;
  private conversations: Map<string, Conversation> = new Map();
  private logger: Logger;
  private currentConversationId: string | null = null;

  constructor(config: ChatbotConfig) {
    this.config = {
      ...config,
      maxHistoryLength: config.maxHistoryLength || 20,
    };

    // Initialize AI assistant with chatbot config
    this.assistant = new AIAssistant({
      model: config.model,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      systemPrompt: this.buildSystemPrompt(),
      enableLogging: config.enableLogging,
    });

    this.logger = new Logger(config.enableLogging !== false, true);
    this.logger.info(`Chatbot "${config.name}" initialized`);
  }

  /**
   * Builds the system prompt based on chatbot configuration
   * @returns System prompt string
   */
  private buildSystemPrompt(): string {
    let prompt = this.config.systemPrompt || 'You are a helpful AI assistant.';
    
    if (this.config.persona) {
      prompt += `\n\nPersona: ${this.config.persona}`;
    }
    
    if (this.config.description) {
      prompt += `\n\nDescription: ${this.config.description}`;
    }

    prompt += '\n\nImportant: Follow ethical AI principles, respect user privacy, and provide helpful, accurate information.';
    
    return prompt;
  }

  /**
   * Start a new conversation
   * @param userId - Optional user identifier
   * @returns Conversation ID
   */
  startConversation(userId?: string): string {
    const conversationId = generateId();
    const conversation: Conversation = {
      id: conversationId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    };

    this.conversations.set(conversationId, conversation);
    this.currentConversationId = conversationId;
    this.assistant.clearHistory();

    this.logger.info(`New conversation started: ${conversationId}`);
    return conversationId;
  }

  /**
   * Send a message in the current or specified conversation
   * @param message - User message
   * @param conversationId - Optional conversation ID (uses current if not specified)
   * @returns Assistant response
   */
  async sendMessage(message: string, conversationId?: string): Promise<string> {
    const convId = conversationId || this.currentConversationId;
    
    if (!convId) {
      throw new Error('No active conversation. Please start a conversation first.');
    }

    const conversation = this.conversations.get(convId);
    if (!conversation) {
      throw new Error(`Conversation ${convId} not found`);
    }

    // Sanitize user input
    const sanitizedMessage = sanitizeInput(message);
    
    if (!sanitizedMessage.trim()) {
      throw new Error('Message cannot be empty');
    }

    // Add user message to conversation
    const userMessage: Message = {
      role: 'user',
      content: sanitizedMessage,
      timestamp: new Date(),
    };
    conversation.messages.push(userMessage);

    // Process message through AI assistant
    const response = await this.assistant.processMessage(sanitizedMessage);

    // Add assistant response to conversation
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      metadata: {
        tokensUsed: response.tokensUsed,
        model: response.model,
      },
    };
    conversation.messages.push(assistantMessage);

    // Update conversation timestamp
    conversation.updatedAt = new Date();

    // Trim conversation history if needed
    this.trimConversationHistory(conversation);

    this.logger.info(`Message processed in conversation ${convId}`);
    
    return response.content;
  }

  /**
   * Trim conversation history to maintain max length
   * @param conversation - Conversation to trim
   */
  private trimConversationHistory(conversation: Conversation): void {
    if (conversation.messages.length > this.config.maxHistoryLength!) {
      const toRemove = conversation.messages.length - this.config.maxHistoryLength!;
      conversation.messages.splice(0, toRemove);
      this.logger.info(`Trimmed ${toRemove} old messages from conversation ${conversation.id}`);
    }
  }

  /**
   * Get conversation by ID
   * @param conversationId - Conversation ID
   * @returns Conversation object or undefined
   */
  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  /**
   * Get current conversation
   * @returns Current conversation or undefined
   */
  getCurrentConversation(): Conversation | undefined {
    return this.currentConversationId 
      ? this.conversations.get(this.currentConversationId) 
      : undefined;
  }

  /**
   * Switch to a different conversation
   * @param conversationId - Conversation ID to switch to
   */
  switchConversation(conversationId: string): void {
    if (!this.conversations.has(conversationId)) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    this.currentConversationId = conversationId;
    this.logger.info(`Switched to conversation ${conversationId}`);
  }

  /**
   * End and archive a conversation
   * @param conversationId - Conversation ID to end
   */
  endConversation(conversationId?: string): void {
    const convId = conversationId || this.currentConversationId;
    
    if (!convId) {
      throw new Error('No conversation to end');
    }

    // In a production system, you might want to save this to a database
    this.conversations.delete(convId);
    
    if (this.currentConversationId === convId) {
      this.currentConversationId = null;
      this.assistant.clearHistory();
    }

    this.logger.info(`Conversation ${convId} ended`);
  }

  /**
   * Get all conversations
   * @returns Array of all conversations
   */
  getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values());
  }

  /**
   * Get chatbot name
   * @returns Chatbot name
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * Get chatbot description
   * @returns Chatbot description
   */
  getDescription(): string | undefined {
    return this.config.description;
  }
}
