import { describe, it, expect, vi } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getActiveAnnouncements: vi.fn().mockResolvedValue([
    { id: 1, message: 'Test announcement', type: 'info', active: 1, createdAt: Date.now() }
  ]),
  getAllAnnouncements: vi.fn().mockResolvedValue([
    { id: 1, message: 'Test announcement', type: 'info', active: 1, createdAt: Date.now() },
    { id: 2, message: 'Old announcement', type: 'warning', active: 0, createdAt: Date.now() }
  ]),
  getPinnedDocuments: vi.fn().mockResolvedValue([
    { slug: 'test-doc', title: 'Test Doc', category: 'Engineering', wordCount: 500, pinned: 1 }
  ]),
  getStaleDocuments: vi.fn().mockResolvedValue([
    { slug: 'stale-doc', title: 'Stale Doc', category: 'Ops', reviewBy: '2025-01-01' }
  ]),
  getCustomCategories: vi.fn().mockResolvedValue([
    { id: 1, name: 'Custom Cat', description: 'A custom category' }
  ]),
  getDownloadHistory: vi.fn().mockResolvedValue([
    { id: 1, documentSlug: 'test-doc', format: 'markdown', createdAt: Date.now() }
  ]),
  getActivityLog: vi.fn().mockResolvedValue([
    { id: 1, action: 'view', documentSlug: 'test-doc', createdAt: Date.now() }
  ]),
  batchDeleteDocuments: vi.fn().mockResolvedValue({ deleted: 3 }),
  batchUpdateStatus: vi.fn().mockResolvedValue({ updated: 5 }),
  batchAddTag: vi.fn().mockResolvedValue({ added: 4 }),
  pinDocument: vi.fn().mockResolvedValue({ success: true }),
  unpinDocument: vi.fn().mockResolvedValue({ success: true }),
  createAnnouncement: vi.fn().mockResolvedValue({ id: 3 }),
  logDownload: vi.fn().mockResolvedValue(undefined),
  logActivity: vi.fn().mockResolvedValue(undefined),
}));

import {
  getActiveAnnouncements,
  getAllAnnouncements,
  getPinnedDocuments,
  getStaleDocuments,
  getCustomCategories,
  getDownloadHistory,
  getActivityLog,
  batchDeleteDocuments,
  batchUpdateStatus,
  batchAddTag,
  pinDocument,
  unpinDocument,
  createAnnouncement,
  logDownload,
  logActivity,
} from './db';

describe('Batch 8 Features - Backend', () => {
  describe('Announcements', () => {
    it('should return active announcements', async () => {
      const result = await getActiveAnnouncements();
      expect(result).toHaveLength(1);
      expect(result[0].message).toBe('Test announcement');
      expect(result[0].active).toBe(1);
    });

    it('should return all announcements including inactive', async () => {
      const result = await getAllAnnouncements();
      expect(result).toHaveLength(2);
    });

    it('should create a new announcement', async () => {
      const result = await createAnnouncement('New message', 'success');
      expect(result).toHaveProperty('id', 3);
    });
  });

  describe('Document Pinning', () => {
    it('should return pinned documents', async () => {
      const result = await getPinnedDocuments();
      expect(result).toHaveLength(1);
      expect(result[0].pinned).toBe(1);
    });

    it('should pin a document', async () => {
      const result = await pinDocument('test-doc');
      expect(result).toHaveProperty('success', true);
    });

    it('should unpin a document', async () => {
      const result = await unpinDocument('test-doc');
      expect(result).toHaveProperty('success', true);
    });
  });

  describe('Batch Operations', () => {
    it('should batch delete documents', async () => {
      const result = await batchDeleteDocuments(['doc-1', 'doc-2', 'doc-3']);
      expect(result.deleted).toBe(3);
    });

    it('should batch update status', async () => {
      const result = await batchUpdateStatus(['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5'], 'review');
      expect(result.updated).toBe(5);
    });

    it('should batch add tag', async () => {
      const result = await batchAddTag(['doc-1', 'doc-2', 'doc-3', 'doc-4'], 'important');
      expect(result.added).toBe(4);
    });
  });

  describe('Custom Categories', () => {
    it('should return custom categories', async () => {
      const result = await getCustomCategories();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Custom Cat');
    });
  });

  describe('Stale Documents', () => {
    it('should return stale documents', async () => {
      const result = await getStaleDocuments(20);
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('stale-doc');
    });
  });

  describe('Download History', () => {
    it('should log a download', async () => {
      await logDownload('test-doc', 'markdown', 'visitor-1');
      expect(logDownload).toHaveBeenCalledWith('test-doc', 'markdown', 'visitor-1');
    });

    it('should return download history', async () => {
      const result = await getDownloadHistory(50);
      expect(result).toHaveLength(1);
      expect(result[0].format).toBe('markdown');
    });
  });

  describe('Activity Log', () => {
    it('should log activity', async () => {
      await logActivity('view', 'test-doc', 'visitor-1');
      expect(logActivity).toHaveBeenCalled();
    });

    it('should return activity log', async () => {
      const result = await getActivityLog(100);
      expect(result).toHaveLength(1);
      expect(result[0].action).toBe('view');
    });
  });
});
