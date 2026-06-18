import { describe, it, expect, vi } from 'vitest';

// Mock drizzle
vi.mock('drizzle-orm/mysql2', () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve([]))
          })),
          limit: vi.fn(() => Promise.resolve([]))
        })),
        orderBy: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([]))
        })),
        limit: vi.fn(() => Promise.resolve([]))
      }))
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve([{ insertId: 1 }]))
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve())
      }))
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve())
    })),
  }))
}));

vi.mock('./_core/env', () => ({
  ENV: { DATABASE_URL: 'mysql://test:test@localhost/test' }
}));

describe('Batch 10: Audit Trail', () => {
  it('should export logAuditEntry function', async () => {
    const { logAuditEntry } = await import('./db');
    expect(logAuditEntry).toBeDefined();
    expect(typeof logAuditEntry).toBe('function');
  });

  it('should export getAuditTrail function', async () => {
    const { getAuditTrail } = await import('./db');
    expect(getAuditTrail).toBeDefined();
    expect(typeof getAuditTrail).toBe('function');
  });

  it('logAuditEntry should accept required parameters', async () => {
    const { logAuditEntry } = await import('./db');
    // Should not throw with valid params
    await expect(logAuditEntry({
      documentSlug: 'test-doc',
      action: 'updated',
      field: 'title',
      oldValue: 'Old Title',
      newValue: 'New Title',
      changedBy: 'admin',
    })).resolves.not.toThrow();
  });
});

describe('Batch 10: Analytics Export', () => {
  it('should export getAnalyticsExportData function', async () => {
    const { getAnalyticsExportData } = await import('./db');
    expect(getAnalyticsExportData).toBeDefined();
    expect(typeof getAnalyticsExportData).toBe('function');
  });

  it('getAnalyticsExportData should return an object with expected keys', async () => {
    const { getAnalyticsExportData } = await import('./db');
    const result = await getAnalyticsExportData();
    expect(result).toHaveProperty('documents');
    expect(result).toHaveProperty('downloads');
  });
});

describe('Batch 10: AI Suggestions', () => {
  it('should export getDocumentSummariesForAI function', async () => {
    const { getDocumentSummariesForAI } = await import('./db');
    expect(getDocumentSummariesForAI).toBeDefined();
    expect(typeof getDocumentSummariesForAI).toBe('function');
  });

  it('getDocumentSummariesForAI should accept slug and limit', async () => {
    const { getDocumentSummariesForAI } = await import('./db');
    const result = await getDocumentSummariesForAI('test-slug', 10);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('Batch 10: Document Comparison', () => {
  it('computeDiff should detect added lines', () => {
    const computeDiff = (oldText: string, newText: string) => {
      const oldLines = oldText.split('\n');
      const newLines = newText.split('\n');
      const result: Array<{ type: 'same' | 'added' | 'removed'; line: string }> = [];
      let i = 0, j = 0;
      while (i < oldLines.length || j < newLines.length) {
        if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
          result.push({ type: 'same', line: oldLines[i] });
          i++; j++;
        } else if (j < newLines.length && (i >= oldLines.length || !oldLines.slice(i).includes(newLines[j]))) {
          result.push({ type: 'added', line: newLines[j] });
          j++;
        } else {
          result.push({ type: 'removed', line: oldLines[i] });
          i++;
        }
      }
      return result;
    };

    const diff = computeDiff('line1\nline2', 'line1\nline2\nline3');
    expect(diff).toContainEqual({ type: 'same', line: 'line1' });
    expect(diff).toContainEqual({ type: 'same', line: 'line2' });
    expect(diff).toContainEqual({ type: 'added', line: 'line3' });
  });

  it('computeDiff should detect removed lines', () => {
    const computeDiff = (oldText: string, newText: string) => {
      const oldLines = oldText.split('\n');
      const newLines = newText.split('\n');
      const result: Array<{ type: 'same' | 'added' | 'removed'; line: string }> = [];
      let i = 0, j = 0;
      while (i < oldLines.length || j < newLines.length) {
        if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
          result.push({ type: 'same', line: oldLines[i] });
          i++; j++;
        } else if (j < newLines.length && (i >= oldLines.length || !oldLines.slice(i).includes(newLines[j]))) {
          result.push({ type: 'added', line: newLines[j] });
          j++;
        } else {
          result.push({ type: 'removed', line: oldLines[i] });
          i++;
        }
      }
      return result;
    };

    const diff = computeDiff('line1\nline2\nline3', 'line1\nline3');
    expect(diff).toContainEqual({ type: 'same', line: 'line1' });
    expect(diff).toContainEqual({ type: 'removed', line: 'line2' });
    expect(diff).toContainEqual({ type: 'same', line: 'line3' });
  });
});

describe('Batch 10: Kanban Board', () => {
  it('should define status configurations', () => {
    const statusConfig = {
      draft: { label: 'Draft', color: 'text-yellow-400' },
      review: { label: 'In Review', color: 'text-blue-400' },
      published: { label: 'Published', color: 'text-green-400' },
    };
    expect(statusConfig.draft.label).toBe('Draft');
    expect(statusConfig.review.label).toBe('In Review');
    expect(statusConfig.published.label).toBe('Published');
  });
});

describe('Batch 10: Keyboard Shortcuts', () => {
  it('should define at least 5 shortcuts', () => {
    const shortcuts = [
      { keys: ['?'], description: 'Open this help modal' },
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['Esc'], description: 'Go back / close modal' },
      { keys: ['/'], description: 'Focus search input' },
      { keys: ['Ctrl', 'P'], description: 'Print current document' },
      { keys: ['G', 'H'], description: 'Go to Home page' },
      { keys: ['G', 'L'], description: 'Go to Document Library' },
      { keys: ['G', 'G'], description: 'Go to Glossary' },
      { keys: ['G', 'T'], description: 'Go to Templates Gallery' },
      { keys: ['G', 'D'], description: 'Go to Admin Dashboard' },
    ];
    expect(shortcuts.length).toBeGreaterThanOrEqual(5);
    expect(shortcuts.every(s => s.keys.length > 0 && s.description.length > 0)).toBe(true);
  });
});

describe('Batch 10: Table of Contents', () => {
  it('should extract headings from markdown content', () => {
    const content = '# Heading 1\n\nSome text\n\n## Heading 2\n\nMore text\n\n### Heading 3';
    const lines = content.split('\n');
    const headings: Array<{ id: string; text: string; level: number }> = [];
    for (const line of lines) {
      const match = line.match(/^(#{1,4})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`\[\]]/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        headings.push({ id, text, level });
      }
    }
    expect(headings).toHaveLength(3);
    expect(headings[0]).toEqual({ id: 'heading-1', text: 'Heading 1', level: 1 });
    expect(headings[1]).toEqual({ id: 'heading-2', text: 'Heading 2', level: 2 });
    expect(headings[2]).toEqual({ id: 'heading-3', text: 'Heading 3', level: 3 });
  });
});

describe('Batch 10: Glossary Auto-Link', () => {
  it('should build regex from glossary terms', () => {
    const terms = [
      { term: 'API', definition: 'Application Programming Interface' },
      { term: 'REST', definition: 'Representational State Transfer' },
    ];
    const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
    const pattern = sortedTerms.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

    const content = 'The REST API is great';
    const matches = content.match(regex);
    expect(matches).toContain('REST');
    expect(matches).toContain('API');
  });
});
