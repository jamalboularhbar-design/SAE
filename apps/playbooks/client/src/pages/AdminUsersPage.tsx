import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Search, Shield, User, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const { data, isLoading } = trpc.userManagement.list.useQuery({ search: search || undefined, limit: 20, offset: page * 20 });
  const updateRoleMutation = trpc.userManagement.updateRole.useMutation();
  const utils = trpc.useUtils();

  const handleRoleChange = async (openId: string, newRole: 'user' | 'admin') => {
    if (!confirm(`Change this user's role to ${newRole}?`)) return;
    await updateRoleMutation.mutateAsync({ openId, role: newRole });
    utils.userManagement.list.invalidate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <span className="text-sm text-muted-foreground ml-auto">{data?.total ?? 0} users</span>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by name, email, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
          />
        </div>

        <div className="space-y-2">
          {(data?.users || []).map((user: any) => (
            <Card key={user.openId}>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                      {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">{user.email || user.openId.slice(0, 16)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Last active: {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString() : 'Never'}
                    </span>
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleRoleChange(user.openId, e.target.value as 'user' | 'admin')}
                      className="text-xs px-2 py-1 rounded border border-border bg-card text-foreground"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(data?.total ?? 0) > 20 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground self-center">Page {page + 1}</span>
            <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={(page + 1) * 20 >= (data?.total ?? 0)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
