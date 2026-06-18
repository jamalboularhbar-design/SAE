import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Search, Mail, Phone, TrendingUp, Flame, ThermometerSun, Snowflake } from 'lucide-react';

type SortField = 'score' | 'name' | 'company' | 'date';
type SortDir = 'asc' | 'desc';

const TIER_CONFIG = {
  hot: { icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Hot' },
  warm: { icon: ThermometerSun, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'Warm' },
  cool: { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Cool' },
  cold: { icon: Snowflake, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20', label: 'Cold' },
};

function getTier(score: number): 'hot' | 'warm' | 'cool' | 'cold' {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 40) return 'cool';
  return 'cold';
}

function ScoreBar({ score }: { score: number }) {
  const tier = getTier(score);
  const colors = {
    hot: 'bg-red-500',
    warm: 'bg-orange-500',
    cool: 'bg-blue-500',
    cold: 'bg-gray-500',
  };
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${colors[tier]}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-mono font-medium">{score}</span>
    </div>
  );
}

export default function AdminLeadScoresPage() {
  const { data: scoredLeads, isLoading } = trpc.leads.scores.useQuery();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [tierFilter, setTierFilter] = useState<string>('all');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const processed = useMemo(() => {
    if (!scoredLeads) return [];
    let list = [...scoredLeads];

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((l: any) =>
        l.fullName?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q)
      );
    }

    // Filter by tier
    if (tierFilter !== 'all') {
      list = list.filter((l: any) => getTier(l.score) === tierFilter);
    }

    // Sort
    list.sort((a: any, b: any) => {
      let cmp = 0;
      switch (sortField) {
        case 'score': cmp = (a.score || 0) - (b.score || 0); break;
        case 'name': cmp = (a.fullName || '').localeCompare(b.fullName || ''); break;
        case 'company': cmp = (a.company || '').localeCompare(b.company || ''); break;
        case 'date': cmp = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(); break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return list;
  }, [scoredLeads, search, sortField, sortDir, tierFilter]);

  const tierCounts = useMemo(() => {
    if (!scoredLeads) return { hot: 0, warm: 0, cool: 0, cold: 0 };
    return scoredLeads.reduce((acc: any, l: any) => {
      const tier = getTier(l.score);
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, { hot: 0, warm: 0, cool: 0, cold: 0 });
  }, [scoredLeads]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lead Scoring Dashboard</h1>
          <p className="text-sm text-muted-foreground">Prioritize outreach based on engagement and fit signals</p>
        </div>
        <Badge variant="outline" className="text-sm">{scoredLeads?.length || 0} leads scored</Badge>
      </div>

      {/* Tier Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(Object.entries(TIER_CONFIG) as [string, typeof TIER_CONFIG.hot][]).map(([key, config]) => {
          const Icon = config.icon;
          const count = tierCounts[key as keyof typeof tierCounts] || 0;
          return (
            <button
              key={key}
              onClick={() => setTierFilter(tierFilter === key ? 'all' : key)}
              className={`border rounded-lg p-4 text-left transition-colors ${
                tierFilter === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-medium">{config.label}</span>
              </div>
              <p className="text-2xl font-bold">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-primary">
                    Lead <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('company')} className="flex items-center gap-1 hover:text-primary">
                    Company <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('score')} className="flex items-center gap-1 hover:text-primary">
                    Score <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium">Tier</th>
                <th className="text-left px-4 py-3 font-medium">Source</th>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-primary">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {processed.map((lead: any, i: number) => {
                const tier = getTier(lead.score);
                const config = TIER_CONFIG[tier];
                const Icon = config.icon;
                return (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{lead.fullName || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.company || '—'}</td>
                    <td className="px-4 py-3"><ScoreBar score={lead.score} /></td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={config.bg}>
                        <Icon className={`w-3 h-3 mr-1 ${config.color}`} />
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{lead.source || 'direct'}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Send email" onClick={() => window.open(`mailto:${lead.email}`)}>
                          <Mail className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Call" onClick={() => window.open(`tel:${lead.phone || ''}`)}>
                          <Phone className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {processed.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
