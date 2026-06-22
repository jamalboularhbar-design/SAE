import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft, FileText, Clock, BookOpen, Copy, Download,
  Bookmark, BookmarkCheck, Printer, ChevronRight, Loader2,
  Hash, AlertCircle, ArrowUp, ExternalLink, Link2, Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import ShareDocument from '@/components/ShareDocument';
import DocumentRating from '@/components/DocumentRating';
import AISummary from '@/components/AISummary';
import QuickActionsToolbar from '@/components/QuickActionsToolbar';
import DocumentTags from '@/components/DocumentTags';
const DocumentComments = lazy(() => import('@/components/DocumentComments'));
const DocumentVersionHistory = lazy(() => import('@/components/DocumentVersionHistory'));
import { recordReadingDay } from '@/components/ReadingStreak';
import DocumentDependencies from '@/components/DocumentDependencies';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import TableOfContents from '@/components/TableOfContents';
import AISuggestions from '@/components/AISuggestions';
import DistractionFreeMode from '@/components/DistractionFreeMode';
import ShareLinkManager from '@/components/ShareLinkManager';
import '@/styles/print.css';
import GlossaryAutoLink from '@/components/GlossaryAutoLink';
import DocumentComparisonView from '@/components/DocumentComparisonView';
import InlineComments from '@/components/InlineComments';
import ExportDocx from '@/components/ExportDocx';
import { useTrackRecentView } from '@/components/RecentlyViewed';
import CodeCopyButton from '@/components/CodeCopyButton';
import DocumentFeedback from '@/components/DocumentFeedback';
import CitationGenerator from '@/components/CitationGenerator';
import ReadingSessionTracker from '@/components/ReadingSessionTracker';
import DocumentMediaGallery from '@/components/DocumentMediaGallery';
import CoAuthorActivitySection from '@/components/CoAuthorActivitySection';
import ContentFreshnessBadge from '@/components/ContentFreshnessBadge';
import DocumentNavigation from '@/components/DocumentNavigation';
import QRCodeShare from '@/components/QRCodeShare';
import SubscribeButton from '@/components/SubscribeButton';
import ReadingPositionTracker from '@/components/ReadingPositionTracker';
import AISummaryPanel from '@/components/AISummaryPanel';
import TranslationPanel from '@/components/TranslationPanel';
import ContextualHelp from '@/components/ContextualHelp';
import { usePreferences } from '@/hooks/usePreferences';
import DocumentQuiz from '@/components/DocumentQuiz';
import DocumentAnnotations from '@/components/DocumentAnnotations';
import RelatedByTags from '@/components/RelatedByTags';
import TextToSpeech from '@/components/TextToSpeech';
import QuickEditInline from '@/components/QuickEditInline';
import SmartRecommendations from '@/components/SmartRecommendations';
import ProcessTimelineVisualization from '@/components/ProcessTimelineVisualization';
import CrossPersonaLinksPanel from '@/components/CrossPersonaLinksPanel';
import DocumentSnapshots from '@/components/DocumentSnapshots';
import AddToCollectionButton from '@/components/AddToCollectionButton';
import ReadingTimeEstimate from '@/components/ReadingTimeEstimate';
import DocumentLibraryFooter from '@/components/DocumentLibraryFooter';
import { prepareDocumentContent } from '@shared/documentContent';

// Reading time calculation - uses configurable WPM from branding settings
function getReadingTime(wordCount: number, wpm = 200): string {
  const minutes = Math.ceil(wordCount / wpm);
  return `${minutes} min read`;
}

// Template variable interpolation: replaces {{variable_name}} with values
function interpolateTemplateVars(content: string): string {
  const vars: Record<string, string> = {
    company_name: 'Riad & Routes',
    website: 'riadandroutes.com',
    current_date: new Date().toLocaleDateString(),
    current_year: new Date().getFullYear().toString(),
  };
  return content.replace(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g, (match, key) => {
    return vars[key] || match;
  });
}

// Extract headings for table of contents
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      headings.push({ id, text, level });
    }
  }
  return headings;
}

// Favorites management via localStorage
function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem('arg-favorites') || '[]');
  } catch { return []; }
}

function toggleFavorite(slug: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(slug);
  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem('arg-favorites', JSON.stringify(favorites));
    return false;
  } else {
    favorites.unshift(slug);
    localStorage.setItem('arg-favorites', JSON.stringify(favorites));
    return true;
  }
}

