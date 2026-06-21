import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MessageSquare, AlertTriangle, ThumbsUp, ClipboardCheck } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const LOG_TYPES = [
  { value: 'praise', label: 'Praise', icon: ThumbsUp, color: 'text-green-600' },
  { value: 'feedback', label: 'Feedback', icon: MessageSquare, color: 'text-blue-600' },
  { value: 'issue', label: 'Issue', icon: AlertTriangle, color: 'text-amber-600' },
  { value: 'audit', label: 'Audit', icon: ClipboardCheck, color: 'text-purple-600' },
];

export default function ProviderQualityPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const providerId = parseInt(params.id || '0');

  const { data: provider } = trpc.providerPartners.getById.useQuery({ id: providerId }, { enabled: providerId > 0 });
  const { data: logs = [], refetch } = trpc.providerPartners.qualityLogs.useQuery({ providerId }, { enabled: providerId > 0 });

  const [newLog, setNewLog] = useState({ type: 'feedback', content: '', rating: 0 });
  const visitorId = typeof window !== 'undefined' ? (localStorage.getItem('arg-visitor-id') || 'anonymous') : 'anonymous';

  const addLogMutation = trpc.providerPartners.addQualityLog.useMutation({
    onSuccess: () => { toast.success('Quality log added'); setNewLog({ type: 'feedback', content: '', rating: 0 }); refetch(); },
    onError: () => toast.error('Failed to add log'),
  });

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-6 flex items-center justify-center">
        <p className="text-slate-400">Loading provider...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/provider-directory')} className="p-2 rounded-lg hover:bg-white/60 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{provider.name}</h1>
            <p className="text-slate-500 text-sm">Quality tracking and observations</p>
          </div>
        </div>

        {/* Provider Summary */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline">{provider.type}</Badge>
              <Badge className="bg-amber-100 text-amber-800">{provider.tier}</Badge>
              {provider.qualityScore && provider.qualityScore > 0 && (
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-amber-500" /> {provider.qualityScore.toFixed(1)}/5
                </span>
              )}
              {provider.location && <span className="text-sm text-slate-500">{provider.location}</span>}
            </div>
          </CardContent>
        </Card>

        {/* Add Quality Log */}
        <Card className="mb-6 border-blue-200">
          <CardHeader><CardTitle className="text-lg">Add Quality Observation</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {LOG_TYPES.map(lt => (
                  <button key={lt.value} onClick={() => setNewLog(p => ({ ...p, type: lt.value }))} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${newLog.type === lt.value ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border hover:bg-slate-50'}`}>
                    <lt.icon className="w-3.5 h-3.5" /> {lt.label}
                  </button>
                ))}
              </div>
              <textarea placeholder="Describe the observation..." value={newLog.content} onChange={e => setNewLog(p => ({ ...p, content: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} />
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Rating (optional):</span>
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} onClick={() => setNewLog(p => ({ ...p, rating: p.rating === r ? 0 : r }))} className="transition">
                    <Star className={`w-5 h-5 ${r <= newLog.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
              <Button onClick={() => addLogMutation.mutate({ providerId, visitorId, type: newLog.type, content: newLog.content, rating: newLog.rating || undefined })} disabled={!newLog.content || addLogMutation.isPending} size="sm">
                {addLogMutation.isPending ? 'Saving...' : 'Save Observation'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quality Logs */}
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quality History ({logs.length})</h2>
        <div className="space-y-3">
          {logs.map((log: any) => {
            const logType = LOG_TYPES.find(lt => lt.value === log.type);
            const Icon = logType?.icon || MessageSquare;
            return (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${logType?.color || 'text-slate-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{log.type}</Badge>
                        {log.rating && (
                          <span className="flex items-center gap-0.5">
                            {Array.from({ length: log.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                            ))}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto">{new Date(log.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700">{log.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {logs.length === 0 && (
            <p className="text-center text-slate-400 py-8">No quality logs yet. Add your first observation above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
