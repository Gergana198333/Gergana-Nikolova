/**
 * Utility functions for AI automation workflows
 */

import { Conversation } from '../types';

/**
 * Generates a unique identifier
 * @returns A unique ID string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Formats a date to ISO string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Validates an email address
 * @param email - Email to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncates text to a maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Sanitizes user input to prevent injection attacks
 * @param input - User input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Anonymizes sensitive data for GDPR compliance
 * @param data - Data to anonymize
 * @returns Anonymized data
 */
export function anonymizeData(data: string): string {
  // Replace email addresses with anonymized version
  let anonymized = data.replace(/([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '***@***.***');
  
  // Replace phone numbers
  anonymized = anonymized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '***-***-****');
  
  // Replace potential credit card numbers
  anonymized = anonymized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '****-****-****-****');
  
  return anonymized;
}

/**
 * Calculates token count estimate (simple approximation)
 * @param text - Text to count tokens for
 * @returns Estimated token count
 */
export function estimateTokenCount(text: string): number {
  // Rough estimation: ~4 characters per token on average
  return Math.ceil(text.length / 4);
}

/**
 * Formats a conversation for display
 * @param conversation - Conversation to format
 * @returns Formatted conversation string
 */
export function formatConversation(conversation: Conversation): string {
  let formatted = `Conversation ID: ${conversation.id}\n`;
  formatted += `Created: ${formatDate(conversation.createdAt)}\n\n`;
  
  conversation.messages.forEach((message) => {
    formatted += `[${message.role.toUpperCase()}] ${formatDate(message.timestamp)}\n`;
    formatted += `${message.content}\n\n`;
  });
  
  return formatted;
}

/**
 * Rate limiter helper class
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequestsPerMinute: number;

  constructor(maxRequestsPerMinute: number) {
    this.maxRequestsPerMinute = maxRequestsPerMinute;
  }

  /**
   * Checks if a request can be made
   * @returns True if allowed, false if rate limited
   */
  canMakeRequest(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Remove requests older than 1 minute
    this.requests = this.requests.filter(time => time > oneMinuteAgo);
    
    if (this.requests.length < this.maxRequestsPerMinute) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }

  /**
   * Gets the time until next request is allowed
   * @returns Milliseconds until next request
   */
  getTimeUntilNextRequest(): number {
    if (this.requests.length < this.maxRequestsPerMinute) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const nextAllowedTime = oldestRequest + 60000;
    return Math.max(0, nextAllowedTime - Date.now());
  }
}

/**
 * Logger utility with privacy considerations
 */
export class Logger {
  private enableLogging: boolean;
  private gdprCompliance: boolean;

  constructor(enableLogging = true, gdprCompliance = true) {
    this.enableLogging = enableLogging;
    this.gdprCompliance = gdprCompliance;
  }

  /**
   * Logs an informational message
   * @param message - Message to log
   */
  info(message: string): void {
    if (!this.enableLogging) return;
    const logMessage = this.gdprCompliance ? anonymizeData(message) : message;
    console.log(`[INFO] ${formatDate(new Date())}: ${logMessage}`);
  }

  /**
   * Logs an error message
   * @param message - Error message to log
   */
  error(message: string): void {
    if (!this.enableLogging) return;
    const logMessage = this.gdprCompliance ? anonymizeData(message) : message;
    console.error(`[ERROR] ${formatDate(new Date())}: ${logMessage}`);
  }

  /**
   * Logs a warning message
   * @param message - Warning message to log
   */
  warn(message: string): void {
    if (!this.enableLogging) return;
    const logMessage = this.gdprCompliance ? anonymizeData(message) : message;
    console.warn(`[WARN] ${formatDate(new Date())}: ${logMessage}`);
  }
}
