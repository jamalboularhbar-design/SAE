import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Plus, Clock, CheckCircle, XCircle, Filter, Plane, Palette } from 'lucide-react';
import { toast } from 'sonner';

type Persona = 'riad-routes' | 'artkech';
type Severity = 'critical' | 'high' | 'medium' | 'low';
type Status = 'open' | 'investigating' | 'resolved' | 'closed';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  category: string;
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  resolution?: string;
  persona: Persona;
}

const SAMPLE_INCIDENTS: Incident[] = [
  { id: 'inc-001', title: 'Hot water failure at Riad Yasmine', description: 'Guest reported no hot water in Suite 3. Provider contacted immediately.', severity: 'high', status: 'resolved', category: 'Provider Issue', reportedBy: 'Ahmed K.', reportedAt: '2026-05-19T08:30:00', resolvedAt: '2026-05-19T10:15:00', resolution: 'Provider plumber fixed boiler. Complimentary hammam offered to guest.', persona: 'riad-routes' },
  { id: 'inc-002', title: 'Driver no-show for airport transfer', description: 'Mr. Johnson arriving on RAM flight AT502. Assigned driver unreachable.', severity: 'critical', status: 'resolved', category: 'Transfer', reportedBy: 'Youssef M.', reportedAt: '2026-05-18T14:00:00', resolvedAt: '2026-05-18T14:25:00', resolution: 'Backup driver dispatched within 15 min. Guest collected with apology gift.', persona: 'riad-routes' },
  { id: 'inc-003', title: 'Dietary requirement not communicated', description: 'Vegan guest served non-vegan breakfast at La Mamounia. Guest upset.', severity: 'high', status: 'investigating', category: 'Guest Welfare', reportedBy: 'Fatima L.', reportedAt: '2026-05-20T07:45:00', persona: 'riad-routes' },
  { id: 'inc-004', title: 'Print deadline missed by freelancer', description: 'Freelance illustrator missed the brochure deadline by 2 days. Client presentation affected.', severity: 'medium', status: 'resolved', category: 'Deadline', reportedBy: 'Sara B.', reportedAt: '2026-05-17T16:00:00', resolvedAt: '2026-05-18T09:00:00', resolution: 'In-house designer completed illustrations overnight. Client notified of 1-day delay.', persona: 'artkech' },
  { id: 'inc-005', title: 'Client files corrupted during transfer', description: 'Brand guidelines PDF corrupted when sent to print vendor. Need re-export.', severity: 'medium', status: 'open', category: 'Technical', reportedBy: 'Karim T.', reportedAt: '2026-05-20T11:00:00', persona: 'artkech' },
];

const RR_CATEGORIES = ['Provider Issue', 'Transfer', 'Guest Welfare', 'Booking Error', 'Security', 'Payment', 'Communication', 'Other'];
const AK_CATEGORIES = ['Deadline', 'Technical', 'Client Complaint', 'Quality Issue', 'Equipment', 'Freelancer', 'Payment', 'Other'];

export default function IncidentLogPage() {
  const [, navigate] = useLocation();
  const [activePersona, setActivePersona] = useState<Persona>('riad-routes');
  const [incidents, setIncidents] = useState<Incident[]>(SAMPLE_INCIDENTS);
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSeverity, setNewSeverity] = useState<Severity>('medium');
  const [newCategory, setNewCategory] = useState('');

  const categories = activePersona === 'riad-routes' ? RR_CATEGORIES : AK_CATEGORIES;

  const filtered = useMemo(() => {
    return incidents
      .filter(i => i.persona === activePersona)
      .filter(i => filterStatus === 'all' || i.status === filterStatus)
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  }, [incidents, activePersona, filterStatus]);

  const logIncident = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error('Please fill in title and description');
      return;
    }
    const incident: Incident = {
      id: `inc-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      severity: newSeverity,
      status: 'open',
      category: newCategory || 'Other',
      reportedBy: 'Current User',
      reportedAt: new Date().toISOString(),
      persona: activePersona,
    };
    setIncidents(prev => [incident, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setShowForm(false);
    toast.success('Incident logged');
  };

  const severityColor = (s: Severity) => {
    if (s === 'critical') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (s === 'high') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (s === 'medium') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const statusIcon = (s: Status) => {
    if (s === 'open') return <XCircle className="w-3 h-3 text-red-400" />;
    if (s === 'investigating') return <Clock className="w-3 h-3 text-amber-400" />;
    if (s === 'resolved') return <CheckCircle className="w-3 h-3 text-green-400" />;
    return <CheckCircle className="w-3 h-3 text-muted-foreground" />;
  };

  const openCount = incidents.filter(i => i.persona === activePersona && (i.status === 'open' || i.status === 'investigating')).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold">Incident Log</h1>
          {openCount > 0 && <Badge variant="destructive" className="ml-auto">{openCount} open</Badge>}
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button onClick={() => setActivePersona('riad-routes')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'riad-routes' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}>
              <Plane className="w-4 h-4" /> Horizon Concierge
            </button>
            <button onClick={() => setActivePersona('artkech')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'artkech' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}>
              <Palette className="w-4 h-4" /> Meridian Creative Studio
            </button>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium">
            <Plus className="w-4 h-4" /> Log Incident
          </button>
        </div>

        {/* New Incident Form */}
        {showForm && (
          <Card className="border-red-500/30">
            <CardHeader>
              <CardTitle className="text-sm text-red-400">Log New Incident</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Incident title..." className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm" />
              <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Describe what happened..." rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm resize-none" />
              <div className="flex gap-2 flex-wrap">
                <select value={newSeverity} onChange={e => setNewSeverity(e.target.value as Severity)} className="px-2 py-1.5 rounded border border-border bg-card text-sm">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="px-2 py-1.5 rounded border border-border bg-card text-sm">
                  <option value="">Category...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={logIncident} className="ml-auto px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium">Submit</button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Filter */}
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'open', 'investigating', 'resolved', 'closed'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1 rounded-lg text-xs border transition-colors capitalize ${filterStatus === s ? 'bg-accent/10 border-accent text-accent' : 'border-border text-muted-foreground'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Incidents List */}
        <div className="space-y-3">
          {filtered.map(incident => (
            <Card key={incident.id} className={`${incident.status === 'open' ? 'border-red-500/20' : incident.status === 'investigating' ? 'border-amber-500/20' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{statusIcon(incident.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{incident.title}</p>
                      <Badge variant="outline" className={`text-xs ${severityColor(incident.severity)}`}>{incident.severity}</Badge>
                      <Badge variant="outline" className="text-xs">{incident.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{incident.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Reported by {incident.reportedBy}</span>
                      <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                    </div>
                    {incident.resolution && (
                      <div className="mt-2 p-2 rounded bg-green-500/5 border border-green-500/20">
                        <p className="text-xs text-green-400 font-medium">Resolution:</p>
                        <p className="text-xs text-foreground/80">{incident.resolution}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No incidents matching filter</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
