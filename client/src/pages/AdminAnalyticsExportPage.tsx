import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAnalyticsExportPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data, isLoading } = trpc.analyticsExportFull.csv.useQuery(undefined, { enabled: isAdmin });

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  const downloadCSV = () => {
    if (!data || data.length === 0) { toast.error('No data to export'); return; }
    const headers = ['Title', 'Slug', 'Category', 'Word Count', 'View Count', 'Upvotes', 'Downvotes', 'Status', 'Visibility', 'Created At', 'Updated At'];
    const rows = data.map((d: any) => [
      `"${(d.title || '').replace(/"/g, '""')}"`,
      d.slug, d.category, d.wordCount, d.viewCount, d.upvotes, d.downvotes, d.status, d.visibility,
      d.createdAt ? new Date(d.createdAt).toISOString() : '',
      d.updatedAt ? new Date(d.updatedAt).toISOString() : '',
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <FileSpreadsheet className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Analytics Export</h1>
          <p className="text-muted-foreground">Download document reading patterns and metrics as CSV</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Export Data</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading analytics data...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {data?.length || 0} documents ready for export. The CSV includes title, slug, category, word count, view count, votes, status, visibility, and timestamps.
              </p>
              <Button onClick={downloadCSV} disabled={!data || data.length === 0}>
                <Download className="w-4 h-4 mr-2" /> Download CSV
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