// Recently viewed tracking
function addToRecentlyViewed(slug: string, title: string) {
  try {
    const recent = JSON.parse(localStorage.getItem('arg-recently-viewed') || '[]');
    const filtered = recent.filter((r: any) => r.slug !== slug);
    filtered.unshift({ slug, title, viewedAt: Date.now() });
    localStorage.setItem('arg-recently-viewed', JSON.stringify(filtered.slice(0, 20)));
  } catch { /* ignore */ }
}

// Heading anchor for copy-link-to-section
function HeadingAnchor({ id }: { id: string }) {
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <button
      onClick={handleCopyLink}
      className="inline-flex ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-accent align-middle"
      title="Copy link to section"
    >
      <Link2 className="w-4 h-4" />
    </button>
  );
}

export default function DocumentDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const slug = params.slug || '';
  
  const { data: document, isLoading, error } = trpc.documents.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const [isFavorited, setIsFavorited] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');

  // Get configurable WPM from branding settings + user preferences
  const { data: brandingSettings } = trpc.branding.get.useQuery();
  const { readingSpeedWpm: userWpm } = usePreferences();
  const wpm = useMemo(() => {
    // User preference takes priority over global branding setting
    if (userWpm && userWpm !== 200) return userWpm;
    const setting = brandingSettings?.find((s: any) => s.settingKey === 'words_per_minute');
    return setting ? parseInt(setting.settingValue) || 200 : 200;
  }, [brandingSettings, userWpm]);

  // Persist reading progress (auto-saves scroll position)
  useReadingProgress(slug);

  // Track recently viewed for server-side history
  const visitorIdForTracking = useMemo(() => {
    let id = localStorage.getItem('visitor_id');
    if (!id) { id = 'v_' + Math.random().toString(36).substring(2, 15); localStorage.setItem('visitor_id', id); }
    return id;
  }, []);
  useTrackRecentView(slug, visitorIdForTracking);

  // Record view count
  const recordViewMutation = trpc.documents.recordView.useMutation();
  const recordCompletionMutation = trpc.readingGoals.recordCompletion.useMutation();
  const recordStreakMutation = trpc.streakLeaderboard.recordRead.useMutation();

  // Track recently viewed
  useEffect(() => {
    if (document) {
      addToRecentlyViewed(document.slug, document.title);
      setIsFavorited(getFavorites().includes(document.slug));
      // Record view (fire and forget)
      recordViewMutation.mutate({ slug: document.slug });
      // Track reading streak
      recordReadingDay();
      // Record streak for leaderboard
      recordStreakMutation.mutate({ documentSlug: document.slug });
      // Track reading goal progress
      const visitorId = localStorage.getItem('arg-visitor-id');
      if (visitorId) {
        recordCompletionMutation.mutate({ visitorId, documentSlug: document.slug });
      }
    }
  }, [document]);

  // Restore scroll position when navigating back
  useEffect(() => {
    // Scroll to hash if present (for copy-link-to-section)
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        const el = window.document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [document]);

  // Table of contents
  const displayContent = useMemo(
    () => prepareDocumentContent(document?.content || ''),
    [document?.content]
  );

  const headings = useMemo(() => {
    if (!displayContent) return [];
    return extractHeadings(displayContent);
  }, [displayContent]);

  // Scroll spy for TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    const headingElements = window.document.querySelectorAll('h1[id], h2[id], h3[id]');
    headingElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [document]);

  // Copy markdown to clipboard
  const handleCopy = useCallback(async () => {
    if (!document?.content) return;
    try {
      await navigator.clipboard.writeText(document.content);
      toast.success('Markdown copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  }, [document]);

  // Download tracking
  const logDownloadMutation = trpc.documents.logDownload.useMutation();

  // Get visitor ID for download tracking
  const getVisitorId = useCallback(() => {
    let id = localStorage.getItem('visitor_id');
    if (!id) { id = 'v_' + Math.random().toString(36).substring(2, 15); localStorage.setItem('visitor_id', id); }
    return id;
  }, []);

  // Download as .md file
  const handleDownload = useCallback(() => {
    if (!document) return;
    const blob = new Blob([document.content || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.filename;
    a.click();
    URL.revokeObjectURL(url);
    logDownloadMutation.mutate({ slug: document.slug, format: 'markdown', visitorId: getVisitorId() });
    toast.success('Download started');
  }, [document]);

  // Toggle favorite
  const handleToggleFavorite = useCallback(() => {
    if (!document) return;
    const nowFavorited = toggleFavorite(document.slug);
    setIsFavorited(nowFavorited);
    toast.success(nowFavorited ? 'Added to favorites' : 'Removed from favorites');
  }, [document]);

  // Export as PDF (opens styled HTML in new tab for print-to-PDF)
  const handleExportPdf = useCallback(() => {
    if (!document) return;
    const pdfUrl = `/api/export/pdf/${document.slug}`;
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        setTimeout(() => printWindow.print(), 500);
      });
    }
    toast.success('PDF export opened - use Save as PDF in print dialog');
  }, [document]);

  // Print current page
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Reading progress tracking
  const [readingProgress, setReadingProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = window.document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadingProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <span className="text-muted-foreground">Loading document...</span>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Document Not Found</h2>
          <p className="text-muted-foreground mb-6">The document you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Print-only branded header */}
      <div className="print-header hidden">
        <h1>{document.title}</h1>
        <div className="subtitle">Riad & Routes — Operational Reference Guide | {document.category} | Last updated: {new Date(document.updatedAt || document.createdAt).toLocaleDateString()}</div>
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-border/30">
        <div
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </button>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 sm:p-2 rounded-lg transition-colors ${
                isFavorited 
                  ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/80'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorited ? <BookmarkCheck className="w-5 h-5 sm:w-4 sm:h-4" /> : <Bookmark className="w-5 h-5 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-2.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors"
              title="Copy markdown"
            >
              <Copy className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors"
              title="Download .md file"
            >
              <Download className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="hidden sm:block p-2.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors"
              title="Print document"
            >
              <Printer className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleExportPdf}
              className="p-2.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors"
              title="Export as PDF"
              aria-label="Export document as PDF"
            >
              <FileText className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => {
                const embedUrl = `${window.location.origin}/embed/${slug}`;
                navigator.clipboard.writeText(`<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"></iframe>`);
                toast.success('Embed code copied to clipboard');
              }}
              className="hidden sm:block p-2.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors"
              title="Copy embed code"
            >
              <ExternalLink className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            {document && <QRCodeShare slug={document.slug} title={document.title} />}
            {document && <SubscribeButton targetType="document" targetValue={document.slug} />}
            {document && <ReadingPositionTracker documentSlug={document.slug} />}
            {document && <ShareDocument title={document.title} slug={document.slug} category={document.category} />}
            {document && <QuickEditInline documentId={document.id} title={document.title} content={document.content || ''} onSaved={() => { /* invalidate via trpc utils */ }} />}
            {document && <DistractionFreeMode><ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown></DistractionFreeMode>}
          </div>
        </div>
        {document && <ShareLinkManager documentSlug={document.slug} />}
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile TOC */}
        {headings.length > 3 && (
          <MobileTOC headings={headings} activeHeading={activeHeading} />
        )}

        <div className="flex gap-8">
          {/* Table of Contents Sidebar */}
          {headings.length > 3 && (
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Table of Contents
                </h4>
                <nav className="space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
                  {headings.map((heading, i) => (
                    <a
                      key={i}
                      href={`#${heading.id}`}
                      className={`block text-xs py-1 transition-colors border-l-2 ${
                        heading.level === 1 ? 'pl-3' : heading.level === 2 ? 'pl-5' : 'pl-7'
                      } ${
                        activeHeading === heading.id
                          ? 'text-accent border-accent'
                          : 'text-muted-foreground hover:text-foreground border-transparent hover:border-border'
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Document Header */}
            <div className="mb-8 pb-6 border-b border-border/50">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
                <button onClick={() => navigate('/')} className="hover:text-accent transition-colors">Home</button>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <button onClick={() => navigate('/')} className="hover:text-accent transition-colors">{document.category}</button>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{document.title}</span>
              </nav>

              <h1 className="font-display text-xl sm:text-3xl md:text-4xl text-foreground mb-3 sm:mb-4 leading-tight">{document.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {document.category}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{getReadingTime(document.wordCount || 0, wpm)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{(document.wordCount || 0).toLocaleString()} words</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{document.filename}</span>
                </div>
                {document.createdAt && (<ContentFreshnessBadge updatedAt={document.updatedAt} createdAt={document.createdAt} />)}
                {document.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(document.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>

              {/* Reading Time Estimate + Add to Collection */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <ReadingTimeEstimate slug={document.slug} />
                <AddToCollectionButton documentId={document.id} documentTitle={document.title} />
              </div>

              {/* Rating and AI Summary */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <DocumentRating slug={document.slug} upvotes={(document as any).upvotes ?? 0} downvotes={(document as any).downvotes ?? 0} />
              </div>
              <div className="mt-4">
                <AISummary slug={document.slug} existingSummary={(document as any).summary} />
              </div>
              <div className="mt-3">
                <DocumentTags slug={document.slug} />
              </div>
            </div>

            {/* Markdown Content */}
            <article data-document-content className="prose dark:prose-invert prose-sm max-w-none
              prose-headings:font-display prose-headings:text-foreground
              prose-h1:text-xl sm:prose-h1:text-2xl prose-h1:mt-6 sm:prose-h1:mt-8 prose-h1:mb-3 sm:prose-h1:mb-4
              prose-h2:text-lg sm:prose-h2:text-xl prose-h2:mt-5 sm:prose-h2:mt-6 prose-h2:mb-2 sm:prose-h2:mb-3 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-2
              prose-h3:text-base sm:prose-h3:text-lg prose-h3:mt-4 sm:prose-h3:mt-5 prose-h3:mb-2
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base
              prose-li:text-muted-foreground prose-li:text-sm sm:prose-li:text-base
              prose-strong:text-foreground
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1 sm:prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[11px] sm:prose-code:text-xs
              prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-xs
              prose-table:border prose-table:border-border prose-table:text-xs sm:prose-table:text-sm
              prose-th:bg-muted prose-th:border prose-th:border-border prose-th:px-2 sm:prose-th:px-3 prose-th:py-1.5 sm:prose-th:py-2 prose-th:text-foreground prose-th:font-semibold
              prose-td:border prose-td:border-border prose-td:px-2 sm:prose-td:px-3 prose-td:py-1.5 sm:prose-td:py-2 prose-td:text-foreground
              prose-blockquote:border-accent/50 prose-blockquote:text-muted-foreground
              prose-hr:border-border/50
              print:prose-p:text-black print:prose-headings:text-black
              [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full
              [&_pre]:max-w-[calc(100vw-3rem)] [&_pre]:sm:max-w-none
              [&_.footnotes]:border-t [&_.footnotes]:border-border/30 [&_.footnotes]:mt-8 [&_.footnotes]:pt-4
              [&_.footnotes]:text-sm [&_.footnotes]:text-muted-foreground
              [&_sup_a]:text-accent [&_sup_a]:no-underline [&_sup_a]:font-medium
              [&_.data-footnote-backref]:text-accent
            ">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return <h1 id={id} className="group relative" {...props}>{children}<HeadingAnchor id={id} /></h1>;
                  },
                  h2: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return <h2 id={id} className="group relative" {...props}>{children}<HeadingAnchor id={id} /></h2>;
                  },
                  h3: ({ children, ...props }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return <h3 id={id} className="group relative" {...props}>{children}<HeadingAnchor id={id} /></h3>;
                  },
                  p: ({ children }) => {
                    return <p><GlossaryAutoLink>{children}</GlossaryAutoLink></p>;
                  },
                  li: ({ children }) => {
                    return <li><GlossaryAutoLink>{children}</GlossaryAutoLink></li>;
                  },
                  pre: ({ children }) => {
                    return <pre className="relative group">{children}</pre>;
                  },
                  code: ({ className, children, ...props }) => {
                    const isBlock = className?.includes('language-');
                    if (isBlock) {
                      const codeStr = String(children).replace(/\n$/, '');
                      return (
                        <>
                          <code className={className} {...props}>{children}</code>
                          <CodeCopyButton code={codeStr} />
                        </>
                      );
                    }
                    return <code className={className} {...props}>{children}</code>;
                  },
                }}
              >
                {interpolateTemplateVars(displayContent)}
              </ReactMarkdown>
            </article>

            <DocumentLibraryFooter
              category={document.category}
              slug={document.slug}
              updatedAt={document.updatedAt || document.createdAt}
            />

            {/* Process Timeline (for persona process docs) */}
            {(document.category === 'Riad & Routes' || document.category === 'ArtKech Design Studio') && (
              <ProcessTimelineVisualization content={displayContent} />
            )}

            {/* Cross-Persona Related Documents */}
            {(document.category === 'Riad & Routes' || document.category === 'ArtKech Design Studio') && (
              <CrossPersonaLinksPanel currentDocTitle={document.title} currentCategory={document.category} />
            )}

            {/* Document Dependencies */}
            <DocumentDependencies slug={document.slug} />

            {/* AI Summary & Translation */}
            <AISummaryPanel slug={document.slug} />
            <TranslationPanel slug={document.slug} />

            {/* Batch 17: Quiz, Annotations, Related by Tags */}
            <TextToSpeech content={document.content || ''} />
            <DocumentQuiz documentId={document.id} content={document.content || ''} />
            <DocumentAnnotations documentId={document.id} />
            <RelatedByTags slug={document.slug} />
            <SmartRecommendations documentId={document.id} />
            <DocumentSnapshots documentId={document.id} currentTitle={document.title} currentContent={document.content || ''} />

            {/* AI-Suggested Related Documents */}
            <AISuggestions slug={document.slug} />

            {/* Related Documents */}
            <RelatedDocuments slug={document.slug} category={document.category} />

            {/* Comments & Notes */}
            <Suspense fallback={<div className="animate-pulse h-32 bg-card/50 rounded-xl" />}>
              <DocumentComments slug={document.slug} />
            </Suspense>

            {/* Inline Comments (threaded) */}
            <InlineComments documentSlug={document.slug} visitorId={visitorIdForTracking} />

            {/* Version History */}
            <Suspense fallback={<div className="animate-pulse h-24 bg-card/50 rounded-xl" />}>
              <DocumentVersionHistory slug={document.slug} />
            </Suspense>
            <button
              onClick={() => navigate(`/diff/${document.slug}`)}
              className="text-xs text-accent hover:underline mt-1 mb-2 inline-block"
            >
              View full changelog diff →
            </button>

            {/* Version Comparison */}
            <DocumentComparisonView slug={document.slug} />

            {/* Reading Session Tracker */}
            <ReadingSessionTracker slug={document.slug} />

            {/* Media Gallery */}
            <DocumentMediaGallery slug={document.slug} />

            {/* Citation Generator */}
            <CitationGenerator documentId={document.id} title={document.title} createdAt={document.createdAt ? new Date(document.createdAt).toISOString() : undefined} />

            {/* Co-Author Activity */}
            <CoAuthorActivitySection documentSlug={document.slug} />

            {/* Document Feedback */}
            <DocumentFeedback slug={document.slug} />

            {/* Prev/Next Document Navigation */}
            <DocumentNavigation slug={document.slug} category={document.category} />

            {/* Bottom Navigation — centered so admin quick actions don't cover actions */}
            <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-border/50 pb-28 sm:pb-32">
              <div className="max-w-lg mx-auto flex flex-col items-center gap-4 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Library
                </button>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-card border border-border hover:border-accent/30 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-card border border-border hover:border-accent/30 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .md
                  </button>
                  <ExportDocx slug={document.slug} title={document.title} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Quick Actions Floating Toolbar */}
      {document && (
        <QuickActionsToolbar
          slug={document.slug}
          title={document.title}
          onShare={() => {}}
          isFavorited={isFavorited}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

// Related Documents Component
function RelatedDocuments({ slug, category }: { slug: string; category: string }) {
  const [, navigate] = useLocation();
  const { data: related } = trpc.documents.related.useQuery(
    { slug, category, limit: 5 },
    { enabled: !!slug && !!category }
  );

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border/50">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-accent" />
        Related Documents in {category}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {related.map(doc => (
          <button
            key={doc.slug}
            onClick={() => navigate(`/docs/${doc.slug}`)}
            className="flex items-start gap-3 p-3 rounded-lg bg-card/30 border border-border/50 hover:border-accent/30 transition-colors text-left group"
          >
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">{doc.title}</p>
              {doc.wordCount && (
                <p className="text-[10px] text-muted-foreground mt-1">{Math.ceil((doc.wordCount || 0) / 200)} min read</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Scroll to Top Button
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 left-6 z-50 p-3 rounded-full bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30 active:bg-accent/40 transition-all shadow-lg no-print"
      title="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

// Mobile Table of Contents (collapsible)
function MobileTOC({ headings, activeHeading }: { headings: { id: string; text: string; level: number }[]; activeHeading: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="xl:hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50 text-sm"
      >
        <span className="font-medium text-foreground flex items-center gap-2">
          <Hash className="w-4 h-4 text-accent" />
          Table of Contents
        </span>
        {isOpen ? <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90 transition-transform" /> : <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform" />}
      </button>
      {isOpen && (
        <nav className="mt-2 p-3 rounded-lg bg-card/30 border border-border/30 space-y-1 max-h-64 overflow-y-auto">
          {headings.map((heading, i) => (
            <a
              key={i}
              href={`#${heading.id}`}
              onClick={() => setIsOpen(false)}
              className={`block text-xs py-1 transition-colors ${
                heading.level === 1 ? 'pl-2' : heading.level === 2 ? 'pl-4' : 'pl-6'
              } ${
                activeHeading === heading.id
                  ? 'text-accent font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      )}

      {/* Print-only branded footer */}
      <div className="print-footer hidden">
        Riad & Routes — riadandroutes.com | Confidential — For internal use only | Printed: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
