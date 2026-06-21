import { describe, it, expect } from 'vitest';
import {
  getComparativePeriodAnalytics,
  getTrendingDocuments,
  runDocumentQualityAudit,
  getLatestQualityAudits,
  recordReadingSession,
  getReadingSessionAnalytics,
  getDocumentFreshnessReport,
  getEmailDigestConfig,
  upsertEmailDigestConfig,
  getDocumentMedia,
  addDocumentMedia,
  removeDocumentMedia,
  getPublicSiteStats,
} from './db';

describe('Batch 21 - Follow-up Features', () => {
  describe('Feature 1: Comparative Period Analytics', () => {
    it('should return current and previous period data', async () => {
      const result = await getComparativePeriodAnalytics(30);
      expect(result).toHaveProperty('current');
      expect(result).toHaveProperty('previous');
      expect(result!.current).toHaveProperty('views');
      expect(result!.current).toHaveProperty('downloads');
      expect(result!.current).toHaveProperty('ratings');
      expect(result!.current).toHaveProperty('readers');
      expect(result!.previous).toHaveProperty('views');
    });
  });

  describe('Feature 4: Trending Documents', () => {
    it('should return trending documents array', async () => {
      const result = await getTrendingDocuments(5);
      expect(result).toBeDefined();
    });
  });

  describe('Feature 5: Quality Audit', () => {
    it('should return quality audit results', async () => {
      const audits = await getLatestQualityAudits();
      expect(Array.isArray(audits)).toBe(true);
    });
  });

  describe('Feature 6: Reading Session Analytics', () => {
    it('should record a reading session', async () => {
      await expect(recordReadingSession({
        visitorId: 'test-visitor-batch21',
        documentSlug: 'test-doc',
        durationSeconds: 120,
        scrollDepthPercent: 85,
        completed: 1,
      })).resolves.not.toThrow();
    });

    it('should return session analytics', async () => {
      const result = await getReadingSessionAnalytics(30);
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('overTime');
    });
  });

  describe('Feature 7: Document Freshness Report', () => {
    it('should return freshness report with daysSinceUpdate', async () => {
      const result = await getDocumentFreshnessReport();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('slug');
        expect(result[0]).toHaveProperty('daysSinceUpdate');
      }
    });
  });

  describe('Feature 8: Email Digest Config', () => {
    it('should return null for non-existent config', async () => {
      const result = await getEmailDigestConfig('nonexistent-owner');
      expect(result).toBeNull();
    });

    it('should upsert email digest config', async () => {
      await expect(upsertEmailDigestConfig({
        ownerId: 'test-owner-batch21',
        frequency: 'weekly',
        includeMetrics: 1,
        includeTopDocs: 1,
        includeNewDocs: 1,
      })).resolves.not.toThrow();
    });
  });

  describe('Feature 9: Document Media', () => {
    it('should return empty array for non-existent slug', async () => {
      const result = await getDocumentMedia('nonexistent-slug-batch21');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('Feature 10: Public Site Stats', () => {
    it('should return site statistics', async () => {
      const result = await getPublicSiteStats();
      expect(result).toHaveProperty('totalDocs');
      expect(result).toHaveProperty('totalViews');
      expect(result).toHaveProperty('totalCategories');
      expect(result).toHaveProperty('totalReaders');
      expect(result).toHaveProperty('growthByMonth');
    });
  });
});
