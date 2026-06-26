import { trpc } from '@/lib/trpc';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ReadingTimeEstimateProps {
  slug: string;
  className?: string;
}

export default function ReadingTimeEstimate({ slug, className }: ReadingTimeEstimateProps) {
  const { data } = trpc.readingEstimate.get.useQuery({ slug }, { enabled: !!slug });

  if (!data) return null;

  const minutes = data.estimatedMinutes || 0;
  const label = minutes < 1 ? '<1 min read' : `${minutes} min read`;
  const complexity = data.complexity || 'standard';

  return (
    <Badge variant="outline" className={`gap-1 text-xs ${className || ''}`}>
      <Clock className="w-3 h-3" />
      {label}
      {complexity !== 'standard' && (
        <span className="text-muted-foreground ml-1">({complexity})</span>
      )}
    </Badge>
  );
}
