import { Link } from 'wouter';
import { BookOpen, GitBranch, ExternalLink } from 'lucide-react';
import LogoMark from '@/components/LogoMark';
import { BRAND } from '@/lib/brand';

type DocumentLibraryFooterProps = {
  category: string;
  slug: string;
  updatedAt?: Date | string | null;
};

/** Branded library footer — replaces legacy Manus attribution on every document */
export default function DocumentLibraryFooter({
  category,
  slug,
  updatedAt,
}: DocumentLibraryFooterProps) {
  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <footer
      className="mt-10 pt-6 border-t border-border/50 not-prose"
      aria-label="Document library footer"
    >
      <div className="rounded-xl border border-border/50 bg-card/40 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <LogoMark size="sm" className="mt-0.5" />
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Part of the {BRAND.productName} Playbooks library
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Structured operating documents for founders and operators — browse the full library,
              explore connections on the knowledge graph, or export this playbook for your team.
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{category}</span>
              {updatedLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Updated {updatedLabel}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <a
                href={BRAND.appUrl}
                className="inline-flex items-center gap-1 text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {BRAND.domain}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground bg-background border border-border hover:border-accent/40 hover:text-accent transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Browse library
          </Link>
          <Link
            href="/graph"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground bg-background border border-border hover:border-accent/40 hover:text-accent transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            Knowledge graph
          </Link>
          <Link
            href={`/graph?focus=${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground bg-background border border-border hover:border-accent/40 hover:text-accent transition-colors"
          >
            View connections
          </Link>
        </div>
      </div>
    </footer>
  );
}
