import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Plus, Star, TrendingUp, Filter } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const SOURCES = ['tripadvisor', 'google', 'booking', 'direct', 'whatsapp'];
const CATEGORIES = ['service', 'cleanliness', 'location', 'value', 'food', 'ambiance', 'communication'];

export default function GuestFeedbackPage() {
  const [, navigate] = useLocation();
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    guestName: '', providerName: '', rating: 5, category: 'service', comment: '', source: 'direct'
  });

  const { data: feedback = [], refetch } = trpc.guestFeedback.list.useQuery({ persona: 'riad-routes' });
  const createMutation = trpc.guestFeedback.create.useMutation({
    onSuccess: () => { refetch(); setShowAddForm(false); toast.success('Feedback recorded'); },
    onError: () => toast.error('Failed to save feedback'),
  });

  const filteredFeedback = feedback.filter((f: any) => sourceFilter === 'all' || f.source === sourceFilter);

  const avgRating = feedback.length > 0 ? (feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / feedback.length).toFixed(1) : '0.0';
  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: feedback.filter((f: any) => f.rating === r).length,
    pct: feedback.length > 0 ? Math.round((feedback.filter((f: any) => f.rating === r).length / feedback.length) * 100) : 0,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-yellow-400" />
              Guest Feedback Aggregator
            </h1>
            <p className="text-sm text-muted-foreground">Collect and analyze guest reviews across all providers</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-yellow-600 hover:bg-yellow-700">
            <Plus className="w-4 h-4 mr-1" /> Add Feedback
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="mb-6 border-yellow-500/30">
            <CardHeader><CardTitle className="text-lg">Record Guest Feedback</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Guest Name *" value={newFeedback.guestName} onChange={e => setNewFeedback({ ...newFeedback, guestName: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Provider Name" value={newFeedback.providerName} onChange={e => setNewFeedback({ ...newFeedback, providerName: e.target.value })} />
                <select className="bg-card border border-border rounded px-3 py-2 text-sm" value={newFeedback.rating} onChange={e => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
                <select className="bg-card border border-border rounded px-3 py-2 text-sm" value={newFeedback.category} onChange={e => setNewFeedback({ ...newFeedback, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="bg-card border border-border rounded px-3 py-2 text-sm" value={newFeedback.source} onChange={e => setNewFeedback({ ...newFeedback, source: e.target.value })}>
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <textarea className="bg-card border border-border rounded px-3 py-2 text-sm md:col-span-3" placeholder="Comment" rows={2} value={newFeedback.comment} onChange={e => setNewFeedback({ ...newFeedback, comment: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => { if (newFeedback.guestName) createMutation.mutate(newFeedback); else toast.error('Guest name required'); }} disabled={createMutation.isPending} className="bg-yellow-600 hover:bg-yellow-700">
                  {createMutation.isPending ? 'Saving...' : 'Save Feedback'}
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">{avgRating}</p>
            <div className="flex justify-center gap-0.5 mt-1">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.round(Number(avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`} />)}</div>
            <p className="text-xs text-muted-foreground mt-1">Average Rating</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{feedback.length}</p><p className="text-xs text-muted-foreground">Total Reviews</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-400">{feedback.filter((f: any) => f.rating >= 4).length}</p><p className="text-xs text-muted-foreground">Positive (4-5★)</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-400">{feedback.filter((f: any) => f.rating <= 2).length}</p><p className="text-xs text-muted-foreground">Needs Attention (1-2★)</p></CardContent></Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Rating Distribution</p>
            </div>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, pct }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-xs w-12">{rating} star</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">{count} ({pct}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Filter */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {['all', ...SOURCES].map(s => (
              <Button key={s} variant={sourceFilter === s ? 'default' : 'outline'} size="sm" onClick={() => setSourceFilter(s)} className="text-xs capitalize">
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-3">
          {filteredFeedback.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No feedback yet. Add your first review above.</CardContent></Card>
          ) : (
            filteredFeedback.map((fb: any) => (
              <Card key={fb.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{fb.guestName}</span>
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`} />)}</div>
                        {fb.category && <Badge variant="outline" className="text-xs">{fb.category}</Badge>}
                      </div>
                      {fb.comment && <p className="text-sm text-muted-foreground mt-1">{fb.comment}</p>}
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        {fb.providerName && <span>Provider: {fb.providerName}</span>}
                        {fb.source && <Badge className="text-xs bg-zinc-700/50">{fb.source}</Badge>}
                        <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
