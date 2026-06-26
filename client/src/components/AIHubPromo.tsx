import { Link } from 'wouter';
import { Brain, Pen, Search, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/brand';

const quickTools = [
  { label: 'Writing Assistant', path: '/ai/writer', icon: Pen },
  { label: 'Semantic Search', path: '/ai/search', icon: Search },
  { label: 'AI Chat', path: '/ai/chat', icon: MessageSquare },
  { label: 'Summarizer', path: '/ai/summarize', icon: Sparkles },
];

export default function AIHubPromo() {
  return (
    <div className="mb-10 sm:mb-12 rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10 p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-purple-500/20 shrink-0">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
              {BRAND.aiHubName}
            </p>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
              {BRAND.aiHubTitle}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              {BRAND.aiHubTagline}. Draft SOPs, search in natural language, summarize docs, and automate workflows — all in one place.
            </p>
          </div>
        </div>
        <Link href={BRAND.aiHubPath}>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700 shrink-0 w-full lg:w-auto">
            <Brain className="w-4 h-4" />
            Open Intelligence Hub
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-purple-500/15">
        {quickTools.map(({ label, path, icon: Icon }) => (
          <Link key={path} href={path}>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-card/80 border border-border/50 text-muted-foreground hover:text-foreground hover:border-purple-500/40 transition-colors">
              <Icon className="w-3 h-3" />
              {label}
            </button>
          </Link>
        ))}
        <Link href={BRAND.aiHubPath}>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
            +6 more tools
            <ArrowRight className="w-3 h-3" />
          </button>
        </Link>
      </div>
    </div>
  );
}
