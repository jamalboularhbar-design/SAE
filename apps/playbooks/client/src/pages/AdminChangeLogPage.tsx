import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { History, FileText, Edit, Upload, Archive, Tag, CheckCircle, Eye } from 'lucide-react';

const changeTypeColors: Record<string, string> = {
  created: 'bg-green-500/20 text-green-400',
  edited: 'bg-blue-500/20 text-blue-400',
  published: 'bg-purple-500/20 text-purple-400',
  archived: 'bg-gray-500/20 text-gray-400',
  tagged: 'bg-amber-500/20 text-amber-400',
  categorized: 'bg-cyan-500/20 text-cyan-400',
  reviewed: 'bg-pink-500/20 text-pink-400',
};

const changeTypeIcons: Record<string, React.ReactNode> = {
  created: <FileText className="w-4 h-4" />,
  edited: <Edit className="w-4 h-4" />,
  published: <Upload className="w-4 h-4" />,
  archived: <Archive className="w-4 h-4" />,
  tagged: <Tag className="w-4 h-4" />,
  categorized: <CheckCircle className="w-4 h-4" />,
  reviewed: <Eye className="w-4 h-4" />,
};

export default function AdminChangeLogPage() {
  const [changeType, setChangeType] = useState<string>('all');
  const [days, setDays] = useState(30);

  const { data: logs, isLoading } = trpc.changeLog.list.useQuery({
    changeType: changeType === 'all' ? undefined : changeType,
    days,
  });

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Document Change Log
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Timeline of all document changes across the system</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={changeType} onValueChange={setChangeType}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="edited">Edited</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="tagged">Tagged</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Timeline</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : !logs || logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No changes recorded yet. Changes will appear here as documents are created, edited, published, and more.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {(logs as any[]).map((log: any) => (
                  <div key={log.id} className="relative pl-10">
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    <div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border/40 bg-card/50">
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded ${changeTypeColors[log.changeType] || 'bg-muted text-muted-foreground'}`}>
                          {changeTypeIcons[log.changeType] || <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {log.documentTitle || `Document #${log.documentId}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {log.changeDescription || `${log.changeType} by ${log.changedByName || log.changedBy}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs">{log.changeType}</Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
