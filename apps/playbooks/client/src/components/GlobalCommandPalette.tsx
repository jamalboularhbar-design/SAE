import { useState, useEffect, useCallback } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import {
  FileText, Search, Brain, MessageSquare, Sparkles, Target, Tags, Mic,
  Workflow, BarChart3, Settings, Users, Shield, Globe, Zap, Home,
  BookOpen, Layout, Activity, Bell, Key, Terminal, Clock, Download,
  PenTool, FolderOpen, Star, TrendingUp
} from 'lucide-react';

interface CommandEntry {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords?: string[];
}

export default function GlobalCommandPalette() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  const go = useCallback((path: string) => {
    navigate(path);
    setOpen(false);
  }, [navigate]);

  const commands: CommandEntry[] = [
    // Navigation
    { id: 'home', title: 'Go to Home', description: 'Main landing page', icon: <Home className="w-4 h-4" />, action: () => go('/'), category: 'Navigation', keywords: ['dashboard', 'main'] },
    { id: 'docs', title: 'Document Library', description: 'Browse all documents', icon: <BookOpen className="w-4 h-4" />, action: () => go('/toc'), category: 'Navigation', keywords: ['library', 'browse'] },
    { id: 'portal', title: 'Client Portal', description: 'Client-facing project view', icon: <Globe className="w-4 h-4" />, action: () => go('/portal'), category: 'Navigation', keywords: ['client', 'external'] },
    { id: 'team', title: 'Team Workspace', description: 'Collaboration and tasks', icon: <Users className="w-4 h-4" />, action: () => go('/team'), category: 'Navigation', keywords: ['collaborate', 'tasks'] },

    // AI Tools
    { id: 'ai-hub', title: 'AI Services Hub', description: 'All AI tools in one place', icon: <Brain className="w-4 h-4" />, action: () => go('/ai'), category: 'AI Tools', keywords: ['artificial intelligence', 'ml'] },
    { id: 'ai-chat', title: 'AI Chat Assistant', description: 'Conversational AI helper', icon: <MessageSquare className="w-4 h-4" />, action: () => go('/ai/chat'), category: 'AI Tools', keywords: ['chatbot', 'ask'] },
    { id: 'ai-summarize', title: 'AI Summarizer', description: 'Summarize documents with AI', icon: <Sparkles className="w-4 h-4" />, action: () => go('/ai/summarize'), category: 'AI Tools', keywords: ['tldr', 'summary'] },
    { id: 'ai-writer', title: 'AI Writer', description: 'Draft, rewrite, expand content', icon: <PenTool className="w-4 h-4" />, action: () => go('/ai/writer'), category: 'AI Tools', keywords: ['write', 'generate', 'draft'] },
    { id: 'ai-search', title: 'AI Semantic Search', description: 'Natural language document search', icon: <Search className="w-4 h-4" />, action: () => go('/ai/search'), category: 'AI Tools', keywords: ['find', 'query'] },
    { id: 'ai-leads', title: 'AI Lead Scoring', description: 'Predict conversion probability', icon: <Target className="w-4 h-4" />, action: () => go('/ai/lead-scoring'), category: 'AI Tools', keywords: ['sales', 'predict'] },
    { id: 'ai-tags', title: 'AI Auto-Tag', description: 'Automated content classification', icon: <Tags className="w-4 h-4" />, action: () => go('/ai/auto-tag'), category: 'AI Tools', keywords: ['classify', 'categorize'] },
    { id: 'ai-meeting', title: 'AI Meeting Notes', description: 'Extract action items from transcripts', icon: <Mic className="w-4 h-4" />, action: () => go('/ai/meeting-notes'), category: 'AI Tools', keywords: ['transcript', 'actions'] },
    { id: 'ai-workflow', title: 'AI Workflow Builder', description: 'Generate automations from English', icon: <Workflow className="w-4 h-4" />, action: () => go('/ai/workflows'), category: 'AI Tools', keywords: ['automate', 'trigger'] },
    { id: 'ai-sentiment', title: 'AI Sentiment Analysis', description: 'Analyze feedback sentiment', icon: <BarChart3 className="w-4 h-4" />, action: () => go('/ai/sentiment'), category: 'AI Tools', keywords: ['feedback', 'mood'] },
    { id: 'ai-templates', title: 'AI Template Generator', description: 'Generate document templates', icon: <FileText className="w-4 h-4" />, action: () => go('/ai/templates'), category: 'AI Tools', keywords: ['template', 'scaffold'] },
    { id: 'ai-recommend', title: 'AI Recommendations', description: 'Smart content suggestions', icon: <Star className="w-4 h-4" />, action: () => go('/ai/recommendations'), category: 'AI Tools', keywords: ['suggest', 'related'] },

    // Admin
    { id: 'admin-command', title: 'Admin Command Center', description: 'Unified quick actions', icon: <Terminal className="w-4 h-4" />, action: () => go('/admin/command-center'), category: 'Admin', keywords: ['actions', 'manage'] },
    { id: 'admin-kpi', title: 'Admin KPI Dashboard', description: 'Live performance metrics', icon: <Activity className="w-4 h-4" />, action: () => go('/admin/kpi'), category: 'Admin', keywords: ['metrics', 'stats'] },
    { id: 'admin-health', title: 'System Health Monitor', description: 'DB, API, storage status', icon: <Zap className="w-4 h-4" />, action: () => go('/admin/health'), category: 'Admin', keywords: ['status', 'uptime'] },
    { id: 'admin-users', title: 'User Management', description: 'Manage users and roles', icon: <Users className="w-4 h-4" />, action: () => go('/admin/users'), category: 'Admin', keywords: ['accounts', 'roles'] },
    { id: 'admin-permissions', title: 'Permissions Matrix', description: 'Role-based access control', icon: <Shield className="w-4 h-4" />, action: () => go('/admin/permissions'), category: 'Admin', keywords: ['rbac', 'access'] },
    { id: 'admin-wizard', title: 'Onboarding Wizard', description: 'Enterprise setup wizard', icon: <Layout className="w-4 h-4" />, action: () => go('/admin/onboarding-wizard'), category: 'Admin', keywords: ['setup', 'configure'] },
    { id: 'admin-growth', title: 'Growth Dashboard', description: 'Revenue and growth metrics', icon: <TrendingUp className="w-4 h-4" />, action: () => go('/admin/growth'), category: 'Admin', keywords: ['revenue', 'mrr'] },

    // Settings
    { id: 'settings-usage', title: 'Usage & Billing', description: 'API usage and cost tracking', icon: <Clock className="w-4 h-4" />, action: () => go('/settings/usage'), category: 'Settings', keywords: ['billing', 'cost'] },
    { id: 'settings-keys', title: 'API Keys', description: 'Manage API keys and scopes', icon: <Key className="w-4 h-4" />, action: () => go('/settings/api-keys'), category: 'Settings', keywords: ['tokens', 'auth'] },
    { id: 'settings-notifs', title: 'Notification Preferences', description: 'Configure alerts and digests', icon: <Bell className="w-4 h-4" />, action: () => go('/settings/notifications'), category: 'Settings', keywords: ['alerts', 'email'] },
    { id: 'settings-integrations', title: 'Integrations', description: 'Connect external services', icon: <FolderOpen className="w-4 h-4" />, action: () => go('/integrations'), category: 'Settings', keywords: ['connect', 'apps'] },
    { id: 'settings-admin', title: 'Admin Settings', description: 'Platform configuration', icon: <Settings className="w-4 h-4" />, action: () => go('/admin/settings'), category: 'Settings', keywords: ['config', 'preferences'] },

    // Quick Actions
    { id: 'export-center', title: 'Export Center', description: 'Bulk export documents and data', icon: <Download className="w-4 h-4" />, action: () => go('/exports'), category: 'Quick Actions', keywords: ['download', 'csv', 'pdf'] },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const groupedCommands = commands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandEntry[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group]]:p-1 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12">
          <CommandInput placeholder="Search pages, AI tools, admin actions..." />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No results found. Try a different search term.</CommandEmpty>
            {Object.entries(groupedCommands).map(([category, cmds]) => (
              <CommandGroup key={category} heading={category}>
                {cmds.map((cmd) => (
                  <CommandItem
                    key={cmd.id}
                    value={`${cmd.title} ${cmd.description} ${cmd.keywords?.join(' ') || ''}`}
                    onSelect={cmd.action}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="text-accent">{cmd.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{cmd.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{cmd.description}</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          <div className="border-t border-border px-3 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Navigate with ↑↓ • Select with Enter</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Esc</kbd> to close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
