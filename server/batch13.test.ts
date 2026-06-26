import { describe, it, expect } from 'vitest';

describe('Batch 13: Document Feedback', () => {
  it('should export submitFeedback function', async () => {
    const db = await import('./db');
    expect(typeof db.submitFeedback).toBe('function');
  });

  it('should export getFeedbackForDocument function', async () => {
    const db = await import('./db');
    expect(typeof db.getFeedbackForDocument).toBe('function');
  });

  it('should export getMyFeedback function', async () => {
    const db = await import('./db');
    expect(typeof db.getMyFeedback).toBe('function');
  });
});

describe('Batch 13: Category Ordering', () => {
  it('should export getCategoryOrdering function', async () => {
    const db = await import('./db');
    expect(typeof db.getCategoryOrdering).toBe('function');
  });

  it('should export saveCategoryOrdering function', async () => {
    const db = await import('./db');
    expect(typeof db.saveCategoryOrdering).toBe('function');
  });
});

describe('Batch 13: Document Duplication', () => {
  it('should export duplicateDocument function', async () => {
    const db = await import('./db');
    expect(typeof db.duplicateDocument).toBe('function');
  });
});

describe('Batch 13: Reading History', () => {
  it('should export getReadingHistory function', async () => {
    const db = await import('./db');
    expect(typeof db.getReadingHistory).toBe('function');
  });
});

describe('Batch 13: Router exports', () => {
  it('should export appRouter with feedback router', async () => {
    const routers = await import('./routers');
    expect(routers.appRouter).toBeDefined();
    expect(routers.appRouter._def.procedures).toBeDefined();
  });
});
