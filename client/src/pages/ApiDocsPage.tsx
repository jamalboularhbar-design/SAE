import { useState } from 'react';
import { Code, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

const API_ENDPOINTS = [
  {
    group: 'Documents',
    endpoints: [
      { method: 'GET', path: '/api/trpc/documents.list', description: 'List documents with filtering, sorting, and pagination', params: 'category?, search?, sort?, limit?, offset?, status?, tags?, minReadingTime?, maxReadingTime?' },
      { method: 'GET', path: '/api/trpc/documents.getBySlug', description: 'Get a single document by its slug', params: 'slug' },
      { method: 'GET', path: '/api/trpc/documents.categories', description: 'Get all document categories with counts', params: 'none' },
      { method: 'GET', path: '/api/trpc/documents.related', description: 'Get related documents in the same category', params: 'slug, category, limit?' },
      { method: 'GET', path: '/api/trpc/documents.stats', description: 'Get aggregate document statistics', params: 'none' },
      { method: 'GET', path: '/api/trpc/documents.popular', description: 'Get most popular documents by engagement score', params: 'limit?' },
      { method: 'GET', path: '/api/trpc/documents.pinned', description: 'Get pinned/featured documents', params: 'none' },
      { method: 'POST', path: '/api/trpc/documents.recordView', description: 'Increment view count for a document', params: 'slug' },
      { method: 'POST', path: '/api/trpc/documents.rate', description: 'Rate a document (up/down)', params: 'slug, visitorId, rating' },
      { method: 'POST', path: '/api/trpc/documents.generateSummary', description: 'Generate AI summary for a document', params: 'slug' },
    ],
  },
  {
    group: 'Search',
    endpoints: [
      { method: 'GET', path: '/api/trpc/relevanceSearch.search', description: 'Full-text search with weighted relevance scoring', params: 'query, category?, locale?, limit?' },
      { method: 'POST', path: '/api/trpc/searchAnalytics.log', description: 'Log a search query for analytics', params: 'query, resultCount, visitorId?' },
      { method: 'POST', path: '/api/trpc/searchAnalytics.logClick', description: 'Log a search result click', params: 'query, clickedSlug, visitorId?' },
    ],
  },
  {
    group: 'Tags',
    endpoints: [
      { method: 'GET', path: '/api/trpc/tags.all', description: 'Get all tags with document counts', params: 'none' },
      { method: 'GET', path: '/api/trpc/tags.forDocument', description: 'Get tags for a specific document', params: 'slug' },
      { method: 'GET', path: '/api/trpc/tags.documentsByTag', description: 'Get all documents with a specific tag', params: 'tag' },
      { method: 'POST', path: '/api/trpc/tags.add', description: 'Add a tag to a document', params: 'documentSlug, tag' },
      { method: 'POST', path: '/api/trpc/tags.remove', description: 'Remove a tag from a document', params: 'documentSlug, tag' },
    ],
  },
  {
    group: 'Glossary',
    endpoints: [
      { method: 'GET', path: '/api/trpc/glossary.list', description: 'Get all glossary terms, optionally filtered by category', params: 'category?' },
    ],
  },
  {
    group: 'Templates',
    endpoints: [
      { method: 'GET', path: '/api/trpc/templates.list', description: 'Get all document templates', params: 'category?' },
      { method: 'GET', path: '/api/trpc/templates.getById', description: 'Get a specific template with full content', params: 'id' },
      { method: 'POST', path: '/api/trpc/templates.use', description: 'Use a template (increments usage count)', params: 'id' },
    ],
  },
  {
    group: 'Reading Lists',
    endpoints: [
      { method: 'GET', path: '/api/trpc/readingLists.list', description: 'Get reading lists for a visitor', params: 'visitorId' },
      { method: 'POST', path: '/api/trpc/readingLists.create', description: 'Create a new reading list', params: 'visitorId, name, description?' },
      { method: 'GET', path: '/api/trpc/readingLists.items', description: 'Get items in a reading list', params: 'listId' },
      { method: 'POST', path: '/api/trpc/readingLists.addItem', description: 'Add a document to a reading list', params: 'listId, documentSlug' },
      { method: 'POST', path: '/api/trpc/readingLists.removeItem', description: 'Remove a document from a reading list', params: 'listId, documentSlug' },
    ],
  },
  {
    group: 'Reading Goals',
    endpoints: [
      { method: 'GET', path: '/api/trpc/readingGoals.get', description: 'Get weekly reading progress and badges', params: 'visitorId' },
      { method: 'POST', path: '/api/trpc/readingGoals.setGoal', description: 'Set weekly reading target', params: 'visitorId, weeklyTarget' },
      { method: 'POST', path: '/api/trpc/readingGoals.recordCompletion', description: 'Record a document read completion', params: 'visitorId, documentSlug' },
    ],
  },
  {
    group: 'Dependencies',
    endpoints: [
      { method: 'GET', path: '/api/trpc/dependencies.prerequisites', description: 'Get prerequisite documents for a document', params: 'slug' },
      { method: 'GET', path: '/api/trpc/dependencies.dependents', description: 'Get documents that depend on this document', params: 'slug' },
    ],
  },
  {
    group: 'Comments',
    endpoints: [
      { method: 'GET', path: '/api/trpc/comments.list', description: 'Get comments for a document', params: 'documentSlug' },
      { method: 'POST', path: '/api/trpc/comments.add', description: 'Add a comment to a document', params: 'documentSlug, visitorId, content' },
      { method: 'POST', path: '/api/trpc/comments.delete', description: 'Delete a comment (owner only)', params: 'id, visitorId' },
    ],
  },
];

export default function ApiDocsPage() {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Documents']));
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-8 h-8 text-[#d4af37]" />
          <div>
            <h1 className="text-3xl font-bold text-[#d4af37]">API Documentation</h1>
            <p className="text-muted-foreground text-sm">Public REST-like endpoints for external integrations</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Overview</h2>
          <p className="text-foreground/80 text-sm mb-3">
            This API uses <strong>tRPC over HTTP</strong>. All endpoints are accessible via standard HTTP requests.
            Query procedures use GET with URL-encoded JSON input, and mutation procedures use POST with JSON body.
          </p>
          <div className="bg-muted rounded p-4 font-mono text-sm">
            <p className="text-muted-foreground mb-1"># Example: List documents</p>
            <p className="text-green-400">GET /api/trpc/documents.list?input={`{"json":{"limit":10}}`}</p>
            <p className="text-muted-foreground mt-3 mb-1"># Example: Record a view</p>
            <p className="text-blue-400">POST /api/trpc/documents.recordView</p>
            <p className="text-muted-foreground">Content-Type: application/json</p>
            <p className="text-yellow-300">{`{"json":{"slug":"my-document-slug"}}`}</p>
          </div>
        </div>

        {/* Authentication Note */}
        <div className="bg-card border border-amber-500/30 rounded-lg p-4 mb-6">
          <p className="text-amber-400 text-sm font-medium">Authentication</p>
          <p className="text-muted-foreground text-sm mt-1">
            Public endpoints (GET queries, ratings, comments) require no authentication.
            Admin endpoints (create, update, delete, analytics) require an authenticated session cookie with admin role.
          </p>
        </div>

        {/* Endpoints */}
        <div className="space-y-3">
          {API_ENDPOINTS.map(group => (
            <div key={group.group} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleGroup(group.group)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {expandedGroups.has(group.group) ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <span className="font-semibold">{group.group}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{group.endpoints.length}</span>
                </div>
              </button>
              {expandedGroups.has(group.group) && (
                <div className="border-t border-border">
                  {group.endpoints.map(ep => (
                    <div key={ep.path} className="p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/50">
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                          {ep.method}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <code className="text-sm text-foreground font-mono truncate">{ep.path}</code>
                            <button onClick={() => copyPath(ep.path)} className="text-muted-foreground hover:text-[#d4af37] shrink-0">
                              {copiedPath === ep.path ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{ep.description}</p>
                          <p className="text-xs text-muted-foreground mt-1 font-mono">Params: {ep.params}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
