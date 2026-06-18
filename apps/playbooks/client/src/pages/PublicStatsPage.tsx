import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { BarChart3, BookOpen, Eye, Users, FolderOpen, FileText, Loader2, ArrowLeft } from 'lucide-react';

export default function PublicStatsPage() {
  const { data, isLoading } = trpc.batch21.publicStats.useQuery();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!data?.growthByMonth || !chartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      chartInstance.current?.destroy();
      const months = data.growthByMonth.map((g: any) => g.month);
      const counts = data.growthByMonth.map((g: any) => Number(g.count));
      const cumulative: number[] = [];
      counts.reduce((acc: number, val: number) => { cumulative.push(acc + val); return acc + val; }, 0);

      chartInstance.current = new Chart(chartRef.current!, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'New Documents',
              data: counts,
              backgroundColor: 'rgba(212,175,55,0.3)',
              borderColor: '#d4af37',
              borderWidth: 1,
              borderRadius: 4,
              yAxisID: 'y',
            },
            {
              label: 'Cumulative Total',
              data: cumulative,
              type: 'line' as any,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.05)',
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 2,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#9ca3af', boxWidth: 12, font: { size: 11 } } },
            tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', titleColor: '#d4af37', bodyColor: '#e5e7eb' },
          },
          scales: {
            x: { ticks: { color: '#6b7280', maxTicksLimit: 12, font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true, position: 'left' as const },
            y1: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { drawOnChartArea: false }, beginAtZero: true, position: 'right' as const },
          },
        },
      });
    });
    return () => { chartInstance.current?.destroy(); };
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
          <BarChart3 className="w-5 h-5 text-[#d4af37]" />
          <h1 className="text-lg font-bold text-foreground">Site Statistics</h1>
        </div>
      </header>
      <div className="container py-8 max-w-5xl">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : data ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">ARG Builder</h2>
              <p className="text-muted-foreground text-sm">A growing knowledge base for operational excellence</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Documents', value: data.totalDocs, icon: FileText, color: 'text-[#d4af37]' },
                { label: 'Categories', value: data.totalCategories, icon: FolderOpen, color: 'text-indigo-400' },
                { label: 'Total Views', value: data.totalViews, icon: Eye, color: 'text-emerald-400' },
                { label: 'Total Words', value: data.totalWords, icon: BookOpen, color: 'text-purple-400' },
                { label: 'Readers', value: data.totalReaders, icon: Users, color: 'text-blue-400' },
              ].map((s) => (
                <div key={s.label} className="bg-card/60 border border-border/50 rounded-xl p-4 text-center">
                  <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-foreground">{Number(s.value).toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-card/60 border border-border/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Content Growth Over Time</h3>
              <div style={{ height: '300px' }}><canvas ref={chartRef}></canvas></div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-[#d4af37] hover:underline">Browse the Document Library</Link>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-12">No statistics available.</p>
        )}
      </div>
    </div>
  );
}
