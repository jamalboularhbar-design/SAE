import { describe, it, expect, vi } from 'vitest';

// Mock drizzle
vi.mock('./db', async () => {
  const actual = await vi.importActual('./db') as any;
  return actual;
});

describe('Batch 12: Branding Settings', () => {
  it('should export getBrandingSettings function', async () => {
    const db = await import('./db');
    expect(typeof db.getBrandingSettings).toBe('function');
  });

  it('should export upsertBrandingSetting function', async () => {
    const db = await import('./db');
    expect(typeof db.upsertBrandingSetting).toBe('function');
  });
});

describe('Batch 12: Inline Comments', () => {
  it('should export getInlineComments function', async () => {
    const db = await import('./db');
    expect(typeof db.getInlineComments).toBe('function');
  });

  it('should export addInlineComment function', async () => {
    const db = await import('./db');
    expect(typeof db.addInlineComment).toBe('function');
  });

  it('should export deleteInlineComment function', async () => {
    const db = await import('./db');
    expect(typeof db.deleteInlineComment).toBe('function');
  });
});

describe('Batch 12: Webhooks', () => {
  it('should export getWebhooks function', async () => {
    const db = await import('./db');
    expect(typeof db.getWebhooks).toBe('function');
  });

  it('should export createWebhook function', async () => {
    const db = await import('./db');
    expect(typeof db.createWebhook).toBe('function');
  });

  it('should export updateWebhook function', async () => {
    const db = await import('./db');
    expect(typeof db.updateWebhook).toBe('function');
  });

  it('should export deleteWebhook function', async () => {
    const db = await import('./db');
    expect(typeof db.deleteWebhook).toBe('function');
  });
});

describe('Batch 12: Recently Viewed (Server)', () => {
  it('should export trackRecentlyViewed function', async () => {
    const db = await import('./db');
    expect(typeof db.trackRecentlyViewed).toBe('function');
  });

  it('should export getRecentlyViewed function', async () => {
    const db = await import('./db');
    expect(typeof db.getRecentlyViewed).toBe('function');
  });
});

describe('Batch 12: User Management', () => {
  it('should export getAllUsers function', async () => {
    const db = await import('./db');
    expect(typeof db.getAllUsers).toBe('function');
  });

  it('should export updateUserRole function', async () => {
    const db = await import('./db');
    expect(typeof db.updateUserRole).toBe('function');
  });

  it('should export getVisitorAnalytics function', async () => {
    const db = await import('./db');
    expect(typeof db.getVisitorAnalytics).toBe('function');
  });
});

describe('Batch 12: Document Export', () => {
  it('should export getDocumentForExport function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentForExport).toBe('function');
  });
});

describe('Batch 12: Archive', () => {
  it('should export archiveDocuments function', async () => {
    const db = await import('./db');
    expect(typeof db.archiveDocuments).toBe('function');
  });
});
