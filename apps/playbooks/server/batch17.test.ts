import { describe, it, expect } from 'vitest';

describe('Batch 17: Saved Filters', () => {
  it('should export getSavedFilters function', async () => {
    const db = await import('./db');
    expect(typeof db.getSavedFilters).toBe('function');
  });
  it('should export createSavedFilter function', async () => {
    const db = await import('./db');
    expect(typeof db.createSavedFilter).toBe('function');
  });
  it('should export deleteSavedFilter function', async () => {
    const db = await import('./db');
    expect(typeof db.deleteSavedFilter).toBe('function');
  });
});

describe('Batch 17: Document Quiz', () => {
  it('should export getDocumentQuiz function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentQuiz).toBe('function');
  });
  it('should export saveDocumentQuiz function', async () => {
    const db = await import('./db');
    expect(typeof db.saveDocumentQuiz).toBe('function');
  });
});

describe('Batch 17: Review Reminders', () => {
  it('should export getReviewReminders function', async () => {
    const db = await import('./db');
    expect(typeof db.getReviewReminders).toBe('function');
  });
  it('should export createReviewReminder function', async () => {
    const db = await import('./db');
    expect(typeof db.createReviewReminder).toBe('function');
  });
  it('should export deleteReviewReminder function', async () => {
    const db = await import('./db');
    expect(typeof db.deleteReviewReminder).toBe('function');
  });
  it('should export getOverdueReviews function', async () => {
    const db = await import('./db');
    expect(typeof db.getOverdueReviews).toBe('function');
  });
});

describe('Batch 17: Document Annotations', () => {
  it('should export getDocumentAnnotations function', async () => {
    const db = await import('./db');
    expect(typeof db.getDocumentAnnotations).toBe('function');
  });
  it('should export createAnnotation function', async () => {
    const db = await import('./db');
    expect(typeof db.createAnnotation).toBe('function');
  });
  it('should export deleteAnnotation function', async () => {
    const db = await import('./db');
    expect(typeof db.deleteAnnotation).toBe('function');
  });
  it('should export updateAnnotationNote function', async () => {
    const db = await import('./db');
    expect(typeof db.updateAnnotationNote).toBe('function');
  });
});

describe('Batch 17: Bulk Tag Assignment', () => {
  it('should export bulkAssignTags function', async () => {
    const db = await import('./db');
    expect(typeof db.bulkAssignTags).toBe('function');
  });
  it('should export bulkRemoveTags function', async () => {
    const db = await import('./db');
    expect(typeof db.bulkRemoveTags).toBe('function');
  });
});

describe('Batch 17: Content Health', () => {
  it('should export getContentHealthScores function', async () => {
    const db = await import('./db');
    expect(typeof db.getContentHealthScores).toBe('function');
  });
});

describe('Batch 17: Related By Tags', () => {
  it('should export getRelatedByTags function', async () => {
    const db = await import('./db');
    expect(typeof db.getRelatedByTags).toBe('function');
  });
});

describe('Batch 17: Schema Tables', () => {
  it('should export savedFilters table from schema', async () => {
    const schema = await import('../drizzle/schema');
    expect(schema.savedFilters).toBeDefined();
  });
  it('should export documentQuizzes table from schema', async () => {
    const schema = await import('../drizzle/schema');
    expect(schema.documentQuizzes).toBeDefined();
  });
  it('should export reviewReminders table from schema', async () => {
    const schema = await import('../drizzle/schema');
    expect(schema.reviewReminders).toBeDefined();
  });
  it('should export documentAnnotations table from schema', async () => {
    const schema = await import('../drizzle/schema');
    expect(schema.documentAnnotations).toBeDefined();
  });
});
