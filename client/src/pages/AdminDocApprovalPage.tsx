import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, FileText, MessageSquare, Filter, Eye } from 'lucide-react';
import { Link } from 'wouter';

interface ApprovalItem {
  id: number;
  title: string;
  author: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  wordCount: number;
  comments: { author: string; text: string; date: string }[];
}

const MOCK_APPROVALS: ApprovalItem[] = [
  { id: 1, title: 'Q3 Revenue Operations Playbook', author: 'Sarah Chen', submittedAt: '2026-05-19T14:30:00Z', status: 'pending', category: 'Operations', wordCount: 3200, comments: [] },
  { id: 2, title: 'Customer Onboarding SOP v2.1', author: 'Marcus Johnson', submittedAt: '2026-05-19T09:15:00Z', status: 'pending', category: 'Customer Success', wordCount: 1850, comments: [{ author: 'Admin', text: 'Please add the escalation matrix section', date: '2026-05-19T11:00:00Z' }] },
  { id: 3, title: 'Data Privacy Compliance Guide', author: 'Elena Rodriguez', submittedAt: '2026-05-18T16:45:00Z', status: 'pending', category: 'Legal & Compliance', wordCount: 4100, comments: [] },
  { id: 4, title: 'Engineering Sprint Retrospective Template', author: 'Dev Team', submittedAt: '2026-05-18T10:00:00Z', status: 'approved', category: 'Engineering', wordCount: 980, comments: [{ author: 'Admin', text: 'Approved - great template!', date: '2026-05-18T14:00:00Z' }] },
  { id: 5, title: 'Sales Enablement: Competitive Positioning', author: 'Jake Williams', submittedAt: '2026-05-17T13:20:00Z', status: 'rejected', category: 'Sales', wordCount: 2400, comments: [{ author: 'Admin', text: 'Needs updated pricing data. Please revise.', date: '2026-05-17T15:30:00Z' }] },
  { id: 6, title: 'Remote Work Policy Update 2026', author: 'HR Team', submittedAt: '2026-05-17T08:00:00Z', status: 'pending', category: 'HR & People', wordCount: 1600, comments: [] },
];

export default function AdminDocApprovalPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(MOCK_APPROVALS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = filter === 'all' ? approvals : approvals.filter(a => a.status === filter);
  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  const handleApprove = (id: number) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const, comments: [...a.comments, { author: 'Admin', text: 'Approved', date: new Date().toISOString() }] } : a));
    toast.success('Document approved and published');
  };

  const handleReject = (id: number) => {
    const comment = commentText[id] || 'Rejected - please revise and resubmit.';
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const, comments: [...a.comments, { author: 'Admin', text: comment, date: new Date().toISOString() }] } : a));
    setCommentText(prev => ({ ...prev, [id]: '' }));
    toast.error('Document rejected with feedback');
  };

  const handleAddComment = (id: number) => {
    const text = commentText[id]?.trim();
    if (!text) return;
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, comments: [...a.comments, { author: 'Admin', text, date: new Date().toISOString() }] } : a));
    setCommentText(prev => ({ ...prev, [id]: '' }));
    toast.success('Comment added');
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-amber-500/10 text-amber-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'approved': return <Badge className="bg-green-500/10 text-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-500/10 text-red-600"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary">Document Workflow</Badge>
            <h1 className="text-2xl font-bold">Approval Queue</h1>
            <p className="text-muted-foreground mt-1">Review, approve, or reject submitted documents</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {pendingCount} pending
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              <Filter className="w-3 h-3 mr-1" />
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 rounded-full">{pendingCount}</span>
              )}
            </Button>
          ))}
        </div>

        {/* Approval Items */}
        <div className="space-y-4">
          {filtered.map(item => (
            <Card key={item.id} className={`transition-all ${item.status === 'pending' ? 'border-amber-500/30' : ''}`}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-medium">{item.title}</h3>
                      {statusBadge(item.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>By {item.author}</span>
                      <span>{item.category}</span>
                      <span>{item.wordCount.toLocaleString()} words</span>
                      <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                      <Eye className="w-4 h-4 mr-1" /> {expandedId === item.id ? 'Collapse' : 'Details'}
                    </Button>
                    {item.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(item.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(item.id)}>
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === item.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    {/* Comments */}
                    {item.comments.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Comments ({item.comments.length})
                        </p>
                        {item.comments.map((c, idx) => (
                          <div key={idx} className="pl-4 border-l-2 border-primary/20">
                            <p className="text-sm">{c.text}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{c.author} · {new Date(c.date).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText[item.id] || ''}
                        onChange={e => setCommentText(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Add a comment or feedback..."
                        className="flex-1 px-3 py-2 rounded-md bg-background border border-border text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(item.id)}
                      />
                      <Button size="sm" variant="outline" onClick={() => handleAddComment(item.id)}>
                        <MessageSquare className="w-4 h-4 mr-1" /> Comment
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-muted-foreground text-sm mt-1">No documents matching this filter.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
