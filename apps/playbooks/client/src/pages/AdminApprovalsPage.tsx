import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, FileText, Clock, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminApprovalsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [rejectSlug, setRejectSlug] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: docs, refetch } = trpc.approvals.list.useQuery(undefined, { enabled: user?.role === 'admin' });
  const approveMutation = trpc.approvals.approve.useMutation({ onSuccess: () => refetch() });
  const rejectMutation = trpc.approvals.reject.useMutation({ onSuccess: () => { refetch(); setRejectSlug(null); setRejectReason(''); } });

  if (user?.role !== 'admin') {
    return <div className="container py-12 text-center text-muted-foreground">Admin access required.</div>;
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="flex items-center gap-3 mb-8">
        <CheckCircle className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold">Approval Queue</h1>
        <Badge variant="secondary">{docs?.length || 0} pending</Badge>
      </div>

      {!docs || docs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">All clear! No documents pending review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => (
            <Card key={doc.slug} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {doc.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{doc.category}</Badge>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(doc.updatedAt).toLocaleDateString()}</span>
                      <span>{doc.wordCount} words</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate({ slug: doc.slug })}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRejectSlug(doc.slug)}
                      disabled={rejectMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {rejectSlug === doc.slug && (
                <CardContent className="pt-2">
                  <Textarea
                    placeholder="Rejection reason (optional)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate({ slug: doc.slug, reason: rejectReason })}>
                      Confirm Reject
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setRejectSlug(null); setRejectReason(''); }}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
