/**
 * AI Assistant Example
 * Demonstrates basic usage of the AIAssistant class
 */

import { AIAssistant } from '../ai-assistant';

async function runAIAssistantExample() {
  console.log('=== AI Assistant Example ===\n');

  // Create an AI assistant instance
  const assistant = new AIAssistant({
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: 'You are a helpful AI assistant focused on productivity and automation.',
    enableLogging: true,
  });

  console.log('System Prompt:', assistant.getSystemPrompt());
  console.log('Configuration:', assistant.getConfig());
  console.log('\n--- Starting Conversation ---\n');

  try {
    // Example 1: Greeting
    console.log('User: Hello!');
    const response1 = await assistant.processMessage('Hello!');
    console.log(`Assistant: ${response1.content}`);
    console.log(`Tokens used: ${response1.tokensUsed}\n`);

    // Example 2: Ask about automation
    console.log('User: Tell me about AI automation');
    const response2 = await assistant.processMessage('Tell me about AI automation');
    console.log(`Assistant: ${response2.content}`);
    console.log(`Tokens used: ${response2.tokensUsed}\n`);

    // Example 3: Ask about ethics
    console.log('User: What about AI ethics?');
    const response3 = await assistant.processMessage('What about AI ethics?');
    console.log(`Assistant: ${response3.content}`);
    console.log(`Tokens used: ${response3.tokensUsed}\n`);

    // Show conversation history
    console.log('--- Conversation History ---');
    const history = assistant.getHistory();
    history.forEach((msg, index) => {
      console.log(`${index + 1}. [${msg.role}] ${msg.content}`);
    });

    // Clear history
    console.log('\n--- Clearing History ---');
    assistant.clearHistory();
    console.log('History cleared. Messages:', assistant.getHistory().length);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runAIAssistantExample().catch(console.error);
}

export { runAIAssistantExample };
