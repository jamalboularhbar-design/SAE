import { describe, it, expect } from 'vitest';

describe('Batch 16: AI Summarization', () => {
  it('should export saveAISummary function', async () => {
    const db = await import('./db');
    expect(typeof db.saveAISummary).toBe('function');
  });
  it('should export getAISummary function', async () => {
    const db = await import('./db');
    expect(typeof db.getAISummary).toBe('function');
  });
});

describe('Batch 16: Document Translation', () => {
  it('should export saveTranslation function', async () => {
    const db = await import('./db');
    expect(typeof db.saveTranslation).toBe('function');
  });
  it('should export getTranslation function', async () => {
    const db = await import('./db');
    expect(typeof db.getTranslation).toBe('function');
  });
  it('should export getTranslationsForDocument function', async () => {
    const db = await import('./db');
    expect(typeof db.getTranslationsForDocument).toBe('function');
  });
});

describe('Batch 16: User Preferences', () => {
  it('should export getUserPreferences function', async () => {
    const db = await import('./db');
    expect(typeof db.getUserPreferences).toBe('function');
  });
  it('should export saveUserPreferences function', async () => {
    const db = await import('./db');
    expect(typeof db.saveUserPreferences).toBe('function');
  });
});

describe('Batch 16: Word Count Analytics', () => {
  it('should export getWordCountAnalytics function', async () => {
    const db = await import('./db');
    expect(typeof db.getWordCountAnalytics).toBe('function');
  });
});

describe('Batch 16: Broken Links Checker', () => {
  it('should export getAllDocumentLinks function', async () => {
    const db = await import('./db');
    expect(typeof db.getAllDocumentLinks).toBe('function');
  });
});

describe('Batch 16: Reading Streak Leaderboard', () => {
  it('should export getReadingStreakLeaderboard function', async () => {
    const db = await import('./db');
    expect(typeof db.getReadingStreakLeaderboard).toBe('function');
  });
  it('should export updateStreakLeaderboard function', async () => {
    const db = await import('./db');
    expect(typeof db.updateStreakLeaderboard).toBe('function');
  });
});

describe('Batch 16: Document Changelog Diff', () => {
  it('should export getDocumentVersionsForDiff function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentVersionsForDiff).toBe('function');
  });
});

describe('Batch 16: Router exports', () => {
  it('should export appRouter with batch 16 routers', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter._def.procedures).toHaveProperty('aiSummary.generate');
    expect(appRouter._def.procedures).toHaveProperty('aiSummary.get');
    expect(appRouter._def.procedures).toHaveProperty('translation.generate');
    expect(appRouter._def.procedures).toHaveProperty('translation.get');
    expect(appRouter._def.procedures).toHaveProperty('translation.list');
    expect(appRouter._def.procedures).toHaveProperty('preferences.get');
    expect(appRouter._def.procedures).toHaveProperty('preferences.save');
    expect(appRouter._def.procedures).toHaveProperty('wordCountAnalytics.get');
    expect(appRouter._def.procedures).toHaveProperty('brokenLinks.check');
    expect(appRouter._def.procedures).toHaveProperty('streakLeaderboard.get');
    expect(appRouter._def.procedures).toHaveProperty('streakLeaderboard.recordRead');
    expect(appRouter._def.procedures).toHaveProperty('changelogDiff.get');
  });
});
