import { useState, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Command, Search, Users, FileText, Brain, Shield, Settings, BarChart3,
  Zap, Globe, Bell, Key, Workflow, Database, Activity, ArrowRight, Sparkles
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: typeof Command;
  path: string;
  category: 'ai' | 'admin' | 'content' | 'team' | 'system';
  shortcut?: string;
}

const quickActions: QuickAction[] = [
  { id: 'ai-hub', label: 'AI Services Hub', description: 'Access all AI-powered tools', icon: Brain, path: '/ai', category: 'ai' },
  { id: 'ai-chat', label: 'AI Chat Assistant', description: 'Ask the AI anything', icon: Sparkles, path: '/ai/chat', category: 'ai', shortcut: '⌘K' },
  { id: 'ai-summarize', label: 'Summarize Document', description: 'Quick AI summary', icon: FileText, path: '/ai/summarize', category: 'ai' },
  { id: 'ai-writer', label: 'AI Writer', description: 'Generate or rewrite content', icon: Zap, path: '/ai/writer', category: 'ai' },
  { id: 'team', label: 'Team Workspace', description: 'View tasks and discussions', icon: Users, path: '/team', category: 'team' },
  { id: 'invites', label: 'Invite Team Members', description: 'Send new invitations', icon: Users, path: '/admin/onboarding-wizard', category: 'team' },
  { id: 'documents', label: 'Document Library', description: 'Browse all documents', icon: FileText, path: '/documents', category: 'content' },
  { id: 'templates', label: 'Generate Template', description: 'AI-powered template creation', icon: Workflow, path: '/ai/templates', category: 'content' },
  { id: 'admin-kpi', label: 'Admin Dashboard', description: 'View KPIs and metrics', icon: BarChart3, path: '/admin/dashboard', category: 'admin' },
  { id: 'admin-users', label: 'User Management', description: 'Manage users and roles', icon: Shield, path: '/admin/users', category: 'admin' },
  { id: 'admin-health', label: 'System Health', description: 'Monitor system status', icon: Activity, path: '/admin/health', category: 'system' },
  { id: 'admin-ai-config', label: 'AI Configuration', description: 'Manage AI models', icon: Settings, path: '/admin/ai-config', category: 'system' },
  { id: 'api-keys', label: 'API Keys', description: 'Manage API access', icon: Key, path: '/settings/api-keys', category: 'system' },
  { id: 'notifications', label: 'Notification Settings', description: 'Configure alerts', icon: Bell, path: '/settings/notifications', category: 'system' },
  { id: 'integrations', label: 'Integrations', description: 'Connect external services', icon: Globe, path: '/integrations', category: 'system' },
  { id: 'webhooks', label: 'Webhook Builder', description: 'Create custom webhooks', icon: Workflow, path: '/admin/webhooks/builder', category: 'system' },
  { id: 'usage', label: 'Usage & Billing', description: 'View consumption and costs', icon: BarChart3, path: '/settings/usage', category: 'admin' },
  { id: 'audit', label: 'Audit Log', description: 'Review system activity', icon: Database, path: '/admin/audit-log', category: 'admin' },
];

const categoryLabels = { ai: 'AI Services', admin: 'Administration', content: 'Content', team: 'Team', system: 'System' };
const categoryColors = { ai: 'text-purple-400', admin: 'text-blue-400', content: 'text-emerald-400', team: 'text-amber-400', system: 'text-cyan-400' };

export default function AdminCommandCenterPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActions = useMemo(() => {
    if (!searchQuery.trim()) return quickActions;
    const q = searchQuery.toLowerCase();
    return quickActions.filter(a =>
      a.label.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.includes(q)
    );
  }, [searchQuery]);

  const groupedActions = useMemo(() => {
    const groups: Record<string, QuickAction[]> = {};
    filteredActions.forEach(action => {
      if (!groups[action.category]) groups[action.category] = [];
      groups[action.category].push(action);
    });
    return groups;
  }, [filteredActions]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
              <Command className="h-7 w-7 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
              <p className="text-sm text-muted-foreground">Quick access to every action and tool in ARG Builder</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search actions, tools, and settings... (e.g., 'AI', 'users', 'billing')"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base"
            autoFocus
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">⌘K</kbd>
        </div>

        {/* Results */}
        {Object.keys(groupedActions).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No actions match "{searchQuery}"</p>
          </div>
        ) : (
          Object.entries(groupedActions).map(([category, actions]) => (
            <div key={category} className="mb-6">
              <h2 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${categoryColors[category as keyof typeof categoryColors]}`}>
                {categoryLabels[category as keyof typeof categoryLabels]}
                <Badge variant="outline" className="text-xs">{actions.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {actions.map(action => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.id} href={action.path}>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                        <div className="p-2 rounded-md bg-muted shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{action.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{action.description}</div>
                        </div>
                        {action.shortcut && (
                          <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">{action.shortcut}</kbd>
                        )}
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
