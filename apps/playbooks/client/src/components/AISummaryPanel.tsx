import { useState } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContextualHelp from '@/components/ContextualHelp';

interface AISummaryPanelProps {
  slug: string;
}

export default function AISummaryPanel({ slug }: AISummaryPanelProps) {
  const { isAuthenticated } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: existing, refetch } = trpc.aiSummary.get.useQuery({ slug }, { staleTime: 60000 });
  const generateMut = trpc.aiSummary.generate.useMutation();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateMut.mutateAsync({ slug });
      await refetch();
    } catch (err: any) {
      const msg = String(err?.message || '');
      toast.error(msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.toLowerCase().includes('quota') ? 'AI quota reached for today — please try again later.' : 'AI summary failed — please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="mt-6 p-4 rounded-xl border border-border/50 bg-card/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">AI Summary</h3>
          <ContextualHelp title="AI Summary" description="Generates a concise 3-5 sentence executive summary of this document using AI. Summaries are cached for quick re-access." />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="text-xs"
        >
          {isGenerating ? (
            <><Loader2 className="w-3 h-3 animate-spin mr-1" /> Generating...</>
          ) : existing ? (
            <><RefreshCw className="w-3 h-3 mr-1" /> Regenerate</>
          ) : (
            <><Sparkles className="w-3 h-3 mr-1" /> Generate Summary</>
          )}
        </Button>
      </div>
      {existing ? (
        <p className="text-sm text-muted-foreground leading-relaxed">{existing.summary}</p>
      ) : (
        <p className="text-xs text-muted-foreground italic">Click "Generate Summary" to create an AI-powered executive summary of this document.</p>
      )}
    </div>
  );
}
