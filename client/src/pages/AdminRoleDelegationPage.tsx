import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Trash2, UserPlus } from 'lucide-react';

const PERMISSIONS = [
  { value: 'full_admin', label: 'Full Admin', desc: 'Complete system access' },
  { value: 'content_editor', label: 'Content Editor', desc: 'Create, edit, delete documents' },
  { value: 'analytics_viewer', label: 'Analytics Viewer', desc: 'View analytics and reports' },
  { value: 'user_manager', label: 'User Manager', desc: 'Manage users and roles' },
  { value: 'webhook_manager', label: 'Webhook Manager', desc: 'Manage webhooks and integrations' },
];

export default function AdminRoleDelegationPage() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPerm, setSelectedPerm] = useState('');
  const utils = trpc.useUtils();
  const { data: permissions, isLoading } = trpc.adminPermissions.list.useQuery();
  const { data: allUsers } = trpc.userManagement.list.useQuery({ limit: 100, offset: 0 });
  const grantMut = trpc.adminPermissions.grant.useMutation({
    onSuccess: () => { utils.adminPermissions.list.invalidate(); toast.success('Permission granted'); setSelectedUser(''); setSelectedPerm(''); },
  });
  const revokeMut = trpc.adminPermissions.revoke.useMutation({
    onSuccess: () => { utils.adminPermissions.list.invalidate(); toast.success('Permission revoked'); },
  });

  const getUserName = (openId: string) => {
    const user = allUsers?.users?.find((u: any) => u.openId === openId);
    return user?.name || openId.substring(0, 12) + '...';
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold">Role Delegation</h1>
          <p className="text-sm text-muted-foreground">Assign granular permissions to team members</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Grant Permission</CardTitle>
          <CardDescription>Select a user and permission level to delegate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>
                  {allUsers?.users?.map((u: any) => (
                    <SelectItem key={u.openId} value={u.openId}>{u.name || u.openId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Permission</label>
              <Select value={selectedPerm} onValueChange={setSelectedPerm}>
                <SelectTrigger><SelectValue placeholder="Select permission" /></SelectTrigger>
                <SelectContent>
                  {PERMISSIONS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => { if (selectedUser && selectedPerm) grantMut.mutate({ userOpenId: selectedUser, permission: selectedPerm }); }} disabled={!selectedUser || !selectedPerm || grantMut.isPending}>
              <UserPlus className="w-4 h-4 mr-1" /> Grant
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !permissions?.length ? (
            <p className="text-muted-foreground">No permissions delegated yet.</p>
          ) : (
            <div className="space-y-3">
              {permissions.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{getUserName(p.userOpenId)}</span>
                    <Badge variant="outline">{PERMISSIONS.find(x => x.value === p.permission)?.label || p.permission}</Badge>
                    <span className="text-xs text-muted-foreground">by {getUserName(p.grantedBy)}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => revokeMut.mutate({ id: p.id })} disabled={revokeMut.isPending}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
