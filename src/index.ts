/**
 * Main entry point for AI Automation Workflows
 * Demonstrates usage of chatbot, prompts, and workflows
 */

import { ChatbotAssistant } from './chatbot/ChatbotAssistant';
import { PromptManager } from './prompts/PromptManager';
import { WorkflowEngine } from './workflows/WorkflowEngine';
import { GDPRManager } from './utils/GDPRManager';
import { ConfigLoader } from './utils/ConfigLoader';

/**
 * Main application class
 */
export class AIAutomationApp {
  private promptManager: PromptManager;
  private gdprManager: GDPRManager;
  private chatbot: ChatbotAssistant;
  private workflowEngine: WorkflowEngine;

  constructor() {
    // Validate configuration
    const configValidation = ConfigLoader.validateConfig();
    if (!configValidation.valid) {
      console.warn('Configuration warnings:', configValidation.errors);
    }

    // Initialize components
    this.promptManager = new PromptManager();
    this.gdprManager = new GDPRManager(ConfigLoader.loadGDPRConfig());
    this.chatbot = new ChatbotAssistant(
      ConfigLoader.loadChatbotConfig(),
      this.promptManager,
      this.gdprManager
    );
    this.workflowEngine = new WorkflowEngine(this.promptManager, this.gdprManager);

    console.log('AI Automation Workflows initialized successfully');
  }

  /**
   * Get the chatbot instance
   */
  getChatbot(): ChatbotAssistant {
    return this.chatbot;
  }

  /**
   * Get the prompt manager instance
   */
  getPromptManager(): PromptManager {
    return this.promptManager;
  }

  /**
   * Get the workflow engine instance
   */
  getWorkflowEngine(): WorkflowEngine {
    return this.workflowEngine;
  }

  /**
   * Get the GDPR manager instance
   */
  getGDPRManager(): GDPRManager {
    return this.gdprManager;
  }

  /**
   * Run demo scenarios
   */
  async runDemo(): Promise<void> {
    console.log('\n=== AI Automation Workflows Demo ===\n');

    // Demo 1: Chatbot conversation
    console.log('--- Demo 1: Chatbot Conversation ---');
    await this.demoChat();

    // Demo 2: Prompt templates
    console.log('\n--- Demo 2: Prompt Templates ---');
    this.demoPrompts();

    // Demo 3: Workflow execution
    console.log('\n--- Demo 3: Workflow Execution ---');
    await this.demoWorkflow();

    // Demo 4: GDPR compliance
    console.log('\n--- Demo 4: GDPR Compliance ---');
    this.demoGDPR();

    console.log('\n=== Demo Complete ===\n');
  }

  /**
   * Demo chatbot conversation
   */
  private async demoChat(): Promise<void> {
    const conversationId = 'demo-conversation-1';
    
    this.chatbot.startConversation(conversationId);
    console.log('Started conversation:', conversationId);

    const response1 = await this.chatbot.sendMessage(conversationId, 'Hello!');
    console.log('User: Hello!');
    console.log('Bot:', response1);

    const response2 = await this.chatbot.sendMessage(
      conversationId,
      'I need help drafting an email'
    );
    console.log('\nUser: I need help drafting an email');
    console.log('Bot:', response2);

    // Export conversation (GDPR right to data portability)
    const conversationData = this.chatbot.exportConversationData(conversationId);
    console.log('\nConversation exported for GDPR compliance');
    console.log('Message count:', conversationData?.messages.length);

    this.chatbot.endConversation(conversationId);
    console.log('Conversation ended');
  }

  /**
   * Demo prompt templates
   */
  private demoPrompts(): void {
    // List available templates
    const templates = this.promptManager.getTemplates();
    console.log('Available prompt templates:', templates.length);
    
    templates.forEach(template => {
      console.log(`- ${template.name} (${template.category})`);
    });

    // Render a template
    console.log('\nRendering email draft template:');
    const emailPrompt = this.promptManager.renderPrompt('email-draft', {
      recipient: 'John Smith',
      subject: 'Project Update',
      tone: 'professional',
      keyPoints: 'Project milestone completed, next steps discussed, budget on track'
    });
    console.log(emailPrompt);
  }

  /**
   * Demo workflow execution
   */
  private async demoWorkflow(): Promise<void> {
    const workflows = this.workflowEngine.getAllWorkflows();
    console.log('Available workflows:', workflows.length);
    
    workflows.forEach(workflow => {
      console.log(`- ${workflow.name}: ${workflow.description} (${workflow.steps.length} steps)`);
    });

    // Execute a workflow
    console.log('\nExecuting customer onboarding workflow:');
    const result = await this.workflowEngine.executeWorkflow('customer-onboarding', {
      email: 'customer@example.com',
      name: 'Jane Doe',
      company: 'Acme Corp'
    });

    console.log('Workflow result:', result.success ? 'Success' : 'Failed');
    if (result.error) {
      console.log('Error:', result.error);
    }
    if (result.metadata) {
      console.log('Steps executed:', (result.metadata.stepResults as unknown[]).length);
    }
  }

  /**
   * Demo GDPR compliance features
   */
  private demoGDPR(): void {
    // Get compliance report
    const report = this.gdprManager.getComplianceReport();
    console.log('GDPR Compliance Report:');
    console.log('- Data Retention:', report.config);
    console.log('- Statistics:', report.statistics);
    console.log('- GDPR Principles:', Object.keys(report.gdprPrinciples || {}).join(', '));

    // Validate compliance
    const validation = this.gdprManager.validateCompliance(
      'customer_support',
      ['contact_info', 'support_history'],
      true
    );
    console.log('\nCompliance validation:', validation.compliant ? 'COMPLIANT' : 'NON-COMPLIANT');
    if (validation.issues.length > 0) {
      console.log('Issues:', validation.issues);
    }

    // Demo audit log
    const auditLog = this.gdprManager.getAuditLog();
    console.log('\nAudit log entries:', auditLog.length);
    if (auditLog.length > 0) {
      console.log('Recent actions:', 
        auditLog.slice(-3).map(entry => entry.action).join(', ')
      );
    }
  }
}

/**
 * Export main components for use in other modules
 */
export {
  ChatbotAssistant,
  PromptManager,
  WorkflowEngine,
  GDPRManager,
  ConfigLoader
};

export * from './types';

/**
 * Run demo if this is the main module
 */
if (require.main === module) {
  const app = new AIAutomationApp();
  app.runDemo().catch(error => {
    console.error('Demo failed:', error);
    process.exit(1);
  });
}
