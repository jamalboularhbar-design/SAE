import { useAuth } from '@/_core/hooks/useAuth';
import { Link } from 'wouter';
import { Brain, FileText, Pen, Target, Search, Tags, ClipboardList, Workflow, BarChart3, Settings, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

const aiServices = [
  { name: 'Document Summarizer', description: 'Generate executive summaries, key points, and action items from any document', icon: FileText, path: '/ai/summarize', color: 'text-blue-400', category: 'Content' },
  { name: 'Writing Assistant', description: 'Draft, rewrite, expand, translate, or simplify content with AI', icon: Pen, path: '/ai/writer', color: 'text-emerald-400', category: 'Content' },
  { name: 'Smart Recommendations', description: 'Get personalized content suggestions based on your interests and reading history', icon: Sparkles, path: '/ai/recommendations', color: 'text-purple-400', category: 'Discovery' },
  { name: 'Semantic Search', description: 'Natural language queries with intent detection and contextual results', icon: Search, path: '/ai/search', color: 'text-cyan-400', category: 'Discovery' },
  { name: 'Lead Scoring', description: 'Predict conversion probability with explainable AI-driven scoring factors', icon: Target, path: '/ai/lead-scoring', color: 'text-orange-400', category: 'Analytics' },
  { name: 'Auto-Tag', description: 'Automatically classify and tag content with confidence-scored categories', icon: Tags, path: '/ai/auto-tag', color: 'text-pink-400', category: 'Automation' },
  { name: 'Meeting Notes', description: 'Extract action items, decisions, and follow-ups from meeting transcripts', icon: ClipboardList, path: '/ai/meeting-notes', color: 'text-yellow-400', category: 'Productivity' },
  { name: 'Workflow Builder', description: 'Describe workflows in plain English and get automated trigger-action sequences', icon: Workflow, path: '/ai/workflows', color: 'text-indigo-400', category: 'Automation' },
  { name: 'Sentiment Analysis', description: 'Analyze feedback and comments for sentiment trends, keywords, and alerts', icon: BarChart3, path: '/ai/sentiment', color: 'text-rose-400', category: 'Analytics' },
];

const categories = ['Content', 'Discovery', 'Analytics', 'Automation', 'Productivity'];

export default function AIHubPage() {
  const { user } = useAuth();
  const { data: configs } = trpc.aiConfigManager.getAll.useQuery();

  const getServiceStats = (serviceName: string) => {
    const config = configs?.find((c: { serviceName: string }) => c.serviceName === serviceName.toLowerCase().replace(/\s+/g, ''));
    return config ? { calls: config.totalCalls, tokens: config.totalTokensUsed, enabled: config.isEnabled === 1 } : { calls: 0, tokens: 0, enabled: true };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Services Hub</h1>
              <p className="text-muted-foreground">Intelligent tools powered by advanced language models</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {aiServices.length} AI Tools Available
            </Badge>
            {configs && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                {configs.reduce((sum: number, c: { totalCalls: number }) => sum + c.totalCalls, 0).toLocaleString()} Total API Calls
              </Badge>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin/ai-config">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configure Models
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Services by Category */}
        {categories.map(category => {
          const services = aiServices.filter(s => s.category === category);
          if (services.length === 0) return null;
          return (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => {
                  const stats = getServiceStats(service.name);
                  const Icon = service.icon;
                  return (
                    <Link key={service.path} href={service.path}>
                      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-muted">
                                <Icon className={`h-5 w-5 ${service.color}`} />
                              </div>
                              <CardTitle className="text-base">{service.name}</CardTitle>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm mb-3">{service.description}</CardDescription>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {stats.calls > 0 && (
                              <span>{stats.calls.toLocaleString()} calls</span>
                            )}
                            {!stats.enabled && (
                              <Badge variant="secondary" className="text-xs">Disabled</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* AI Template Generator CTA */}
        <div className="mt-8 p-6 rounded-lg border border-dashed border-primary/30 bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Template Generator</h3>
              <p className="text-sm text-muted-foreground mt-1">Describe the document you need and AI will generate a full template with sections</p>
            </div>
            <Link href="/ai/templates">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Template
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
