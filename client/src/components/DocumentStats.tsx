import { trpc } from '@/lib/trpc';
import { FileText, BookOpen, FolderOpen, Clock } from 'lucide-react';

export default function DocumentStats() {
  const { data: stats, isLoading } = trpc.documents.stats.useQuery();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-card/30 border border-border/30" />
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Documents',
      value: stats.totalDocuments.toLocaleString(),
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Categories',
      value: stats.totalCategories.toString(),
      icon: FolderOpen,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Total Words',
      value: stats.totalWords > 1000000
        ? `${(stats.totalWords / 1000000).toFixed(1)}M`
        : `${(stats.totalWords / 1000).toFixed(0)}K`,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Avg. Reading Time',
      value: `${stats.avgReadingTime} min`,
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="p-4 rounded-xl bg-card/30 border border-border/50 hover:border-border transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg ${metric.bgColor} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${metric.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
          </div>
        );
      })}
    </div>
  );
}
