import { describe, it, expect } from 'vitest';

describe('Batch 19: Admin Unified Dashboard', () => {
  it('should export getAdminDashboardStats function', async () => {
    const db = await import('./db');
    expect(typeof db.getAdminDashboardStats).toBe('function');
  });
});

describe('Batch 19: Document Snapshots', () => {
  it('should export createDocumentSnapshot function', async () => {
    const db = await import('./db');
    expect(typeof db.createDocumentSnapshot).toBe('function');
  });
  it('should export getDocumentSnapshots function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentSnapshots).toBe('function');
  });
  it('should export getSnapshotById function', async () => {
    const db = await import('./db');
    expect(typeof db.getSnapshotById).toBe('function');
  });
});

describe('Batch 19: Smart Recommendations', () => {
  it('should export getSmartRecommendations function', async () => {
    const db = await import('./db');
    expect(typeof db.getSmartRecommendations).toBe('function');
  });
});

describe('Batch 19: SEO Metadata', () => {
  it('should export upsertDocumentSeoMeta function', async () => {
    const db = await import('./db');
    expect(typeof db.upsertDocumentSeoMeta).toBe('function');
  });
  it('should export getDocumentSeoMeta function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentSeoMeta).toBe('function');
  });
});

describe('Batch 19: Notification Logs', () => {
  it('should export getSystemNotificationLog function', async () => {
    const db = await import('./db');
    expect(typeof db.getSystemNotificationLog).toBe('function');
  });
});

describe('Batch 19: User Personal Dashboard', () => {
  it('should export getUserPersonalStats function', async () => {
    const db = await import('./db');
    expect(typeof db.getUserPersonalStats).toBe('function');
  });
});

describe('Batch 19: Bulk Zip Export', () => {
  it('should export getDocumentsForZipExport function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentsForZipExport).toBe('function');
  });
});

describe('Batch 19: Cross References', () => {
  it('should export getAllDocumentTitlesAndSlugs function', async () => {
    const db = await import('./db');
    expect(typeof db.getAllDocumentTitlesAndSlugs).toBe('function');
  });
});

describe('Batch 19: Quiz Results', () => {
  it('should export saveQuizResult function', async () => {
    const db = await import('./db');
    expect(typeof db.saveQuizResult).toBe('function');
  });
});

describe('Batch 19: Router exports', () => {
  it('should export appRouter with batch 19 routers', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter).toBeDefined();
    const procedures = Object.keys(appRouter._def.procedures);
    expect(procedures).toContain('snapshots.list');
    expect(procedures).toContain('snapshots.create');
    expect(procedures).toContain('recommendations.get');
    expect(procedures).toContain('seoMeta.get');
    expect(procedures).toContain('seoMeta.upsert');
    expect(procedures).toContain('userDashboard.stats');
    expect(procedures).toContain('crossReferences.allTitles');
    expect(procedures).toContain('quizResults.save');
    expect(procedures).toContain('zipExport.getDocContents');
  });
});
