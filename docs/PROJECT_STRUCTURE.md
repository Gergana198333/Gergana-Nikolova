# Project Structure

This document provides a detailed overview of the project architecture and organization.

## Directory Structure

```
ai-automation-workflows/
├── src/                          # Source code
│   ├── index.ts                  # Main entry point
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts             # Shared interfaces and types
│   ├── chatbot/                  # Chatbot implementation
│   │   └── ChatbotAssistant.ts  # Conversational AI assistant
│   ├── prompts/                  # Prompt management
│   │   └── PromptManager.ts     # Template system for prompts
│   ├── workflows/                # Workflow automation
│   │   └── WorkflowEngine.ts    # Business process automation
│   └── utils/                    # Utilities and helpers
│       ├── GDPRManager.ts       # GDPR compliance utilities
│       └── ConfigLoader.ts      # Configuration management
├── docs/                         # Documentation
│   ├── SETUP.md                 # Setup instructions
│   ├── PROJECT_STRUCTURE.md     # This file
│   ├── ETHICAL_AI.md            # AI ethics guidelines
│   └── GDPR_COMPLIANCE.md       # Privacy documentation
├── dist/                         # Compiled JavaScript (generated)
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc.json               # ESLint configuration
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── LICENSE                       # MIT License
└── README.md                     # Project overview
```

## Core Components

### 1. Type System (`src/types/index.ts`)

Defines all TypeScript interfaces used throughout the project:

- **Message**: Chat message structure
- **ConversationContext**: Conversation state and history
- **PromptTemplate**: Template definition for AI prompts
- **WorkflowConfig**: Workflow configuration and steps
- **AIConfig**: AI service configuration
- **GDPRConfig**: Privacy and compliance settings
- **ChatbotConfig**: Chatbot behavior settings

**Design principle**: Strong typing ensures type safety and better IDE support.

### 2. Chatbot Assistant (`src/chatbot/ChatbotAssistant.ts`)

Provides conversational interface for business workflows.

**Key Features**:
- Conversation management (start, send, end)
- Message history with configurable limits
- GDPR-compliant data handling
- Integration with prompt templates
- Data export and deletion capabilities

**Architecture**:
```
ChatbotAssistant
├── Conversation Management
│   ├── startConversation()
│   ├── sendMessage()
│   └── endConversation()
├── GDPR Compliance
│   ├── exportConversationData()
│   ├── deleteConversation()
│   └── enforceHistoryLimit()
└── Template Integration
    └── sendTemplatedMessage()
```

**Usage Pattern**:
```typescript
chatbot.startConversation(id);
const response = await chatbot.sendMessage(id, userInput);
chatbot.endConversation(id);
```

### 3. Prompt Manager (`src/prompts/PromptManager.ts`)

Manages configurable prompt templates for consistent AI interactions.

**Key Features**:
- Pre-built templates for common scenarios
- Variable interpolation
- Category-based organization
- Template registration and retrieval

**Built-in Templates**:
1. **Customer Support**: Handle customer inquiries
2. **Email Drafting**: Generate professional emails
3. **Data Analysis**: Analyze business data
4. **Meeting Summarization**: Summarize meetings
5. **Content Moderation**: Check compliance and appropriateness

**Architecture**:
```
PromptManager
├── Template Storage (Map)
├── Default Templates
│   ├── customer-support
│   ├── email-draft
│   ├── data-analysis
│   ├── meeting-summary
│   └── content-moderation
└── Template Operations
    ├── registerTemplate()
    ├── getTemplate()
    ├── renderPrompt()
    └── getCategories()
```

**Usage Pattern**:
```typescript
const prompt = promptManager.renderPrompt('email-draft', {
  recipient: 'John',
  subject: 'Update',
  tone: 'professional',
  keyPoints: 'Status update'
});
```

### 4. Workflow Engine (`src/workflows/WorkflowEngine.ts`)

Orchestrates multi-step business processes with reusable logic.

**Key Features**:
- Step-based workflow execution
- Multiple step types (prompt, validate, transform, action)
- Error handling and rollback
- Workflow enablement controls

**Built-in Workflows**:
1. **Customer Onboarding**: Automated new customer setup
2. **Support Ticket**: Ticket categorization and routing
3. **Data Analysis**: Automated data processing and reporting

**Step Types**:
- **Prompt**: AI-powered content generation
- **Validate**: Data validation and verification
- **Transform**: Data transformation and formatting
- **Action**: Custom business actions

**Architecture**:
```
WorkflowEngine
├── Workflow Storage (Map)
├── Default Workflows
│   ├── customer-onboarding
│   ├── support-ticket
│   └── data-analysis
└── Execution Engine
    ├── executeWorkflow()
    ├── executeStep()
    │   ├── executePromptStep()
    │   ├── executeValidateStep()
    │   ├── executeTransformStep()
    │   └── executeActionStep()
    └── Workflow Management
        ├── registerWorkflow()
        ├── getWorkflow()
        └── setWorkflowEnabled()
```

**Usage Pattern**:
```typescript
const result = await workflowEngine.executeWorkflow('customer-onboarding', {
  email: 'user@example.com',
  name: 'John Doe'
});
```

### 5. GDPR Manager (`src/utils/GDPRManager.ts`)

Ensures privacy compliance and data protection.

**Key Features**:
- Audit logging
- Data anonymization
- PII detection and sanitization
- User data export and deletion
- Compliance validation
- Automated data retention

