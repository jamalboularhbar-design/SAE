import { describe, it, expect } from 'vitest';
import {
  getDashboardWidgetConfig,
  saveDashboardWidgetConfig,
  rollbackDocumentVersion,
  saveBrokenLinkScanResults,
  getBrokenLinkScanResults,
  getSavedSearchFilters,
  createSavedSearchFilter,
  deleteSavedSearchFilter,
  incrementSavedFilterUsage,
  getDocumentReadingEstimate,
  saveDuplicateContentResults,
  getDuplicateContentResults,
  updateDuplicateScanStatus,
  getUserDocCollections,
  createUserDocCollection,
  deleteUserDocCollection,
  getUserDocCollectionItems,
  addDocToCollection,
  removeDocFromCollection,
  getPerformanceBenchmarks,
  savePerformanceBenchmark,
  getKnowledgeGraphData,
} from './db';

describe('Batch 25 – Dashboard Widget Config', () => {
  it('getDashboardWidgetConfig returns an array', async () => {
    const result = await getDashboardWidgetConfig('test-user-widget');
    expect(Array.isArray(result)).toBe(true);
  });
  it('saveDashboardWidgetConfig saves widgets', async () => {
    const result = await saveDashboardWidgetConfig('test-user-widget', [
      { widgetKey: 'stats-overview', position: 0, visible: 1, width: 'full' },
      { widgetKey: 'recent-activity', position: 1, visible: 0, width: 'half' },
    ]);
    expect(result).toBeDefined();
  });
  it('getDashboardWidgetConfig returns saved config', async () => {
    const result = await getDashboardWidgetConfig('test-user-widget');
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Batch 25 – Version Rollback', () => {
  it('rollbackDocumentVersion handles non-existent slug gracefully', async () => {
    const result = await rollbackDocumentVersion('non-existent-slug-xyz', 999, 'test-user');
    // Should not throw, may return success false or handle gracefully
    expect(result).toBeDefined();
  });
});

describe('Batch 25 – Broken Link Scanner', () => {
  it('getBrokenLinkScanResults returns an array', async () => {
    const result = await getBrokenLinkScanResults();
    expect(Array.isArray(result)).toBe(true);
  });
  it('saveBrokenLinkScanResults saves results', async () => {
    const result = await saveBrokenLinkScanResults([
      { documentId: 1, documentTitle: 'Test Doc', linkUrl: 'https://broken.example.com', linkType: 'external', statusCode: 404, errorMessage: 'Not Found' },
    ]);
    expect(result).toBeDefined();
  });
  it('getBrokenLinkScanResults returns saved results', async () => {
    const result = await getBrokenLinkScanResults({ linkType: 'external' });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Batch 25 – Saved Search Filters', () => {
  it('getSavedSearchFilters returns an array', async () => {
    const result = await getSavedSearchFilters('test-user-filters');
    expect(Array.isArray(result)).toBe(true);
  });
  it('createSavedSearchFilter creates a filter', async () => {
    const result = await createSavedSearchFilter({
      userOpenId: 'test-user-filters',
      name: 'My Test Filter',
      filterConfig: JSON.stringify({ category: 'Operations', tags: ['travel'] }),
    });
    expect(result).toBeDefined();
  });
  it('incrementSavedFilterUsage increments usage', async () => {
    const filters = await getSavedSearchFilters('test-user-filters');
    if (filters.length > 0) {
      const result = await incrementSavedFilterUsage(filters[0].id);
      expect(result).toBeDefined();
    }
  });
});

describe('Batch 25 – Reading Time Estimate', () => {
  it('getDocumentReadingEstimate returns null or object for non-existent slug', async () => {
    const result = await getDocumentReadingEstimate('non-existent-slug-xyz');
    expect(result === null || typeof result === 'object').toBe(true);
  });
});

describe('Batch 25 – Duplicate Content Detector', () => {
  it('getDuplicateContentResults returns an array', async () => {
    const result = await getDuplicateContentResults();
    expect(Array.isArray(result)).toBe(true);
  });
  it('saveDuplicateContentResults saves results', async () => {
    const result = await saveDuplicateContentResults([
      { sourceDocId: 1, sourceDocTitle: 'Doc A', targetDocId: 2, targetDocTitle: 'Doc B', similarityScore: 0.75 },
    ]);
    expect(result).toBeDefined();
  });
  it('getDuplicateContentResults with status filter', async () => {
    const result = await getDuplicateContentResults({ status: 'pending' });
    expect(Array.isArray(result)).toBe(true);
  });
  it('updateDuplicateScanStatus updates status', async () => {
    const results = await getDuplicateContentResults();
    if (results.length > 0) {
      const updated = await updateDuplicateScanStatus(results[0].id, 'resolved');
      expect(updated).toBeDefined();
    }
  });
});

describe('Batch 25 – User Document Collections', () => {
  it('getUserDocCollections returns an array', async () => {
    const result = await getUserDocCollections('test-user-collections');
    expect(Array.isArray(result)).toBe(true);
  });
  it('createUserDocCollection creates a collection', async () => {
    const result = await createUserDocCollection({
      userOpenId: 'test-user-collections',
      name: 'My Test Collection',
      description: 'A test collection',
    });
    expect(result).toBeDefined();
  });
  it('getUserDocCollections returns created collection', async () => {
    const result = await getUserDocCollections('test-user-collections');
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
  it('getUserDocCollectionItems returns an array', async () => {
    const collections = await getUserDocCollections('test-user-collections');
    if (collections.length > 0) {
      const items = await getUserDocCollectionItems(collections[0].id);
      expect(Array.isArray(items)).toBe(true);
    }
  });
});

describe('Batch 25 – Performance Benchmarks', () => {
  it('getPerformanceBenchmarks returns an array', async () => {
    const result = await getPerformanceBenchmarks();
    expect(Array.isArray(result)).toBe(true);
  });
  it('savePerformanceBenchmark saves a benchmark', async () => {
    const result = await savePerformanceBenchmark({
      metricKey: 'test-metric',
      metricLabel: 'Test Metric',
      baselineValue: 100,
      currentValue: 120,
      periodStart: new Date('2025-01-01'),
      periodEnd: new Date('2025-01-31'),
      trend: 'up',
    });
    expect(result).toBeDefined();
  });
  it('getPerformanceBenchmarks returns saved benchmark', async () => {
    const result = await getPerformanceBenchmarks();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Batch 25 – Knowledge Graph', () => {
  it('getKnowledgeGraphData returns nodes and edges', async () => {
    const result = await getKnowledgeGraphData();
    expect(result).toBeDefined();
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(Array.isArray(result.edges)).toBe(true);
  });
});
