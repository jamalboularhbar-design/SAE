import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Star, Clock, Phone, Mail, MapPin, Plus, Filter } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

type ProviderTier = 'platinum' | 'gold' | 'silver';
type ProviderStatus = 'active' | 'probation' | 'suspended' | 'inactive';

const TIER_COLORS: Record<ProviderTier, string> = {
  platinum: 'bg-purple-100 text-purple-800',
  gold: 'bg-amber-100 text-amber-800',
  silver: 'bg-gray-100 text-gray-800',
};

const STATUS_COLORS: Record<ProviderStatus, string> = {
  active: 'bg-green-100 text-green-800',
  probation: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-500',
};

export default function ProviderDirectoryPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: providers = [], refetch } = trpc.providerPartners.list.useQuery({ status: filterStatus === 'all' ? undefined : filterStatus });

  const filteredProviders = useMemo(() => {
    if (filterTier === 'all') return providers;
    return providers.filter((p: any) => p.tier === filterTier);
  }, [providers, filterTier]);

  const isAdmin = user?.role === 'admin';

  // Add form state
  const [formData, setFormData] = useState({
    name: '', type: 'riad', tier: 'gold', location: '', contactName: '', contactPhone: '', contactEmail: '', roomCount: 0, priceRange: '', specialties: '', notes: ''
  });

  const createMutation = trpc.providerPartners.create.useMutation({
    onSuccess: () => { toast.success('Provider added'); setShowAddForm(false); refetch(); setFormData({ name: '', type: 'riad', tier: 'gold', location: '', contactName: '', contactPhone: '', contactEmail: '', roomCount: 0, priceRange: '', specialties: '', notes: '' }); },
    onError: () => toast.error('Failed to add provider'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/60 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Provider Partner Directory</h1>
            <p className="text-slate-500 text-sm">Luxury riads, hotels, and villas we collaborate with</p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowAddForm(!showAddForm)} size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Provider
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Tier:</span>
            {['all', 'platinum', 'gold', 'silver'].map(tier => (
              <button key={tier} onClick={() => setFilterTier(tier)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${filterTier === tier ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                {tier === 'all' ? 'All' : tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-slate-500">Status:</span>
            {['all', 'active', 'probation', 'suspended'].map(status => (
              <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${filterStatus === status ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && isAdmin && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardHeader><CardTitle className="text-lg">Add New Provider Partner</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input placeholder="Provider Name *" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm" />
                <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm">
                  <option value="riad">Riad</option>
                  <option value="hotel">Hotel</option>
                  <option value="villa">Villa</option>
                  <option value="guesthouse">Guesthouse</option>
                </select>
                <select value={formData.tier} onChange={e => setFormData(p => ({ ...p, tier: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm">
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                </select>
                <input placeholder="Location" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm" />
                <input placeholder="Contact Name" value={formData.contactName} onChange={e => setFormData(p => ({ ...p, contactName: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm" />
                <input placeholder="Contact Phone" value={formData.contactPhone} onChange={e => setFormData(p => ({ ...p, contactPhone: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm" />
                <input placeholder="Contact Email" value={formData.contactEmail} onChange={e => setFormData(p => ({ ...p, contactEmail: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm" />
                <input placeholder="Room Count" type="number" value={formData.roomCount || ''} onChange={e => setFormData(p => ({ ...p, roomCount: parseInt(e.target.value) || 0 }))} className="px-3 py-2 border rounded-lg text-sm" />
                <input placeholder="Price Range (e.g. $200-$500/night)" value={formData.priceRange} onChange={e => setFormData(p => ({ ...p, priceRange: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm" />
                <input placeholder="Specialties (comma-separated)" value={formData.specialties} onChange={e => setFormData(p => ({ ...p, specialties: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm col-span-full md:col-span-2" />
                <textarea placeholder="Notes" value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm col-span-full" rows={2} />
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={() => createMutation.mutate(formData)} disabled={!formData.name || createMutation.isPending} size="sm">
                  {createMutation.isPending ? 'Adding...' : 'Add Provider'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provider Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map((provider: any) => (
            <Card key={provider.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                  </div>
                  <Badge className={TIER_COLORS[provider.tier as ProviderTier] || 'bg-gray-100 text-gray-600'}>
                    {provider.tier}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{provider.type}</Badge>
                    <Badge className={STATUS_COLORS[provider.status as ProviderStatus] || 'bg-gray-100'}>
                      {provider.status}
                    </Badge>
                  </div>
                  {provider.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {provider.location}
                    </div>
                  )}
                  {provider.contactName && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {provider.contactName}
                    </div>
                  )}
                  {provider.contactEmail && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {provider.contactEmail}
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2 border-t mt-2">
                    {provider.qualityScore > 0 && (
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500" /> {provider.qualityScore.toFixed(1)}
                      </span>
                    )}
                    {provider.responseTimeAvg && (
                      <span className="flex items-center gap-1 text-xs">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> {provider.responseTimeAvg}min avg
                      </span>
                    )}
                    {provider.roomCount && (
                      <span className="text-xs text-slate-400">{provider.roomCount} rooms</span>
                    )}
                  </div>
                  {provider.priceRange && (
                    <p className="text-xs text-slate-400">{provider.priceRange}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No providers found with current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
