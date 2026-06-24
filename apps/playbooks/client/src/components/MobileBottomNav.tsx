import { useLocation } from 'wouter';
import { Home, Search, Library, Brain, Hexagon } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const navItems = [
  { label: 'Home', icon: Home, path: '/', match: (loc: string) => loc === '/' },
  { label: 'Search', icon: Search, path: '/search', match: (loc: string) => loc.startsWith('/search') },
  { label: 'Docs', icon: Library, path: '/toc', match: (loc: string) => loc.startsWith('/toc') || loc.startsWith('/docs') },
  { label: 'AI', icon: Brain, path: '/ai', match: (loc: string) => loc.startsWith('/ai') },
  { label: 'OS', icon: Hexagon, path: `${BRAND.nexusOsPath}/`, external: true, match: () => false },
];

export default function MobileBottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-t border-border sm:hidden no-print pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.match(location);
          const baseClass = 'flex flex-col items-center justify-center gap-0.5 min-w-[3.5rem] py-1.5 rounded-lg transition-colors';
          const activeClass = isActive
            ? 'text-accent font-semibold'
            : 'text-foreground/55 hover:text-foreground/80';

          if ('external' in item && item.external) {
            return (
              <a
                key={item.label}
                href={item.path}
                className={`${baseClass} ${activeClass}`}
                aria-label={BRAND.nexusOsName}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 2} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </a>
            );
          }
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`${baseClass} ${activeClass}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 2} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
