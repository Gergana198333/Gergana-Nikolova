/**
 * Example: Basic Chatbot Usage
 * 
 * This example demonstrates how to use the chatbot assistant for
 * basic conversational interactions.
 */

import { AIAutomationApp } from '../src/index';

async function basicChatbotExample(): Promise<void> {
  console.log('=== Basic Chatbot Example ===\n');

  // Initialize the application
  const app = new AIAutomationApp();
  const chatbot = app.getChatbot();

  // Start a conversation
  const conversationId = 'example-conversation-1';
  chatbot.startConversation(conversationId);
  console.log('✓ Conversation started\n');

  // Example 1: Greeting
  console.log('User: Hello, can you help me?');
  const response1 = await chatbot.sendMessage(
    conversationId,
    'Hello, can you help me?'
  );
  console.log('Bot:', response1);
  console.log();

  // Example 2: Ask for help
  console.log('User: I need help with email drafting');
  const response2 = await chatbot.sendMessage(
    conversationId,
    'I need help with email drafting'
  );
  console.log('Bot:', response2);
  console.log();

  // Example 3: Data analysis request
  console.log('User: Can you analyze sales data?');
  const response3 = await chatbot.sendMessage(
    conversationId,
    'Can you analyze sales data?'
  );
  console.log('Bot:', response3);
  console.log();

  // Get conversation history
  const history = chatbot.getConversationHistory(conversationId);
  console.log(`\n✓ Conversation has ${history.length} messages`);

  // Export conversation (GDPR compliance)
  const exportedData = chatbot.exportConversationData(conversationId);
  console.log('✓ Conversation data exported for GDPR compliance');
  console.log(`  - Messages: ${exportedData?.messages.length}`);
  console.log(`  - Started: ${exportedData?.metadata?.startedAt}`);

  // End conversation
  chatbot.endConversation(conversationId);
  console.log('\n✓ Conversation ended gracefully\n');
}

// Run the example
if (require.main === module) {
  basicChatbotExample().catch(error => {
    console.error('Error running example:', error);
    process.exit(1);
  });
}

export { basicChatbotExample };
