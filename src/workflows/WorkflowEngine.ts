/**
 * Business Workflow Automation
 * Reusable logic for common business processes
 */

import { WorkflowConfig, WorkflowStep, WorkflowResult } from '../types';
import { PromptManager } from '../prompts/PromptManager';
import { GDPRManager } from '../utils/GDPRManager';

export class WorkflowEngine {
  private workflows: Map<string, WorkflowConfig>;
  private promptManager: PromptManager;
  private gdprManager: GDPRManager;

  constructor(promptManager: PromptManager, gdprManager: GDPRManager) {
    this.workflows = new Map();
    this.promptManager = promptManager;
    this.gdprManager = gdprManager;
    this.initializeDefaultWorkflows();
  }

  /**
   * Initialize default business workflows
   */
  private initializeDefaultWorkflows(): void {
    // Customer onboarding workflow
    this.registerWorkflow({
      id: 'customer-onboarding',
      name: 'Customer Onboarding',
      description: 'Automated customer onboarding process',
      enabled: true,
      steps: [
        {
          id: 'welcome',
          type: 'prompt',
          config: { templateId: 'customer-support', stage: 'welcome' }
        },
        {
          id: 'collect-info',
          type: 'action',
          config: { action: 'collect_customer_data' }
        },
        {
          id: 'validate',
          type: 'validate',
          config: { rules: ['email_format', 'required_fields'] }
        },
        {
          id: 'send-confirmation',
          type: 'prompt',
          config: { templateId: 'email-draft', stage: 'confirmation' }
        }
      ]
    });

    // Support ticket workflow
    this.registerWorkflow({
      id: 'support-ticket',
      name: 'Support Ticket Processing',
      description: 'Automated support ticket handling',
      enabled: true,
      steps: [
        {
          id: 'categorize',
          type: 'prompt',
          config: { templateId: 'customer-support', stage: 'categorize' }
        },
        {
          id: 'priority',
          type: 'validate',
          config: { action: 'determine_priority' }
        },
        {
          id: 'route',
          type: 'action',
          config: { action: 'route_to_team' }
        },
        {
          id: 'notify',
          type: 'prompt',
          config: { templateId: 'email-draft', stage: 'notification' }
        }
      ]
    });

    // Data analysis workflow
    this.registerWorkflow({
      id: 'data-analysis',
      name: 'Business Data Analysis',
      description: 'Automated data analysis and reporting',
      enabled: true,
      steps: [
        {
          id: 'collect-data',
          type: 'action',
          config: { action: 'collect_data' }
        },
        {
          id: 'analyze',
          type: 'prompt',
          config: { templateId: 'data-analysis' }
        },
        {
          id: 'generate-report',
          type: 'transform',
          config: { format: 'report' }
        },
        {
          id: 'distribute',
          type: 'action',
          config: { action: 'send_report' }
        }
      ]
    });
  }

  /**
   * Register a new workflow
   */
  registerWorkflow(workflow: WorkflowConfig): void {
    this.workflows.set(workflow.id, workflow);
    this.gdprManager.logAction('workflow_registered', {
      workflowId: workflow.id,
      workflowName: workflow.name
    });
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflowId: string,
    input: Record<string, unknown>
  ): Promise<WorkflowResult> {
    const workflow = this.workflows.get(workflowId);
    
    if (!workflow) {
      return {
        success: false,
        error: `Workflow not found: ${workflowId}`
      };
    }

    if (!workflow.enabled) {
      return {
        success: false,
        error: `Workflow is disabled: ${workflowId}`
      };
    }

    this.gdprManager.logAction('workflow_started', {
      workflowId,
      timestamp: new Date()
    });

    try {
      let currentData = input;
      const stepResults: Record<string, unknown>[] = [];

      for (const step of workflow.steps) {
        const stepResult = await this.executeStep(step, currentData);
        stepResults.push({
          stepId: step.id,
          result: stepResult
        });

        // Update data for next step
        if (stepResult.success && stepResult.data) {
          currentData = {
            ...currentData,
            ...(stepResult.data as Record<string, unknown>)
          };
        } else if (!stepResult.success) {
          // Stop workflow on step failure
          this.gdprManager.logAction('workflow_failed', {
            workflowId,
            failedStep: step.id,
            error: stepResult.error
          });

          return {
            success: false,
            error: `Workflow failed at step ${step.id}: ${stepResult.error}`,
            metadata: { stepResults }
          };
        }
      }

      this.gdprManager.logAction('workflow_completed', {
        workflowId,
        stepCount: workflow.steps.length,
        timestamp: new Date()
      });

      return {
        success: true,
        data: currentData,
        metadata: { stepResults }
      };
    } catch (error) {
      this.gdprManager.logAction('workflow_error', {
        workflowId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<WorkflowResult> {
    switch (step.type) {
      case 'prompt':
        return this.executePromptStep(step, data);
      
      case 'validate':
        return this.executeValidateStep(step, data);
      
      case 'transform':
        return this.executeTransformStep(step, data);
      
      case 'action':
        return this.executeActionStep(step, data);
      
      default:
        return {
          success: false,
          error: `Unknown step type: ${step.type}`
        };
    }
  }

  /**
   * Execute a prompt-based step
   */
  private async executePromptStep(
    step: WorkflowStep,
    _data: Record<string, unknown>
  ): Promise<WorkflowResult> {
    try {
      const templateId = step.config.templateId as string;
      const template = this.promptManager.getTemplate(templateId);
      
      if (!template) {
        return {
          success: false,
          error: `Template not found: ${templateId}`
        };
      }

      // In production, this would generate AI response
      const promptData = {
        template: template.name,
        stage: step.config.stage,
        processed: true
      };

      return {
        success: true,
        data: promptData
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Prompt step failed'
      };
    }
  }

  /**
   * Execute a validation step
   */
  private async executeValidateStep(
    step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<WorkflowResult> {
    // Simple validation logic
    const rules = step.config.rules as string[] || [];
    const errors: string[] = [];

    for (const rule of rules) {
      if (rule === 'email_format' && data.email) {
        const email = data.email as string;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push('Invalid email format');
        }
      }

      if (rule === 'required_fields') {
        const requiredFields = ['email', 'name'];
        for (const field of requiredFields) {
          if (!data[field]) {
            errors.push(`Missing required field: ${field}`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join(', ')
      };
    }

    return {
      success: true,
      data: { validated: true }
    };
  }

  /**
   * Execute a transform step
   */
  private async executeTransformStep(
    step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<WorkflowResult> {
    const format = step.config.format as string;

    // Simple transformation
    const transformed = {
      ...data,
      transformedAt: new Date(),
      format
    };

    return {
      success: true,
      data: transformed
    };
  }

  /**
   * Execute an action step
   */
  private async executeActionStep(
    step: WorkflowStep,
    data: Record<string, unknown>
  ): Promise<WorkflowResult> {
    const action = step.config.action as string;

    // Mock action execution
    console.log(`Executing action: ${action} with data:`, data);

    return {
      success: true,
      data: {
        actionExecuted: action,
        executedAt: new Date()
      }
    };
  }

  /**
   * Get workflow configuration
   */
  getWorkflow(workflowId: string): WorkflowConfig | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all workflows
   */
  getAllWorkflows(): WorkflowConfig[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Enable/disable a workflow
   */
  setWorkflowEnabled(workflowId: string, enabled: boolean): boolean {
    const workflow = this.workflows.get(workflowId);
    if (workflow) {
      workflow.enabled = enabled;
      this.gdprManager.logAction('workflow_status_changed', {
        workflowId,
        enabled
      });
      return true;
    }
    return false;
  }
}
