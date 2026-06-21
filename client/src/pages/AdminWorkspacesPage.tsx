import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Building2, Users, Plus, Trash2, UserPlus } from 'lucide-react';

export default function AdminWorkspacesPage() {
  const { data: workspacesList, refetch } = trpc.workspaces.list.useQuery();
  const createMut = trpc.workspaces.create.useMutation({ onSuccess: () => { refetch(); toast.success('Workspace created'); } });
  const removeMemberMut = trpc.workspaces.removeMember.useMutation({ onSuccess: () => refetch() });
  const addMemberMut = trpc.workspaces.addMember.useMutation({ onSuccess: () => { toast.success('Member added'); } });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedWs, setSelectedWs] = useState<number | null>(null);
  const [newMemberId, setNewMemberId] = useState('');

  const { data: members } = trpc.workspaces.members.useQuery(
    { workspaceId: selectedWs! },
    { enabled: !!selectedWs }
  );

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 className="w-6 h-6 text-orange-400" /> Workspaces</h1>
          <p className="text-muted-foreground mt-1">Manage team workspaces with isolated document collections</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Workspace</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Workspace</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Workspace name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="URL slug (e.g. engineering)" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} />
              <Input placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} />
              <Button className="w-full" onClick={() => { createMut.mutate({ name, slug, description: desc || undefined }); setName(''); setSlug(''); setDesc(''); }} disabled={!name || !slug}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(workspacesList || []).map((ws: any) => (
          <Card key={ws.id} className={`cursor-pointer transition-all ${selectedWs === ws.id ? 'ring-2 ring-orange-400' : 'hover:border-orange-400/50'}`} onClick={() => setSelectedWs(ws.id)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {ws.name}</span>
                {ws.isDefault ? <Badge variant="secondary">Default</Badge> : null}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{ws.description || 'No description'}</p>
              <p className="text-xs text-muted-foreground mt-2">/{ws.slug}</p>
            </CardContent>
          </Card>
        ))}
        {(!workspacesList || workspacesList.length === 0) && (
          <p className="text-muted-foreground col-span-3 text-center py-12">No workspaces yet. Create one to get started.</p>
        )}
      </div>

      {selectedWs && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input placeholder="User ID to add" value={newMemberId} onChange={e => setNewMemberId(e.target.value)} className="max-w-xs" />
              <Button size="sm" onClick={() => { addMemberMut.mutate({ workspaceId: selectedWs, userId: newMemberId }); setNewMemberId(''); }} disabled={!newMemberId}>
                <UserPlus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {(members || []).map((m: any) => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div>
                    <span className="font-medium">{m.userId}</span>
                    <Badge variant="outline" className="ml-2">{m.role}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeMemberMut.mutate({ id: m.id })}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              ))}
              {(!members || members.length === 0) && <p className="text-sm text-muted-foreground">No members yet.</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
