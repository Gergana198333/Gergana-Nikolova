# Examples

This directory contains practical examples demonstrating how to use the AI Automation Workflows project.

## Available Examples

### 1. Basic Chatbot (`chatbot-basic.ts`)

Demonstrates basic chatbot usage:
- Starting and ending conversations
- Sending messages
- Getting conversation history
- Exporting conversation data (GDPR)

**Run:**
```bash
npm run dev examples/chatbot-basic.ts
```

### 2. Prompt Templates (`prompt-templates.ts`)

Shows how to use configurable prompt templates:
- Customer support prompts
- Email drafting
- Data analysis
- Meeting summarization
- Integration with chatbot

**Run:**
```bash
npm run dev examples/prompt-templates.ts
```

### 3. Workflow Automation (`workflow-automation.ts`)

Demonstrates workflow engine capabilities:
- Executing built-in workflows
- Creating custom workflows
- Managing workflow state
- Multi-step process automation

**Run:**
```bash
npm run dev examples/workflow-automation.ts
```

### 4. GDPR Compliance (`gdpr-compliance.ts`)

Showcases GDPR compliance features:
- User data export (right to access)
- Data deletion (right to erasure)
- Audit logging
- Compliance validation
- Data minimization
- PII detection

**Run:**
```bash
npm run dev examples/gdpr-compliance.ts
```

## Running Examples

### Using ts-node (Development)

```bash
# Run a specific example
npm run dev examples/chatbot-basic.ts

# Or use ts-node directly
npx ts-node examples/chatbot-basic.ts
```

### Using Compiled JavaScript

```bash
# First, build the project
npm run build

# Then compile the example
npx tsc examples/chatbot-basic.ts --outDir dist/examples

# Run it
node dist/examples/chatbot-basic.js
```

## Example Output

Each example provides clear console output showing:
- ✓ Successful operations
- ✗ Failed operations
- Detailed results and data
- Step-by-step progress

## Modifying Examples

Feel free to modify these examples to:
- Test different scenarios
- Experiment with configurations
- Learn how components work together
- Build your own workflows

## Integration Patterns

### Pattern 1: Chatbot + Prompts

```typescript
const app = new AIAutomationApp();
const chatbot = app.getChatbot();
const promptManager = app.getPromptManager();

// Use a template with the chatbot
await chatbot.sendTemplatedMessage(
  conversationId,
  'customer-support',
  { companyName: 'Acme', productService: 'SaaS', customerQuestion: '...' }
);
```

### Pattern 2: Workflow + GDPR

```typescript
const workflowEngine = app.getWorkflowEngine();
const gdprManager = app.getGDPRManager();

// Execute workflow
await workflowEngine.executeWorkflow('customer-onboarding', data);

// Check audit log
const auditLog = gdprManager.getAuditLog();
```

### Pattern 3: Complete Integration

```typescript
// Initialize
const app = new AIAutomationApp();

// Use all components together
const chatbot = app.getChatbot();
const workflows = app.getWorkflowEngine();
const prompts = app.getPromptManager();
const gdpr = app.getGDPRManager();

// Orchestrate business process
chatbot.startConversation(id);
const result = await workflows.executeWorkflow('...', data);
const compliance = gdpr.validateCompliance('...', [...], true);
```

## Common Use Cases

### Customer Support Automation

```typescript
// Start support conversation
chatbot.startConversation(ticketId);

// Use support prompt
const response = await chatbot.sendTemplatedMessage(
  ticketId,
  'customer-support',
  { companyName: '...', productService: '...', customerQuestion: '...' }
);

// Execute support workflow
await workflowEngine.executeWorkflow('support-ticket', ticketData);
```

### Email Campaign Generation

```typescript
// Generate email for each recipient
const emailPrompt = promptManager.renderPrompt('email-draft', {
  recipient: recipient.name,
  subject: campaignSubject,
  tone: 'professional',
  keyPoints: campaignPoints
});

// Use in conversation for refinement
const draft = await chatbot.sendMessage(conversationId, emailPrompt);
```

### Data Analysis Pipeline

```typescript
// Execute analysis workflow
const result = await workflowEngine.executeWorkflow('data-analysis', {
  reportType: 'monthly_sales',
  period: '2024-01',
  metrics: salesData
});

// GDPR: Ensure compliance
const validation = gdprManager.validateCompliance(
  'service_improvement',
  ['sales_data'],
  true
);
```

## Best Practices

1. **Always end conversations**: Properly clean up resources
   ```typescript
   chatbot.endConversation(id);
   ```

2. **Handle errors**: Use try-catch blocks
   ```typescript
   try {
     await chatbot.sendMessage(id, message);
   } catch (error) {
     console.error('Error:', error);
   }
   ```

3. **Respect GDPR**: Export/delete data on request
   ```typescript
   // User request
   const data = chatbot.exportConversationData(id);
   chatbot.deleteConversation(id);
   ```

4. **Validate inputs**: Check data before processing
   ```typescript
   if (!email || !isValidEmail(email)) {
     throw new Error('Invalid email');
   }
   ```

5. **Use templates**: Maintain consistent prompts
   ```typescript
   // Instead of hardcoding prompts
   const prompt = promptManager.renderPrompt('template-id', variables);
   ```

## Next Steps

After exploring the examples:

1. Read the [documentation](../docs/)
2. Customize prompt templates for your use case
3. Create your own workflows
4. Integrate with real AI services (OpenAI, etc.)
5. Add your business logic
6. Deploy to production

## Support

For questions about the examples:
- Check the main [README.md](../README.md)
- Review the [documentation](../docs/)
- Open a GitHub issue
