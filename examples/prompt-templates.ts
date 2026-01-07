/**
 * Example: Using Prompt Templates
 * 
 * This example shows how to use the configurable prompt system
 * for different business scenarios.
 */

import { AIAutomationApp } from '../src/index';

async function promptTemplatesExample(): Promise<void> {
  console.log('=== Prompt Templates Example ===\n');

  const app = new AIAutomationApp();
  const promptManager = app.getPromptManager();
  const chatbot = app.getChatbot();

  // Example 1: Customer Support Prompt
  console.log('--- Example 1: Customer Support ---');
  const supportPrompt = promptManager.renderPrompt('customer-support', {
    companyName: 'TechCorp Solutions',
    productService: 'Cloud Platform',
    customerQuestion: 'How do I reset my password?'
  });
  console.log(supportPrompt);
  console.log();

  // Example 2: Email Drafting
  console.log('--- Example 2: Professional Email ---');
  const emailPrompt = promptManager.renderPrompt('email-draft', {
    recipient: 'Jane Smith, VP of Engineering',
    subject: 'Q1 Project Status Update',
    tone: 'professional and concise',
    keyPoints: 'Project ahead of schedule, budget on track, team performing well, next milestone in 2 weeks'
  });
  console.log(emailPrompt);
  console.log();

  // Example 3: Data Analysis
  console.log('--- Example 3: Data Analysis ---');
  const analysisPrompt = promptManager.renderPrompt('data-analysis', {
    dataType: 'Sales metrics',
    data: 'Q4 2023: Revenue $2.5M, Growth +15%, New customers: 450',
    focusArea: 'Growth trends and customer acquisition'
  });
  console.log(analysisPrompt);
  console.log();

  // Example 4: Meeting Summary
  console.log('--- Example 4: Meeting Summarization ---');
  const meetingPrompt = promptManager.renderPrompt('meeting-summary', {
    meetingTitle: 'Sprint Planning - Q1 2024',
    meetingDate: '2024-01-08',
    participants: 'Engineering team, Product Manager, Scrum Master',
    notes: 'Discussed new feature priorities, identified 3 critical bugs, planned capacity for next sprint, agreed on demo date'
  });
  console.log(meetingPrompt);
  console.log();

  // Example 5: Using prompts with chatbot
  console.log('--- Example 5: Prompt + Chatbot Integration ---');
  const conversationId = 'prompt-example-1';
  chatbot.startConversation(conversationId);

  const response = await chatbot.sendTemplatedMessage(
    conversationId,
    'customer-support',
    {
      companyName: 'Acme Inc',
      productService: 'Project Management Software',
      customerQuestion: 'How do I export my data?'
    }
  );
  console.log('Customer Support Response:');
  console.log(response);

  chatbot.endConversation(conversationId);
  console.log('\n✓ Example complete\n');

  // List all available templates
  console.log('--- Available Template Categories ---');
  const categories = promptManager.getCategories();
  categories.forEach(category => {
    const templates = promptManager.getTemplates(category);
    console.log(`\n${category}:`);
    templates.forEach(template => {
      console.log(`  - ${template.name}: ${template.description}`);
    });
  });
}

// Run the example
if (require.main === module) {
  promptTemplatesExample().catch(error => {
    console.error('Error running example:', error);
    process.exit(1);
  });
}

export { promptTemplatesExample };
