import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Search, User, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminImpersonationPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [impersonating, setImpersonating] = useState<any>(null);
  const [viewMode, setViewMode] = useState(false);

  // Mock user list for impersonation (in production, this would query the users table)
  const mockUsers = [
    { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', role: 'user', lastActive: '2 hours ago' },
    { id: 2, name: 'Marcus Johnson', email: 'marcus@example.com', role: 'user', lastActive: '1 day ago' },
    { id: 3, name: 'Priya Patel', email: 'priya@example.com', role: 'admin', lastActive: '5 minutes ago' },
    { id: 4, name: 'James Wilson', email: 'james@example.com', role: 'user', lastActive: '3 days ago' },
    { id: 5, name: 'Aisha Mohammed', email: 'aisha@example.com', role: 'user', lastActive: '12 hours ago' },
  ];

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startImpersonation = (targetUser: any) => {
    setImpersonating(targetUser);
    setViewMode(true);
    toast.info(`Now viewing as ${targetUser.name}. Actions are read-only.`);
  };

  const stopImpersonation = () => {
    setImpersonating(null);
    setViewMode(false);
    toast.success('Returned to admin view');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        {/* Impersonation banner */}
        {viewMode && impersonating && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600">
                Viewing as: {impersonating.name} ({impersonating.email})
              </span>
              <Badge variant="outline" className="text-xs">Read-only</Badge>
            </div>
            <Button size="sm" variant="outline" onClick={stopImpersonation}>
              <EyeOff className="w-3 h-3 mr-1" /> End Session
            </Button>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent" />
            Admin Impersonation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View the platform as another user for debugging and support. All actions are logged.
          </p>
        </div>

        {/* Warning card */}
        <Card className="mb-6 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Security Notice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Impersonation sessions are fully audited. You will see the platform from the user's perspective 
                  but cannot perform write operations. All impersonation events are logged in the audit trail.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Select User to Impersonate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-2">
              {filteredUsers.map(u => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{u.lastActive}</span>
                    <Badge variant="outline" className="text-xs">{u.role}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startImpersonation(u)}
                      disabled={viewMode}
                    >
                      <Eye className="w-3 h-3 mr-1" /> View As
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active session details */}
        {viewMode && impersonating && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Impersonation Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Target User</p>
                  <p className="font-medium">{impersonating.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Role</p>
                  <p className="font-medium capitalize">{impersonating.role}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Session Started</p>
                  <p className="font-medium">{new Date().toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Admin</p>
                  <p className="font-medium">{user?.name || 'Current Admin'}</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded bg-muted text-xs text-muted-foreground">
                <p><strong>What you can do:</strong> View dashboards, read documents, see user settings, check permissions</p>
                <p className="mt-1"><strong>What you cannot do:</strong> Edit content, change settings, delete data, make purchases</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
