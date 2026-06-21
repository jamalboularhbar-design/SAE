import { describe, it, expect } from 'vitest';

describe('Batch 18: Custom Workflows', () => {
  it('should export createWorkflowStatus function', async () => {
    const db = await import('./db');
    expect(typeof db.createWorkflowStatus).toBe('function');
  });
  it('should export getWorkflowStatuses function', async () => {
    const db = await import('./db');
    expect(typeof db.getWorkflowStatuses).toBe('function');
  });
  it('should export deleteWorkflowStatus function', async () => {
    const db = await import('./db');
    expect(typeof db.deleteWorkflowStatus).toBe('function');
  });
  it('should export getWorkflowTransitions function', async () => {
    const db = await import('./db');
    expect(typeof db.getWorkflowTransitions).toBe('function');
  });
});

describe('Batch 18: Analytics Export', () => {
  it('should export getAnalyticsForExport function', async () => {
    const db = await import('./db');
    expect(typeof db.getAnalyticsForExport).toBe('function');
  });
});

describe('Batch 18: Archival Policy', () => {
  it('should export getStaleDocumentsForArchival function', async () => {
    const db = await import('./db');
    expect(typeof db.getStaleDocumentsForArchival).toBe('function');
  });
  it('should export archiveDocument function', async () => {
    const db = await import('./db');
    expect(typeof db.archiveDocument).toBe('function');
  });
  it('should export upsertArchivalPolicy function', async () => {
    const db = await import('./db');
    expect(typeof db.upsertArchivalPolicy).toBe('function');
  });
});

describe('Batch 18: Quick Edit Inline', () => {
  it('should export quickEditDocument function', async () => {
    const db = await import('./db');
    expect(typeof db.quickEditDocument).toBe('function');
  });
});

describe('Batch 18: Content Gap Analysis', () => {
  it('should export getContentGapSuggestions function', async () => {
    const db = await import('./db');
    expect(typeof db.getContentGapSuggestions).toBe('function');
  });
  it('should export saveContentGapSuggestions function', async () => {
    const db = await import('./db');
    expect(typeof db.saveContentGapSuggestions).toBe('function');
  });
});

describe('Batch 18: Duplicate Detector', () => {
  it('should export getDuplicateContentPairs function', async () => {
    const db = await import('./db');
    expect(typeof db.getDuplicateContentPairs).toBe('function');
  });
  it('should export saveDuplicatePair function', async () => {
    const db = await import('./db');
    expect(typeof db.saveDuplicatePair).toBe('function');
  });
});

describe('Batch 18: Activity Feed', () => {
  it('should export addActivityFeedEntry function', async () => {
    const db = await import('./db');
    expect(typeof db.addActivityFeedEntry).toBe('function');
  });
  it('should export getActivityFeed function', async () => {
    const db = await import('./db');
    expect(typeof db.getActivityFeed).toBe('function');
  });
});

describe('Batch 18: Router exports', () => {
  it('should export appRouter with batch 18 routers', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter).toBeDefined();
    const procedures = Object.keys(appRouter._def.procedures);
    expect(procedures).toContain('workflow.statuses');
    expect(procedures).toContain('workflow.createStatus');
    expect(procedures).toContain('analyticsExportFull.csv');
    expect(procedures).toContain('archival.staleDocs');
    expect(procedures).toContain('archival.archive');
    expect(procedures).toContain('quickEdit.update');
    expect(procedures).toContain('contentGap.analyze');
    expect(procedures).toContain('duplicates.scan');
  });
});
