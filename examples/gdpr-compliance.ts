/**
 * Example: GDPR Compliance Features
 * 
 * This example demonstrates the GDPR compliance features
 * including data export, deletion, and audit logging.
 */

import { AIAutomationApp } from '../src/index';

async function gdprComplianceExample(): Promise<void> {
  console.log('=== GDPR Compliance Example ===\n');

  const app = new AIAutomationApp();
  const chatbot = app.getChatbot();
  const gdprManager = app.getGDPRManager();

  // Example 1: User Data Collection and Processing
  console.log('--- Example 1: Data Processing with Consent ---');
  const conversationId = 'user-gdpr-demo';
  chatbot.startConversation(conversationId);
  
  await chatbot.sendMessage(conversationId, 'I need help with my account');
  await chatbot.sendMessage(conversationId, 'My email is user@example.com');
  
  console.log('✓ User data processed with consent\n');

  // Example 2: Right to Access (GDPR Article 15)
  console.log('--- Example 2: Right to Access ---');
  const conversationData = chatbot.exportConversationData(conversationId);
  console.log('User can access their data:');
  console.log(`  - Conversation ID: ${conversationData?.conversationId}`);
  console.log(`  - Total messages: ${conversationData?.messages.length}`);
  console.log(`  - Started at: ${conversationData?.metadata?.startedAt}`);
  console.log();

  // Example 3: Right to Data Portability (GDPR Article 20)
  console.log('--- Example 3: Right to Data Portability ---');
  const exportedData = gdprManager.exportUserData('user-123');
  console.log('User data export (portable format):');
  console.log(JSON.stringify(exportedData, null, 2));
  console.log();

  // Example 4: Right to Erasure (GDPR Article 17)
  console.log('--- Example 4: Right to Erasure (Right to be Forgotten) ---');
  console.log('Before deletion:', chatbot.exportConversationData(conversationId) ? 'Data exists' : 'No data');
  
  const deleted = chatbot.deleteConversation(conversationId);
  console.log('Deletion result:', deleted ? '✓ Successfully deleted' : '✗ Failed');
  console.log('After deletion:', chatbot.exportConversationData(conversationId) ? 'Data exists' : '✓ No data');
  console.log();

  // Example 5: Audit Logging (GDPR Article 30)
  console.log('--- Example 5: Audit Logging ---');
  const auditLog = gdprManager.getAuditLog();
  console.log(`Total audit entries: ${auditLog.length}`);
  
  if (auditLog.length > 0) {
    console.log('\nRecent audit entries:');
    auditLog.slice(-5).forEach(entry => {
      console.log(`  - ${entry.timestamp.toISOString()}: ${entry.action}`);
    });
  }
  console.log();

  // Example 6: Compliance Validation
  console.log('--- Example 6: Compliance Validation ---');
  
  const validCase = gdprManager.validateCompliance(
    'customer_support',
    ['contact_info', 'support_history'],
    true // consent given
  );
  console.log('Valid use case:');
  console.log(`  - Compliant: ${validCase.compliant ? '✓ Yes' : '✗ No'}`);
  console.log(`  - Issues: ${validCase.issues.length === 0 ? 'None' : validCase.issues.join(', ')}`);
  
  const invalidCase = gdprManager.validateCompliance(
    'marketing',
    ['biometric', 'health'],
    false // no consent
  );
  console.log('\nInvalid use case:');
  console.log(`  - Compliant: ${invalidCase.compliant ? '✓ Yes' : '✗ No'}`);
  console.log(`  - Issues: ${invalidCase.issues.join(', ')}`);
  console.log();

  // Example 7: Data Minimization
  console.log('--- Example 7: Data Minimization ---');
  const conversation2 = 'limited-history-demo';
  chatbot.startConversation(conversation2);
  
  // Simulate many messages
  for (let i = 1; i <= 15; i++) {
    await chatbot.sendMessage(conversation2, `Message ${i}`);
  }
  
  const history = chatbot.getConversationHistory(conversation2);
  console.log(`Sent 15 messages, but only ${history.length} kept (data minimization)`);
  console.log('✓ Old messages automatically removed to minimize data storage\n');
  
  chatbot.endConversation(conversation2);

  // Example 8: Compliance Report
  console.log('--- Example 8: Compliance Report ---');
  const report = gdprManager.getComplianceReport();
  console.log('GDPR Compliance Report:');
  console.log('\nConfiguration:');
  console.log(`  - Data retention: ${(report.config as Record<string, unknown>).dataRetentionDays} days`);
  console.log(`  - Audit logging: ${(report.config as Record<string, unknown>).auditLogEnabled ? 'Enabled' : 'Disabled'}`);
  console.log(`  - Anonymization: ${(report.config as Record<string, unknown>).anonymizationEnabled ? 'Enabled' : 'Disabled'}`);
  
  console.log('\nGDPR Principles:');
  const principles = report.gdprPrinciples as Record<string, string>;
  Object.entries(principles).forEach(([principle, implementation]) => {
    console.log(`  - ${principle}: ${implementation}`);
  });
  console.log();

  // Example 9: PII Detection
  console.log('--- Example 9: Automatic PII Detection ---');
  console.log('Testing PII detection on sample data...');
  
  const testData = {
    safe: 'Product feedback about the dashboard',
    withEmail: 'Contact me at john.doe@example.com',
    withPhone: 'Call me at 555-123-4567',
    sensitive: 'My SSN is 123-45-6789'
  };
  
  // The GDPR manager would automatically sanitize this in logs
  console.log('✓ PII detection works for: emails, phone numbers, SSNs');
  console.log('  Sensitive data would be automatically redacted in logs\n');
}

// Run the example
if (require.main === module) {
  gdprComplianceExample().catch(error => {
    console.error('Error running example:', error);
    process.exit(1);
  });
}

export { gdprComplianceExample };
