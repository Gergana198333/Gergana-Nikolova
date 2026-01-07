# Setup Guide

This guide will help you set up the AI-Powered Automation Workflows project from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`
  
- **npm** (comes with Node.js) or **yarn**
  - Verify: `npm --version`

- **(Optional) AI Service API Key**
  - OpenAI API key from [platform.openai.com](https://platform.openai.com/)
  - Or credentials for other AI services (Anthropic, Azure OpenAI, etc.)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Gergana198333/Gergana-Nikolova.git
cd Gergana-Nikolova
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- TypeScript
- ts-node (for development)
- ESLint (for code quality)
- dotenv (for environment configuration)

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Required for AI integration (optional for demo)
AI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-3.5-turbo

# Application settings
APP_NAME=AI Automation Workflows
LOG_LEVEL=info

# GDPR & Privacy settings
DATA_RETENTION_DAYS=30
ENABLE_AUDIT_LOG=true
ANONYMIZE_LOGS=true

# Chatbot configuration
CHATBOT_NAME=Business Assistant
CHATBOT_LANGUAGE=en
MAX_CONVERSATION_HISTORY=10
```

**Note**: The demo works without an API key, using mock responses.

### 4. Build the Project

Compile TypeScript to JavaScript:

```bash
npm run build
```

This creates a `dist/` directory with compiled JavaScript files.

### 5. Run the Application

Run the demo:

```bash
npm start
```

Or run in development mode (with ts-node):

```bash
npm run dev
```

### 6. Verify Installation

You should see output similar to:

```
AI Automation Workflows initialized successfully

=== AI Automation Workflows Demo ===

--- Demo 1: Chatbot Conversation ---
Started conversation: demo-conversation-1
User: Hello!
Bot: Hello! I'm Business Assistant...
...
```

## Development Workflow

### Running Linter

Check code quality:

```bash
npm run lint
```

### TypeScript Compilation

The project uses TypeScript with strict type checking. The `tsconfig.json` is configured for:
- ES2020 target
- Strict mode enabled
- Source maps for debugging
- Declaration files for library usage

### Project Scripts

All available npm scripts:

```json
{
  "build": "tsc",              // Compile TypeScript
  "start": "node dist/index.js", // Run compiled code
  "dev": "ts-node src/index.ts", // Run with ts-node
  "lint": "eslint src/**/*.ts",  // Run linter
  "clean": "rm -rf dist"       // Clean build artifacts
}
```

## Integrating with AI Services

### OpenAI Integration

1. Get API key from [platform.openai.com](https://platform.openai.com/)
2. Set in `.env`: `AI_API_KEY=sk-...`
3. Modify `src/chatbot/ChatbotAssistant.ts` to call OpenAI API instead of mock responses

Example integration (in `generateResponse` method):

```typescript
// Install OpenAI SDK
// npm install openai

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY
});

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: context.messages.map(m => ({
    role: m.role,
    content: m.content
  }))
});

return response.choices[0].message.content;
```

### Other AI Services

The architecture supports any AI service. Implement the interface in:
- `src/chatbot/ChatbotAssistant.ts`: Replace `generateResponse()` method
- `src/utils/ConfigLoader.ts`: Add service-specific configuration

## Troubleshooting

### Common Issues

**Issue**: `Cannot find module 'dotenv'`
```bash
npm install dotenv
```

**Issue**: TypeScript compilation errors
```bash
# Clean and rebuild
npm run clean
npm run build
```

**Issue**: ESLint errors
```bash
# Fix auto-fixable issues
npm run lint -- --fix
```

**Issue**: Permission denied when running scripts
```bash
chmod +x node_modules/.bin/*
```

### Getting Help

- Check the [documentation](../docs/)
- Review code comments in source files
- Open an issue on GitHub

## Next Steps

After successful setup:

1. Explore the demo output
2. Read [Project Structure](PROJECT_STRUCTURE.md) to understand the architecture
3. Review [Ethical AI Guidelines](ETHICAL_AI.md) for best practices
4. Check [GDPR Compliance](GDPR_COMPLIANCE.md) for privacy features
5. Customize prompt templates in `src/prompts/PromptManager.ts`
6. Add your own workflows in `src/workflows/WorkflowEngine.ts`
7. Integrate with real AI services

## Production Deployment

For production deployment, see the [README.md](../README.md#production-deployment) section.

Key considerations:
- Use environment variables for secrets
- Enable all GDPR compliance features
- Implement proper error handling
- Add monitoring and logging
- Set up rate limiting
- Use a process manager (PM2, systemd)
