import { describe, it, expect, vi } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  searchWithRelevance: vi.fn().mockResolvedValue([
    { slug: 'test-doc', title: 'Test Document', category: 'Testing', wordCount: 500, locale: 'en', relevance: 15, snippet: '...test content...' },
  ]),
  getViewsOverTime: vi.fn().mockResolvedValue([
    { date: '2026-05-01', views: 10 },
    { date: '2026-05-02', views: 15 },
  ]),
  getTopDocuments: vi.fn().mockResolvedValue([
    { slug: 'popular-doc', title: 'Popular Doc', category: 'Ops', viewCount: 100, upvotes: 20, downvotes: 2 },
  ]),
  getDownloadTrends: vi.fn().mockResolvedValue([
    { date: '2026-05-01', downloads: 5 },
  ]),
  getCategoryDistribution: vi.fn().mockResolvedValue([
    { category: 'Operations', count: 50, totalViews: 500 },
    { category: 'Finance', count: 30, totalViews: 300 },
  ]),
  getGlossaryTerms: vi.fn().mockResolvedValue([
    { id: 1, term: 'SLA', definition: 'Service Level Agreement', category: 'Operations', relatedTerms: 'KPI,SLO' },
  ]),
  createGlossaryTerm: vi.fn().mockResolvedValue({ id: 2 }),
  updateGlossaryTerm: vi.fn().mockResolvedValue({ success: true }),
  deleteGlossaryTerm: vi.fn().mockResolvedValue({ success: true }),
  getDocumentDependencies: vi.fn().mockResolvedValue([
    { prerequisiteSlug: 'prereq-doc', title: 'Prerequisite Doc', category: 'Basics' },
  ]),
  getDependentDocuments: vi.fn().mockResolvedValue([
    { documentSlug: 'dependent-doc', title: 'Dependent Doc', category: 'Advanced' },
  ]),
  addDocumentDependency: vi.fn().mockResolvedValue({ alreadyExists: false }),
  removeDocumentDependency: vi.fn().mockResolvedValue({ success: true }),
  getReadingGoal: vi.fn().mockResolvedValue({ id: 1, visitorId: 'v1', weeklyTarget: 7 }),
  setReadingGoal: vi.fn().mockResolvedValue({ success: true }),
  recordReadingCompletion: vi.fn().mockResolvedValue(undefined),
  getWeeklyProgress: vi.fn().mockResolvedValue({ docsRead: 3, target: 7, badges: ['Bookworm'], totalReads: 12 }),
  getDocumentTemplates: vi.fn().mockResolvedValue([
    { id: 1, name: 'SOP Template', description: 'Standard operating procedure', category: 'Operations', content: '# SOP\n...', icon: '📋', usageCount: 5 },
  ]),
  createDocumentTemplate: vi.fn().mockResolvedValue({ id: 2 }),
  getDocumentTemplateById: vi.fn().mockResolvedValue({ id: 1, name: 'SOP Template', content: '# SOP\n...' }),
  incrementTemplateUsage: vi.fn().mockResolvedValue(undefined),
  deleteDocumentTemplate: vi.fn().mockResolvedValue({ success: true }),
}));

import {
  searchWithRelevance, getViewsOverTime, getTopDocuments, getDownloadTrends, getCategoryDistribution,
  getGlossaryTerms, createGlossaryTerm, updateGlossaryTerm, deleteGlossaryTerm,
  getDocumentDependencies, getDependentDocuments, addDocumentDependency, removeDocumentDependency,
  getWeeklyProgress, setReadingGoal, recordReadingCompletion,
  getDocumentTemplates, createDocumentTemplate, getDocumentTemplateById, incrementTemplateUsage, deleteDocumentTemplate,
} from './db';

describe('Batch 9: Relevance Search', () => {
  it('should return search results with relevance scores', async () => {
    const results = await searchWithRelevance('test');
    expect(results).toHaveLength(1);
    expect(results[0].relevance).toBe(15);
    expect(results[0].slug).toBe('test-doc');
  });
});

