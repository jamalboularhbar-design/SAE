import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FileBarChart, Plus, Play, Trash2, GripVertical } from 'lucide-react';

const AVAILABLE_METRICS = [
  { id: 'total_documents', label: 'Total Documents', icon: '📄' },
  { id: 'total_views', label: 'Total Views', icon: '👁' },
  { id: 'avg_rating', label: 'Average Rating', icon: '⭐' },
  { id: 'documents_by_category', label: 'Documents by Category', icon: '📁' },
  { id: 'documents_by_status', label: 'Documents by Status', icon: '📊' },
  { id: 'top_viewed', label: 'Top Viewed Documents', icon: '🔥' },
  { id: 'recent_activity', label: 'Recent Activity', icon: '🕐' },
];

export default function AdminCustomReportsPage() {
  const { data: reports, refetch } = trpc.customReports.list.useQuery();
  const createMut = trpc.customReports.create.useMutation({ onSuccess: () => { refetch(); toast.success('Report created'); } });
  const deleteMut = trpc.customReports.delete.useMutation({ onSuccess: () => { refetch(); toast.success('Report deleted'); } });
  const executeMut = trpc.customReports.execute.useMutation();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [reportResult, setReportResult] = useState<any>(null);
  const [activeReportId, setActiveReportId] = useState<number | null>(null);

  const toggleMetric = (id: string) => {
    setSelectedMetrics(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!name || selectedMetrics.length === 0) return;
    createMut.mutate({
      name, description: desc || undefined,
      config: JSON.stringify({ metrics: selectedMetrics }),
    });
    setName(''); setDesc(''); setSelectedMetrics([]);
  };

  const handleExecute = (report: any) => {
    setActiveReportId(report.id);
    setReportResult(null);
    executeMut.mutate({ config: report.config }, {
      onSuccess: (data) => setReportResult(data),
    });
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><FileBarChart className="w-6 h-6 text-orange-400" /> Custom Reports</h1>
          <p className="text-muted-foreground mt-1">Build custom reports combining any metrics</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Report</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Custom Report</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <Input placeholder="Report name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} />
              <div>
                <label className="text-sm font-medium mb-2 block">Select Metrics</label>
                <div className="space-y-1">
                  {AVAILABLE_METRICS.map(m => (
                    <div key={m.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${selectedMetrics.includes(m.id) ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-muted/20 hover:bg-muted/40'}`} onClick={() => toggleMetric(m.id)}>
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span>{m.icon}</span>
                      <span className="text-sm">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={!name || selectedMetrics.length === 0}>Create Report</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Saved Reports ({(reports || []).length})</h2>
          <div className="space-y-2">
            {(reports || []).map((r: any) => {
              const config = JSON.parse(r.config || '{}');
              return (
                <Card key={r.id} className={`cursor-pointer transition-all ${activeReportId === r.id ? 'ring-2 ring-orange-400' : 'hover:border-orange-400/50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{r.name}</span>
                        {r.description && <p className="text-sm text-muted-foreground">{r.description}</p>}
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {(config.metrics || []).map((m: string) => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleExecute(r)}><Play className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteMut.mutate({ id: r.id })}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {(!reports || reports.length === 0) && <p className="text-muted-foreground text-center py-8">No custom reports yet.</p>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Report Results</h2>
          <Card className="min-h-[300px]">
            <CardContent className="p-4">
              {executeMut.isPending && <p className="text-muted-foreground animate-pulse">Generating report...</p>}
              {reportResult && (
                <div className="space-y-4">
                  {Object.entries(reportResult).map(([key, value]) => (
                    <div key={key}>
                      <h3 className="text-sm font-semibold text-orange-400 uppercase mb-1">{key.replace(/_/g, ' ')}</h3>
                      {typeof value === 'number' || typeof value === 'string' ? (
                        <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                      ) : Array.isArray(value) ? (
                        <div className="bg-muted/20 rounded p-2 max-h-[200px] overflow-auto">
                          <pre className="text-xs font-mono whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                        </div>
                      ) : (
                        <pre className="text-xs font-mono bg-muted/20 rounded p-2">{JSON.stringify(value, null, 2)}</pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!reportResult && !executeMut.isPending && (
                <p className="text-muted-foreground text-center py-12">Select a report and click play to generate</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
