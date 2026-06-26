import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminDependencyManagerProps {
  slug: string;
}

export default function AdminDependencyManager({ slug }: AdminDependencyManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: prerequisites, refetch } = trpc.dependencies.prerequisites.useQuery({ slug });
  const { data: dependents } = trpc.dependencies.dependents.useQuery({ slug });
  const { data: allDocs } = trpc.documents.list.useQuery({ limit: 500 });

  const addMutation = trpc.dependencies.add.useMutation({
    onSuccess: () => { refetch(); toast.success('Dependency added'); setSearchQuery(''); },
    onError: (err) => toast.error(err.message),
  });
  const removeMutation = trpc.dependencies.remove.useMutation({
    onSuccess: () => { refetch(); toast.success('Dependency removed'); },
    onError: (err) => toast.error(err.message),
  });

  const filteredDocs = allDocs?.documents?.filter((d: any) =>
    d.slug !== slug &&
    !prerequisites?.some((p: any) => p.prerequisiteSlug === d.slug) &&
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8) || [];

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="w-5 h-5 text-accent" />
          Manage Dependencies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current prerequisites */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Prerequisites ({prerequisites?.length || 0})</p>
          {prerequisites && prerequisites.length > 0 ? (
            <div className="space-y-1">
              {prerequisites.map((dep: any) => (
                <div key={dep.prerequisiteSlug} className="flex items-center justify-between bg-muted/30 rounded px-3 py-2">
                  <span className="text-sm">{dep.prerequisiteSlug}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMutation.mutate({ documentSlug: slug, prerequisiteSlug: dep.prerequisiteSlug })}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No prerequisites linked</p>
          )}
        </div>

        {/* Add new prerequisite */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Add Prerequisite</p>
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          {searchQuery && filteredDocs.length > 0 && (
            <div className="border border-border rounded-md max-h-40 overflow-y-auto">
              {filteredDocs.map(doc => (
                <button
                  key={doc.slug}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center justify-between"
                  onClick={() => addMutation.mutate({ documentSlug: slug, prerequisiteSlug: doc.slug })}
                >
                  <span className="truncate">{doc.title}</span>
                  <Plus className="w-4 h-4 text-accent flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dependents (read-only) */}
        {dependents && dependents.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Depended on by ({dependents.length})</p>
            <div className="space-y-1">
              {dependents.map((dep: any) => (
                <div key={dep.documentSlug} className="bg-muted/20 rounded px-3 py-2 text-sm text-muted-foreground">
                  {dep.documentSlug}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
