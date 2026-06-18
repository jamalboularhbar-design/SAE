import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Plus, Search, Star, Phone, Mail, Globe, Heart, Edit, Trash2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type VipLevel = 'standard' | 'silver' | 'gold' | 'platinum';

const VIP_COLORS: Record<VipLevel, string> = {
  standard: 'bg-zinc-500/20 text-zinc-300',
  silver: 'bg-slate-400/20 text-slate-300',
  gold: 'bg-amber-500/20 text-amber-300',
  platinum: 'bg-purple-500/20 text-purple-300',
};

export default function GuestCrmPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [vipFilter, setVipFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '', email: '', phone: '', nationality: '', language: '',
    vipLevel: 'standard', preferences: '', dietaryRestrictions: '',
    roomPreferences: '', specialOccasions: '', notes: ''
  });

  const { data: guests = [], refetch } = trpc.guestCrm.list.useQuery({ persona: 'riad-routes' });
  const createMutation = trpc.guestCrm.create.useMutation({
    onSuccess: () => { refetch(); setShowAddForm(false); setNewGuest({ name: '', email: '', phone: '', nationality: '', language: '', vipLevel: 'standard', preferences: '', dietaryRestrictions: '', roomPreferences: '', specialOccasions: '', notes: '' }); toast.success('Guest added successfully'); },
    onError: () => toast.error('Failed to add guest'),
  });
  const deleteMutation = trpc.guestCrm.delete.useMutation({
    onSuccess: () => { refetch(); toast.success('Guest removed'); },
    onError: () => toast.error('Failed to remove guest'),
  });

  const filteredGuests = guests.filter((g: any) => {
    const matchesSearch = g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.nationality?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVip = vipFilter === 'all' || g.vipLevel === vipFilter;
    return matchesSearch && matchesVip;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              Guest CRM
            </h1>
            <p className="text-sm text-muted-foreground">Track returning guests, preferences, and stay history</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-1" /> Add Guest
          </Button>
        </div>

        {/* Add Guest Form */}
        {showAddForm && (
          <Card className="mb-6 border-amber-500/30">
            <CardHeader><CardTitle className="text-lg">Add New Guest</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Full Name *" value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Email" value={newGuest.email} onChange={e => setNewGuest({ ...newGuest, email: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Phone" value={newGuest.phone} onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Nationality" value={newGuest.nationality} onChange={e => setNewGuest({ ...newGuest, nationality: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Language" value={newGuest.language} onChange={e => setNewGuest({ ...newGuest, language: e.target.value })} />
                <select className="bg-card border border-border rounded px-3 py-2 text-sm" value={newGuest.vipLevel} onChange={e => setNewGuest({ ...newGuest, vipLevel: e.target.value })}>
                  <option value="standard">Standard</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Preferences (JSON)" value={newGuest.preferences} onChange={e => setNewGuest({ ...newGuest, preferences: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Dietary Restrictions" value={newGuest.dietaryRestrictions} onChange={e => setNewGuest({ ...newGuest, dietaryRestrictions: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Room Preferences" value={newGuest.roomPreferences} onChange={e => setNewGuest({ ...newGuest, roomPreferences: e.target.value })} />
                <input className="bg-card border border-border rounded px-3 py-2 text-sm" placeholder="Special Occasions" value={newGuest.specialOccasions} onChange={e => setNewGuest({ ...newGuest, specialOccasions: e.target.value })} />
                <textarea className="bg-card border border-border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Notes" rows={2} value={newGuest.notes} onChange={e => setNewGuest({ ...newGuest, notes: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => { if (newGuest.name) createMutation.mutate(newGuest); else toast.error('Name is required'); }} disabled={createMutation.isPending} className="bg-amber-600 hover:bg-amber-700">
                  {createMutation.isPending ? 'Saving...' : 'Save Guest'}
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2 text-sm" placeholder="Search guests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {['all', 'platinum', 'gold', 'silver', 'standard'].map(level => (
              <Button key={level} variant={vipFilter === level ? 'default' : 'outline'} size="sm" onClick={() => setVipFilter(level)} className="text-xs capitalize">
                {level === 'all' ? 'All' : level}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{guests.length}</p><p className="text-xs text-muted-foreground">Total Guests</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-purple-400">{guests.filter((g: any) => g.vipLevel === 'platinum').length}</p><p className="text-xs text-muted-foreground">Platinum</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-400">{guests.filter((g: any) => g.vipLevel === 'gold').length}</p><p className="text-xs text-muted-foreground">Gold</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-slate-400">{guests.filter((g: any) => g.totalStays > 3).length}</p><p className="text-xs text-muted-foreground">Repeat (3+)</p></CardContent></Card>
        </div>

        {/* Guest List */}
        <div className="space-y-3">
          {filteredGuests.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">
              {guests.length === 0 ? 'No guests yet. Add your first guest above.' : 'No guests match your search.'}
            </CardContent></Card>
          ) : (
            filteredGuests.map((guest: any) => (
              <Card key={guest.id} className="hover:border-amber-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{guest.name}</h3>
                        <Badge className={VIP_COLORS[guest.vipLevel as VipLevel] || VIP_COLORS.standard}>
                          {guest.vipLevel}
                        </Badge>
                        {guest.totalStays > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />{guest.totalStays} stays
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
                        {guest.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{guest.email}</span>}
                        {guest.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guest.phone}</span>}
                        {guest.nationality && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{guest.nationality}</span>}
                        {guest.dietaryRestrictions && <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{guest.dietaryRestrictions}</span>}
                      </div>
                      {guest.notes && <p className="text-xs text-muted-foreground mt-2 italic">{guest.notes}</p>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toast.info('Edit feature coming soon')}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm('Remove this guest?')) deleteMutation.mutate({ id: guest.id }); }}>
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
