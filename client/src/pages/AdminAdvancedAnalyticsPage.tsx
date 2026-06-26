import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import {
  ArrowLeft, BarChart3, TrendingUp, Users, Eye, Download, FileText,
  ThumbsUp, Clock, Activity, Calendar, Loader2
} from 'lucide-react';

type ChartInstance = any;

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-card/80 border border-border/50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

const RANGE_OPTIONS = [
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '60d', days: 60 },
  { label: '90d', days: 90 },
];

export default function AdminAdvancedAnalyticsPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [range, setRange] = useState(30);

  // Data queries
  const { data: summary, isLoading: summaryLoading } = trpc.advancedAnalytics.summary.useQuery(undefined, { enabled: isAdmin });
  const { data: viewsData } = trpc.analytics.viewsOverTime.useQuery({ days: range }, { enabled: isAdmin });
  const { data: readingData } = trpc.advancedAnalytics.readingActivity.useQuery({ days: range }, { enabled: isAdmin });
  const { data: engagementData } = trpc.advancedAnalytics.engagement.useQuery({ days: range }, { enabled: isAdmin });
  const { data: downloadData } = trpc.analytics.downloadTrends.useQuery({ days: range }, { enabled: isAdmin });
  const { data: topDocs } = trpc.advancedAnalytics.topByEngagement.useQuery({ limit: 10 }, { enabled: isAdmin });
  const { data: catDist } = trpc.analytics.categoryDistribution.useQuery(undefined, { enabled: isAdmin });
  const { data: contentGrowth } = trpc.advancedAnalytics.contentGrowth.useQuery({ days: 90 }, { enabled: isAdmin });
  const { data: activityBreakdown } = trpc.advancedAnalytics.activityBreakdown.useQuery({ days: range }, { enabled: isAdmin });
  const { data: heatmapData } = trpc.advancedAnalytics.hourlyHeatmap.useQuery({ days: range }, { enabled: isAdmin });

  // Chart refs
  const viewsChartRef = useRef<HTMLCanvasElement>(null);
  const readingChartRef = useRef<HTMLCanvasElement>(null);
  const engagementChartRef = useRef<HTMLCanvasElement>(null);
  const downloadsChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const growthChartRef = useRef<HTMLCanvasElement>(null);
  const activityChartRef = useRef<HTMLCanvasElement>(null);

  // Chart instances
  const viewsChart = useRef<ChartInstance>(null);
  const readingChart = useRef<ChartInstance>(null);
  const engagementChart = useRef<ChartInstance>(null);
  const downloadsChart = useRef<ChartInstance>(null);
  const categoryChart = useRef<ChartInstance>(null);
  const growthChart = useRef<ChartInstance>(null);
  const activityChart = useRef<ChartInstance>(null);

  const chartDefaults = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleColor: '#d4af37',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(212,175,55,0.3)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b7280', maxTicksLimit: 8, font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      y: {
        ticks: { color: '#6b7280', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        beginAtZero: true,
      },
    },
  }), []);

  // Views Over Time chart
  useEffect(() => {
    if (!viewsData || !viewsChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      viewsChart.current?.destroy();
      viewsChart.current = new Chart(viewsChartRef.current!, {
        type: 'line',
        data: {
          labels: viewsData.map((d: any) => d.date),
          datasets: [{
            label: 'Document Views',
            data: viewsData.map((d: any) => Number(d.views)),
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212,175,55,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
            borderWidth: 2,
          }],
        },
        options: { ...chartDefaults },
      });
    });
    return () => { viewsChart.current?.destroy(); };
  }, [viewsData, chartDefaults]);

  // Reading Activity chart
  useEffect(() => {
    if (!readingData || !readingChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      readingChart.current?.destroy();
      readingChart.current = new Chart(readingChartRef.current!, {
        type: 'line',
        data: {
          labels: readingData.map((d: any) => d.date),
          datasets: [
            {
              label: 'Unique Readers',
              data: readingData.map((d: any) => Number(d.readers)),
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 2,
              yAxisID: 'y',
            },
            {
              label: 'Total Reads',
              data: readingData.map((d: any) => Number(d.reads)),
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 2,
              borderDash: [5, 3],
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          ...chartDefaults,
          plugins: {
            ...chartDefaults.plugins,
            legend: { display: true, labels: { color: '#9ca3af', boxWidth: 12, font: { size: 11 } } },
          },
          scales: {
            ...chartDefaults.scales,
            y: { ...chartDefaults.scales.y, position: 'left' as const },
            y1: {
              ...chartDefaults.scales.y,
              position: 'right' as const,
              grid: { drawOnChartArea: false, color: 'rgba(255,255,255,0.04)' },
            },
          },
        },
      });
    });
    return () => { readingChart.current?.destroy(); };
  }, [readingData, chartDefaults]);

  // Engagement chart (upvotes/downvotes)
  useEffect(() => {
    if (!engagementData || !engagementChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      engagementChart.current?.destroy();
      engagementChart.current = new Chart(engagementChartRef.current!, {
        type: 'bar',
        data: {
          labels: engagementData.map((d: any) => d.date),
          datasets: [
            {
              label: 'Upvotes',
              data: engagementData.map((d: any) => Number(d.upvotes)),
              backgroundColor: 'rgba(16,185,129,0.7)',
              borderRadius: 3,
            },
            {
              label: 'Downvotes',
              data: engagementData.map((d: any) => Number(d.downvotes)),
              backgroundColor: 'rgba(239,68,68,0.7)',
              borderRadius: 3,
            },
          ],
        },
        options: {
          ...chartDefaults,
          plugins: {
            ...chartDefaults.plugins,
            legend: { display: true, labels: { color: '#9ca3af', boxWidth: 12, font: { size: 11 } } },
          },
        },
      });
    });
    return () => { engagementChart.current?.destroy(); };
  }, [engagementData, chartDefaults]);

  // Downloads chart
  useEffect(() => {
    if (!downloadData || !downloadsChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      downloadsChart.current?.destroy();
      downloadsChart.current = new Chart(downloadsChartRef.current!, {
        type: 'bar',
        data: {
          labels: downloadData.map((d: any) => d.date),
          datasets: [{
            label: 'Downloads',
            data: downloadData.map((d: any) => Number(d.downloads)),
            backgroundColor: 'rgba(99,102,241,0.6)',
            borderRadius: 4,
            borderSkipped: false,
          }],
        },
        options: { ...chartDefaults },
      });
    });
    return () => { downloadsChart.current?.destroy(); };
  }, [downloadData, chartDefaults]);

  // Category distribution doughnut
  useEffect(() => {
    if (!catDist || !categoryChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      categoryChart.current?.destroy();
      const colors = ['#d4af37', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#a855f7', '#22d3ee', '#e11d48'];
      categoryChart.current = new Chart(categoryChartRef.current!, {
        type: 'doughnut',
        data: {
          labels: catDist.map((c: any) => c.category),
          datasets: [{
            data: catDist.map((c: any) => Number(c.count)),
            backgroundColor: colors.slice(0, catDist.length),
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: { position: 'right' as const, labels: { color: '#9ca3af', boxWidth: 10, font: { size: 10 }, padding: 8 } },
            tooltip: chartDefaults.plugins.tooltip,
          },
        },
      });
    });
    return () => { categoryChart.current?.destroy(); };
  }, [catDist, chartDefaults]);

  // Content growth chart
  useEffect(() => {
    if (!contentGrowth || !growthChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      growthChart.current?.destroy();
      growthChart.current = new Chart(growthChartRef.current!, {
        type: 'line',
        data: {
          labels: contentGrowth.map((d: any) => d.date),
          datasets: [
            {
              label: 'Cumulative Documents',
              data: contentGrowth.map((d: any) => Number(d.cumulativeTotal)),
              borderColor: '#d4af37',
              backgroundColor: 'rgba(212,175,55,0.05)',
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              borderWidth: 2,
              yAxisID: 'y',
            },
            {
              label: 'New per Day',
              data: contentGrowth.map((d: any) => Number(d.newDocs)),
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139,92,246,0.3)',
              type: 'bar' as const,
              borderRadius: 3,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          ...chartDefaults,
          plugins: {
            ...chartDefaults.plugins,
            legend: { display: true, labels: { color: '#9ca3af', boxWidth: 12, font: { size: 11 } } },
          },
          scales: {
            ...chartDefaults.scales,
            y: { ...chartDefaults.scales.y, position: 'left' as const },
            y1: {
              ...chartDefaults.scales.y,
              position: 'right' as const,
              grid: { drawOnChartArea: false, color: 'rgba(255,255,255,0.04)' },
            },
          },
        },
      });
    });
    return () => { growthChart.current?.destroy(); };
  }, [contentGrowth, chartDefaults]);

  // Activity breakdown stacked area
  useEffect(() => {
    if (!activityBreakdown || !activityChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      activityChart.current?.destroy();
      // Pivot the data: group by date, then by action
      const dateMap = new Map<string, Record<string, number>>();
      const actionSet = new Set<string>();
      for (const row of activityBreakdown as any[]) {
        actionSet.add(row.action);
        if (!dateMap.has(row.date)) dateMap.set(row.date, {});
        dateMap.get(row.date)![row.action] = Number(row.count);
      }
      const dates = Array.from(dateMap.keys()).sort();
      const actions = Array.from(actionSet);
      const actionColors: Record<string, string> = {
        view: '#d4af37',
        rate: '#10b981',
        download: '#6366f1',
        comment: '#f59e0b',
        search: '#06b6d4',
        create: '#8b5cf6',
        edit: '#ec4899',
        delete: '#ef4444',
      };
      activityChart.current = new Chart(activityChartRef.current!, {
        type: 'line',
        data: {
          labels: dates,
          datasets: actions.map((action) => ({
            label: action.charAt(0).toUpperCase() + action.slice(1),
            data: dates.map((d) => dateMap.get(d)?.[action] || 0),
            borderColor: actionColors[action] || '#9ca3af',
            backgroundColor: (actionColors[action] || '#9ca3af') + '15',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 1.5,
          })),
        },
        options: {
          ...chartDefaults,
          plugins: {
            ...chartDefaults.plugins,
            legend: { display: true, labels: { color: '#9ca3af', boxWidth: 10, font: { size: 10 } } },
          },
          scales: {
            ...chartDefaults.scales,
            y: { ...chartDefaults.scales.y, stacked: true },
            x: { ...chartDefaults.scales.x, stacked: true },
          },
        },
      });
    });
    return () => { activityChart.current?.destroy(); };
  }, [activityBreakdown, chartDefaults]);

  // Heatmap rendering
  const heatmapGrid = useMemo(() => {
    if (!heatmapData) return null;
    const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    let maxVal = 1;
    for (const row of heatmapData as any[]) {
      const dow = Number(row.dayOfWeek) - 1; // 0=Sun
      const hour = Number(row.hourOfDay);
      const val = Number(row.count);
      if (dow >= 0 && dow < 7 && hour >= 0 && hour < 24) {
        grid[dow][hour] = val;
        if (val > maxVal) maxVal = val;
      }
    }
    return { grid, maxVal };
  }, [heatmapData]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BarChart3 className="w-5 h-5 text-[#d4af37]" />
          <h1 className="text-lg font-bold text-foreground">Advanced Analytics</h1>
          <div className="ml-auto flex items-center gap-1 bg-card/50 border border-border/50 rounded-lg p-0.5">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setRange(opt.days)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  range === opt.days
                    ? 'bg-[#d4af37]/20 text-[#d4af37] font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-7xl">
        {/* Summary Stats */}
        {summaryLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <StatCard icon={FileText} label="Total Documents" value={summary.totalDocs} color="bg-[#d4af37]/15 text-[#d4af37]" />
            <StatCard icon={Eye} label="Total Views" value={summary.totalViews} color="bg-blue-500/15 text-blue-400" />
            <StatCard icon={Eye} label="Today's Views" value={summary.todayViews} color="bg-emerald-500/15 text-emerald-400" />
            <StatCard icon={Users} label="Unique Readers" value={summary.uniqueReaders} color="bg-indigo-500/15 text-indigo-400" />
            <StatCard icon={Download} label="Total Downloads" value={summary.totalDownloads} color="bg-purple-500/15 text-purple-400" />
            <StatCard icon={ThumbsUp} label="Total Upvotes" value={summary.totalUpvotes} sub={`${summary.totalDownvotes} downvotes`} color="bg-green-500/15 text-green-400" />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Views Over Time */}
          <div className="bg-card/60 border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#d4af37]" />
              <h2 className="text-sm font-semibold text-foreground">Document Views Over Time</h2>
            </div>
            <div style={{ height: '240px' }}>
              <canvas ref={viewsChartRef}></canvas>
            </div>
          </div>

          {/* Reading Activity */}
          <div className="bg-card/60 border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-foreground">Reading Activity (Readers & Reads)</h2>
            </div>
            <div style={{ height: '240px' }}>
              <canvas ref={readingChartRef}></canvas>
            </div>
          </div>

          {/* Engagement (Upvotes/Downvotes) */}
          <div className="bg-card/60 border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-foreground">Engagement (Upvotes vs Downvotes)</h2>
            </div>
            <div style={{ height: '240px' }}>
              <canvas ref={engagementChartRef}></canvas>
            </div>
          </div>

          {/* Download Trends */}
          <div className="bg-card/60 border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-semibold text-foreground">Download Trends</h2>
            </div>
            <div style={{ height: '240px' }}>
              <canvas ref={downloadsChartRef}></canvas>
            </div>
          </div>

          {/* Content Growth */}
          <div className="bg-card/60 border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#d4af37]" />
              <h2 className="text-sm font-semibold text-foreground">Content Growth (90 days)</h2>
            </div>
            <div style={{ height: '240px' }}>
              <canvas ref={growthChartRef}></canvas>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-card/60 border border-border/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-foreground">Category Distribution</h2>
            </div>
            <div style={{ height: '240px' }}>
              <canvas ref={categoryChartRef}></canvas>
            </div>
          </div>

          {/* Activity Breakdown (stacked) */}
          <div className="bg-card/60 border border-border/50 rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-foreground">Activity Breakdown by Type</h2>
            </div>
            <div style={{ height: '260px' }}>
              <canvas ref={activityChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Hourly Activity Heatmap */}
        {heatmapGrid && (
          <div className="bg-card/60 border border-border/50 rounded-xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-semibold text-foreground">Activity Heatmap (Hour vs Day of Week)</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Hour labels */}
                <div className="flex items-center gap-0.5 ml-10 mb-1">
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} className="flex-1 text-center text-[9px] text-muted-foreground">
                      {h % 3 === 0 ? `${h}:00` : ''}
                    </div>
                  ))}
                </div>
                {/* Grid rows */}
                {heatmapGrid.grid.map((row, dow) => (
                  <div key={dow} className="flex items-center gap-0.5 mb-0.5">
                    <div className="w-10 text-right text-[10px] text-muted-foreground pr-2">{dayLabels[dow]}</div>
                    {row.map((val, h) => {
                      const intensity = val / heatmapGrid.maxVal;
                      return (
                        <div
                          key={h}
                          className="flex-1 aspect-square rounded-sm"
                          style={{
                            backgroundColor: intensity > 0
                              ? `rgba(212, 175, 55, ${Math.max(0.08, intensity * 0.9)})`
                              : 'rgba(255,255,255,0.03)',
                          }}
                          title={`${dayLabels[dow]} ${h}:00 — ${val} activities`}
                        />
                      );
                    })}
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center gap-2 mt-3 ml-10">
                  <span className="text-[10px] text-muted-foreground">Less</span>
                  {[0.08, 0.25, 0.5, 0.75, 0.9].map((opacity, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(212, 175, 55, ${opacity})` }} />
                  ))}
                  <span className="text-[10px] text-muted-foreground">More</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Documents by Engagement */}
        <div className="bg-card/60 border border-border/50 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            <h2 className="text-sm font-semibold text-foreground">Top Documents by Engagement Score</h2>
            <span className="text-[10px] text-muted-foreground ml-auto">Score = Views + (Upvotes x 5) - (Downvotes x 3)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border/50">
                  <th className="text-left py-2.5 px-2 font-medium text-xs">#</th>
                  <th className="text-left py-2.5 px-2 font-medium text-xs">Document</th>
                  <th className="text-left py-2.5 px-2 font-medium text-xs">Category</th>
                  <th className="text-right py-2.5 px-2 font-medium text-xs">Views</th>
                  <th className="text-right py-2.5 px-2 font-medium text-xs">Upvotes</th>
                  <th className="text-right py-2.5 px-2 font-medium text-xs">Downvotes</th>
                  <th className="text-right py-2.5 px-2 font-medium text-xs">Score</th>
                </tr>
              </thead>
              <tbody>
                {topDocs?.map((doc: any, i: number) => (
                  <tr key={doc.slug} className="border-b border-border/30 hover:bg-card/80 transition-colors">
                    <td className="py-2 px-2 text-muted-foreground text-xs">{i + 1}</td>
                    <td className="py-2 px-2">
                      <Link href={`/docs/${doc.slug}`} className="text-foreground hover:text-[#d4af37] transition-colors text-xs font-medium">
                        {doc.title?.length > 50 ? doc.title.slice(0, 50) + '...' : doc.title}
                      </Link>
                    </td>
                    <td className="py-2 px-2 text-xs text-muted-foreground">{doc.category}</td>
                    <td className="py-2 px-2 text-right text-xs">{Number(doc.viewCount || 0).toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-xs text-green-400">{Number(doc.upvotes || 0)}</td>
                    <td className="py-2 px-2 text-right text-xs text-red-400">{Number(doc.downvotes || 0)}</td>
                    <td className="py-2 px-2 text-right text-xs font-semibold text-[#d4af37]">{Number(doc.engagementScore || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Link href="/admin/dashboard" className="hover:text-[#d4af37] transition-colors">Basic Dashboard</Link>
          <span>·</span>
          <Link href="/admin/analytics-export" className="hover:text-[#d4af37] transition-colors">Export Analytics</Link>
          <span>·</span>
          <Link href="/admin/heatmap" className="hover:text-[#d4af37] transition-colors">Reading Heatmap</Link>
          <span>·</span>
          <Link href="/admin/visitors" className="hover:text-[#d4af37] transition-colors">Visitor Analytics</Link>
        </div>
      </div>
    </div>
  );
}
