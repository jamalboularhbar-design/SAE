import { describe, it, expect } from 'vitest';

describe('Batch 20: Admin Permissions (Role Delegation)', () => {
  it('should export getUserPermissions function', async () => {
    const db = await import('./db');
    expect(typeof db.getUserPermissions).toBe('function');
  });
  it('should export grantPermission function', async () => {
    const db = await import('./db');
    expect(typeof db.grantPermission).toBe('function');
  });
  it('should export revokePermission function', async () => {
    const db = await import('./db');
    expect(typeof db.revokePermission).toBe('function');
  });
  it('should export getAllPermissions function', async () => {
    const db = await import('./db');
    expect(typeof db.getAllPermissions).toBe('function');
  });
});

describe('Batch 20: Approval SLA Config', () => {
  it('should export getSlaConfig function', async () => {
    const db = await import('./db');
    expect(typeof db.getSlaConfig).toBe('function');
  });
  it('should export upsertSlaConfig function', async () => {
    const db = await import('./db');
    expect(typeof db.upsertSlaConfig).toBe('function');
  });
  it('should export getDocsExceedingSla function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocsExceedingSla).toBe('function');
  });
});

describe('Batch 20: Webhook Event Logs', () => {
  it('should export getWebhookEventLogs function', async () => {
    const db = await import('./db');
    expect(typeof db.getWebhookEventLogs).toBe('function');
  });
  it('should export retryWebhookEvent function', async () => {
    const db = await import('./db');
    expect(typeof db.retryWebhookEvent).toBe('function');
  });
  it('should export logWebhookEvent function', async () => {
    const db = await import('./db');
    expect(typeof db.logWebhookEvent).toBe('function');
  });
});

describe('Batch 20: Document Access Requests', () => {
  it('should export createAccessRequest function', async () => {
    const db = await import('./db');
    expect(typeof db.createAccessRequest).toBe('function');
  });
  it('should export getAccessRequests function', async () => {
    const db = await import('./db');
    expect(typeof db.getAccessRequests).toBe('function');
  });
  it('should export reviewAccessRequest function', async () => {
    const db = await import('./db');
    expect(typeof db.reviewAccessRequest).toBe('function');
  });
  it('should export getUserAccessRequests function', async () => {
    const db = await import('./db');
    expect(typeof db.getUserAccessRequests).toBe('function');
  });
});

describe('Batch 20: Version Comparison', () => {
  it('should export getDocumentVersionById function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentVersionById).toBe('function');
  });
});

describe('Batch 20: Batch AI Summarization', () => {
  it('should export getDocumentsWithoutSummary function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentsWithoutSummary).toBe('function');
  });
});

describe('Batch 20: Onboarding Progress', () => {
  it('should export getOnboardingProgress function', async () => {
    const db = await import('./db');
    expect(typeof db.getOnboardingProgress).toBe('function');
  });
  it('should export completeOnboardingTask function', async () => {
    const db = await import('./db');
    expect(typeof db.completeOnboardingTask).toBe('function');
  });
  it('should export initOnboardingTasks function', async () => {
    const db = await import('./db');
    expect(typeof db.initOnboardingTasks).toBe('function');
  });
});

describe('Batch 20: Document Citations', () => {
  it('should export getCachedCitation function', async () => {
    const db = await import('./db');
    expect(typeof db.getCachedCitation).toBe('function');
  });
  it('should export saveCitation function', async () => {
    const db = await import('./db');
    expect(typeof db.saveCitation).toBe('function');
  });
});

describe('Batch 20: Router exports', () => {
  it('should export appRouter with batch 20 routers', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter).toBeDefined();
    const procedures = Object.keys(appRouter._def.procedures);
    expect(procedures).toContain('adminPermissions.list');
    expect(procedures).toContain('adminPermissions.grant');
    expect(procedures).toContain('adminPermissions.revoke');
    expect(procedures).toContain('approvalSla.getConfig');
    expect(procedures).toContain('approvalSla.updateConfig');
    expect(procedures).toContain('approvalSla.getOverdue');
    expect(procedures).toContain('webhookEvents.list');
    expect(procedures).toContain('webhookEvents.retry');
    expect(procedures).toContain('accessRequests.create');
    expect(procedures).toContain('accessRequests.listAll');
    expect(procedures).toContain('accessRequests.review');
    expect(procedures).toContain('accessRequests.myRequests');
    expect(procedures).toContain('versionCompare.getVersion');
    expect(procedures).toContain('batchSummarize.getUnsummarized');
    expect(procedures).toContain('batchSummarize.summarize');
    expect(procedures).toContain('onboarding.get');
    expect(procedures).toContain('onboarding.complete');
    expect(procedures).toContain('systemHealth.status');
    expect(procedures).toContain('citations.get');
    expect(procedures).toContain('citations.generate');
  });
});
