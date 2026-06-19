import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ClipboardList, Plus, Clock, AlertTriangle, CheckCircle, User, Plane, Palette, Check } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type Persona = 'riad-routes' | 'artkech';
type Priority = 'urgent' | 'normal' | 'info';

function getVisitorId(): string {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

const RR_CATEGORIES = ['Guest Issues', 'Provider Coordination', 'Arrivals/Departures', 'VIP Notes', 'Supplier Updates', 'Security', 'F&B', 'General'];
const AK_CATEGORIES = ['Client Deadlines', 'Design Reviews', 'Print Jobs', 'Freelancer Updates', 'Client Feedback', 'Equipment', 'Billing', 'General'];

export default function ShiftHandoverPage() {
  const [, navigate] = useLocation();
  const [activePersona, setActivePersona] = useState<Persona>('riad-routes');
  const [currentShift, setCurrentShift] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('normal');
  const [newCategory, setNewCategory] = useState('General');

  const visitorId = useMemo(() => getVisitorId(), []);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const categories = activePersona === 'riad-routes' ? RR_CATEGORIES : AK_CATEGORIES;

  // Fetch persisted handover notes from DB
  const { data: handoverNotes, refetch } = trpc.handover.list.useQuery(
    { persona: activePersona },
    { staleTime: 10000 }
  );

  const createMutation = trpc.handover.create.useMutation({
    onSuccess: () => {
      toast.success('Handover item saved');
      setNewContent('');
      refetch();
    },
    onError: () => { toast.error('Failed to save handover item'); }
  });

  const resolveMutation = trpc.handover.resolve.useMutation({
    onSuccess: () => {
      toast.success('Item resolved');
      refetch();
    },
    onError: () => { toast.error('Failed to resolve item'); }
  });

  const submitItem = () => {
    if (!newContent.trim() || !currentShift || !authorName.trim()) {
      toast.error('Please fill in your name, shift, and content');
      return;
    }
    createMutation.mutate({
      visitorId,
      persona: activePersona,
      priority: newPriority,
      category: newCategory,
      content: `[${authorName}] ${newContent.trim()}`,
      shiftDate: todayStr,
      shiftType: currentShift,
    });
  };

  const resolveItem = (id: number) => {
    resolveMutation.mutate({ id });
  };

  const priorityIcon = (p: string) => {
    if (p === 'urgent') return <AlertTriangle className="w-3 h-3 text-red-400" />;
    if (p === 'normal') return <Clock className="w-3 h-3 text-amber-400" />;
    return <CheckCircle className="w-3 h-3 text-blue-400" />;
  };

  const priorityStyle = (p: string) => {
    if (p === 'urgent') return 'border-l-red-500 bg-red-500/5';
    if (p === 'normal') return 'border-l-amber-500 bg-amber-500/5';
    return 'border-l-blue-500 bg-blue-500/5';
  };

  const activeNotes = (handoverNotes || []).filter((n: any) => !n.resolvedAt);
  const resolvedNotes = (handoverNotes || []).filter((n: any) => n.resolvedAt);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ClipboardList className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold">Shift Handover Notes</h1>
          <Badge variant="secondary" className="ml-auto">{activeNotes.length} active</Badge>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Persona Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActivePersona('riad-routes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'riad-routes' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}
          >
            <Plane className="w-4 h-4" /> Horizon Concierge
          </button>
          <button
            onClick={() => setActivePersona('artkech')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'artkech' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}
          >
            <Palette className="w-4 h-4" /> Meridian Creative Studio
          </button>
        </div>

        {/* Create Handover */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-accent" />
              Add Handover Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Your Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="e.g., Ahmed K."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Shift Ending</label>
                <select
                  value={currentShift}
                  onChange={e => setCurrentShift(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                >
                  <option value="">Select shift...</option>
                  <option value="Morning (6:00-14:00)">Morning (6:00-14:00)</option>
                  <option value="Afternoon (14:00-22:00)">Afternoon (14:00-22:00)</option>
                  <option value="Night (22:00-6:00)">Night (22:00-6:00)</option>
                  {activePersona === 'artkech' && <option value="Studio Hours (9:00-18:00)">Studio Hours (9:00-18:00)</option>}
                </select>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="border border-border rounded-lg p-3 space-y-3">
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Describe the handover item..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-none"
              />
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as Priority)}
                  className="px-2 py-1.5 rounded border border-border bg-card text-sm"
                >
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                  <option value="info">Info</option>
                </select>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="px-2 py-1.5 rounded border border-border bg-card text-sm"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  onClick={submitItem}
                  disabled={!newContent.trim() || !currentShift || !authorName.trim() || createMutation.isPending}
                  className="ml-auto px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Saving...' : 'Submit Item'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Handover Items */}
        {activeNotes.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Active Handover Items ({activeNotes.length})
            </h3>
            {activeNotes.map((note: any) => (
              <div key={note.id} className={`flex items-start gap-2 p-3 rounded-lg border-l-4 ${priorityStyle(note.priority)}`}>
                {priorityIcon(note.priority)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{note.content}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{note.category}</Badge>
                    <span className="text-xs text-muted-foreground">{note.shiftType}</span>
                    <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => resolveItem(note.id)}
                  className="px-2 py-1 rounded bg-green-600/20 text-green-400 text-xs font-medium hover:bg-green-600/30 transition flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Resolve
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Resolved Items */}
        {resolvedNotes.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Resolved ({resolvedNotes.length})
            </h3>
            {resolvedNotes.slice(0, 10).map((note: any) => (
              <div key={note.id} className="flex items-start gap-2 p-3 rounded-lg border border-border/50 opacity-60">
                <CheckCircle className="w-3 h-3 text-green-500 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-through">{note.content}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{note.category}</Badge>
                    <span className="text-xs text-muted-foreground">Resolved {new Date(note.resolvedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
