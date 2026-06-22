import { useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import {
  Zap, Plus, Users, Download, FileText, BarChart3, Share2,
  Settings, Bell, ChevronUp, ChevronDown, X
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

const ACTION_STYLES = {
  teal: 'bg-teal-500/15 text-teal-900 dark:bg-teal-500/20 dark:text-teal-300 hover:bg-teal-500/25 dark:hover:bg-teal-500/30',
  blue: 'bg-blue-500/15 text-blue-900 dark:bg-blue-500/20 dark:text-blue-300 hover:bg-blue-500/25 dark:hover:bg-blue-500/30',
  green: 'bg-green-500/15 text-green-900 dark:bg-green-500/20 dark:text-green-300 hover:bg-green-500/25 dark:hover:bg-green-500/30',
  purple: 'bg-purple-500/15 text-purple-900 dark:bg-purple-500/20 dark:text-purple-300 hover:bg-purple-500/25 dark:hover:bg-purple-500/30',
  orange: 'bg-orange-500/15 text-orange-900 dark:bg-orange-500/20 dark:text-orange-300 hover:bg-orange-500/25 dark:hover:bg-orange-500/30',
  yellow: 'bg-amber-500/15 text-amber-900 dark:bg-yellow-500/20 dark:text-yellow-300 hover:bg-amber-500/25 dark:hover:bg-yellow-500/30',
  indigo: 'bg-indigo-500/15 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-300 hover:bg-indigo-500/25 dark:hover:bg-indigo-500/30',
  gray: 'bg-muted text-foreground dark:bg-gray-500/20 dark:text-gray-300 hover:bg-muted/80 dark:hover:bg-gray-500/30',
} as const;

export default function AdminQuickActionToolbar() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!user || user.role !== 'admin') return null;

  const actions: QuickAction[] = [
    {
      id: 'new-doc',
      label: 'New Document',
      icon: <Plus className="w-4 h-4" />,
      action: () => navigate('/admin/editor'),
      color: ACTION_STYLES.teal,
    },
    {
      id: 'view-leads',
      label: 'View Leads',
      icon: <Users className="w-4 h-4" />,
      action: () => navigate('/admin/leads'),
      color: ACTION_STYLES.blue,
    },
    {
      id: 'export-csv',
      label: 'Export Leads CSV',
      icon: <Download className="w-4 h-4" />,
      action: () => {
        fetch('/api/trpc/leads.exportCsv', { credentials: 'include' })
          .then(res => res.json())
          .then((data: any) => {
            const csv = data?.result?.data?.json?.csv;
            if (!csv) { toast.error('Export failed'); return; }
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Leads exported');
          })
          .catch(() => toast.error('Export failed'));
      },
      color: ACTION_STYLES.green,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => navigate('/admin/dashboard'),
      color: ACTION_STYLES.purple,
    },
    {
      id: 'knowledge-graph',
      label: 'Knowledge Graph',
      icon: <Share2 className="w-4 h-4" />,
      action: () => navigate('/admin/knowledge-graph'),
      color: ACTION_STYLES.orange,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: <Bell className="w-4 h-4" />,
      action: () => navigate('/admin/announcements'),
      color: ACTION_STYLES.yellow,
    },
    {
      id: 'documents',
      label: 'All Documents',
      icon: <FileText className="w-4 h-4" />,
      action: () => navigate('/docs'),
      color: ACTION_STYLES.indigo,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => navigate('/admin/settings'),
      color: ACTION_STYLES.gray,
    },
  ];

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-accent text-primary-foreground flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors"
        title="Show Quick Actions"
      >
        <Zap className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isExpanded && (
        <div className="flex flex-col gap-2 mb-2 animate-in slide-in-from-bottom-2 duration-200">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg border border-border dark:border-white/10 ${action.color}`}
              title={action.label}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsVisible(false)}
          className="w-8 h-8 rounded-full bg-card border border-border text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors"
          title="Hide toolbar"
        >
          <X className="w-3 h-3" />
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-primary-foreground shadow-lg hover:bg-accent/90 transition-all"
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Quick Actions</span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
