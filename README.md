# AI Automation Workflows

A professional TypeScript-based project showcasing applied AI automation and chatbot workflows. This project demonstrates best practices for building intelligent systems with ethical AI considerations, GDPR compliance, and real-world use cases.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Examples](#usage-examples)
- [Ethical AI Considerations](#ethical-ai-considerations)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project provides a clean, well-structured foundation for building AI-powered automation workflows and chatbot systems. It includes:

- **AI Assistant Module**: A flexible AI assistant interface for processing user messages
- **Chatbot Workflow**: Complete conversation management with multi-session support
- **Utility Functions**: Reusable helpers for common tasks (sanitization, anonymization, rate limiting)
- **Type Safety**: Full TypeScript support with strict type checking
- **Privacy-First**: Built-in GDPR compliance and data anonymization features

## ✨ Features

### Core Capabilities

- 🤖 **AI Assistant**: Simple, extensible AI assistant class for automation workflows
- 💬 **Chatbot System**: Full-featured chatbot with conversation history and session management
- 🔒 **Security**: Input sanitization to prevent injection attacks
- 🛡️ **Privacy**: GDPR-compliant data handling and anonymization
- ⚡ **Rate Limiting**: Built-in rate limiter to control API usage
- 📝 **Logging**: Privacy-aware logging with automatic data anonymization
- 🎯 **Type Safe**: Written in TypeScript with comprehensive type definitions

### Best Practices

- Clean, modular architecture with separation of concerns
- Comprehensive documentation and code comments
- Ethical AI principles embedded in the design
- Production-ready patterns and error handling
- Easy to extend and customize for specific use cases

## 🛠️ Technologies Used

- **[TypeScript](https://www.typescriptlang.org/)** (v5.3+) - Type-safe JavaScript
- **[Node.js](https://nodejs.org/)** (v18+) - JavaScript runtime
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variable management
- **[ESLint](https://eslint.org/)** - Code quality and linting
- **[Prettier](https://prettier.io/)** - Code formatting

## 📁 Project Structure

```
ai-automation-workflows/
├── src/
│   ├── ai-assistant/          # AI Assistant module
│   │   └── index.ts
│   ├── chatbot/               # Chatbot workflow module
│   │   └── index.ts
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                 # Reusable utility functions
│   │   └── index.ts
│   ├── examples/              # Example usage and demos
│   │   ├── ai-assistant-example.ts
│   │   ├── chatbot-demo.ts
│   │   └── utilities-example.ts
│   └── index.ts               # Main entry point
├── dist/                      # Compiled JavaScript (generated)
├── .env.example               # Environment variable template
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── .gitignore                 # Git ignore rules
├── LICENSE                    # MIT License
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Gergana198333/Gergana-Nikolova.git
   cd Gergana-Nikolova
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env and add your API keys if integrating with real AI services
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

### Running the Project

**Run the chatbot demo:**

```bash
npm start
```

**Run individual examples:**

```bash
# AI Assistant example
node dist/examples/ai-assistant-example.js

# Chatbot demo
node dist/examples/chatbot-demo.js

# Utilities example
node dist/examples/utilities-example.js
```

**Development mode (watch for changes):**

```bash
npm run dev
```

## 📖 Usage Examples

### AI Assistant

```typescript
import { AIAssistant } from './ai-assistant';

const assistant = new AIAssistant({
  model: 'gpt-3.5-turbo',
  maxTokens: 1000,
  temperature: 0.7,
  systemPrompt: 'You are a helpful AI assistant.',
  enableLogging: true,
});

const response = await assistant.processMessage('Hello!');
console.log(response.content);
```

### Chatbot Workflow

```typescript
import { Chatbot } from './chatbot';

const chatbot = new Chatbot({
  name: 'CustomerSupportBot',
  description: 'A helpful customer support chatbot',
  persona: 'Friendly and professional support representative',
  maxHistoryLength: 10,
});

const conversationId = chatbot.startConversation('user-123');
const reply = await chatbot.sendMessage('I need help with my account');
console.log(reply);
```

### Utility Functions

```typescript
import { sanitizeInput, anonymizeData, RateLimiter, Logger } from './utils';

// Sanitize user input
const safe = sanitizeInput('<script>alert("XSS")</script>Hello');

// Anonymize sensitive data (GDPR)
const anonymized = anonymizeData('Contact: john@example.com');

// Rate limiting
const limiter = new RateLimiter(60); // 60 requests per minute
if (limiter.canMakeRequest()) {
  // Process request
}

// Privacy-aware logging
const logger = new Logger(true, true);
logger.info('User action performed');
```

## 🤝 Ethical AI Considerations

This project is built with ethical AI principles at its core:

### Data Privacy & GDPR Compliance

- **Data Minimization**: Only collect and process necessary data
- **Anonymization**: Built-in functions to anonymize personal information
- **Right to be Forgotten**: Easy conversation deletion and cleanup
- **Transparency**: Clear logging and audit trails
- **Consent**: Designed to respect user privacy preferences

### Security Best Practices

- **Input Sanitization**: Prevent injection attacks and malicious input
- **Rate Limiting**: Protect against abuse and ensure fair usage
- **Error Handling**: Graceful error management without exposing sensitive data
- **Secure by Default**: Privacy-first configuration options

### Responsible AI Use

- **Bias Awareness**: Design encourages diverse and inclusive AI interactions
- **Transparency**: Clear documentation of AI capabilities and limitations
- **Human Oversight**: Systems designed to support, not replace, human decision-making
- **Accountability**: Logging and tracking for responsible AI deployment

### Compliance Features

- **GDPR**: Built-in data anonymization and privacy controls
- **Data Retention**: Configurable retention policies
- **Audit Logs**: Privacy-aware logging for compliance tracking
- **User Control**: Easy access to user data and conversation management

## 📚 API Reference

### AIAssistant

Main AI assistant class for processing messages.

**Constructor Options:**
- `model?: string` - AI model to use (default: 'gpt-3.5-turbo')
- `maxTokens?: number` - Maximum tokens per response (default: 1000)
- `temperature?: number` - Response creativity (0-1, default: 0.7)
- `systemPrompt?: string` - System instructions
- `enableLogging?: boolean` - Enable/disable logging (default: true)

**Methods:**
- `processMessage(message: string): Promise<AIResponse>` - Process a user message
- `getHistory(): Message[]` - Get conversation history
- `clearHistory(): void` - Clear conversation history
- `getSystemPrompt(): string` - Get current system prompt
- `setSystemPrompt(prompt: string): void` - Update system prompt

### Chatbot

Complete chatbot workflow with conversation management.

**Constructor Options:**
- `name: string` - Chatbot name (required)
- `description?: string` - Chatbot description
- `persona?: string` - AI persona definition
- `maxHistoryLength?: number` - Max messages to keep (default: 20)
- Plus all `AIAssistantConfig` options

**Methods:**
- `startConversation(userId?: string): string` - Start new conversation
- `sendMessage(message: string, conversationId?: string): Promise<string>` - Send message
- `getConversation(id: string): Conversation | undefined` - Get conversation by ID
- `getCurrentConversation(): Conversation | undefined` - Get current conversation
- `switchConversation(id: string): void` - Switch to different conversation
- `endConversation(id?: string): void` - End and delete conversation
- `getAllConversations(): Conversation[]` - Get all conversations

### Utility Functions

**String Utilities:**
- `generateId(): string` - Generate unique ID
- `formatDate(date: Date): string` - Format date to ISO string
- `truncateText(text: string, maxLength: number): string` - Truncate text
- `sanitizeInput(input: string): string` - Sanitize user input
- `anonymizeData(data: string): string` - Anonymize sensitive data

**Validation:**
- `isValidEmail(email: string): boolean` - Validate email format

**AI Utilities:**
- `estimateTokenCount(text: string): number` - Estimate token count

**Classes:**
- `RateLimiter` - Rate limiting for API calls
- `Logger` - Privacy-aware logging utility

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Gergana Nikolova**

- Applied AI and automation specialist
- Focus on intelligent workflows, chatbots, and ethical AI
- GDPR compliance and privacy-first design

## 🙏 Acknowledgments

- Built with TypeScript for type safety and developer experience
- Inspired by modern AI automation and chatbot best practices
- Designed with ethical AI principles and GDPR compliance in mind

---

**Note**: This is a demonstration project with mock AI responses. For production use, integrate with actual AI APIs (OpenAI, Anthropic, etc.) by replacing the `generateMockResponse` method in the `AIAssistant` class.
