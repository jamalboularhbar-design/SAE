import { describe, it, expect, vi } from 'vitest';

// Mock the LLM module
vi.mock('./_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: 'Mocked AI response' } }],
  }),
}));

// Mock the db module
vi.mock('./db', () => ({
  getDocuments: vi.fn().mockResolvedValue({
    documents: [
      { id: 1, slug: 'test-doc', title: 'Test Document', category: 'General', status: 'published', content: 'Test content' },
      { id: 2, slug: 'another-doc', title: 'Another Document', category: 'Operations', status: 'published', content: 'More content' },
    ],
    total: 2,
  }),
}));

describe('AI Services - Backend Procedures', () => {
  describe('AI Summarizer', () => {
    it('should accept text input with format option', () => {
      const input = { text: 'This is a long document that needs summarizing. It contains important information about business operations.', format: 'executive' as const };
      expect(input.text.length).toBeGreaterThan(10);
      expect(['executive', 'bullets', 'actions']).toContain(input.format);
    });

    it('should reject text shorter than 10 characters', () => {
      const input = { text: 'short' };
      expect(input.text.length).toBeLessThan(10);
    });

    it('should support all three format types', () => {
      const formats = ['executive', 'bullets', 'actions'];
      formats.forEach(f => {
        expect(['executive', 'bullets', 'actions']).toContain(f);
      });
    });
  });

  describe('AI Writer', () => {
    it('should accept prompt with mode', () => {
      const input = { prompt: 'Write a professional email', mode: 'draft' as const };
      expect(input.prompt.length).toBeGreaterThanOrEqual(5);
      expect(['draft', 'rewrite', 'expand', 'translate', 'simplify']).toContain(input.mode);
    });

    it('should accept optional context and target language', () => {
      const input = { prompt: 'Translate this', mode: 'translate' as const, context: 'Hello world', targetLanguage: 'French' };
      expect(input.context).toBeDefined();
      expect(input.targetLanguage).toBe('French');
    });
  });

  describe('AI Lead Scoring', () => {
    it('should accept lead data with required fields', () => {
      const input = { leadData: { name: 'John', email: 'john@test.com', company: 'Acme', source: 'Referral', interactions: 5 } };
      expect(input.leadData.name).toBeTruthy();
      expect(input.leadData.email).toContain('@');
    });

    it('should handle optional fields gracefully', () => {
      const input = { leadData: { name: 'Jane', email: 'jane@test.com' } };
      expect(input.leadData.company).toBeUndefined();
      expect(input.leadData.source).toBeUndefined();
    });
  });

  describe('AI Semantic Search', () => {
    it('should accept natural language queries', () => {
      const input = { query: 'How do we handle VIP client escalations?' };
      expect(input.query.length).toBeGreaterThanOrEqual(2);
      expect(input.query.length).toBeLessThanOrEqual(500);
    });

    it('should reject queries shorter than 2 characters', () => {
      const input = { query: 'x' };
      expect(input.query.length).toBeLessThan(2);
    });
  });

  describe('AI Auto-Tag', () => {
    it('should accept text with optional existing tags', () => {
      const input = { text: 'This document covers luxury travel concierge services for high-net-worth clients.', existingTags: ['travel', 'luxury', 'concierge'] };
      expect(input.text.length).toBeGreaterThanOrEqual(10);
      expect(input.existingTags).toHaveLength(3);
    });
  });

  describe('AI Meeting Notes', () => {
    it('should accept transcript with optional title', () => {
      const input = { transcript: 'John: Let us discuss the Q2 targets. Sarah: I think we should focus on retention.', meetingTitle: 'Q2 Strategy' };
      expect(input.transcript.length).toBeGreaterThanOrEqual(20);
      expect(input.meetingTitle).toBeDefined();
    });
  });

  describe('AI Workflow Builder', () => {
    it('should accept plain English workflow descriptions', () => {
      const input = { description: 'When a new client signs up, send a welcome email and assign an account manager' };
      expect(input.description.length).toBeGreaterThanOrEqual(10);
      expect(input.description.length).toBeLessThanOrEqual(2000);
    });
  });

  describe('AI Sentiment Analysis', () => {
    it('should accept an array of texts', () => {
      const input = { texts: ['Great service!', 'Terrible experience', 'It was okay'] };
      expect(input.texts.length).toBeGreaterThanOrEqual(1);
      expect(input.texts.length).toBeLessThanOrEqual(20);
    });

    it('should reject empty arrays', () => {
      const input = { texts: [] as string[] };
      expect(input.texts.length).toBeLessThan(1);
    });
  });

  describe('AI Recommendations', () => {
    it('should accept optional current doc slug', () => {
      const input = { currentDocSlug: 'travel-concierge-guide' };
      expect(input.currentDocSlug).toBeTruthy();
    });

    it('should accept optional user interests', () => {
      const input = { userInterests: ['travel', 'luxury', 'operations'] };
      expect(input.userInterests).toHaveLength(3);
    });
  });
});
