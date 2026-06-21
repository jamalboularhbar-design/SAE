import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Edit3, MessageSquare, CheckCircle, Eye } from 'lucide-react';

const actionIcons: Record<string, React.ReactNode> = {
  edit: <Edit3 className="w-3 h-3" />,
  comment: <MessageSquare className="w-3 h-3" />,
  review: <Eye className="w-3 h-3" />,
  approve: <CheckCircle className="w-3 h-3" />,
};

export default function CoAuthorActivitySection({ documentSlug }: { documentSlug: string }) {
  const { data: contributors } = trpc.coAuthoring.contributors.useQuery({ documentSlug });
  const { data: activity } = trpc.coAuthoring.activity.useQuery({ documentSlug });

  if ((!contributors || (contributors as any[]).length === 0) && (!activity || activity.length === 0)) return null;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-orange-400" /> Co-Author Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {(contributors as any[])?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Contributors</p>
            <div className="flex flex-wrap gap-2">
              {(contributors as any[]).map((c: any, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {c.userName || c.userId} ({c.actionCount} actions)
                </Badge>
              ))}
            </div>
          </div>
        )}
        {activity && activity.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-medium">Recent Activity</p>
            <div className="space-y-1 max-h-[200px] overflow-auto">
              {activity.slice(0, 10).map((a: any) => (
                <div key={a.id} className="flex items-center gap-2 text-xs p-1.5 rounded bg-muted/20">
                  {actionIcons[a.actionType] || <Edit3 className="w-3 h-3" />}
                  <span className="font-medium">{a.userName || a.userId}</span>
                  <Badge variant="outline" className="text-[10px] px-1">{a.actionType}</Badge>
                  {a.summary && <span className="text-muted-foreground truncate">{a.summary}</span>}
                  <span className="text-muted-foreground ml-auto shrink-0">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
