import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Shield, Clock, Trash2, Copy, CheckCircle2 } from 'lucide-react';

export default function AdminTeamPage() {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'user' | 'admin'>('user');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const { data: members, isLoading: membersLoading } = trpc.userManagement.teamMembers.useQuery();
  const { data: invites, isLoading: invitesLoading } = trpc.userManagement.invites.useQuery();
  const createInvite = trpc.userManagement.createInvite.useMutation();
  const provisionFounding = trpc.userManagement.provisionFoundingClient.useMutation();
  const revokeInvite = trpc.userManagement.revokeInvite.useMutation();
  const changeRole = trpc.userManagement.changeRole.useMutation();
  const utils = trpc.useUtils();

  const [foundingEmail, setFoundingEmail] = useState('');
  const [foundingName, setFoundingName] = useState('');
  const [foundingCompany, setFoundingCompany] = useState('');
  const [showFoundingForm, setShowFoundingForm] = useState(false);

  const handleProvisionFounding = async () => {
    if (!foundingEmail.trim() || !foundingName.trim() || !foundingCompany.trim()) {
      toast.error('Email, name, and company are required');
      return;
    }
    try {
      const result = await provisionFounding.mutateAsync({
        email: foundingEmail,
        inviteeName: foundingName,
        companyName: foundingCompany,
      });
      toast.success(`Founding workspace created for ${foundingCompany}`);
      navigator.clipboard.writeText(result.inviteUrl);
      toast.info('Invite link copied — send after virement/facture');
      setFoundingEmail('');
      setFoundingName('');
      setFoundingCompany('');
      setShowFoundingForm(false);
      utils.userManagement.invites.invalidate();
    } catch {
      toast.error('Failed to provision founding client');
    }
  };

  const handleCreateInvite = async () => {
    if (!inviteEmail.trim()) { toast.error('Email is required'); return; }
    try {
      const result = await createInvite.mutateAsync({ email: inviteEmail, role: inviteRole });
      toast.success(`Invite sent to ${inviteEmail}`);
      navigator.clipboard.writeText(result.inviteUrl);
      toast.info('Invite link copied to clipboard');
      setInviteEmail('');
      setShowInviteForm(false);
      utils.userManagement.invites.invalidate();
    } catch {
      toast.error('Failed to create invite');
    }
  };

  const handleRevokeInvite = async (id: number) => {
    try {
      await revokeInvite.mutateAsync({ id });
      toast.success('Invite revoked');
      utils.userManagement.invites.invalidate();
    } catch {
      toast.error('Failed to revoke invite');
    }
  };

  const handleChangeRole = async (userId: number, role: 'user' | 'admin') => {
    try {
      await changeRole.mutateAsync({ userId, role });
      toast.success('Role updated');
      utils.userManagement.teamMembers.invalidate();
    } catch {
      toast.error('Failed to update role');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;
  }

  const pendingInvites = invites?.filter((i: any) => !i.acceptedAt && new Date(i.expiresAt) > new Date()) || [];
  const expiredInvites = invites?.filter((i: any) => !i.acceptedAt && new Date(i.expiresAt) <= new Date()) || [];
  const acceptedInvites = invites?.filter((i: any) => i.acceptedAt) || [];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto">
        {/* Founding client (Morocco — no Stripe) */}
        <div className="mb-8 p-6 rounded-xl border border-accent/30 bg-accent/5">
          <h2 className="text-lg font-semibold mb-1">🇲🇦 Provision founding client</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Creates workspace + 30-day invite. Payment via facture/virement — no Stripe required.
          </p>
          {showFoundingForm ? (
            <div className="grid sm:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="Company name"
                value={foundingCompany}
                onChange={(e) => setFoundingCompany(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
              <input
                type="text"
                placeholder="Contact full name"
                value={foundingName}
                onChange={(e) => setFoundingName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
              <input
                type="email"
                placeholder="Work email"
                value={foundingEmail}
                onChange={(e) => setFoundingEmail(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>
          ) : null}
          <Button
            variant={showFoundingForm ? 'default' : 'outline'}
            onClick={() => (showFoundingForm ? handleProvisionFounding() : setShowFoundingForm(true))}
            disabled={provisionFounding.isPending}
            className={showFoundingForm ? 'bg-accent text-accent-foreground' : ''}
          >
            {provisionFounding.isPending ? 'Provisioning…' : showFoundingForm ? 'Create workspace + invite' : 'New founding client'}
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-teal-400" />
              Team Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage team members and invite new users</p>
          </div>
          <Button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-accent text-white hover:bg-accent/90"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <div className="mb-8 p-6 rounded-xl border border-border/50 bg-card">
            <h2 className="text-lg font-semibold mb-4">Send Invite</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'user' | 'admin')}
                  className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="user">Viewer / Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleCreateInvite} disabled={createInvite.isPending}>
                  {createInvite.isPending ? 'Sending...' : 'Send Invite'}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Invite links expire after 7 days. The recipient will receive a link to join the team.
            </p>
          </div>
        )}

        {/* Team Members */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Active Members ({members?.length || 0})
          </h2>
          {membersLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-3">
              {members?.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      {(member.name || member.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.name || 'Unnamed'}</p>
                      <p className="text-sm text-muted-foreground">{member.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleChangeRole(member.id, e.target.value as 'user' | 'admin')}
                      className="px-3 py-1 bg-background border border-border rounded text-sm text-foreground"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Badge variant="outline" className={member.role === 'admin' ? 'border-teal-500/50 text-teal-300' : 'border-blue-500/50 text-blue-300'}>
                      {member.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Invites */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Pending Invites ({pendingInvites.length})
          </h2>
          {invitesLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : pendingInvites.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending invites</p>
          ) : (
            <div className="space-y-3">
              {pendingInvites.map((invite: any) => (
                <div key={invite.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires {new Date(invite.expiresAt).toLocaleDateString()} · Role: {invite.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.token}`);
                        toast.success('Link copied');
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleRevokeInvite(invite.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accepted Invites */}
        {acceptedInvites.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Accepted Invites ({acceptedInvites.length})
            </h2>
            <div className="space-y-3">
              {acceptedInvites.map((invite: any) => (
                <div key={invite.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card opacity-70">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Accepted {invite.acceptedAt ? new Date(invite.acceptedAt).toLocaleDateString() : ''} · Role: {invite.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