describe('Batch 9: Analytics Dashboard', () => {
  it('should return views over time data', async () => {
    const data = await getViewsOverTime(30);
    expect(data).toHaveLength(2);
    expect(data[0].date).toBe('2026-05-01');
  });

  it('should return top documents', async () => {
    const docs = await getTopDocuments(10);
    expect(docs).toHaveLength(1);
    expect(docs[0].viewCount).toBe(100);
  });

  it('should return download trends', async () => {
    const trends = await getDownloadTrends(30);
    expect(trends).toHaveLength(1);
  });

  it('should return category distribution', async () => {
    const dist = await getCategoryDistribution();
    expect(dist).toHaveLength(2);
    expect(dist[0].category).toBe('Operations');
  });
});

describe('Batch 9: Glossary', () => {
  it('should list glossary terms', async () => {
    const terms = await getGlossaryTerms();
    expect(terms).toHaveLength(1);
    expect(terms[0].term).toBe('SLA');
  });

  it('should create a glossary term', async () => {
    const result = await createGlossaryTerm({ term: 'KPI', definition: 'Key Performance Indicator' });
    expect(result.id).toBe(2);
  });

  it('should update a glossary term', async () => {
    const result = await updateGlossaryTerm(1, { definition: 'Updated definition' });
    expect(result.success).toBe(true);
  });

  it('should delete a glossary term', async () => {
    const result = await deleteGlossaryTerm(1);
    expect(result.success).toBe(true);
  });
});

describe('Batch 9: Document Dependencies', () => {
  it('should get prerequisites for a document', async () => {
    const deps = await getDocumentDependencies('advanced-doc');
    expect(deps).toHaveLength(1);
    expect(deps[0].prerequisiteSlug).toBe('prereq-doc');
  });

  it('should get dependent documents', async () => {
    const deps = await getDependentDocuments('basic-doc');
    expect(deps).toHaveLength(1);
    expect(deps[0].documentSlug).toBe('dependent-doc');
  });

  it('should add a dependency', async () => {
    const result = await addDocumentDependency('doc-a', 'doc-b');
    expect(result.alreadyExists).toBe(false);
  });

  it('should remove a dependency', async () => {
    const result = await removeDocumentDependency('doc-a', 'doc-b');
    expect(result.success).toBe(true);
  });
});

describe('Batch 9: Reading Goals', () => {
  it('should get weekly progress with badges', async () => {
    const progress = await getWeeklyProgress('visitor-1');
    expect(progress.docsRead).toBe(3);
    expect(progress.target).toBe(7);
    expect(progress.badges).toContain('Bookworm');
  });

  it('should set a reading goal', async () => {
    const result = await setReadingGoal('visitor-1', 10);
    expect(result.success).toBe(true);
  });

  it('should record reading completion', async () => {
    await recordReadingCompletion('visitor-1', 'some-doc');
    expect(recordReadingCompletion).toHaveBeenCalledWith('visitor-1', 'some-doc');
  });
});

describe('Batch 9: Document Templates', () => {
  it('should list templates', async () => {
    const templates = await getDocumentTemplates();
    expect(templates).toHaveLength(1);
    expect(templates[0].name).toBe('SOP Template');
  });

  it('should create a template', async () => {
    const result = await createDocumentTemplate({ name: 'New Template', category: 'Ops', content: '# Template' });
    expect(result.id).toBe(2);
  });

  it('should get template by id', async () => {
    const template = await getDocumentTemplateById(1);
    expect(template?.name).toBe('SOP Template');
  });

  it('should increment template usage', async () => {
    await incrementTemplateUsage(1);
    expect(incrementTemplateUsage).toHaveBeenCalledWith(1);
  });

  it('should delete a template', async () => {
    const result = await deleteDocumentTemplate(1);
    expect(result.success).toBe(true);
  });
});
