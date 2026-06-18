import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Settings, ChevronDown, FileText, BarChart3, CheckCircle, Tags, 
  Globe, CalendarClock, Paintbrush, Webhook, Users, Archive, 
  Columns3, Clock, MessageSquare, GripVertical, Copy, Download,
  Shield, FileJson, Activity, FolderInput, Merge, Image, Calendar,
  BarChart2, LinkIcon, CalendarCheck, Tags as TagsIcon, HeartPulse,
  Workflow, FileSpreadsheet, Lightbulb, LayoutDashboard, Search, Bell,
  Building2, Code2, ArrowRightLeft, SmilePlus, Accessibility, FileBarChart,
  History, Link2, Trophy, Megaphone,
  Share2, TrendingUp, Scan
} from 'lucide-react';

const adminLinks = [
  { label: 'Document Editor', href: '/admin/editor', icon: FileText },
  { label: 'Analytics Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { label: 'Approval Queue', href: '/admin/approvals', icon: CheckCircle },
  { label: 'Kanban Board', href: '/admin/kanban', icon: Columns3 },
  { label: 'Audit Trail', href: '/admin/audit', icon: Clock },
  { label: 'Activity Log', href: '/admin/activity', icon: Clock },
  { label: 'Tags Manager', href: '/admin/tags', icon: Tags },
  { label: 'Categories', href: '/admin/categories', icon: Tags },
  { label: 'Category Order', href: '/admin/category-order', icon: GripVertical },
  { label: 'Announcements', href: '/admin/announcements', icon: Globe },
  { label: 'Scheduled Publish', href: '/admin/scheduled', icon: CalendarClock },
  { label: 'Branding', href: '/admin/branding', icon: Paintbrush },
  { label: 'Webhooks', href: '/admin/webhooks', icon: Webhook },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Visitor Analytics', href: '/admin/visitors', icon: BarChart3 },
  { label: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
  { label: 'Archive', href: '/admin/archive', icon: Archive },
  { label: 'Duplicate Doc', href: '/admin/duplicate', icon: Copy },
  { label: 'Bulk Export', href: '/admin/bulk-export', icon: Download },
  { label: 'Stale Docs', href: '/admin/stale', icon: Clock },
  { label: 'Import URL', href: '/admin/import-url', icon: Globe },
  { label: 'Visibility', href: '/admin/visibility', icon: Shield },
  { label: 'Import JSON', href: '/admin/import-json', icon: FileJson },
  { label: 'Reading Heatmap', href: '/admin/heatmap', icon: Activity },
  { label: 'Content Calendar', href: '/admin/calendar', icon: Calendar },
  { label: 'Bulk Move', href: '/admin/bulk-move', icon: FolderInput },
  { label: 'Merge Docs', href: '/admin/merge', icon: Merge },
  { label: 'Category Covers', href: '/admin/category-covers', icon: Image },
  { label: 'Word Count Stats', href: '/admin/word-count', icon: BarChart2 },
  { label: 'Broken Links', href: '/admin/broken-links', icon: LinkIcon },
  { label: 'Review Reminders', href: '/admin/review-reminders', icon: CalendarCheck },
  { label: 'Bulk Tags', href: '/admin/bulk-tags', icon: TagsIcon },
  { label: 'Content Health', href: '/admin/content-health', icon: HeartPulse },
  { label: 'Custom Workflows', href: '/admin/workflow', icon: Workflow },
  { label: 'Analytics Export', href: '/admin/analytics-export', icon: FileSpreadsheet },
  { label: 'Archival Policy', href: '/admin/archival', icon: Archive },
  { label: 'Content Gap Analysis', href: '/admin/content-gap', icon: Lightbulb },
  { label: 'Duplicate Detector', href: '/admin/duplicates', icon: Copy },
  { label: 'Unified Dashboard', href: '/admin/unified', icon: LayoutDashboard },
  { label: 'SEO Editor', href: '/admin/seo', icon: Search },
  { label: 'Notification Center', href: '/admin/notification-center', icon: Bell },
  { label: 'Role Delegation', href: '/admin/role-delegation', icon: Shield },
  { label: 'Approval SLA', href: '/admin/sla', icon: Clock },
  { label: 'Webhook Events', href: '/admin/webhook-events', icon: Webhook },
  { label: 'Access Requests', href: '/admin/access-requests', icon: Users },
  { label: 'Batch Summarize', href: '/admin/batch-summarize', icon: Lightbulb },
  { label: 'System Health', href: '/admin/system-health', icon: Activity },
  { label: 'Advanced Analytics', href: '/admin/advanced-analytics', icon: BarChart3 },
  { label: 'Period Comparison', href: '/admin/comparative-analytics', icon: BarChart2 },
  { label: 'Quality Audit', href: '/admin/quality-audit', icon: Shield },
  { label: 'Session Analytics', href: '/admin/session-analytics', icon: Clock },
  { label: 'Freshness Report', href: '/admin/freshness', icon: Activity },
  { label: 'Email Digest', href: '/admin/email-digest', icon: Bell },
  { label: 'Workspaces', href: '/admin/workspaces', icon: Building2 },
  { label: 'Review Scheduling', href: '/admin/review-scheduling', icon: CalendarClock },
  { label: 'API Playground', href: '/admin/api-playground', icon: Code2 },
  { label: 'Content Migration', href: '/admin/content-migration', icon: ArrowRightLeft },
  { label: 'Sentiment Dashboard', href: '/admin/sentiment', icon: SmilePlus },
  { label: 'Retention Policies', href: '/admin/retention', icon: Shield },
  { label: 'Accessibility Checker', href: '/admin/accessibility', icon: Accessibility },
  { label: 'Custom Reports', href: '/admin/custom-reports', icon: FileBarChart },
  { label: 'Compliance Reports', href: '/admin/compliance-reports', icon: Shield },
  { label: 'Change Log', href: '/admin/change-log', icon: History },
  { label: 'Cross-References', href: '/admin/cross-references', icon: Link2 },
  { label: 'Engagement Scorecards', href: '/admin/engagement-scorecards', icon: Trophy },
  { label: 'Announcement Scheduler', href: '/admin/announcement-scheduler', icon: Megaphone },
  { label: 'Widget Config', href: '/admin/widget-config', icon: LayoutDashboard },
  { label: 'Link Scanner', href: '/admin/broken-link-scanner', icon: Scan },
  { label: 'Duplicate Detector+', href: '/admin/duplicate-detector', icon: Copy },
  { label: 'Knowledge Graph', href: '/admin/knowledge-graph', icon: Share2 },
  { label: 'Benchmarks', href: '/admin/benchmarks', icon: TrendingUp },
  { label: 'Lead Management', href: '/admin/leads', icon: Users },
  { label: 'Account Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminNavDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
      >
        <Settings className="w-4 h-4" />
        Admin
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 max-h-[70vh] overflow-y-auto bg-popover text-popover-foreground border border-border rounded-lg shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <button
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
              >
                <link.icon className="w-4 h-4 text-muted-foreground" />
                {link.label}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
