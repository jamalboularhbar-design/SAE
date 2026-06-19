import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCheck, CheckCircle2, Circle, Building2, Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';

interface AuditCategory {
  name: string;
  items: { id: string; label: string; weight: number }[];
}

const AUDIT_CATEGORIES: AuditCategory[] = [
  {
    name: 'First Impressions',
    items: [
      { id: 'fi1', label: 'Entrance clean and welcoming', weight: 3 },
      { id: 'fi2', label: 'Staff greeting within 30 seconds', weight: 3 },
      { id: 'fi3', label: 'Welcome drink/refreshment offered', weight: 2 },
      { id: 'fi4', label: 'Luggage assistance provided', weight: 2 },
      { id: 'fi5', label: 'Check-in process smooth (<5 min)', weight: 3 },
    ]
  },
  {
    name: 'Room Standards',
    items: [
      { id: 'rs1', label: 'Room spotlessly clean', weight: 3 },
      { id: 'rs2', label: 'Linens fresh and high quality', weight: 3 },
      { id: 'rs3', label: 'Amenities fully stocked', weight: 2 },
      { id: 'rs4', label: 'AC/heating functioning properly', weight: 3 },
      { id: 'rs5', label: 'WiFi strong and reliable', weight: 2 },
      { id: 'rs6', label: 'No maintenance issues visible', weight: 3 },
    ]
  },
  {
    name: 'Service Quality',
    items: [
      { id: 'sq1', label: 'Staff knowledgeable about property', weight: 2 },
      { id: 'sq2', label: 'Requests fulfilled within promised time', weight: 3 },
      { id: 'sq3', label: 'Proactive service (anticipating needs)', weight: 3 },
      { id: 'sq4', label: 'Multilingual capability available', weight: 2 },
      { id: 'sq5', label: 'Concierge recommendations accurate', weight: 2 },
    ]
  },
  {
    name: 'Food & Beverage',
    items: [
      { id: 'fb1', label: 'Breakfast quality and variety', weight: 3 },
      { id: 'fb2', label: 'Dietary restrictions accommodated', weight: 3 },
      { id: 'fb3', label: 'Food presentation up to standard', weight: 2 },
      { id: 'fb4', label: 'In-room dining available and timely', weight: 2 },
    ]
  },
  {
    name: 'RR Partnership Standards',
    items: [
      { id: 'rr1', label: 'Guest preferences communicated correctly', weight: 3 },
      { id: 'rr2', label: 'Special occasion setup executed', weight: 3 },
      { id: 'rr3', label: 'Provider responsive to RR requests (<1hr)', weight: 3 },
      { id: 'rr4', label: 'Issue escalation process followed', weight: 3 },
      { id: 'rr5', label: 'Post-stay feedback shared with RR', weight: 2 },
    ]
  },
];

export default function QualityAuditPage() {
  const [, navigate] = useLocation();
  const [selectedProvider, setSelectedProvider] = useState('Grand Palace Hotel');
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Record<string, number>>({});

  const toggleItem = (id: string) => {
    setCompletedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setScore = (id: string, score: number) => {
    setScores(prev => ({ ...prev, [id]: score }));
  };

  const totalItems = AUDIT_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedCount = completedItems.size;
  const totalPossibleScore = AUDIT_CATEGORIES.reduce((sum, cat) => sum + cat.items.reduce((s, i) => s + i.weight * 5, 0), 0);
  const currentScore = Object.entries(scores).reduce((sum, [id, score]) => {
    const item = AUDIT_CATEGORIES.flatMap(c => c.items).find(i => i.id === id);
    return sum + (item ? item.weight * score : 0);
  }, 0);
  const scorePercentage = totalPossibleScore > 0 ? Math.round((currentScore / totalPossibleScore) * 100) : 0;

  const PROVIDERS = ['Grand Palace Hotel', 'Riverside Luxury Hotel', 'Vista Resort', 'Highland Retreat', 'Harbor View Lodge', 'Cedar Boutique Hotel', 'Garden Court Hotel', 'Summit Inn'];

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
              <ClipboardCheck className="w-6 h-6 text-teal-400" />
              Provider Quality Audit
            </h1>
            <p className="text-sm text-muted-foreground">Structured quality assessment for provider properties</p>
          </div>
        </div>

        {/* Provider Selector & Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <select className="bg-card border border-border rounded px-3 py-2 text-sm flex-1" value={selectedProvider} onChange={e => { setSelectedProvider(e.target.value); setCompletedItems(new Set()); setScores({}); }}>
                  {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className={scorePercentage >= 80 ? 'border-green-500/30' : scorePercentage >= 60 ? 'border-amber-500/30' : 'border-red-500/30'}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold">{scorePercentage}%</p>
              <p className="text-xs text-muted-foreground">{completedCount}/{totalItems} items scored</p>
              <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                <div className="h-full rounded-full transition-all bg-teal-500" style={{ width: `${(completedCount / totalItems) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Categories */}
        <div className="space-y-4">
          {AUDIT_CATEGORIES.map(category => (
            <Card key={category.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                      <button onClick={() => toggleItem(item.id)} className="shrink-0">
                        {completedItems.has(item.id) ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <Circle className="w-5 h-5 text-zinc-600" />}
                      </button>
                      <span className="flex-1 text-sm">{item.label}</span>
                      <Badge variant="outline" className="text-xs shrink-0">×{item.weight}</Badge>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => { setScore(item.id, s); if (!completedItems.has(item.id)) toggleItem(item.id); }}>
                            <Star className={`w-4 h-4 ${(scores[item.id] || 0) >= s ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => toast.success(`Audit saved for ${selectedProvider} — Score: ${scorePercentage}%`)}>
            Save Audit Report
          </Button>
        </div>
      </div>
    </div>
  );
}
