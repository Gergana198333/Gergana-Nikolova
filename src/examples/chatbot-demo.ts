/**
 * Chatbot Workflow Example
 * Demonstrates the complete chatbot workflow with conversation management
 */

import { Chatbot } from '../chatbot';
import { formatConversation } from '../utils';

async function runChatbotExample() {
  console.log('=== Chatbot Workflow Example ===\n');

  // Create a chatbot instance
  const chatbot = new Chatbot({
    name: 'CustomerSupportBot',
    description: 'A helpful customer support chatbot',
    persona: 'You are a friendly and professional customer support representative with expertise in troubleshooting and problem-solving.',
    model: 'gpt-3.5-turbo',
    maxTokens: 1500,
    temperature: 0.8,
    maxHistoryLength: 10,
    enableLogging: true,
  });

  console.log('Chatbot Name:', chatbot.getName());
  console.log('Description:', chatbot.getDescription());
  console.log('\n--- Starting Conversation ---\n');

  try {
    // Start a new conversation
    const conversationId = chatbot.startConversation('user-123');
    console.log(`Conversation started: ${conversationId}\n`);

    // Send messages in the conversation
    console.log('User: Hi, I need help with my account');
    let response = await chatbot.sendMessage('Hi, I need help with my account');
    console.log(`Bot: ${response}\n`);

    console.log('User: I forgot my password');
    response = await chatbot.sendMessage('I forgot my password');
    console.log(`Bot: ${response}\n`);

    console.log('User: How do I reset it?');
    response = await chatbot.sendMessage('How do I reset it?');
    console.log(`Bot: ${response}\n`);

    // Get current conversation
    const conversation = chatbot.getCurrentConversation();
    if (conversation) {
      console.log('--- Conversation Summary ---');
      console.log(`Total messages: ${conversation.messages.length}`);
      console.log(`Created: ${conversation.createdAt.toISOString()}`);
      console.log(`Updated: ${conversation.updatedAt.toISOString()}`);
      console.log();

      // Format and display full conversation
      console.log('--- Full Conversation ---');
      console.log(formatConversation(conversation));
    }

    // Start a second conversation
    console.log('--- Starting Second Conversation ---\n');
    const conversationId2 = chatbot.startConversation('user-456');
    console.log(`New conversation started: ${conversationId2}\n`);

    console.log('User: Hello, what can you help me with?');
    response = await chatbot.sendMessage('Hello, what can you help me with?');
    console.log(`Bot: ${response}\n`);

    // List all conversations
    console.log('--- All Conversations ---');
    const allConversations = chatbot.getAllConversations();
    console.log(`Total conversations: ${allConversations.length}`);
    allConversations.forEach((conv, index) => {
      console.log(`${index + 1}. ID: ${conv.id}, Messages: ${conv.messages.length}`);
    });

    // Switch back to first conversation
    console.log('\n--- Switching Back to First Conversation ---');
    chatbot.switchConversation(conversationId);
    console.log(`Switched to conversation: ${conversationId}\n`);

    console.log('User: Thank you for your help!');
    response = await chatbot.sendMessage('Thank you for your help!');
    console.log(`Bot: ${response}\n`);

    // End conversations
    console.log('--- Ending Conversations ---');
    chatbot.endConversation(conversationId);
    console.log(`Conversation ${conversationId} ended`);
    chatbot.endConversation(conversationId2);
    console.log(`Conversation ${conversationId2} ended`);

    console.log('\nRemaining conversations:', chatbot.getAllConversations().length);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runChatbotExample().catch(console.error);
}

export { runChatbotExample };
