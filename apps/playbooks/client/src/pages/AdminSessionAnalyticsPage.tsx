import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Clock, Users, BarChart3, Loader2, Target } from 'lucide-react';

export default function AdminSessionAnalyticsPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [range, setRange] = useState(30);
  const { data, isLoading } = trpc.batch21.sessionAnalytics.useQuery({ days: range }, { enabled: isAdmin });
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!data?.overTime || !chartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      chartInstance.current?.destroy();
      chartInstance.current = new Chart(chartRef.current!, {
        type: 'line',
        data: {
          labels: data.overTime.map((d: any) => d.date),
          datasets: [
            {
              label: 'Sessions',
              data: data.overTime.map((d: any) => Number(d.sessions)),
              borderColor: '#d4af37',
              backgroundColor: 'rgba(212,175,55,0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 2,
              yAxisID: 'y',
            },
            {
              label: 'Avg Duration (s)',
              data: data.overTime.map((d: any) => Number(d.avgDuration)),
              borderColor: '#6366f1',
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 2,
              borderDash: [5, 3],
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#9ca3af', boxWidth: 12, font: { size: 11 } } },
            tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', titleColor: '#d4af37', bodyColor: '#e5e7eb', borderColor: 'rgba(212,175,55,0.3)', borderWidth: 1 },
          },
          scales: {
            x: { ticks: { color: '#6b7280', maxTicksLimit: 8, font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true, position: 'left' as const },
            y1: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { drawOnChartArea: false }, beginAtZero: true, position: 'right' as const },
          },
        },
      });
    });
    return () => { chartInstance.current?.destroy(); };
  }, [data]);

  if (!isAdmin) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Admin access required.</p></div>;
  }

  const s = data?.summary;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/advanced-analytics')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <Clock className="w-5 h-5 text-[#d4af37]" />
          <h1 className="text-lg font-bold text-foreground">Reading Session Analytics</h1>
          <div className="ml-auto flex items-center gap-1 bg-card/50 border border-border/50 rounded-lg p-0.5">
            {[7, 14, 30, 60].map((d) => (
              <button key={d} onClick={() => setRange(d)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${range === d ? 'bg-[#d4af37]/20 text-[#d4af37] font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                {d}d
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="container py-6 max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-card/60 border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1"><BarChart3 className="w-4 h-4 text-[#d4af37]" /><span className="text-[10px] text-muted-foreground">Total Sessions</span></div>
                <div className="text-2xl font-bold">{(s?.totalSessions || 0).toLocaleString()}</div>
              </div>
              <div className="bg-card/60 border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-indigo-400" /><span className="text-[10px] text-muted-foreground">Avg Duration</span></div>
                <div className="text-2xl font-bold">{s?.avgDuration || 0}s</div>
              </div>
              <div className="bg-card/60 border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-emerald-400" /><span className="text-[10px] text-muted-foreground">Avg Scroll Depth</span></div>
                <div className="text-2xl font-bold">{s?.avgScrollDepth || 0}%</div>
              </div>
              <div className="bg-card/60 border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-purple-400" /><span className="text-[10px] text-muted-foreground">Unique Readers</span></div>
                <div className="text-2xl font-bold">{(s?.uniqueReaders || 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-card/60 border border-border/50 rounded-xl p-5 mb-6">
              <h2 className="text-sm font-semibold text-foreground mb-3">Sessions & Duration Over Time</h2>
              <div style={{ height: '280px' }}><canvas ref={chartRef}></canvas></div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Session data is recorded when users read documents. Metrics populate as readers engage with content.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
