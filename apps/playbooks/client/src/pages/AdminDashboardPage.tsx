import { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { BarChart3, TrendingUp, Download, PieChart } from 'lucide-react';
import LeadsDashboardWidget from '@/components/LeadsDashboardWidget';
import { Link } from 'wouter';

export default function AdminDashboardPage() {
  const { data: viewsData } = trpc.analytics.viewsOverTime.useQuery({ days: 30 });
  const { data: topDocs } = trpc.analytics.topDocuments.useQuery({ limit: 10 });
  const { data: downloadData } = trpc.analytics.downloadTrends.useQuery({ days: 30 });
  const { data: catDist } = trpc.analytics.categoryDistribution.useQuery();
  const utils = trpc.useUtils();

  const handleExportCSV = async () => {
    try {
      const exportData = await utils.analyticsExport.csv.fetch();
      const sections: string[] = [];

      // Section 1: Documents Overview
      sections.push('=== DOCUMENTS OVERVIEW ===');
      const docHeaders = ['Slug', 'Title', 'Category', 'Views', 'Upvotes', 'Downvotes', 'Words', 'Status', 'Locale', 'Created'];
      const docRows = exportData.documents.map((d: any) => [
        d.slug, `"${(d.title || '').replace(/"/g, '""')}"`, d.category, d.viewCount, d.upvotes, d.downvotes, d.wordCount, d.status, d.locale || 'en', d.createdAt
      ]);
      sections.push(docHeaders.join(','));
      sections.push(...docRows.map((r: any[]) => r.join(',')));

      // Section 2: Download History
      sections.push('');
      sections.push('=== DOWNLOAD HISTORY ===');
      const dlHeaders = ['Document Slug', 'Format', 'Visitor ID', 'Downloaded At'];
      const dlRows = exportData.downloads.map((d: any) => [
        d.documentSlug, d.format, d.visitorId || 'anonymous', d.createdAt
      ]);
      sections.push(dlHeaders.join(','));
      sections.push(...dlRows.map((r: any[]) => r.join(',')));

      // Section 3: Top Documents by Views (from current query data)
      if (topDocs && topDocs.length > 0) {
        sections.push('');
        sections.push('=== TOP DOCUMENTS BY VIEWS ===');
        sections.push('Rank,Slug,Title,Views');
        topDocs.forEach((d: any, i: number) => {
          sections.push(`${i + 1},${d.slug},"${(d.title || '').replace(/"/g, '""')}",${d.viewCount}`);
        });
      }

      // Section 4: Views Over Time (from current query data)
      if (viewsData && viewsData.length > 0) {
        sections.push('');
        sections.push('=== VIEWS OVER TIME (30 DAYS) ===');
        sections.push('Date,Views');
        viewsData.forEach((d: any) => {
          sections.push(`${d.date},${d.views}`);
        });
      }

      const csv = sections.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const viewsChartRef = useRef<HTMLCanvasElement>(null);
  const downloadsChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const viewsChartInstance = useRef<any>(null);
  const downloadsChartInstance = useRef<any>(null);
  const categoryChartInstance = useRef<any>(null);

  useEffect(() => {
    if (!viewsData || !viewsChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      if (viewsChartInstance.current) viewsChartInstance.current.destroy();
      viewsChartInstance.current = new Chart(viewsChartRef.current!, {
        type: 'line',
        data: {
          labels: viewsData.map((d: any) => d.date),
          datasets: [{
            label: 'Views',
            data: viewsData.map((d: any) => Number(d.views)),
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: true,
            tension: 0.3,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#9ca3af', maxTicksLimit: 10 } },
            y: { ticks: { color: '#9ca3af' }, beginAtZero: true },
          },
        },
      });
    });
    return () => { viewsChartInstance.current?.destroy(); };
  }, [viewsData]);

  useEffect(() => {
    if (!downloadData || !downloadsChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      if (downloadsChartInstance.current) downloadsChartInstance.current.destroy();
      downloadsChartInstance.current = new Chart(downloadsChartRef.current!, {
        type: 'bar',
        data: {
          labels: downloadData.map((d: any) => d.date),
          datasets: [{
            label: 'Downloads',
            data: downloadData.map((d: any) => Number(d.downloads)),
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#9ca3af', maxTicksLimit: 10 } },
            y: { ticks: { color: '#9ca3af' }, beginAtZero: true },
          },
        },
      });
    });
    return () => { downloadsChartInstance.current?.destroy(); };
  }, [downloadData]);

  useEffect(() => {
    if (!catDist || !categoryChartRef.current) return;
    import('chart.js/auto').then(({ default: Chart }) => {
      if (categoryChartInstance.current) categoryChartInstance.current.destroy();
      const colors = ['#d4af37', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#a855f7', '#22d3ee', '#e11d48'];
      categoryChartInstance.current = new Chart(categoryChartRef.current!, {
        type: 'doughnut',
        data: {
          labels: catDist.map((c: any) => c.category),
          datasets: [{
            data: catDist.map((c: any) => Number(c.count)),
            backgroundColor: colors.slice(0, catDist.length),
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: '#9ca3af', boxWidth: 12 } },
          },
        },
      });
    });
    return () => { categoryChartInstance.current?.destroy(); };
  }, [catDist]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#d4af37]">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Document engagement and usage metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg text-sm text-[#d4af37] hover:bg-[#d4af37]/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <Link href="/admin/advanced-analytics" className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-sm text-indigo-400 hover:bg-indigo-500/20 transition-colors">
              <TrendingUp className="w-4 h-4" />
              Advanced Analytics
            </Link>
            <Link href="/admin/editor" className="text-sm text-gray-400 hover:text-[#d4af37]">
              ← Back to Admin
            </Link>
          </div>
        </div>

        {/* Leads Pipeline Widget */}
        <div className="mb-8">
          <LeadsDashboardWidget />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Views Over Time */}
          <div className="bg-[#12121a] border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#d4af37]" />
              <h2 className="text-lg font-semibold">Views Over Time (30 days)</h2>
            </div>
            <div style={{ height: '250px' }}>
              <canvas ref={viewsChartRef}></canvas>
            </div>
          </div>

          {/* Download Trends */}
          <div className="bg-[#12121a] border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold">Download Trends (30 days)</h2>
            </div>
            <div style={{ height: '250px' }}>
              <canvas ref={downloadsChartRef}></canvas>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-[#12121a] border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold">Category Distribution</h2>
            </div>
            <div style={{ height: '250px' }}>
              <canvas ref={categoryChartRef}></canvas>
            </div>
          </div>

          {/* Top Documents Table */}
          <div className="bg-[#12121a] border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold">Top Documents</h2>
            </div>
            <div className="overflow-auto max-h-[250px]">
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="text-left py-2">Title</th>
                    <th className="text-right py-2">Views</th>
                    <th className="text-right py-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topDocs?.map((doc: any) => (
                    <tr key={doc.slug} className="border-b border-gray-800">
                      <td className="py-2 truncate max-w-[200px]">
                        <Link href={`/docs/${doc.slug}`} className="hover:text-[#d4af37]">
                          {doc.title}
                        </Link>
                      </td>
                      <td className="text-right py-2 text-gray-400">{doc.viewCount}</td>
                      <td className="text-right py-2">
                        <span className="text-green-400">+{doc.upvotes}</span>
                        {' / '}
                        <span className="text-red-400">-{doc.downvotes}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
