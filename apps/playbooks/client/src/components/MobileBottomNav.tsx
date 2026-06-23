import { useLocation } from 'wouter';
import { Home, Search, Network, Brain, Hexagon } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const navItems = [
  { label: 'Home', icon: Home, path: '/', match: (loc: string) => loc === '/' },
  { label: 'Search', icon: Search, path: '/search', match: (loc: string) => loc.startsWith('/search') },
  { label: 'Graph', icon: Network, path: '/graph', match: (loc: string) => loc.startsWith('/graph') },
  { label: 'AI', icon: Brain, path: '/ai', match: (loc: string) => loc.startsWith('/ai') },
  { label: 'OS', icon: Hexagon, path: `${BRAND.nexusOsPath}/`, external: true, match: () => false },
];

export default function MobileBottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 sm:hidden no-print" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-14">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.match(location);
          if ('external' in item && item.external) {
            return (
              <a
                key={item.label}
                href={item.path}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-muted-foreground"
                aria-label={BRAND.nexusOsName}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            );
          }
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${
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
