import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock drizzle-orm/mysql2
vi.mock('drizzle-orm/mysql2', () => ({
  drizzle: vi.fn(() => null),
}));

describe('Batch 11: Bookmark Notes', () => {
  it('should export getBookmarkNotes function', async () => {
    const { getBookmarkNotes } = await import('./db');
    expect(typeof getBookmarkNotes).toBe('function');
  });

  it('should export upsertBookmarkNote function', async () => {
    const { upsertBookmarkNote } = await import('./db');
    expect(typeof upsertBookmarkNote).toBe('function');
  });

  it('should export deleteBookmarkNote function', async () => {
    const { deleteBookmarkNote } = await import('./db');
    expect(typeof deleteBookmarkNote).toBe('function');
  });
});

describe('Batch 11: Share Links', () => {
  it('should export createShareLink function', async () => {
    const { createShareLink } = await import('./db');
    expect(typeof createShareLink).toBe('function');
  });

  it('should export getShareLinkByToken function', async () => {
    const { getShareLinkByToken } = await import('./db');
    expect(typeof getShareLinkByToken).toBe('function');
  });

  it('should export incrementShareLinkAccess function', async () => {
    const { incrementShareLinkAccess } = await import('./db');
    expect(typeof incrementShareLinkAccess).toBe('function');
  });
});

describe('Batch 11: Scheduled Publish', () => {
  it('should export schedulePublish function', async () => {
    const { schedulePublish } = await import('./db');
    expect(typeof schedulePublish).toBe('function');
  });

  it('should export processScheduledPublishes function', async () => {
    const { processScheduledPublishes } = await import('./db');
    expect(typeof processScheduledPublishes).toBe('function');
  });

  it('should export cancelScheduledPublish function', async () => {
    const { cancelScheduledPublish } = await import('./db');
    expect(typeof cancelScheduledPublish).toBe('function');
  });
});

describe('Batch 11: Approval Queue', () => {
  it('should export getDocumentsInReview function', async () => {
    const { getDocumentsInReview } = await import('./db');
    expect(typeof getDocumentsInReview).toBe('function');
  });

  it('should export approveDocument function', async () => {
    const { approveDocument } = await import('./db');
    expect(typeof approveDocument).toBe('function');
  });

  it('should export rejectDocument function', async () => {
    const { rejectDocument } = await import('./db');
    expect(typeof rejectDocument).toBe('function');
  });
});

describe('Batch 11: Bulk Tag Management', () => {
  it('should export renameTag function', async () => {
    const { renameTag } = await import('./db');
    expect(typeof renameTag).toBe('function');
  });

  it('should export mergeTags function', async () => {
    const { mergeTags } = await import('./db');
    expect(typeof mergeTags).toBe('function');
  });

  it('should export deleteTagGlobally function', async () => {
    const { deleteTagGlobally } = await import('./db');
    expect(typeof deleteTagGlobally).toBe('function');
  });

  it('should export getAllTagsWithCounts function', async () => {
    const { getAllTagsWithCounts } = await import('./db');
    expect(typeof getAllTagsWithCounts).toBe('function');
  });
});

describe('Batch 11: Import from URL', () => {
  it('should export importDocumentFromContent function', async () => {
    const { importDocumentFromContent } = await import('./db');
    expect(typeof importDocumentFromContent).toBe('function');
  });
});

describe('Batch 11: Router exports', () => {
  it('should export appRouter with batch 11 routers', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter).toBeDefined();
    // Check new routers exist
    expect(appRouter._def.procedures).toHaveProperty('bookmarkNotes.list');
    expect(appRouter._def.procedures).toHaveProperty('shareLinks.create');
    expect(appRouter._def.procedures).toHaveProperty('scheduledPublish.schedule');
    expect(appRouter._def.procedures).toHaveProperty('approvals.list');
    expect(appRouter._def.procedures).toHaveProperty('tagManagement.listWithCounts');
    expect(appRouter._def.procedures).toHaveProperty('importFromUrl.import');
  });
});
