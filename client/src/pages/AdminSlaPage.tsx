import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Clock, AlertTriangle } from 'lucide-react';

export default function AdminSlaPage() {
  const [maxHours, setMaxHours] = useState(48);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const utils = trpc.useUtils();
  const { data: config } = trpc.approvalSla.getConfig.useQuery();
  const { data: overdueList, isLoading: loadingOverdue } = trpc.approvalSla.getOverdue.useQuery();
  const updateMut = trpc.approvalSla.updateConfig.useMutation({
    onSuccess: () => { utils.approvalSla.getConfig.invalidate(); utils.approvalSla.getOverdue.invalidate(); toast.success('SLA config updated'); },
  });

  useEffect(() => {
    if (config) {
      setMaxHours(config.maxHoursInReview);
      setAlertEnabled(config.alertEnabled ?? true);
    }
  }, [config]);

  const getHoursOverdue = (updatedAt: Date) => {
    const hours = Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60));
    return hours;
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold">Approval SLA Tracking</h1>
          <p className="text-sm text-muted-foreground">Monitor documents stuck in review beyond the configured threshold</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">SLA Configuration</CardTitle>
          <CardDescription>Set the maximum hours a document can remain in review status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="text-sm font-medium mb-1 block">Max Hours in Review</label>
              <Input type="number" value={maxHours} onChange={e => setMaxHours(Number(e.target.value))} className="w-32" min={1} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={alertEnabled} onCheckedChange={setAlertEnabled} />
              <span className="text-sm">Enable alerts</span>
            </div>
            <Button onClick={() => updateMut.mutate({ maxHoursInReview: maxHours, alertEnabled })} disabled={updateMut.isPending}>
              Save Config
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Overdue Documents
            {overdueList && overdueList.length > 0 && <Badge variant="destructive">{overdueList.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingOverdue ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !overdueList?.length ? (
            <p className="text-muted-foreground">No documents are overdue. All reviews are within SLA.</p>
          ) : (
            <div className="space-y-3">
              {overdueList.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div>
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-xs text-muted-foreground ml-2">/{doc.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{getHoursOverdue(doc.updatedAt)}h overdue</Badge>
                    <Button variant="outline" size="sm" onClick={() => window.open(`/doc/${doc.slug}`, '_blank')}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
