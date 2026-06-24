import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

function calculateHealthScore(doc: { wordCount: number | null; updatedAt: string | Date; viewCount: number | null; upvotes: number | null; downvotes: number | null }) {
  let score = 0;
  // Word count: 300-3000 is ideal
  const wc = doc.wordCount || 0;
  if (wc >= 300 && wc <= 3000) score += 30;
  else if (wc > 0) score += 15;

  // Freshness: updated within 90 days
  const daysSinceUpdate = Math.floor((Date.now() - new Date(doc.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceUpdate <= 30) score += 30;
  else if (daysSinceUpdate <= 90) score += 20;
  else if (daysSinceUpdate <= 180) score += 10;

  // Engagement: views
  const views = doc.viewCount || 0;
  if (views >= 50) score += 20;
  else if (views >= 10) score += 10;
  else if (views > 0) score += 5;

  // Sentiment: upvotes vs downvotes
  const up = doc.upvotes || 0;
  const down = doc.downvotes || 0;
  if (up > 0 && down === 0) score += 20;
  else if (up > down) score += 15;
  else if (up === down && up > 0) score += 10;
  else if (up > 0) score += 5;

  return Math.min(score, 100);
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-green-500/10';
  if (score >= 50) return 'bg-yellow-500/10';
  return 'bg-red-500/10';
}

export default function AdminContentHealthPage() {
  const { data: docs, isLoading } = trpc.contentHealth.scores.useQuery();

  const scoredDocs = useMemo(() => {
    if (!docs) return [];
    return docs.map(d => ({
      ...d,
      healthScore: calculateHealthScore(d),
    })).sort((a, b) => a.healthScore - b.healthScore);
  }, [docs]);

  const avgScore = scoredDocs.length > 0
    ? Math.round(scoredDocs.reduce((sum, d) => sum + d.healthScore, 0) / scoredDocs.length)
    : 0;

  const healthyCount = scoredDocs.filter(d => d.healthScore >= 80).length;
  const warningCount = scoredDocs.filter(d => d.healthScore >= 50 && d.healthScore < 80).length;
  const criticalCount = scoredDocs.filter(d => d.healthScore < 50).length;

  if (isLoading) return <div className="container py-8"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="container py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-primary" />
        Content Health Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{avgScore}</p>
          <p className="text-xs text-muted-foreground">Average Score</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-500">{healthyCount}</p>
          <p className="text-xs text-muted-foreground">Healthy (80+)</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">{warningCount}</p>
          <p className="text-xs text-muted-foreground">Warning (50-79)</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{criticalCount}</p>
          <p className="text-xs text-muted-foreground">Critical (&lt;50)</p>
        </div>
      </div>

      {/* Scoring Explanation */}
      <div className="border rounded-lg p-4 mb-6 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Scoring Criteria:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <span>Word Count (300-3000): 30pts</span>
          <span>Freshness (&lt;90 days): 30pts</span>
          <span>Engagement (views): 20pts</span>
          <span>Sentiment (votes): 20pts</span>
        </div>
      </div>

      {/* Document List */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-accent/30">
            <tr>
              <th className="text-left p-3">Score</th>
              <th className="text-left p-3">Document</th>
              <th className="text-left p-3">Category</th>
              <th className="text-right p-3">Words</th>
              <th className="text-right p-3">Views</th>
              <th className="text-right p-3">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {scoredDocs.map(doc => (
              <tr key={doc.id} className={`border-t ${getScoreBg(doc.healthScore)}`}>
                <td className="p-3">
                  <span className={`font-bold ${getScoreColor(doc.healthScore)}`}>
                    {doc.healthScore >= 80 ? <CheckCircle className="w-4 h-4 inline mr-1" /> :
                     doc.healthScore >= 50 ? <Clock className="w-4 h-4 inline mr-1" /> :
                     <AlertTriangle className="w-4 h-4 inline mr-1" />}
                    {doc.healthScore}
                  </span>
                </td>
                <td className="p-3">
                  <a href={`/docs/${doc.slug}`} className="hover:text-primary transition-colors">
                    {doc.title}
                  </a>
                </td>
                <td className="p-3 text-muted-foreground">{doc.category}</td>
                <td className="p-3 text-right">{doc.wordCount?.toLocaleString() || 0}</td>
                <td className="p-3 text-right">{doc.viewCount || 0}</td>
                <td className="p-3 text-right text-muted-foreground">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
