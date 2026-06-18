import { describe, it, expect } from 'vitest';

describe('Advanced Analytics: DB Helpers', () => {
  it('should export getReadingActivityOverTime function', async () => {
    const db = await import('./db');
    expect(typeof db.getReadingActivityOverTime).toBe('function');
  });
  it('should export getEngagementOverTime function', async () => {
    const db = await import('./db');
    expect(typeof db.getEngagementOverTime).toBe('function');
  });
  it('should export getActivityBreakdown function', async () => {
    const db = await import('./db');
    expect(typeof db.getActivityBreakdown).toBe('function');
  });
  it('should export getTopDocsByEngagement function', async () => {
    const db = await import('./db');
    expect(typeof db.getTopDocsByEngagement).toBe('function');
  });
  it('should export getContentGrowthOverTime function', async () => {
    const db = await import('./db');
    expect(typeof db.getContentGrowthOverTime).toBe('function');
  });
  it('should export getAnalyticsSummary function', async () => {
    const db = await import('./db');
    expect(typeof db.getAnalyticsSummary).toBe('function');
  });
  it('should export getHourlyActivityHeatmap function', async () => {
    const db = await import('./db');
    expect(typeof db.getHourlyActivityHeatmap).toBe('function');
  });
});

describe('Advanced Analytics: Router exports', () => {
  it('should export appRouter with advanced analytics procedures', async () => {
    const { appRouter } = await import('./routers');
    expect(appRouter).toBeDefined();
    const procedures = Object.keys(appRouter._def.procedures);
    expect(procedures).toContain('advancedAnalytics.summary');
    expect(procedures).toContain('advancedAnalytics.readingActivity');
    expect(procedures).toContain('advancedAnalytics.engagement');
    expect(procedures).toContain('advancedAnalytics.activityBreakdown');
    expect(procedures).toContain('advancedAnalytics.topByEngagement');
    expect(procedures).toContain('advancedAnalytics.contentGrowth');
    expect(procedures).toContain('advancedAnalytics.hourlyHeatmap');
  });
});
