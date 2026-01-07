/**
 * Utilities Example
 * Demonstrates the utility functions available in the project
 */

import {
  generateId,
  formatDate,
  isValidEmail,
  truncateText,
  sanitizeInput,
  anonymizeData,
  estimateTokenCount,
  RateLimiter,
  Logger,
} from '../utils';

function runUtilitiesExample() {
  console.log('=== Utilities Example ===\n');

  // ID Generation
  console.log('--- ID Generation ---');
  console.log('Generated ID:', generateId());
  console.log('Another ID:', generateId());
  console.log();

  // Date Formatting
  console.log('--- Date Formatting ---');
  console.log('Formatted date:', formatDate(new Date()));
  console.log();

  // Email Validation
  console.log('--- Email Validation ---');
  console.log('Valid email (test@example.com):', isValidEmail('test@example.com'));
  console.log('Invalid email (not-an-email):', isValidEmail('not-an-email'));
  console.log();

  // Text Truncation
  console.log('--- Text Truncation ---');
  const longText = 'This is a very long text that needs to be truncated for display purposes';
  console.log('Original:', longText);
  console.log('Truncated (30 chars):', truncateText(longText, 30));
  console.log();

  // Input Sanitization
  console.log('--- Input Sanitization ---');
  const unsafeInput = '<script>alert("XSS")</script>Hello World';
  console.log('Unsafe input:', unsafeInput);
  console.log('Sanitized:', sanitizeInput(unsafeInput));
  console.log();

  // Data Anonymization (GDPR)
  console.log('--- Data Anonymization (GDPR Compliance) ---');
  const sensitiveData = 'Contact me at john.doe@example.com or call 555-123-4567';
  console.log('Original data:', sensitiveData);
  console.log('Anonymized:', anonymizeData(sensitiveData));
  console.log();

  // Token Estimation
  console.log('--- Token Count Estimation ---');
  const text = 'This is a sample text for token counting estimation';
  console.log('Text:', text);
  console.log('Estimated tokens:', estimateTokenCount(text));
  console.log();

  // Rate Limiting
  console.log('--- Rate Limiting ---');
  const rateLimiter = new RateLimiter(5); // 5 requests per minute
  console.log('Max requests per minute: 5');
  
  for (let i = 1; i <= 7; i++) {
    const canMakeRequest = rateLimiter.canMakeRequest();
    console.log(`Request ${i}: ${canMakeRequest ? 'Allowed' : 'Rate limited'}`);
    
    if (!canMakeRequest) {
      const waitTime = rateLimiter.getTimeUntilNextRequest();
      console.log(`  Wait ${Math.ceil(waitTime / 1000)} seconds until next request`);
    }
  }
  console.log();

  // Logger
  console.log('--- Logger with GDPR Compliance ---');
  const logger = new Logger(true, true);
  
  logger.info('This is an info message');
  logger.warn('This is a warning message');
  logger.error('This is an error message');
  
  console.log('\nLogger with sensitive data:');
  logger.info('User email is john.doe@example.com');
  console.log('(Notice email is anonymized in the log)');
  console.log();

  console.log('--- Logger without GDPR Compliance ---');
  const nonCompliantLogger = new Logger(true, false);
  nonCompliantLogger.info('User email is john.doe@example.com');
  console.log('(Notice email is NOT anonymized)');
}

// Run the example if this file is executed directly
if (require.main === module) {
  runUtilitiesExample();
}

export { runUtilitiesExample };
