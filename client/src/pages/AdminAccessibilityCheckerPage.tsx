import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Accessibility, Search, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function AdminAccessibilityCheckerPage() {
  const { data: allIssues, refetch } = trpc.accessibility.allIssues.useQuery();
  const checkMut = trpc.accessibility.check.useMutation({ onSuccess: (d: any) => { refetch(); toast.success(`Found ${d.issueCount} issues`); } });
  const resolveMut = trpc.accessibility.resolve.useMutation({ onSuccess: () => { refetch(); toast.success('Issue resolved'); } });

  const [slug, setSlug] = useState('');

  const severityIcon: Record<string, React.ReactNode> = {
    error: <AlertTriangle className="w-4 h-4 text-red-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
  };

  const severityColor: Record<string, string> = {
    error: 'bg-red-600', warning: 'bg-yellow-600', info: 'bg-blue-600',
  };

  const groupedByDoc = (allIssues || []).reduce((acc: Record<string, any[]>, issue: any) => {
    if (!acc[issue.documentSlug]) acc[issue.documentSlug] = [];
    acc[issue.documentSlug].push(issue);
    return acc;
  }, {});

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Accessibility className="w-6 h-6 text-orange-400" /> Accessibility Checker</h1>
          <p className="text-muted-foreground mt-1">Scan documents for accessibility issues</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Document slug to scan" className="max-w-sm" />
            <Button onClick={() => checkMut.mutate({ documentSlug: slug })} disabled={!slug || checkMut.isPending}>
              <Search className="w-4 h-4 mr-2" /> Scan Document
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Issues</p>
            <p className="text-3xl font-bold mt-1">{(allIssues || []).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Errors</p>
            <p className="text-3xl font-bold text-red-400 mt-1">{(allIssues || []).filter((i: any) => i.severity === 'error').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Documents Affected</p>
            <p className="text-3xl font-bold mt-1">{Object.keys(groupedByDoc).length}</p>
          </CardContent>
        </Card>
      </div>

      {Object.entries(groupedByDoc).map(([docSlug, issues]) => (
        <Card key={docSlug} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{docSlug}</span>
              <Badge variant="outline">{(issues as any[]).length} issues</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(issues as any[]).map((issue: any) => (
                <div key={issue.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <div className="flex items-center gap-2">
                    {severityIcon[issue.severity] || severityIcon.info}
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={severityColor[issue.severity]}>{issue.severity}</Badge>
                        <Badge variant="outline">{issue.issueType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{issue.description} {issue.lineReference && `(${issue.lineReference})`}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => resolveMut.mutate({ id: issue.id })}>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {Object.keys(groupedByDoc).length === 0 && (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No accessibility issues found. Scan documents to check.</CardContent></Card>
      )}
    </div>
  );
}
