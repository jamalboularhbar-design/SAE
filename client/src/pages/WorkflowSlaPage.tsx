import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, AlertTriangle, CheckCircle, Settings, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkflowSlaPage() {
  const [editStage, setEditStage] = useState<string | null>(null);
  const [editHours, setEditHours] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const { data: configs, refetch: refetchConfigs } = trpc.workflowSla.getConfigs.useQuery();
  const { data: breaches } = trpc.workflowSla.getBreaches.useQuery({ resolved: false });
  const { data: allBreaches } = trpc.workflowSla.getBreaches.useQuery();

  const upsertMutation = trpc.workflowSla.upsertConfig.useMutation({
    onSuccess: () => {
      toast.success('SLA config updated');
      setEditStage(null);
      refetchConfigs();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resolveMutation = trpc.workflowSla.resolveBreach.useMutation({
    onSuccess: () => {
      toast.success('Breach resolved');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const DEFAULT_STAGES = [
    { stage: 'draft', label: 'Draft', defaultHours: 48 },
    { stage: 'review', label: 'In Review', defaultHours: 24 },
    { stage: 'approval', label: 'Pending Approval', defaultHours: 12 },
    { stage: 'revision', label: 'Revision Required', defaultHours: 36 },
    { stage: 'publish', label: 'Ready to Publish', defaultHours: 8 },
  ];

  const getConfigForStage = (stage: string) => {
    return configs?.find((c: any) => c.stage === stage);
  };

  const handleSave = (stage: string) => {
    upsertMutation.mutate({
      stage,
      maxHours: parseInt(editHours) || 24,
      alertEmail: editEmail || undefined,
      isActive: 1,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Timer className="w-6 h-6 text-accent" />
            Workflow SLA Tracking
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure time limits per workflow stage and monitor SLA breaches
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{configs?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Active SLA Rules</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{breaches?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Active Breaches</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allBreaches?.filter((b: any) => b.resolvedAt).length || 0}</p>
                <p className="text-xs text-muted-foreground">Resolved This Month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="config">
          <TabsList>
            <TabsTrigger value="config"><Settings className="w-3 h-3 mr-1" /> Configuration</TabsTrigger>
            <TabsTrigger value="breaches"><AlertTriangle className="w-3 h-3 mr-1" /> Breaches</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">SLA Rules by Workflow Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DEFAULT_STAGES.map(({ stage, label, defaultHours }) => {
                    const config = getConfigForStage(stage);
                    const isEditing = editStage === stage;
                    return (
                      <div
                        key={stage}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-xs text-muted-foreground font-mono">{stage}</p>
                          </div>
                        </div>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Hours"
                              value={editHours}
                              onChange={(e) => setEditHours(e.target.value)}
                              className="w-20 h-8 text-xs"
                            />
                            <Input
                              placeholder="Alert email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-40 h-8 text-xs"
                            />
                            <Button size="sm" onClick={() => handleSave(stage)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditStage(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {config ? `${config.maxHours}h` : `${defaultHours}h (default)`}
                            </Badge>
                            {config?.isActive ? (
                              <Badge className="text-xs bg-green-600">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditStage(stage);
                                setEditHours(config?.maxHours?.toString() || defaultHours.toString());
                                setEditEmail(config?.alertEmail || '');
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breaches" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active SLA Breaches</CardTitle>
              </CardHeader>
              <CardContent>
                {(!breaches || breaches.length === 0) ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No active SLA breaches. All workflows are within limits.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {breaches.map((breach: any) => (
                      <div
                        key={breach.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-red-500/30 bg-red-500/5"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">Document #{breach.documentId}</p>
                            <p className="text-xs text-muted-foreground">
                              Stage: <span className="font-mono">{breach.stage}</span> • 
                              Max: {breach.maxHours}h • 
                              Breached: {new Date(breach.breachedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveMutation.mutate({ id: breach.id })}
                        >
                          Resolve
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
