import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ShieldCheck, Check, X } from 'lucide-react';

export default function AdminAccessRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const utils = trpc.useUtils();
  const { data: requests, isLoading } = trpc.accessRequests.listAll.useQuery(
    statusFilter === 'all' ? undefined : { status: statusFilter }
  );
  const reviewMut = trpc.accessRequests.review.useMutation({
    onSuccess: () => {
      utils.accessRequests.listAll.invalidate();
      toast.success('Request reviewed');
    },
    onError: () => toast.error('Failed to review request'),
  });

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <Badge className="bg-green-600">Approved</Badge>;
    if (status === 'denied') return <Badge variant="destructive">Denied</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-6 h-6 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold">Document Access Requests</h1>
          <p className="text-sm text-muted-foreground">Review and manage user requests for private document access</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium">Filter:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !requests?.length ? (
            <p className="text-muted-foreground">No access requests found.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((req: any) => (
                <div key={req.id} className="border rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(req.status)}
                      <span className="font-medium text-sm truncate">{req.requesterName || req.requesterOpenId.substring(0, 12)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Document ID: {req.documentId}</p>
                    {req.reason && <p className="text-xs text-muted-foreground mt-1">Reason: {req.reason}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(req.createdAt).toLocaleString()}</p>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => reviewMut.mutate({ id: req.id, status: 'approved' })}
                        disabled={reviewMut.isPending}
                      >
                        <Check className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => reviewMut.mutate({ id: req.id, status: 'denied' })}
                        disabled={reviewMut.isPending}
                      >
                        <X className="w-3 h-3 mr-1" /> Deny
                      </Button>
                    </div>
                  )}
                  {req.status !== 'pending' && req.reviewedBy && (
                    <span className="text-xs text-muted-foreground">Reviewed by: {req.reviewedBy.substring(0, 12)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
