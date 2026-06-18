import { Sparkles, List, BookOpen, FileText, Tag, Columns, Book, Target, Code, Bookmark, Sun, Moon, Clock, Library, Bell, Network, Trophy, Settings, FileDown, User, Brain } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import AdminNavDropdown from './AdminNavDropdown';
import { BRAND } from '@/lib/brand';

function NotificationBell({ navigate }: { navigate: (path: string) => void }) {
  const { isAuthenticated } = useAuth();
  const { data: unreadCount } = trpc.subscriptions.unreadCount.useQuery(undefined, { enabled: isAuthenticated, refetchInterval: 30000 });
  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
      title="Notifications"
    >
      <Bell className="w-4 h-4" />
      {typeof unreadCount === 'number' && unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

export default function Header() {
  const { theme, toggleTheme, switchable } = useTheme();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-border/50 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md sticky top-0 z-50" role="banner">
      <div className="container flex items-center justify-between py-3 sm:py-5">
        <div className="flex items-center gap-2.5 sm:gap-4" role="heading" aria-level={1}>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-accent via-accent/80 to-accent/60 flex items-center justify-center shadow-lg flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-lg sm:text-2xl font-bold text-foreground truncate">{BRAND.productName}</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground tracking-wide hidden sm:block">{BRAND.tagline}</p>
          </div>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          <button
            onClick={() => navigate('/ai')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-blue-500/30 transition-colors shrink-0"
            title={BRAND.aiHubTitle}
            aria-label={BRAND.aiHubTitle}
          >
            <Brain className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-medium hidden xs:inline sm:inline">Intelligence</span>
          </button>
          <button
            onClick={() => navigate('/toc')}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Table of Contents"
            aria-label="Table of Contents"
          >
            <List className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => navigate('/lists')}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Reading Lists"
            aria-label="Reading Lists"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => navigate('/templates')}
            className="hidden sm:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Document Templates"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/tags')}
            className="hidden sm:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Browse Tags"
          >
            <Tag className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/compare')}
            className="hidden sm:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Compare documents"
          >
            <Columns className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/glossary')}
            className="hidden sm:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Glossary"
          >
            <Book className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/reading-goals')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Reading Goals"
          >
            <Target className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/reading-history')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Reading History"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/api/docs')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="API Documentation"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/collections')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Collections"
          >
            <Library className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/graph')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Document Graph"
          >
            <Network className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Reading Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/preferences')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/bookmarks')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="My Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/export')}
            className="hidden lg:block p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
            title="Export Documents"
          >
            <FileDown className="w-4 h-4" />
          </button>
          <NotificationBell navigate={navigate} />
          {isAuthenticated && (
            <button
              onClick={() => navigate('/my-dashboard')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
              title="My Dashboard"
            >
              <User className="w-4 h-4" />
            </button>
          )}
          {user?.role === 'admin' && <AdminNavDropdown />}
          {switchable && toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50 transition-colors active:bg-card/60"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
