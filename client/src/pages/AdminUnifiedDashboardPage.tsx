import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Users, Star, MessageSquare, ThumbsUp, Activity, ArrowRight, BarChart3, Shield, Settings, Archive, Workflow, AlertTriangle, Tags, Globe, Bell } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminUnifiedDashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  if (user?.role !== 'admin') { navigate('/'); return null; }

  const { data: stats, isLoading } = trpc.adminDashboard.stats.useQuery();

  const adminLinks = [
    { href: '/admin/editor', label: 'Document Editor', icon: FileText, color: 'text-blue-400' },
    { href: '/admin/analytics', label: 'Analytics Dashboard', icon: BarChart3, color: 'text-green-400' },
    { href: '/admin/workflow', label: 'Workflow Manager', icon: Workflow, color: 'text-purple-400' },
    { href: '/admin/archival', label: 'Archival Policy', icon: Archive, color: 'text-yellow-400' },
    { href: '/admin/content-health', label: 'Content Health', icon: Shield, color: 'text-red-400' },
    { href: '/admin/bulk-tags', label: 'Bulk Tags', icon: Tags, color: 'text-cyan-400' },
    { href: '/admin/seo', label: 'SEO Manager', icon: Globe, color: 'text-emerald-400' },
    { href: '/admin/notification-center', label: 'Notification Center', icon: Bell, color: 'text-orange-400' },
    { href: '/admin/review-reminders', label: 'Review Reminders', icon: AlertTriangle, color: 'text-amber-400' },
    { href: '/admin/branding', label: 'Branding', icon: Settings, color: 'text-pink-400' },
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Unified overview of your reference guide</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-card/50 animate-pulse"><CardContent className="pt-6 h-20" /></Card>
          ))}
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-card/80 border-border/50">
              <CardContent className="pt-5 pb-4 text-center">
                <FileText className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                <div className="text-xs text-muted-foreground">Documents</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border/50">
              <CardContent className="pt-5 pb-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-1 text-green-400" />
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-xs text-muted-foreground">Users</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border/50">
              <CardContent className="pt-5 pb-4 text-center">
                <Star className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                <div className="text-2xl font-bold">{stats.totalRatings}</div>
                <div className="text-xs text-muted-foreground">Ratings</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border/50">
              <CardContent className="pt-5 pb-4 text-center">
                <MessageSquare className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                <div className="text-2xl font-bold">{stats.totalComments}</div>
                <div className="text-xs text-muted-foreground">Comments</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border/50">
              <CardContent className="pt-5 pb-4 text-center">
                <ThumbsUp className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                <div className="text-2xl font-bold">{stats.totalFeedback}</div>
                <div className="text-xs text-muted-foreground">Feedback</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-4 h-4" /> Recently Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.recentDocuments.map((doc: any) => (
                    <Link key={doc.id} href={`/docs/${doc.slug}`}>
                      <div className="flex items-center justify-between py-2 px-3 rounded hover:bg-accent/30 transition-colors cursor-pointer">
                        <span className="text-sm truncate flex-1">{doc.title}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{doc.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-4 h-4" /> Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.recentActivity.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between py-2 px-3 rounded">
                      <span className="text-sm truncate flex-1">{a.action}: {a.details}</span>
                      <span className="text-xs text-muted-foreground ml-2">{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {adminLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <Card className="bg-card/60 border-border/40 hover:bg-accent/20 transition-colors cursor-pointer h-full">
                <CardContent className="pt-5 pb-4 text-center">
                  <link.icon className={`w-6 h-6 mx-auto mb-2 ${link.color}`} />
                  <div className="text-xs font-medium">{link.label}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
