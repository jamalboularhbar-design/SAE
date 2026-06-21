import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Search } from 'lucide-react';

export default function AdminAuditTrailPage() {
  const [slug, setSlug] = useState('');
  const [searchSlug, setSearchSlug] = useState('');

  const { data: auditEntries, isLoading } = trpc.audit.get.useQuery(
    { slug: searchSlug, limit: 100 },
    { enabled: !!searchSlug }
  );

  const handleSearch = () => {
    if (slug.trim()) setSearchSlug(slug.trim());
  };

  const actionColors: Record<string, string> = {
    created: 'bg-green-500/20 text-green-400',
    updated: 'bg-blue-500/20 text-blue-400',
    status_changed: 'bg-purple-500/20 text-purple-400',
    pinned: 'bg-yellow-500/20 text-yellow-400',
    unpinned: 'bg-gray-500/20 text-gray-400',
    deleted: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <History className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-display text-foreground">Document Audit Trail</h1>
      </div>

      <Card className="card-premium mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter document slug..."
              value={slug}
              onChange={e => setSlug(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!slug.trim()}>
              <Search className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground text-center py-8">Loading audit trail...</p>}

      {auditEntries && auditEntries.length > 0 && (
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg">
              History for <span className="text-accent">{searchSlug}</span> ({auditEntries.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditEntries.map((entry: any) => (
                <div key={entry.id} className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
                  <Badge className={`text-xs ${actionColors[entry.action] || 'bg-muted text-muted-foreground'}`}>
                    {entry.action}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    {entry.field && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Field:</span>{' '}
                        <span className="font-medium">{entry.field}</span>
                      </p>
                    )}
                    {entry.oldValue && (
                      <p className="text-xs text-red-400/80 line-through truncate">{entry.oldValue}</p>
                    )}
                    {entry.newValue && (
                      <p className="text-xs text-green-400/80 truncate">{entry.newValue}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      by {entry.changedBy || 'system'} • {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {auditEntries && auditEntries.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No audit entries found for this document.</p>
      )}
    </div>
  );
}
