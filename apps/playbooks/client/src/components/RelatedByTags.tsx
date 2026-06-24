import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Tags } from 'lucide-react';

interface RelatedByTagsProps {
  slug: string;
}

export default function RelatedByTags({ slug }: RelatedByTagsProps) {
  const { data: related } = trpc.relatedByTags.get.useQuery({ slug });

  if (!related || related.length === 0) return null;

  return (
    <div className="border rounded-lg p-4 mt-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
        <Tags className="w-4 h-4 text-primary" />
        Related by Tags
      </h3>
      <div className="space-y-2">
        {related.slice(0, 5).map((doc: any) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="block text-sm hover:text-primary transition-colors"
          >
            <span>{doc.title}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {doc.sharedTags} shared tag{doc.sharedTags !== 1 ? 's' : ''}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
