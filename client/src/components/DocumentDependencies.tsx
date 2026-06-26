import { trpc } from '@/lib/trpc';
import { GitBranch, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface Props {
  slug: string;
}

export default function DocumentDependencies({ slug }: Props) {
  const { data: prerequisites } = trpc.dependencies.prerequisites.useQuery({ slug });
  const { data: dependents } = trpc.dependencies.dependents.useQuery({ slug });

  if ((!prerequisites || prerequisites.length === 0) && (!dependents || dependents.length === 0)) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Document Dependencies</h3>
      </div>

      {prerequisites && prerequisites.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Prerequisites (read these first)
          </h4>
          <div className="space-y-2">
            {prerequisites.map((dep: any) => (
              <Link
                key={dep.prerequisiteSlug}
                href={`/docs/${dep.prerequisiteSlug}`}
                className="block bg-muted border border-border rounded p-3 hover:border-primary/50 transition-colors"
              >
                <span className="text-sm text-foreground">{dep.title}</span>
                <span className="text-xs text-muted-foreground ml-2">{dep.category}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {dependents && dependents.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Dependent Documents (read after this)
          </h4>
          <div className="space-y-2">
            {dependents.map((dep: any) => (
              <Link
                key={dep.documentSlug}
                href={`/docs/${dep.documentSlug}`}
                className="block bg-muted border border-border rounded p-3 hover:border-primary/50 transition-colors"
              >
                <span className="text-sm text-foreground">{dep.title}</span>
                <span className="text-xs text-muted-foreground ml-2">{dep.category}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
