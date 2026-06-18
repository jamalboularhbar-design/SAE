import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Plus, Search, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-blue-500/20 text-blue-300',
  medium: 'bg-amber-500/20 text-amber-300',
  high: 'bg-orange-500/20 text-orange-300',
  critical: 'bg-red-500/20 text-red-300',
};

const STATUS_ICONS: Record<string, any> = {
  open: <XCircle className="w-3 h-3 text-red-400" />,
  investigating: <Clock className="w-3 h-3 text-amber-400" />,
  resolved: <CheckCircle2 className="w-3 h-3 text-green-400" />,
  closed: <CheckCircle2 className="w-3 h-3 text-zinc-400" />,
};

export default function IncidentLogDbPage() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [resolveId, setResolveId] = useState<number | null>(null);
  const [resolution, setResolution] = useState('');
  const [newIncident, setNewIncident] = useState({
    title: '', description: '', severity: 'medium', persona: 'riad-routes', category: '', providerName: '', assignedTo: ''
  });

  const { data: incidents = [], refetch } = trpc.incidents.list.useQuery({ persona: 'riad-routes' });
  const createMutation = trpc.incidents.create.useMutation({
    onSuccess: () => { refetch(); setShowAddForm(false); setNewIncident({ title: '', description: '', severity: 'medium', persona: 'riad-routes', category: '', providerName: '', assignedTo: '' }); toast.success('Incident logged'); },
    onError: () => toast.error('Failed to log incident'),
  });
  const resolveMutation = trpc.incidents.resolve.useMutation({
    onSuccess: () => { refetch(); setResolveId(null); setResolution(''); toast.success('Incident resolved'); },
    onError: () => toast.error('Failed to resolve'),
  });

  const filtered = incidents.filter((i: any) => statusFilter === 'all' || i.status === statusFilter);

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
              <AlertTriangle className="w-6 h-6 text-red-400" />
              Incident Log
            </h1>
            <p className="text-sm text-muted-foreground">Track, investigate, and resolve operational incidents</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-1" /> Log Incident
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="mb-6 border-red-500/30">
            <CardHeader><CardTitle className="text-lg">Log New Incident</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input className="bg-card border border-border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Title *" value={newIncident.title} onChange={e => setNewIncident({ ...newIncident, title: e.target.value })} />
                <select className="bg-card border border-border rounded px-3 py-2 text-sm" value={newIncident.severity} onChange={e => setNewIncident({ ...newIncident, severity: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <textarea className="bg-card border border-border rounded px-3 py-2 text-sm md:col-span-3" placeholder="Description *" rows={3} value={newIncident.description} onChange={e => setNewIncident({ ...newIncident, description: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Category" value={newIncident.category} onChange={e => setNewIncident({ ...newIncident, category: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Provider Name" value={newIncident.providerName} onChange={e => setNewIncident({ ...newIncident, providerName: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Assigned To" value={newIncident.assignedTo} onChange={e => setNewIncident({ ...newIncident, assignedTo: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => { if (newIncident.title && newIncident.description) createMutation.mutate(newIncident); else toast.error('Title and description required'); }} disabled={createMutation.isPending} className="bg-red-600 hover:bg-red-700">
                  {createMutation.isPending ? 'Logging...' : 'Log Incident'}
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-400">{incidents.filter((i: any) => i.status === 'open').length}</p><p className="text-xs text-muted-foreground">Open</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-400">{incidents.filter((i: any) => i.status === 'investigating').length}</p><p className="text-xs text-muted-foreground">Investigating</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-400">{incidents.filter((i: any) => i.status === 'resolved').length}</p><p className="text-xs text-muted-foreground">Resolved</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{incidents.length}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 mb-4">
          {['all', 'open', 'investigating', 'resolved', 'closed'].map(s => (
            <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(s)} className="text-xs capitalize">
              {s}
            </Button>
          ))}
        </div>

        {/* Incident List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No incidents to display.</CardContent></Card>
          ) : (
            filtered.map((inc: any) => (
              <Card key={inc.id} className={inc.severity === 'critical' ? 'border-red-500/30' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {STATUS_ICONS[inc.status]}
                        <h3 className="font-medium text-sm">{inc.title}</h3>
                        <Badge className={SEVERITY_COLORS[inc.severity] || ''}>{inc.severity}</Badge>
                        {inc.category && <Badge variant="outline" className="text-xs">{inc.category}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{inc.description}</p>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        {inc.providerName && <span>Provider: {inc.providerName}</span>}
                        {inc.assignedTo && <span>Assigned: {inc.assignedTo}</span>}
                        <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                      </div>
                      {inc.resolution && <p className="text-xs text-green-400 mt-2">Resolution: {inc.resolution}</p>}
                    </div>
                    {(inc.status === 'open' || inc.status === 'investigating') && (
                      <div>
                        {resolveId === inc.id ? (
                          <div className="flex flex-col gap-1">
                            <textarea className="bg-card border border-border rounded px-2 py-1 text-xs w-48" placeholder="Resolution..." rows={2} value={resolution} onChange={e => setResolution(e.target.value)} />
                            <div className="flex gap-1">
                              <Button size="sm" className="text-xs h-6 bg-green-600 hover:bg-green-700" onClick={() => { if (resolution) resolveMutation.mutate({ id: inc.id, resolution }); }}>
                                Resolve
                              </Button>
                              <Button size="sm" variant="ghost" className="text-xs h-6" onClick={() => setResolveId(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => setResolveId(inc.id)}>
                            Resolve
                          </Button>
                        )}
                      </div>
                    )}
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
