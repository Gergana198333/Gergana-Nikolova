/**
 * Configurable prompt templates for AI interactions
 * These templates can be customized for various business workflows
 */

import { PromptTemplate } from '../types';

export class PromptManager {
  private templates: Map<string, PromptTemplate>;

  constructor() {
    this.templates = new Map();
    this.initializeDefaultTemplates();
  }

  /**
   * Initialize default prompt templates for common business scenarios
   */
  private initializeDefaultTemplates(): void {
    // Customer support prompt
    this.registerTemplate({
      id: 'customer-support',
      name: 'Customer Support Assistant',
      description: 'Handles customer inquiries with empathy and professionalism',
      template: `You are a helpful customer support assistant for {{companyName}}.
Your role is to assist customers with their questions about {{productService}}.
Always be polite, empathetic, and professional.
If you cannot help, politely direct them to human support.

Customer question: {{customerQuestion}}`,
      variables: ['companyName', 'productService', 'customerQuestion'],
      category: 'support'
    });

    // Email drafting prompt
    this.registerTemplate({
      id: 'email-draft',
      name: 'Professional Email Drafter',
      description: 'Generates professional business emails',
      template: `Draft a professional email with the following details:
To: {{recipient}}
Subject: {{subject}}
Tone: {{tone}}
Key points to include: {{keyPoints}}

Please write a clear, concise, and professional email.`,
      variables: ['recipient', 'subject', 'tone', 'keyPoints'],
      category: 'communication'
    });

    // Data analysis prompt
    this.registerTemplate({
      id: 'data-analysis',
      name: 'Data Analysis Assistant',
      description: 'Analyzes business data and provides insights',
      template: `Analyze the following business data and provide actionable insights:

Data type: {{dataType}}
Data: {{data}}
Analysis focus: {{focusArea}}

Provide:
1. Key findings
2. Trends or patterns
3. Recommendations for action`,
      variables: ['dataType', 'data', 'focusArea'],
      category: 'analysis'
    });

    // Meeting summarization prompt
    this.registerTemplate({
      id: 'meeting-summary',
      name: 'Meeting Summarizer',
      description: 'Summarizes meeting notes into actionable items',
      template: `Summarize the following meeting notes:

Meeting: {{meetingTitle}}
Date: {{meetingDate}}
Participants: {{participants}}
Notes: {{notes}}

Provide:
1. Key discussion points
2. Decisions made
3. Action items with owners
4. Next steps`,
      variables: ['meetingTitle', 'meetingDate', 'participants', 'notes'],
      category: 'productivity'
    });

    // Content moderation prompt (GDPR-aware)
    this.registerTemplate({
      id: 'content-moderation',
      name: 'Content Moderator',
      description: 'Reviews content for compliance and appropriateness',
      template: `Review the following content for compliance and appropriateness:

Content: {{content}}
Context: {{context}}
Guidelines: {{guidelines}}

Check for:
1. Inappropriate or harmful content
2. GDPR/privacy concerns (PII exposure)
3. Brand compliance
4. Factual accuracy

Provide a compliance report with recommendations.`,
      variables: ['content', 'context', 'guidelines'],
      category: 'compliance'
    });
  }

  /**
   * Register a new prompt template
   */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Get a prompt template by ID
   */
  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all templates, optionally filtered by category
   */
  getTemplates(category?: string): PromptTemplate[] {
    const allTemplates = Array.from(this.templates.values());
    if (category) {
      return allTemplates.filter(t => t.category === category);
    }
    return allTemplates;
  }

  /**
   * Render a prompt template with provided variables
   */
  renderPrompt(templateId: string, variables: Record<string, string>): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Check all required variables are provided
    const missingVars = template.variables.filter(v => !(v in variables));
    if (missingVars.length > 0) {
      throw new Error(`Missing required variables: ${missingVars.join(', ')}`);
    }

    // Replace variables in template
    let rendered = template.template;
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return rendered;
  }

  /**
   * List all available template categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    const templates = Array.from(this.templates.values());
    for (const template of templates) {
      if (template.category) {
        categories.add(template.category);
      }
    }
    return Array.from(categories);
  }
}
