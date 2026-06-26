import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Eye, Download, ThumbsUp, Users, Loader2 } from 'lucide-react';

const RANGE_OPTIONS = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '60 days', days: 60 },
];

function ChangeIndicator({ current, previous, label, icon: Icon }: { current: number; previous: number; label: string; icon: any }) {
  const diff = current - previous;
  const pctChange = previous > 0 ? Math.round((diff / previous) * 100) : current > 0 ? 100 : 0;
  const isUp = diff > 0;
  const isFlat = diff === 0;
  return (
    <div className="bg-card/60 border border-border/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{current.toLocaleString()}</div>
      <div className="flex items-center gap-2">
        {isFlat ? (
          <Minus className="w-4 h-4 text-muted-foreground" />
        ) : isUp ? (
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400" />
        )}
        <span className={`text-sm font-semibold ${isFlat ? 'text-muted-foreground' : isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {isFlat ? '0%' : `${isUp ? '+' : ''}${pctChange}%`}
        </span>
        <span className="text-xs text-muted-foreground">vs previous {label.toLowerCase()}</span>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>Previous: {previous.toLocaleString()}</span>
        <span>Change: {diff >= 0 ? '+' : ''}{diff.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function AdminComparativeAnalyticsPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [range, setRange] = useState(30);

  const { data, isLoading } = trpc.batch21.comparativePeriod.useQuery({ days: range }, { enabled: isAdmin });

  if (!isAdmin) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Admin access required.</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/advanced-analytics')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <TrendingUp className="w-5 h-5 text-[#d4af37]" />
          <h1 className="text-lg font-bold text-foreground">Period Comparison</h1>
          <div className="ml-auto flex items-center gap-1 bg-card/50 border border-border/50 rounded-lg p-0.5">
            {RANGE_OPTIONS.map((opt) => (
              <button key={opt.days} onClick={() => setRange(opt.days)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${range === opt.days ? 'bg-[#d4af37]/20 text-[#d4af37] font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="container py-6 max-w-5xl">
        <div className="mb-6 p-4 bg-card/40 border border-border/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Comparing the <span className="text-foreground font-medium">last {range} days</span> against the <span className="text-foreground font-medium">previous {range} days</span>.
            Percentage changes show growth or decline between the two periods.
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ChangeIndicator current={data.current.views} previous={data.previous.views} label="Views" icon={Eye} />
            <ChangeIndicator current={data.current.downloads} previous={data.previous.downloads} label="Downloads" icon={Download} />
            <ChangeIndicator current={data.current.ratings} previous={data.previous.ratings} label="Ratings" icon={ThumbsUp} />
            <ChangeIndicator current={data.current.readers} previous={data.previous.readers} label="Unique Readers" icon={Users} />
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No data available.</p>
        )}
        <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
          <Link href="/admin/advanced-analytics" className="hover:text-[#d4af37]">Advanced Analytics</Link>
          <span>·</span>
          <Link href="/admin/dashboard" className="hover:text-[#d4af37]">Basic Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
