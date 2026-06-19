import { useMemo } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Link2, Plane, Palette } from 'lucide-react';
import { trpc } from '@/lib/trpc';

// Mapping of related topics between the two personas
const CROSS_LINKS: Record<string, string[]> = {
  // RR doc keywords -> AK related keywords
  'check-in': ['client onboarding', 'project kickoff'],
  'guest complaint': ['client feedback', 'revision management'],
  'provider coordination': ['quality assurance', 'pre-flight'],
  'tour booking': ['creative brief', 'brief intake'],
  'vip guest': ['brand identity', 'client onboarding'],
  'procurement': ['freelancer management', 'contractor'],
  'food & beverage': ['photography', 'shoot planning'],
  'pricing': ['pricing', 'quotation'],
  'whatsapp': ['social media', 'content pipeline'],
  'reputation': ['portfolio', 'case study'],
  'commission reconciliation': ['financial management', 'invoicing'],
  'staff training': ['daily operations', 'time management'],
  'driver dispatch': ['print production', 'production'],
  'checkout': ['file management', 'digital asset'],
  'hammam': ['design review', 'approval workflow'],
  'medina tour': ['lead generation', 'new business'],
  // AK doc keywords -> RR related keywords
  'creative brief': ['tour booking', 'booking confirmation'],
  'design review': ['provider coordination', 'quality'],
  'client onboarding': ['check-in', 'guest check-in'],
  'brand identity': ['vip guest', 'vip handling'],
  'print production': ['driver dispatch', 'fleet'],
  'social media': ['whatsapp', 'concierge'],
  'quotation': ['pricing', 'revenue'],
  'daily operations': ['staff training', 'training'],
  'freelancer': ['procurement', 'supplier'],
  'client feedback': ['guest complaint', 'complaint resolution'],
  'file management': ['checkout', 'departure'],
  'portfolio': ['reputation', 'review management'],
  'quality assurance': ['provider coordination', 'quality check'],
  'financial management': ['commission reconciliation', 'finance'],
  'lead generation': ['medina tour', 'tour guide'],
  'photography': ['food & beverage', 'f&b'],
};

interface CrossPersonaLinksPanelProps {
  currentDocTitle: string;
  currentCategory: string;
}

export default function CrossPersonaLinksPanel({ currentDocTitle, currentCategory }: CrossPersonaLinksPanelProps) {
  const isRR = currentCategory === 'Horizon Concierge';
  const otherCategory = isRR ? 'Meridian Creative Studio' : 'Horizon Concierge';

  const { data } = trpc.documents.list.useQuery({ category: otherCategory, limit: 600 });

  const relatedDocs = useMemo(() => {
    if (!data?.documents) return [];
    const titleLower = currentDocTitle.toLowerCase();

    // Find matching keywords
    const matchingKeywords: string[] = [];
    for (const [keyword, relatedTerms] of Object.entries(CROSS_LINKS)) {
      if (titleLower.includes(keyword)) {
        matchingKeywords.push(...relatedTerms);
      }
    }

    if (matchingKeywords.length === 0) return [];

    // Find docs from other persona that match related keywords
    return data.documents.filter(doc => {
      const docTitleLower = doc.title.toLowerCase();
      return matchingKeywords.some(kw => docTitleLower.includes(kw));
    }).slice(0, 4);
  }, [data, currentDocTitle]);

  if (relatedDocs.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Link2 className="w-4 h-4 text-accent" />
          Related from {isRR ? 'Meridian Creative Studio' : 'Horizon Concierge'}
          {isRR ? <Palette className="w-3.5 h-3.5 text-purple-400" /> : <Plane className="w-3.5 h-3.5 text-sky-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground mb-3">
          Similar operational processes from the {isRR ? 'creative studio' : 'hospitality'} perspective:
        </p>
        {relatedDocs.map(doc => (
          <Link key={doc.id} href={`/docs/${doc.slug}`}>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{Math.ceil((doc.wordCount || 0) / 200)} min read</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
