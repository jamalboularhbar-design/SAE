import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Building2, Briefcase, Clock, CheckCircle2, XCircle, MessageSquare, Download } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  qualified: 'bg-green-500/20 text-green-300 border-green-500/30',
  converted: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  lost: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function AdminLeadsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data: leads, isLoading } = trpc.leads.list.useQuery(statusFilter ? { status: statusFilter } : undefined);
  const updateStatus = trpc.leads.updateStatus.useMutation();
  const utils = trpc.useUtils();

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      utils.leads.list.invalidate();
      toast.success(`Lead status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const statuses = ['all', 'new', 'contacted', 'qualified', 'converted', 'lost'];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-teal-400" />
              Lead Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage incoming demo requests and leads from the NexusAI Playbooks landing page</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5"
              onClick={() => {
                fetch('/api/trpc/leads.exportCsv', { credentials: 'include' })
                  .then(res => res.json())
                  .then((data: any) => {
                    const csv = data?.result?.data?.json?.csv;
                    if (!csv) { toast.error('Export failed'); return; }
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success('Leads exported successfully');
                  })
                  .catch(() => toast.error('Export failed'));
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {leads?.length ?? 0} leads
            </Badge>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {statuses.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s || (s === 'all' && !statusFilter) ? 'default' : 'outline'}
              onClick={() => setStatusFilter(s === 'all' ? undefined : s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>

        {/* Leads Table */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading leads...</div>
        ) : !leads || leads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No leads yet. Share the landing page to start collecting demo requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="p-5 rounded-xl bg-card border border-border hover:border-teal-500/20 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{lead.fullName}</h3>
                      <Badge className={`${STATUS_COLORS[lead.status] || STATUS_COLORS.new} border text-xs`}>
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {lead.email}
                      </span>
                      {lead.company && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {lead.company}
                        </span>
                      )}
                      {lead.jobTitle && (
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          {lead.jobTitle}
                        </span>
                      )}
                      {lead.teamSize && (
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {lead.teamSize} employees
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {lead.message && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Challenge:
                        </div>
                        {lead.message}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {lead.status === 'new' && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(lead.id, 'contacted')}>
                        <Mail className="w-3.5 h-3.5 mr-1" /> Mark Contacted
                      </Button>
                    )}
                    {(lead.status === 'new' || lead.status === 'contacted') && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-500" onClick={() => handleStatusChange(lead.id, 'qualified')}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Qualify
                      </Button>
                    )}
                    {lead.status === 'qualified' && (
                      <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black" onClick={() => handleStatusChange(lead.id, 'converted')}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Convert
                      </Button>
                    )}
                    {lead.status !== 'lost' && lead.status !== 'converted' && (
                      <Button size="sm" variant="outline" className="text-red-400 border-red-500/30" onClick={() => handleStatusChange(lead.id, 'lost')}>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Lost
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
