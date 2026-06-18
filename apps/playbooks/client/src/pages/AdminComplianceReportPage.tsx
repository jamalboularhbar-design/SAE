import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, FileText, Download, Trash2, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminComplianceReportPage() {
  const [showGenerate, setShowGenerate] = useState(false);
  const [title, setTitle] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedReport, setSelectedReport] = useState<number | null>(null);

  const { data: reports, isLoading } = trpc.complianceReports.list.useQuery();
  const { data: reportDetail } = trpc.complianceReports.get.useQuery(
    { id: selectedReport! },
    { enabled: !!selectedReport }
  );
  const utils = trpc.useUtils();

  const generate = trpc.complianceReports.generate.useMutation({
    onSuccess: () => {
      toast.success('Compliance report generated successfully!');
      setShowGenerate(false);
      setTitle('');
      setDateFrom('');
      setDateTo('');
      utils.complianceReports.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteReport = trpc.complianceReports.delete.useMutation({
    onSuccess: () => {
      toast.success('Report deleted');
      setSelectedReport(null);
      utils.complianceReports.list.invalidate();
    },
  });

  const parsedData = reportDetail?.reportData ? JSON.parse(reportDetail.reportData) : null;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Audit Compliance Reports</h1>
        </div>
        <Button onClick={() => setShowGenerate(!showGenerate)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Generate Form */}
      {showGenerate && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Report title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <Button
                onClick={() => generate.mutate({ title, dateFrom, dateTo })}
                disabled={!title || !dateFrom || !dateTo || generate.isPending}
              >
                {generate.isPending ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report List */}
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Generated Reports</h2>
          {!reports?.length ? (
            <p className="text-sm text-muted-foreground">No reports generated yet.</p>
          ) : (
            reports.map((report: any) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-colors ${selectedReport === report.id ? 'border-primary' : 'hover:border-primary/30'}`}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{report.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={report.status === 'generated' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Report Detail */}
        <div className="lg:col-span-2">
          {selectedReport && parsedData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{reportDetail?.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteReport.mutate({ id: selectedReport })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Period: {reportDetail?.dateFrom ? new Date(reportDetail.dateFrom).toLocaleDateString() : ''} — {reportDetail?.dateTo ? new Date(reportDetail.dateTo).toLocaleDateString() : ''}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* Access Requests */}
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Access Requests</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-mono">{parsedData.accessRequests?.total || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Approved</span>
                          <span className="font-mono text-green-400">{parsedData.accessRequests?.approved || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Denied</span>
                          <span className="font-mono text-red-400">{parsedData.accessRequests?.denied || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Retention Executions */}
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Retention Executions</p>
                      <div className="text-2xl font-bold">{parsedData.retentionExecutions?.total || 0}</div>
                      <p className="text-xs text-muted-foreground">policies executed</p>
                    </CardContent>
                  </Card>

                  {/* Accessibility Scans */}
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Accessibility Scans</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Issues Found</span>
                          <span className="font-mono">{parsedData.accessibilityScans?.total || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resolved</span>
                          <span className="font-mono text-green-400">{parsedData.accessibilityScans?.resolved || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Audit Events */}
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Audit Trail Events</p>
                      <div className="text-2xl font-bold">{parsedData.auditEvents?.total || 0}</div>
                      <p className="text-xs text-muted-foreground">total events logged</p>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Generated: {parsedData.generatedAt ? new Date(parsedData.generatedAt).toLocaleString() : 'N/A'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Select a report to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
