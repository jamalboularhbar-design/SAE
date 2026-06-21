import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import {
  FileText, Search, Filter, ChevronDown, ChevronUp,
  Server, Users, DollarSign, ShieldCheck, BarChart3,
  Megaphone, Package, Heart, Scale, Handshake, Database,
  Settings, Bot, Briefcase, ArrowUpDown
} from 'lucide-react';
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis
} from '@/components/ui/pagination';
import DocumentLibrarySkeleton from './DocumentLibrarySkeleton';
import BulkExport from './BulkExport';
import KeyboardNavigation from './KeyboardNavigation';
import { usePreferences } from '@/hooks/usePreferences';
import SavedFilters from './SavedFilters';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Pin } from 'lucide-react';

const SCROLL_POSITION_KEY = 'doclib_scroll_position';

const CATEGORY_ICONS: Record<string, any> = {
  'Engineering': Server,
  'Customer Success': Users,
  'Sales': DollarSign,
  'Marketing': Megaphone,
  'Product': Package,
  'People & Culture': Heart,
  'Finance & Legal': Scale,
  'Security & Compliance': ShieldCheck,
  'Revenue & Pricing': BarChart3,
  'Partnerships & GTM': Handshake,
  'Data & Analytics': Database,
  'Operations': Settings,
  'AI & Developer': Bot,
  'Strategy & Operations': Briefcase,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Engineering': 'Infrastructure, architecture, and development processes',
  'Customer Success': 'Client onboarding, retention, and support workflows',
  'Sales': 'Pipeline management, deal execution, and revenue processes',
  'Marketing': 'Brand strategy, campaigns, and demand generation',
  'Product': 'Roadmap planning, feature delivery, and user research',
  'People & Culture': 'Hiring, onboarding, culture, and team development',
  'Finance & Legal': 'Budgeting, compliance, contracts, and financial operations',
  'Security & Compliance': 'Data protection, audits, and regulatory frameworks',
  'Revenue & Pricing': 'Pricing strategy, monetization, and revenue optimization',
  'Partnerships & GTM': 'Partner programs, co-selling, and go-to-market motions',
  'Data & Analytics': 'Data pipelines, BI, and analytics infrastructure',
  'Operations': 'Internal tooling, process automation, and operational efficiency',
  'AI & Developer': 'AI/ML workflows, developer experience, and platform tools',
  'Strategy & Operations': 'Strategic planning, OKRs, and cross-functional alignment',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Engineering': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Customer Success': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Sales': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Marketing': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Product': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  'People & Culture': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  'Finance & Legal': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Security & Compliance': 'bg-red-500/15 text-red-400 border-red-500/30',
  'Revenue & Pricing': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'Partnerships & GTM': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  'Data & Analytics': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  'Operations': 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  'AI & Developer': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'Strategy & Operations': 'bg-stone-500/15 text-stone-400 border-stone-500/30',
};

const ITEMS_PER_PAGE = 24;

