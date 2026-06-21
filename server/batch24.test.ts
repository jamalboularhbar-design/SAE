import { describe, it, expect } from 'vitest';
import {
  getDocumentChangeLog,
  getUserLandingPreference,
  setUserLandingPreference,
  getDocumentCrossReferences,
  getAllCrossReferences,
  addDocumentCrossReference,
  updateCrossReferenceStatus,
  getUserEngagementScorecards,
  getUserEngagementScorecard,
  upsertUserEngagementScorecard,
  getScheduledAnnouncements,
  createScheduledAnnouncement,
  updateScheduledAnnouncement,
  deleteScheduledAnnouncement,
  createBulkExportJob,
  getBulkExportJobs,
  updateBulkExportJob,
} from './db';

describe('Batch 24 – Document Change Log', () => {
  it('getDocumentChangeLogs returns an array', async () => {
    const result = await getDocumentChangeLog({ days: 30 });
    expect(Array.isArray(result)).toBe(true);
  });

  it('getDocumentChangeLogs accepts changeType filter', async () => {
    const result = await getDocumentChangeLog({ days: 7, changeType: 'created' });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('Batch 24 – Landing Preference', () => {
  it('getUserLandingPreference returns null or object', async () => {
    const result = await getUserLandingPreference('test-user-pref');
    expect(result === null || typeof result === 'object').toBe(true);
  });

  it('setUserLandingPreference saves preference', async () => {
    const result = await setUserLandingPreference('test-user-pref', '/dashboard');
    expect(result).toBeDefined();
  });
});

describe('Batch 24 – Cross-References', () => {
  it('getAllCrossReferences returns an array', async () => {
    const result = await getAllCrossReferences();
    expect(Array.isArray(result)).toBe(true);
  });

  it('getDocumentCrossReferences returns an array', async () => {
    const result = await getDocumentCrossReferences(1);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('Batch 24 – Engagement Scorecards', () => {
  it('getUserEngagementScorecards returns an array', async () => {
    const result = await getUserEngagementScorecards();
    expect(Array.isArray(result)).toBe(true);
  });

  it('getUserEngagementScorecard returns null or object', async () => {
    const result = await getUserEngagementScorecard('test-user-score');
    expect(result === null || result === undefined || typeof result === 'object').toBe(true);
  });
});

describe('Batch 24 – Scheduled Announcements', () => {
  it('getScheduledAnnouncements returns an array', async () => {
    const result = await getScheduledAnnouncements({});
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('Batch 24 – Bulk Export Jobs', () => {
  it('getBulkExportJobs returns an array', async () => {
    const result = await getBulkExportJobs('test-user-export');
    expect(Array.isArray(result)).toBe(true);
  });
});
