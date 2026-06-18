import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Building2, FileText, MessageSquare, Clock, CheckCircle2, AlertCircle, Search, ExternalLink } from 'lucide-react';

interface ProjectItem {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  lastUpdate: string;
  progress: number;
  documentsCount: number;
}

interface ActivityItem {
  id: string;
  type: 'document' | 'message' | 'milestone';
  title: string;
  timestamp: string;
  description: string;
}

const mockProjects: ProjectItem[] = [
  { id: '1', name: 'Riad & Routes Launch', status: 'active', lastUpdate: '2 hours ago', progress: 72, documentsCount: 14 },
  { id: '2', name: 'ArtKech Studio Branding', status: 'active', lastUpdate: '1 day ago', progress: 45, documentsCount: 8 },
  { id: '3', name: 'Q2 Marketing Campaign', status: 'pending', lastUpdate: '3 days ago', progress: 20, documentsCount: 5 },
  { id: '4', name: 'Operations Manual v2', status: 'completed', lastUpdate: '1 week ago', progress: 100, documentsCount: 22 },
];

const mockActivity: ActivityItem[] = [
  { id: '1', type: 'document', title: 'Travel Concierge SOP updated', timestamp: '2 hours ago', description: 'New section added for VIP guest protocols' },
  { id: '2', type: 'milestone', title: 'Phase 2 completed', timestamp: '5 hours ago', description: 'Riad & Routes brand guidelines approved' },
  { id: '3', type: 'message', title: 'Feedback received', timestamp: '1 day ago', description: 'Client approved the revised pricing structure' },
  { id: '4', type: 'document', title: 'Studio workflow documented', timestamp: '2 days ago', description: 'ArtKech creative process now fully documented' },
  { id: '5', type: 'milestone', title: 'Onboarding complete', timestamp: '3 days ago', description: 'All team members have completed initial setup' },
];

export default function ClientPortalPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('projects');

  const filteredProjects = mockProjects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const typeIcons = {
    document: FileText,
    message: MessageSquare,
    milestone: CheckCircle2,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
              <Building2 className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Client Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name || 'Client'}. Here's your project overview.</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-foreground">{mockProjects.filter(p => p.status === 'active').length}</div>
              <div className="text-xs text-muted-foreground">Active Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-foreground">{mockProjects.reduce((s, p) => s + p.documentsCount, 0)}</div>
              <div className="text-xs text-muted-foreground">Total Documents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-emerald-400">92%</div>
              <div className="text-xs text-muted-foreground">On-Time Delivery</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-xs text-muted-foreground">Pending Reviews</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="documents">Shared Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map(project => (
                <Card key={project.id} className="hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <Badge className={statusColors[project.status]}>{project.status}</Badge>
                    </div>
                    <CardDescription className="text-xs">Last updated {project.lastUpdate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{project.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{project.documentsCount} documents</span>
                        <Button variant="ghost" size="sm" className="text-xs gap-1">
                          View Details <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-3">
              {mockActivity.map(item => {
                const Icon = typeIcons[item.type];
                return (
                  <div key={item.id} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/20 transition-colors">
                    <div className="p-2 rounded-md bg-muted shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Shared documents will appear here once projects are active.</p>
              <Link href="/documents">
                <Button variant="outline" className="mt-4">Browse All Documents</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
