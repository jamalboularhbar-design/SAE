import { useState, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, FileText, Calendar, Plus, Search, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastActive: string;
}

interface SharedTask {
  id: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastReply: string;
  unread: boolean;
}

const mockMembers: TeamMember[] = [
  { id: '1', name: 'Youssef M.', role: 'Operations Lead', avatar: 'YM', status: 'online', lastActive: 'Now' },
  { id: '2', name: 'Sarah K.', role: 'Content Strategist', avatar: 'SK', status: 'online', lastActive: '5m ago' },
  { id: '3', name: 'Omar B.', role: 'Travel Concierge', avatar: 'OB', status: 'away', lastActive: '1h ago' },
  { id: '4', name: 'Fatima Z.', role: 'Creative Director', avatar: 'FZ', status: 'offline', lastActive: '3h ago' },
  { id: '5', name: 'Ahmed R.', role: 'Developer', avatar: 'AR', status: 'online', lastActive: '2m ago' },
];

const mockTasks: SharedTask[] = [
  { id: '1', title: 'Finalize Q3 operational playbook', assignee: 'Youssef M.', status: 'in-progress', priority: 'high', dueDate: 'May 22' },
  { id: '2', title: 'Review travel concierge SOP updates', assignee: 'Omar B.', status: 'todo', priority: 'high', dueDate: 'May 23' },
  { id: '3', title: 'Design studio brand guidelines v3', assignee: 'Fatima Z.', status: 'in-progress', priority: 'medium', dueDate: 'May 25' },
  { id: '4', title: 'Integrate CRM webhook notifications', assignee: 'Ahmed R.', status: 'done', priority: 'medium', dueDate: 'May 20' },
  { id: '5', title: 'Write onboarding email sequence', assignee: 'Sarah K.', status: 'todo', priority: 'low', dueDate: 'May 28' },
];

const mockDiscussions: Discussion[] = [
  { id: '1', title: 'New pricing tiers for Riad & Routes', author: 'Youssef M.', replies: 8, lastReply: '30m ago', unread: true },
  { id: '2', title: 'AI features rollout timeline', author: 'Ahmed R.', replies: 5, lastReply: '2h ago', unread: true },
  { id: '3', title: 'Guest experience feedback analysis', author: 'Omar B.', replies: 3, lastReply: '1 day ago', unread: false },
  { id: '4', title: 'Studio workshop schedule for June', author: 'Fatima Z.', replies: 2, lastReply: '2 days ago', unread: false },
];

export default function TeamWorkspacePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'all') return mockTasks;
    return mockTasks.filter(t => t.status === taskFilter);
  }, [taskFilter]);

  const statusIcons = { todo: Circle, 'in-progress': Clock, done: CheckCircle2 };
  const statusColors = { todo: 'text-muted-foreground', 'in-progress': 'text-amber-400', done: 'text-emerald-400' };
  const priorityColors = { high: 'bg-red-500/10 text-red-400', medium: 'bg-amber-500/10 text-amber-400', low: 'bg-blue-500/10 text-blue-400' };
  const memberStatusColors = { online: 'bg-emerald-500', away: 'bg-amber-500', offline: 'bg-muted-foreground/50' };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <Users className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Workspace</h1>
              <p className="text-sm text-muted-foreground">{mockMembers.filter(m => m.status === 'online').length} members online</p>
            </div>
          </div>
          <Button className="gap-2"><Plus className="h-4 w-4" /> New Task</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="files">Shared Files</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks">
                <div className="flex items-center gap-2 mb-4">
                  {(['all', 'todo', 'in-progress', 'done'] as const).map(filter => (
                    <Button
                      key={filter}
                      variant={taskFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTaskFilter(filter)}
                      className="text-xs capitalize"
                    >
                      {filter === 'all' ? 'All' : filter.replace('-', ' ')}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  {filteredTasks.map(task => {
                    const StatusIcon = statusIcons[task.status];
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
                        <StatusIcon className={`h-5 w-5 shrink-0 ${statusColors[task.status]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{task.title}</div>
                          <div className="text-xs text-muted-foreground">{task.assignee} · Due {task.dueDate}</div>
                        </div>
                        <Badge className={`text-xs ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="discussions">
                <div className="space-y-2">
                  {mockDiscussions.map(disc => (
                    <div key={disc.id} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/20 transition-colors cursor-pointer">
                      <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{disc.title}</span>
                          {disc.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {disc.author} · {disc.replies} replies · Last reply {disc.lastReply}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="files">
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Shared files and documents appear here.</p>
                  <p className="text-xs mt-1">Upload files or share documents from the library.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Team Members */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMembers.map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                          {member.avatar}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${memberStatusColors[member.status]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Open tasks</span>
                    <span className="font-medium text-foreground">{mockTasks.filter(t => t.status !== 'done').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium text-emerald-400">{mockTasks.filter(t => t.status === 'done').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unread discussions</span>
                    <span className="font-medium text-foreground">{mockDiscussions.filter(d => d.unread).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
