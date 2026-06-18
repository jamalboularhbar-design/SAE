import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Lightbulb, Sparkles, ArrowRight, Loader2, Tag } from 'lucide-react';
import { Link } from 'wouter';

export default function AIRecommendationsPage() {
  const [interests, setInterests] = useState('');
  const [currentSlug, setCurrentSlug] = useState('');

  const { data, isLoading, refetch } = trpc.ai.recommendations.useQuery(
    {
      currentDocSlug: currentSlug || undefined,
      userInterests: interests ? interests.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    },
    { enabled: false }
  );

  const handleGetRecommendations = () => {
    refetch();
    toast.info('Fetching AI recommendations...');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-amber-500/10 text-amber-600">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" /> Smart Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">Get AI-powered content suggestions based on your interests and reading history</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-5 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Your Interests (comma-separated)</label>
              <input
                value={interests}
                onChange={e => setInterests(e.target.value)}
                placeholder="e.g. travel concierge, luxury services, client management"
                className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Currently Reading (document slug, optional)</label>
              <input
                value={currentSlug}
                onChange={e => setCurrentSlug(e.target.value)}
                placeholder="e.g. travel-concierge-guide"
                className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleGetRecommendations} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Get Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {data?.recommendations && data.recommendations.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" /> Recommended for You
            </h2>
            {data.recommendations.map((rec, i) => (
              <Card key={i} className="hover:border-amber-500/30 transition-colors">
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{rec.slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                  </div>
                  <Link href={`/docs/${rec.slug}`}>
                    <Button variant="ghost" size="sm">
                      Read <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {data?.recommendations && data.recommendations.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <Lightbulb className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No recommendations found. Try different interests.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
