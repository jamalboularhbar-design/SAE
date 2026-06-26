import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, BarChart3, Shield, Users, Clock, CheckCircle, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ExportJob {
  id: string;
  type: string;
  format: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  fileSize?: string;
}

const EXPORT_TYPES = [
  { id: 'documents', label: 'All Documents', description: 'Export all published documents with metadata', icon: FileText, formats: ['csv', 'json', 'pdf'] },
  { id: 'analytics', label: 'Analytics Data', description: 'Search analytics, reading sessions, engagement metrics', icon: BarChart3, formats: ['csv', 'json'] },
  { id: 'audit-logs', label: 'Audit Logs', description: 'Complete audit trail of all system actions', icon: Shield, formats: ['csv', 'json'] },
  { id: 'user-data', label: 'User Data', description: 'User profiles, preferences, and activity (GDPR export)', icon: Users, formats: ['json'] },
];

export default function ExportCenterPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<Record<string, string>>({});

  const startExport = (type: string) => {
    const format = selectedFormat[type] || 'csv';
    const newJob: ExportJob = {
      id: `export-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      format,
      status: 'queued',
      createdAt: new Date(),
    };
    setJobs(prev => [newJob, ...prev]);
    toast.success(`Export queued: ${type} as ${format.toUpperCase()}`);

    // Simulate processing
    setTimeout(() => {
      setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: 'processing' as const } : j));
    }, 1000);
    setTimeout(() => {
      setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: 'completed' as const, completedAt: new Date(), fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB` } : j));
      toast.success(`Export ready: ${type}.${format}`);
    }, 3000 + Math.random() * 2000);
  };

  const getStatusBadge = (status: ExportJob['status']) => {
    switch (status) {
      case 'queued': return <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" />Queued</Badge>;
      case 'processing': return <Badge variant="secondary" className="text-xs"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case 'completed': return <Badge className="text-xs bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Ready</Badge>;
      case 'failed': return <Badge variant="destructive" className="text-xs">Failed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-accent" />
            Export Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Queue and download bulk exports of your platform data</p>
        </div>

        {/* Export types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {EXPORT_TYPES.map((type) => (
            <Card key={type.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <type.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{type.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Select
                        value={selectedFormat[type.id] || type.formats[0]}
                        onValueChange={(v) => setSelectedFormat(prev => ({ ...prev, [type.id]: v }))}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {type.formats.map(f => (
                            <SelectItem key={f} value={f}>{f.toUpperCase()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={() => startExport(type.id)}>
                        <Download className="w-3 h-3 mr-1" /> Export
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Export history */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Export History</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Download className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No exports yet. Start by selecting a data type above.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{job.type}.{job.format}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.createdAt.toLocaleString()}
                          {job.fileSize && ` • ${job.fileSize}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(job.status)}
                      {job.status === 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => toast.info('Download started')}>
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
