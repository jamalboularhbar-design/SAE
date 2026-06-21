import { useLocation } from 'wouter';
import { Home, Search, Bookmark, Clock } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Search', icon: Search, path: '/search' },
  { label: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
  { label: 'History', icon: Clock, path: '/reading-history' },
];

export default function MobileBottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 sm:hidden no-print" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-14">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive ? 'text-accent' : 'text-muted-foreground'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