**GDPR Principles Implemented**:
1. **Lawfulness**: Consent tracking
2. **Purpose Limitation**: Purpose validation
3. **Data Minimization**: PII detection, conversation limits
4. **Accuracy**: Data correction capabilities
5. **Storage Limitation**: Automated data retention cleanup
6. **Integrity & Confidentiality**: Anonymization, secure handling
7. **Accountability**: Comprehensive audit logging

**Architecture**:
```
GDPRManager
├── Audit Logging
│   ├── logAction()
│   └── getAuditLog()
├── Anonymization
│   ├── anonymizeIfEnabled()
│   └── hashString()
├── PII Protection
│   ├── sanitizeDetails()
│   ├── isSensitiveField()
│   └── containsPII()
├── User Rights
│   ├── exportUserData()
│   └── deleteUserData()
├── Compliance
│   ├── validateCompliance()
│   └── getComplianceReport()
└── Data Retention
    └── startDataRetentionCleanup()
```

### 6. Configuration Loader (`src/utils/ConfigLoader.ts`)

Manages environment-based configuration.

**Configuration Domains**:
- AI service settings
- GDPR compliance settings
- Chatbot behavior settings
- Configuration validation

**Usage Pattern**:
```typescript
const aiConfig = ConfigLoader.loadAIConfig();
const gdprConfig = ConfigLoader.loadGDPRConfig();
const validation = ConfigLoader.validateConfig();
```

### 7. Main Application (`src/index.ts`)

Entry point that ties all components together.

**Responsibilities**:
- Component initialization
- Dependency injection
- Demo orchestration
- Public API export

**Architecture**:
```
AIAutomationApp
├── Initialize Components
│   ├── PromptManager
│   ├── GDPRManager
│   ├── ChatbotAssistant
│   └── WorkflowEngine
├── Public API
│   ├── getChatbot()
│   ├── getPromptManager()
│   ├── getWorkflowEngine()
│   └── getGDPRManager()
└── Demo Scenarios
    ├── demoChat()
    ├── demoPrompts()
    ├── demoWorkflow()
    └── demoGDPR()
```

## Data Flow

### Chatbot Conversation Flow

```
User Input
    ↓
ChatbotAssistant.sendMessage()
    ↓
Add to conversation context
    ↓
Generate AI response (or mock)
    ↓
GDPRManager.logAction()
    ↓
Return response to user
```

### Workflow Execution Flow

```
Input Data
    ↓
WorkflowEngine.executeWorkflow()
    ↓
For each step:
    ↓
executeStep() → Execute specific step type
    ↓
Update data with step results
    ↓
GDPRManager.logAction()
    ↓
Return final result
```

### Prompt Rendering Flow

```
Template ID + Variables
    ↓
PromptManager.getTemplate()
    ↓
Validate required variables
    ↓
Replace variables in template
    ↓
Return rendered prompt
```

## Design Patterns

### 1. **Dependency Injection**
- Components receive dependencies via constructor
- Facilitates testing and flexibility
- Example: `ChatbotAssistant` receives `PromptManager` and `GDPRManager`

### 2. **Template Method**
- `WorkflowEngine` defines workflow execution flow
- Subclasses (step types) implement specific behaviors
- Promotes code reuse

### 3. **Strategy Pattern**
- Different step types (prompt, validate, transform, action)
- Executed polymorphically
- Easy to add new step types

### 4. **Facade Pattern**
- `AIAutomationApp` provides simplified interface
- Hides complexity of component initialization
- Single entry point for users

### 5. **Repository Pattern**
- `PromptManager` and `WorkflowEngine` use Map storage
- Abstraction over data storage
- Easy to swap storage implementations

## Extension Points

### Adding Custom Prompts

```typescript
promptManager.registerTemplate({
  id: 'my-custom-template',
  name: 'My Template',
  description: 'Custom template',
  template: 'Hello {{name}}',
  variables: ['name'],
  category: 'custom'
});
```

### Adding Custom Workflows

```typescript
workflowEngine.registerWorkflow({
  id: 'my-workflow',
  name: 'My Workflow',
  description: 'Custom workflow',
  enabled: true,
  steps: [
    { id: 'step1', type: 'prompt', config: {...} },
    { id: 'step2', type: 'action', config: {...} }
  ]
});
```

### Integrating Real AI Services

Replace mock implementation in `ChatbotAssistant.generateResponse()`:

```typescript
private async generateResponse(context: ConversationContext): Promise<string> {
  // Call your AI service API
  const response = await yourAIService.complete({
    messages: context.messages
  });
  return response.text;
}
```

## Testing Strategy

While tests are not included (minimal change requirement), here's the recommended approach:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **GDPR Compliance Tests**: Verify privacy features
4. **Mock AI Responses**: Test without real API calls

## Performance Considerations

1. **Conversation Limits**: Enforced via `maxConversationHistory`
2. **Data Retention**: Automatic cleanup of old data
3. **Lazy Loading**: Templates loaded on initialization
4. **Map Storage**: O(1) lookup for templates and workflows

## Security Considerations

1. **Environment Variables**: Secrets never in code
2. **Input Validation**: All user input validated
3. **PII Detection**: Automatic sensitive data detection
4. **Audit Logging**: All actions tracked
5. **Data Anonymization**: Optional anonymization of logs
