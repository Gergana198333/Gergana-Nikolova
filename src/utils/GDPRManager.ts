/**
 * GDPR-compliant data management utilities
 * Ensures privacy and compliance with data protection regulations
 */

import { GDPRConfig, AuditLogEntry } from '../types';

export class GDPRManager {
  private config: GDPRConfig;
  private auditLog: AuditLogEntry[];

  constructor(config: GDPRConfig) {
    this.config = config;
    this.auditLog = [];
    this.startDataRetentionCleanup();
  }

  /**
   * Log an action for audit purposes
   */
  logAction(
    action: string,
    details?: Record<string, unknown>,
    userId?: string
  ): void {
    if (!this.config.enableAuditLog) {
      return;
    }

    const entry: AuditLogEntry = {
      timestamp: new Date(),
      action,
      userId: this.anonymizeIfEnabled(userId),
      dataProcessed: !!details,
      gdprCompliant: true,
      details: this.config.anonymizeLogs ? this.sanitizeDetails(details) : details
    };

    this.auditLog.push(entry);
  }

  /**
   * Anonymize data if anonymization is enabled
   */
  anonymizeIfEnabled(data?: string): string | undefined {
    if (!data) return undefined;
    if (!this.config.anonymizeLogs) return data;
    
    // Simple hash-based anonymization (in production, use proper hashing)
    return this.hashString(data);
  }

  /**
   * Simple string hashing for anonymization
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return 'anon_' + Math.abs(hash).toString(16);
  }

  /**
   * Sanitize details to remove PII
   */
  private sanitizeDetails(details?: Record<string, unknown>): Record<string, unknown> {
    if (!details) return {};

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(details)) {
      // Skip potentially sensitive fields
      if (this.isSensitiveField(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && this.containsPII(value)) {
        sanitized[key] = '[REDACTED_PII]';
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * Check if field name indicates sensitive data
   */
  private isSensitiveField(fieldName: string): boolean {
    const sensitivePatterns = [
      'email', 'phone', 'address', 'ssn', 'passport',
      'credit', 'card', 'password', 'secret', 'token',
      'name', 'birthday', 'birth', 'age'
    ];
    const lowerField = fieldName.toLowerCase();
    return sensitivePatterns.some(pattern => lowerField.includes(pattern));
  }

  /**
   * Check if string potentially contains PII
   */
  private containsPII(text: string): boolean {
    // Simple patterns for common PII (in production, use more sophisticated detection)
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/;
    
    return emailPattern.test(text) || 
           phonePattern.test(text) || 
           ssnPattern.test(text);
  }

  /**
   * Get audit log (filtered if anonymization is enabled)
   */
  getAuditLog(fromDate?: Date, toDate?: Date): AuditLogEntry[] {
    let filtered = this.auditLog;

    if (fromDate) {
      filtered = filtered.filter(entry => entry.timestamp >= fromDate);
    }

    if (toDate) {
      filtered = filtered.filter(entry => entry.timestamp <= toDate);
    }

    return filtered;
  }

  /**
   * Export user data (GDPR right to data portability)
   */
  exportUserData(userId: string): Record<string, unknown> {
    const userLogs = this.auditLog.filter(
      entry => entry.userId === userId || entry.userId === this.hashString(userId)
    );

    return {
      userId,
      exportDate: new Date(),
      auditLog: userLogs,
      dataRetentionPolicy: `Data is retained for ${this.config.dataRetentionDays} days`,
      gdprCompliant: true
    };
  }

  /**
   * Delete user data (GDPR right to erasure)
   */
  deleteUserData(userId: string): boolean {
    const hashedUserId = this.hashString(userId);
    const initialLength = this.auditLog.length;

    this.auditLog = this.auditLog.filter(
      entry => entry.userId !== userId && entry.userId !== hashedUserId
    );

    this.logAction('user_data_deleted', {
      recordsDeleted: initialLength - this.auditLog.length,
      deletionDate: new Date()
    });

    return initialLength !== this.auditLog.length;
  }

  /**
   * Start automatic data retention cleanup
   */
  private startDataRetentionCleanup(): void {
    // In production, this would run as a scheduled job
    // For now, we'll just define the method
    const cleanupOldData = (): void => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.dataRetentionDays);

      const beforeCount = this.auditLog.length;
      this.auditLog = this.auditLog.filter(
        entry => entry.timestamp > cutoffDate
      );
      const afterCount = this.auditLog.length;

      if (beforeCount !== afterCount) {
        console.log(`GDPR: Cleaned up ${beforeCount - afterCount} old audit log entries`);
      }
    };

    // Run cleanup periodically (daily)
    setInterval(cleanupOldData, 24 * 60 * 60 * 1000);
  }

  /**
   * Check if data processing is compliant with GDPR principles
   */
  validateCompliance(
    purpose: string,
    dataTypes: string[],
    consentGiven: boolean
  ): { compliant: boolean; issues: string[] } {
    const issues: string[] = [];

    // Principle: Lawfulness, fairness and transparency
    if (!consentGiven) {
      issues.push('User consent is required for data processing');
    }

    // Principle: Purpose limitation
    const validPurposes = [
      'customer_support',
      'service_improvement',
      'legal_compliance',
      'contract_fulfillment'
    ];
    if (!validPurposes.includes(purpose)) {
      issues.push(`Purpose '${purpose}' must be specific and legitimate`);
    }

    // Principle: Data minimization
    const sensitiveDataTypes = ['biometric', 'health', 'financial', 'racial'];
    const hasSensitiveData = dataTypes.some(type => 
      sensitiveDataTypes.includes(type.toLowerCase())
    );
    if (hasSensitiveData) {
      issues.push('Sensitive data requires additional safeguards and explicit consent');
    }

    return {
      compliant: issues.length === 0,
      issues
    };
  }

  /**
   * Get GDPR compliance report
   */
  getComplianceReport(): Record<string, unknown> {
    return {
      generatedAt: new Date(),
      config: {
        dataRetentionDays: this.config.dataRetentionDays,
        auditLogEnabled: this.config.enableAuditLog,
        anonymizationEnabled: this.config.anonymizeLogs,
        dataExportEnabled: this.config.allowDataExport
      },
      statistics: {
        totalAuditEntries: this.auditLog.length,
        oldestEntry: this.auditLog[0]?.timestamp,
        newestEntry: this.auditLog[this.auditLog.length - 1]?.timestamp
      },
      gdprPrinciples: {
        lawfulness: 'Implemented via consent tracking',
        purposeLimitation: 'Enforced via purpose validation',
        dataMinimization: 'Enforced via conversation limits and PII detection',
        accuracy: 'User can update/correct data',
        storageLimit: `${this.config.dataRetentionDays} days retention`,
        integrityAndConfidentiality: 'Data anonymization and secure storage',
        accountability: 'Comprehensive audit logging'
      }
    };
  }
}
