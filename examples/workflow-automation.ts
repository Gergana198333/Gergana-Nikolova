/**
 * Example: Workflow Automation
 * 
 * This example demonstrates how to use the workflow engine
 * for automated business processes.
 */

import { AIAutomationApp } from '../src/index';

async function workflowExample(): Promise<void> {
  console.log('=== Workflow Automation Example ===\n');

  const app = new AIAutomationApp();
  const workflowEngine = app.getWorkflowEngine();

  // Example 1: Customer Onboarding Workflow
  console.log('--- Example 1: Customer Onboarding ---');
  const onboardingResult = await workflowEngine.executeWorkflow(
    'customer-onboarding',
    {
      email: 'newcustomer@example.com',
      name: 'John Doe',
      company: 'Startup Inc',
      phone: '+1-555-0123'
    }
  );

  console.log('Workflow Status:', onboardingResult.success ? '✓ Success' : '✗ Failed');
  if (onboardingResult.error) {
    console.log('Error:', onboardingResult.error);
  }
  if (onboardingResult.metadata) {
    console.log('Steps completed:', (onboardingResult.metadata.stepResults as unknown[]).length);
  }
  console.log();

  // Example 2: Support Ticket Workflow
  console.log('--- Example 2: Support Ticket Processing ---');
  const ticketResult = await workflowEngine.executeWorkflow(
    'support-ticket',
    {
      ticketId: 'TICKET-12345',
      subject: 'Unable to access dashboard',
      priority: 'high',
      customer: 'customer@example.com',
      description: 'Getting error 500 when trying to access the analytics dashboard'
    }
  );

  console.log('Workflow Status:', ticketResult.success ? '✓ Success' : '✗ Failed');
  if (ticketResult.error) {
    console.log('Error:', ticketResult.error);
  }
  console.log();

  // Example 3: Data Analysis Workflow
  console.log('--- Example 3: Business Data Analysis ---');
  const analysisResult = await workflowEngine.executeWorkflow(
    'data-analysis',
    {
      reportType: 'monthly_sales',
      period: '2024-01',
      metrics: {
        revenue: 150000,
        newCustomers: 45,
        churnRate: 2.5,
        avgOrderValue: 3333
      }
    }
  );

  console.log('Workflow Status:', analysisResult.success ? '✓ Success' : '✗ Failed');
  if (analysisResult.data) {
    console.log('Analysis completed at:', (analysisResult.data as Record<string, unknown>).transformedAt);
  }
  console.log();

  // Example 4: Custom Workflow Registration
  console.log('--- Example 4: Custom Workflow ---');
  workflowEngine.registerWorkflow({
    id: 'invoice-processing',
    name: 'Invoice Processing',
    description: 'Automated invoice validation and approval',
    enabled: true,
    steps: [
      {
        id: 'validate-invoice',
        type: 'validate',
        config: { rules: ['required_fields', 'amount_check'] }
      },
      {
        id: 'check-approval',
        type: 'action',
        config: { action: 'check_approval_limit' }
      },
      {
        id: 'send-notification',
        type: 'prompt',
        config: { templateId: 'email-draft', stage: 'approval_request' }
      }
    ]
  });
  console.log('✓ Custom workflow registered');

  const customResult = await workflowEngine.executeWorkflow(
    'invoice-processing',
    {
      invoiceNumber: 'INV-2024-001',
      amount: 5000,
      vendor: 'Supplier Co',
      email: 'accounts@supplier.com',
      name: 'Accounts Payable'
    }
  );
  console.log('Custom Workflow Status:', customResult.success ? '✓ Success' : '✗ Failed');
  console.log();

  // Example 5: Workflow Management
  console.log('--- Example 5: Workflow Management ---');
  const allWorkflows = workflowEngine.getAllWorkflows();
  console.log(`Total workflows: ${allWorkflows.length}\n`);

  allWorkflows.forEach(workflow => {
    console.log(`${workflow.name}:`);
    console.log(`  - ID: ${workflow.id}`);
    console.log(`  - Enabled: ${workflow.enabled ? 'Yes' : 'No'}`);
    console.log(`  - Steps: ${workflow.steps.length}`);
    console.log();
  });

  // Disable a workflow
  console.log('Disabling support-ticket workflow...');
  workflowEngine.setWorkflowEnabled('support-ticket', false);
  const disabledWorkflow = workflowEngine.getWorkflow('support-ticket');
  console.log(`✓ Workflow enabled status: ${disabledWorkflow?.enabled}`);
}

// Run the example
if (require.main === module) {
  workflowExample().catch(error => {
    console.error('Error running example:', error);
    process.exit(1);
  });
}

export { workflowExample };
