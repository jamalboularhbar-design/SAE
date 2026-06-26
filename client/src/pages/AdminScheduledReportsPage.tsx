import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, Clock, Mail, FileText, Plus, Trash2, Play, Pause, Settings } from 'lucide-react';

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'csv' | 'html';
  recipients: string[];
  metrics: string[];
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
}

const AVAILABLE_METRICS = [
  'Document views', 'User activity', 'Search analytics', 'Content health',
  'Lead conversions', 'System performance', 'Approval queue', 'Team productivity',
];

const DEFAULT_REPORTS: ScheduledReport[] = [
  {
    id: '1', name: 'Weekly Executive Summary', frequency: 'weekly', format: 'pdf',
    recipients: ['admin@company.com', 'ceo@company.com'], metrics: ['Document views', 'User activity', 'Lead conversions'],
    enabled: true, lastRun: '2026-05-13T08:00:00Z', nextRun: '2026-05-20T08:00:00Z',
  },
  {
    id: '2', name: 'Monthly Content Health Report', frequency: 'monthly', format: 'html',
    recipients: ['content-team@company.com'], metrics: ['Content health', 'Approval queue', 'Search analytics'],
    enabled: true, lastRun: '2026-05-01T06:00:00Z', nextRun: '2026-06-01T06:00:00Z',
  },
  {
    id: '3', name: 'Daily Performance Digest', frequency: 'daily', format: 'csv',
    recipients: ['ops@company.com'], metrics: ['System performance', 'User activity'],
    enabled: false, lastRun: '2026-05-18T06:00:00Z', nextRun: '2026-05-21T06:00:00Z',
  },
];

export default function AdminScheduledReportsPage() {
  const [reports, setReports] = useState<ScheduledReport[]>(DEFAULT_REPORTS);
  const [showCreate, setShowCreate] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '', frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    format: 'pdf' as 'pdf' | 'csv' | 'html', recipients: '', metrics: [] as string[],
  });

  const toggleReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast.success('Report schedule updated');
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast.success('Report deleted');
  };

  const createReport = () => {
    if (!newReport.name || !newReport.recipients || newReport.metrics.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }
    const report: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      frequency: newReport.frequency,
      format: newReport.format,
      recipients: newReport.recipients.split(',').map(e => e.trim()),
      metrics: newReport.metrics,
      enabled: true,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setReports(prev => [...prev, report]);
    setShowCreate(false);
    setNewReport({ name: '', frequency: 'weekly', format: 'pdf', recipients: '', metrics: [] });
    toast.success('Scheduled report created');
  };

  const toggleMetric = (metric: string) => {
    setNewReport(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric) ? prev.metrics.filter(m => m !== metric) : [...prev.metrics, metric],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary">Reporting</Badge>
            <h1 className="text-2xl font-bold">Scheduled Reports</h1>
            <p className="text-muted-foreground mt-1">Configure automated report delivery to your team</p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="w-4 h-4 mr-1" /> New Report
          </Button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <Card className="mb-6 border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Create Scheduled Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Report Name</label>
                  <input
                    type="text"
                    value={newReport.name}
                    onChange={e => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weekly Team Summary"
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Recipients (comma-separated)</label>
                  <input
                    type="text"
                    value={newReport.recipients}
                    onChange={e => setNewReport(prev => ({ ...prev, recipients: e.target.value }))}
                    placeholder="email1@co.com, email2@co.com"
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Frequency</label>
                  <select
                    value={newReport.frequency}
                    onChange={e => setNewReport(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Format</label>
                  <select
                    value={newReport.format}
                    onChange={e => setNewReport(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="html">HTML Email</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Metrics to Include</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_METRICS.map(metric => (
                    <Badge
                      key={metric}
                      className={`cursor-pointer transition-colors ${
                        newReport.metrics.includes(metric)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                      onClick={() => toggleMetric(metric)}
                    >
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={createReport}>Create Report</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map(report => (
            <Card key={report.id} className={`${!report.enabled ? 'opacity-60' : ''}`}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <h3 className="font-medium">{report.name}</h3>
                      <Badge variant="outline" className="text-xs">{report.frequency}</Badge>
                      <Badge variant="outline" className="text-xs uppercase">{report.format}</Badge>
                      {report.enabled ? (
                        <Badge className="bg-green-500/10 text-green-600 text-xs">Active</Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground text-xs">Paused</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {report.recipients.join(', ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Next: {new Date(report.nextRun).toLocaleDateString()}
                      </span>
                      {report.lastRun && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Last: {new Date(report.lastRun).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {report.metrics.map(m => (
                        <Badge key={m} variant="outline" className="text-xs bg-muted/30">{m}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => toggleReport(report.id)} title={report.enabled ? 'Pause' : 'Resume'}>
                      {report.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteReport(report.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