// Highlight matching text in search results
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-accent/30 text-accent rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function DocumentLibrary() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'review' | 'published'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { defaultSort } = usePreferences();
  const [sortBy, setSortBy] = useState<'alpha' | 'reading_time' | 'newest'>((defaultSort === 'reading_time' || defaultSort === 'newest') ? defaultSort : 'alpha');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Restore scroll position when returning from detail page
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (saved) {
      const pos = parseInt(saved, 10);
      setTimeout(() => window.scrollTo(0, pos), 100);
      sessionStorage.removeItem(SCROLL_POSITION_KEY);
    }
  }, []);

  // Save scroll position before navigating to detail page
  const navigateToDoc = useCallback((slug: string) => {
    sessionStorage.setItem(SCROLL_POSITION_KEY, String(window.scrollY));
    navigate(`/docs/${slug}`);
  }, [navigate]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories from database
  const { data: categoriesData, isLoading: categoriesLoading } = trpc.documents.categories.useQuery();

  // Fetch custom categories to merge into filter pills
  const { data: customCategoriesData } = trpc.customCategories.list.useQuery();

  // Fetch pinned documents to show at top
  const { data: pinnedDocs } = trpc.documents.pinned.useQuery();

  // Fetch category ordering for display order
  const { data: categoryOrderData } = trpc.categoryOrder.get.useQuery();

  // Fetch documents from database - fetch all for category view, paginate for filtered
  const { data: documentsData, isLoading: documentsLoading, error: documentsError } = trpc.documents.list.useQuery({
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    search: debouncedSearch.trim() || undefined,
    sort: sortBy,
    limit: 600,
    offset: 0,
    status: isAdmin && statusFilter !== 'all' ? statusFilter : undefined,
  });

  const categories = categoriesData ?? [];
  // Merge custom categories into the category list
  const customCats = customCategoriesData ?? [];
  const mergedCategories = useMemo(() => {
    const existing = new Set(categories.map(c => c.category));
    const extras = customCats.filter((cc: any) => !existing.has(cc.name)).map((cc: any) => ({ category: cc.name, count: 0 }));
    const merged = [...categories, ...extras];
    // Apply saved category ordering if available
    if (categoryOrderData && categoryOrderData.length > 0) {
      const orderMap = new Map(categoryOrderData.map((o: any) => [o.categoryName, o.sortOrder]));
      merged.sort((a, b) => {
        const orderA = orderMap.get(a.category) ?? 999;
        const orderB = orderMap.get(b.category) ?? 999;
        return orderA - orderB;
      });
    }
    return merged;
  }, [categories, customCats, categoryOrderData]);
  const totalDocuments = mergedCategories.reduce((sum, c) => sum + c.count, 0);
  const categoryList = mergedCategories.map(c => c.category);
  const categoryCounts: Record<string, number> = {};
  mergedCategories.forEach(c => { categoryCounts[c.category] = c.count; });

  const documents = documentsData?.documents ?? [];
  const filteredTotal = documentsData?.total ?? 0;

  // Log search analytics
  const logSearchMutation = trpc.searchAnalytics.log.useMutation();
  useEffect(() => {
    if (debouncedSearch.trim() && documentsData) {
      logSearchMutation.mutate({ query: debouncedSearch.trim(), resultCount: filteredTotal });
    }
  }, [debouncedSearch, filteredTotal]);

  // Grouped by category for category view
  const groupedDocs = useMemo(() => {
    const groups: Record<string, typeof documents> = {};
    documents.forEach(doc => {
      if (!groups[doc.category]) groups[doc.category] = [];
      groups[doc.category].push(doc);
    });
    return groups;
  }, [documents]);

  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const visibleDocs = documents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const hasMore = currentPage < totalPages;

  const isLoading = categoriesLoading || documentsLoading;

  const toggleCategoryExpand = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <section className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-border/50">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6 sm:mb-8 flex-wrap gap-3 sm:gap-4">
        <div>
          <div className="inline-block mb-2 sm:mb-3 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <p className="text-xs font-semibold text-accent tracking-wider uppercase">Complete Library</p>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl mb-2 text-foreground">Document Library</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            <span className="text-accent font-semibold">{totalDocuments}</span> operational documents across{' '}
            <span className="text-accent font-semibold">{categoryList.length}</span> categories
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all text-sm"
            aria-label="Search documents by title or content"
            role="searchbox"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[200px] overflow-y-auto sm:max-h-none sm:overflow-visible">
          <button
            onClick={() => { setSelectedCategory('All'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              selectedCategory === 'All'
                ? 'bg-accent/20 text-accent border-accent/40'
                : 'bg-card/50 text-muted-foreground border-border/50 hover:border-accent/30'
            }`}
          >
            All ({totalDocuments})
          </button>
          {Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, catCount]) => {
              const Icon = CATEGORY_ICONS[cat] || FileText;
              const description = CATEGORY_DESCRIPTIONS[cat];
              return (
                <Tooltip key={cat}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => { setSelectedCategory(cat === selectedCategory ? 'All' : cat); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                        selectedCategory === cat
                          ? 'bg-accent/20 text-accent border-accent/40'
                          : 'bg-card/50 text-muted-foreground border-border/50 hover:border-accent/30'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {cat} ({catCount})
                    </button>
                  </TooltipTrigger>
                  {description && (
                    <TooltipContent side="bottom" className="max-w-[200px] text-center">
                      <p className="text-xs">{description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
        </div>
      </div>

      {/* Status Filter (Admin only) */}
      {isAdmin && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground font-medium">Status:</span>
          {(['all', 'draft', 'review', 'published'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
                statusFilter === s
                  ? 'bg-accent/20 text-accent border-accent/40'
                  : 'bg-card/50 text-muted-foreground border-border/50 hover:border-accent/30'
              }`}
            >
              {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Pinned Documents */}
      {!isLoading && pinnedDocs && pinnedDocs.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Pin className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-foreground">Pinned</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {pinnedDocs.map((doc: any) => (
              <button
                key={doc.slug}
                onClick={() => navigateToDoc(doc.slug)}
                className="p-3 rounded-lg bg-background/50 border border-amber-500/20 hover:border-amber-500/50 transition-colors text-left"
              >
                <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">{doc.category}</Badge>
                  {doc.wordCount && <span className="text-[10px] text-muted-foreground">{Math.ceil(doc.wordCount / 200)} min</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <DocumentLibrarySkeleton />}

      {/* Error State */}
      {documentsError && !isLoading && (
        <div className="text-center py-16">
          <Filter className="w-12 h-12 text-red-400/30 mx-auto mb-4" />
          <p className="text-red-400">Failed to load documents. Please try again.</p>
        </div>
      )}

      {/* Sort Controls & Results Count */}
      {!isLoading && (searchQuery || selectedCategory !== 'All') && (
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">
            {searchQuery ? (
              <>Found <span className="text-accent font-semibold">{filteredTotal}</span> document{filteredTotal !== 1 ? 's' : ''} matching "{searchQuery}"{selectedCategory !== 'All' && ` in ${selectedCategory}`}</>
            ) : (
              <><span className="text-accent font-semibold">{filteredTotal}</span> documents in {selectedCategory}</>
            )}
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
              className="text-xs bg-card border border-border/50 rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:border-accent/50"
            >
              <option value="alpha">A-Z</option>
              <option value="reading_time">Reading Time</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      )}

      {/* Saved Filters */}
      <div className="mb-4">
        <SavedFilters
          currentFilter={{ category: selectedCategory, sort: sortBy, search: searchQuery, status: statusFilter }}
          onApplyFilter={(config) => {
            if (config.category) setSelectedCategory(config.category);
            if (config.sort) setSortBy(config.sort);
            if (config.search !== undefined) setSearchQuery(config.search);
            if (config.status) setStatusFilter(config.status);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Category View (when no search and All selected) */}
      {!isLoading && !searchQuery && selectedCategory === 'All' ? (
        <div className="space-y-4">
          {Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => {
              const Icon = CATEGORY_ICONS[cat] || FileText;
              const isExpanded = expandedCategories.has(cat);
              const catDocs = groupedDocs[cat] || [];
              const colorClass = CATEGORY_COLORS[cat] || 'bg-muted/30 text-muted-foreground border-border/50';
              
              return (
                <div key={cat} className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
                  <div
                    className="w-full flex items-center justify-between p-4 hover:bg-card/50 transition-colors cursor-pointer"
                    onClick={() => toggleCategoryExpand(cat)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCategoryExpand(cat); } }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass.split(' ')[0]}`}>
                        <Icon className={`w-4.5 h-4.5 ${colorClass.split(' ')[1]}`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground text-sm">{cat}</h3>
                        <p className="text-xs text-muted-foreground">{count} document{count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <BulkExport category={cat} />
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t border-border/30 p-4">
                      <div className="flex justify-end mb-3">
                        <button
                          onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                          className="text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          View all {count} docs →
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {catDocs.map(doc => (
                          <button
                            key={doc.slug}
                            onClick={() => navigateToDoc(doc.slug)}
                            className="p-3 rounded-lg bg-background/50 border border-border/30 hover:border-accent/30 transition-colors group text-left w-full"
                          >
                            <div className="flex items-start gap-2.5">
                              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">{doc.title}</p>
                                {doc.wordCount && (
                                  <p className="text-[10px] text-muted-foreground mt-1">{Math.ceil((doc.wordCount || 0) / 200)} min read</p>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : !isLoading ? (
        /* List View (when searching or category selected) */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {visibleDocs.map((doc, docIdx) => {
              const colorClass = CATEGORY_COLORS[doc.category] || 'bg-muted/30 text-muted-foreground border-border/50';
              return (
                <button
                  key={doc.slug}
                  data-nav-index={docIdx}
                  onClick={() => navigateToDoc(doc.slug)}
                  className="p-3 sm:p-4 rounded-xl bg-card/30 border border-border/50 hover:border-accent/30 active:bg-card/50 transition-all group text-left"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 group-hover:text-accent transition-colors" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                        <HighlightText text={doc.title} query={debouncedSearch} />
                      </p>
                      {debouncedSearch && (doc as any).snippet && (
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                          ...{(() => {
                            const raw = (doc as any).snippet.replace(/^#.*\n?/gm, '').replace(/\n/g, ' ').trim().substring(0, 140);
                            return <HighlightText text={raw + '...'} query={debouncedSearch} />;
                          })()}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0 border ${colorClass}`}>
                          {doc.category}
                        </Badge>
                        {doc.wordCount && (
                          <span className="text-[10px] text-muted-foreground">{Math.ceil((doc.wordCount || 0) / 200)} min read</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} />
                    </PaginationItem>
                  )}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Page {currentPage} of {totalPages} ({documents.length} documents)
              </p>
            </div>
          )}
          
          {documents.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No documents found matching your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-3 text-accent text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      ) : null}
      <KeyboardNavigation items={visibleDocs || []} enabled={!isLoading && visibleDocs.length > 0} />
    </section>
  );
}
