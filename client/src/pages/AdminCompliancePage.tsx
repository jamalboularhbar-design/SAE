import { useState } from 'react';
import { Shield, Download, Trash2, FileText, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DataRequest {
  id: string;
  type: 'export' | 'deletion' | 'rectification';
  userEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  completedAt?: string;
  notes?: string;
}

const DEMO_REQUESTS: DataRequest[] = [
  { id: '1', type: 'export', userEmail: 'john@company.com', status: 'completed', requestedAt: '2025-05-15', completedAt: '2025-05-16', notes: 'Full data export delivered via secure link' },
  { id: '2', type: 'deletion', userEmail: 'sarah@agency.com', status: 'pending', requestedAt: '2025-05-19' },
  { id: '3', type: 'export', userEmail: 'mike@enterprise.co', status: 'processing', requestedAt: '2025-05-18' },
  { id: '4', type: 'rectification', userEmail: 'anna@startup.io', status: 'completed', requestedAt: '2025-05-10', completedAt: '2025-05-11', notes: 'Name updated as requested' },
];

const CONSENT_CATEGORIES = [
  { name: 'Essential Cookies', description: 'Required for basic functionality', required: true, enabled: true },
  { name: 'Analytics', description: 'Usage tracking and performance monitoring', required: false, enabled: true },
  { name: 'Marketing', description: 'Personalized content and advertising', required: false, enabled: false },
  { name: 'Third-Party Integrations', description: 'External service connections', required: false, enabled: true },
];

export default function AdminCompliancePage() {
  const [requests, setRequests] = useState<DataRequest[]>(DEMO_REQUESTS);
  const [activeTab, setActiveTab] = useState<'requests' | 'consent' | 'retention' | 'audit'>('requests');

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'processing' as const } : r));
    toast.success('Request approved and processing started');
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
    toast.success('Request rejected');
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-500';
      case 'processing': return 'bg-blue-500/20 text-blue-500';
      case 'pending': return 'bg-amber-500/20 text-amber-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      default: return '';
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'export': return <Download className="w-4 h-4" />;
      case 'deletion': return <Trash2 className="w-4 h-4" />;
      case 'rectification': return <FileText className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Data Compliance & Privacy
          </h1>
          <p className="text-muted-foreground mt-1">
            GDPR, CCPA, and data privacy management tools
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Pending Requests', value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-amber-500' },
            { label: 'Completed (30d)', value: requests.filter(r => r.status === 'completed').length, icon: CheckCircle, color: 'text-green-500' },
            { label: 'Avg Response Time', value: '18h', icon: Clock, color: 'text-blue-500' },
            { label: 'Compliance Score', value: '94%', icon: Shield, color: 'text-primary' },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {(['requests', 'consent', 'retention', 'audit'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'requests' ? 'Data Requests' : tab}
            </button>
          ))}
        </div>

        {/* Data Requests Tab */}
        {activeTab === 'requests' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Data Subject Requests</CardTitle>
                <Button size="sm" variant="outline" onClick={() => toast.success('Export log generated')}>
                  <Download className="w-4 h-4 mr-2" /> Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {typeIcon(req.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{req.userEmail}</span>
                          <Badge variant="outline" className="text-xs capitalize">{req.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Requested {req.requestedAt}
                          {req.completedAt && ` • Completed ${req.completedAt}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColor(req.status)}>{req.status}</Badge>
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApprove(req.id)}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(req.id)}>Reject</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consent Management Tab */}
        {activeTab === 'consent' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consent Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CONSENT_CATEGORIES.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cat.name}</span>
                        {cat.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{cat.enabled ? 'Enabled' : 'Disabled'}</span>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${cat.enabled ? 'bg-primary' : 'bg-muted'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${cat.enabled ? 'left-5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Cookie Banner Configuration</h4>
                <p className="text-xs text-muted-foreground">
                  The consent banner is automatically shown to new visitors. Users can manage their preferences at any time via the footer link.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Retention Tab */}
        {activeTab === 'retention' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Retention Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: 'User Activity Logs', retention: '90 days', auto: true, description: 'Page views, searches, interactions' },
                  { category: 'Session Data', retention: '30 days', auto: true, description: 'Login sessions, device info' },
                  { category: 'Analytics Data', retention: '2 years', auto: false, description: 'Aggregated usage statistics' },
                  { category: 'Audit Trail', retention: '7 years', auto: false, description: 'Admin actions, compliance events' },
                  { category: 'Deleted User Data', retention: '30 days', auto: true, description: 'Soft-deleted accounts before permanent removal' },
                  { category: 'Email Communications', retention: '1 year', auto: true, description: 'Sent nurture emails, notifications' },
                ].map(policy => (
                  <div key={policy.category} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{policy.category}</span>
                        {policy.auto && <Badge className="bg-green-500/20 text-green-500 text-xs">Auto-purge</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{policy.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{policy.retention}</p>
                      <p className="text-xs text-muted-foreground">retention period</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compliance Audit Tab */}
        {activeTab === 'audit' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { item: 'Privacy Policy published and up-to-date', status: true },
                  { item: 'Cookie consent banner implemented', status: true },
                  { item: 'Data Processing Agreement (DPA) available', status: true },
                  { item: 'Right to erasure process documented', status: true },
                  { item: 'Data portability (export) functional', status: true },
                  { item: 'Breach notification procedure defined', status: true },
                  { item: 'Data Protection Impact Assessment (DPIA) completed', status: false },
                  { item: 'Sub-processor list maintained', status: true },
                  { item: 'Employee data handling training', status: false },
                  { item: 'Annual compliance review scheduled', status: true },
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    {check.status ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${check.status ? '' : 'text-amber-500'}`}>{check.item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <Button onClick={() => toast.success('Compliance report generated')}>
                  <FileText className="w-4 h-4 mr-2" /> Generate Report
                </Button>
                <Button variant="outline" onClick={() => toast.success('DPA template downloaded')}>
                  <Download className="w-4 h-4 mr-2" /> Download DPA Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
