import { Link } from 'wouter';
import { ArrowRight, Brain, Sparkles, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { BRAND } from '@/lib/brand';
import LogoMark from '@/components/LogoMark';

type MarketingNavProps = {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  showProductLinks?: boolean;
  primaryCta?: React.ReactNode;
};

const PRODUCT_LINKS = [
  { href: '#why', label: 'Why' },
  { href: '#library', label: 'Library' },
  { href: '#intelligence', label: 'Intelligence', accent: 'purple' as const },
  { href: '#platform', label: 'Platform' },
  { href: '#compare', label: 'Compare' },
  { href: '/product/templates', label: 'Templates', accent: 'teal' as const, isRoute: true },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

function NavLink({
  href,
  label,
  accent,
  isRoute,
}: {
  href: string;
  label: string;
  accent?: 'purple' | 'teal';
  isRoute?: boolean;
}) {
  const className = [
    'whitespace-nowrap hover:text-foreground transition-colors',
    accent === 'purple'
      ? 'text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300'
      : accent === 'teal'
        ? 'text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300'
        : 'text-muted-foreground',
  ].join(' ');

  if (isRoute) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

export default function MarketingNav({
  title,
  subtitle,
  backHref,
  backLabel,
  showProductLinks = true,
  primaryCta,
}: MarketingNavProps) {
  const { user } = useAuth({ redirectOnUnauthenticated: false });
  const { theme, toggleTheme, switchable } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center gap-4 lg:gap-6">
          {/* Brand — logo must not shrink (min-w-0 only on text) */}
          <div className="flex items-center gap-3 shrink-0">
            {backHref ? (
              <Link href={backHref} className="flex items-center gap-3 min-w-0">
                <LogoMark size="nav" />
                <span className="text-lg sm:text-xl font-bold tracking-tight truncate">
                  {title ?? BRAND.parentName}
                </span>
              </Link>
            ) : (
              <>
                <LogoMark size="nav" />
                <div className="min-w-0 leading-tight">
                  <span className="block text-lg sm:text-xl font-bold tracking-tight truncate">
                    {title ?? BRAND.parentName}
                  </span>
                  {subtitle && (
                    <span className="block text-[11px] text-muted-foreground font-normal truncate">
                      {subtitle}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Section links — centered, only when there is room */}
          {showProductLinks && (
            <div className="hidden xl:flex flex-1 items-center justify-center gap-x-5 2xl:gap-x-7 text-sm min-w-0">
              {PRODUCT_LINKS.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
            {switchable && toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {showProductLinks && (
              <>
                <Link href="/ai">
                  <Button
                    size="sm"
                    variant="outline"
                    className="hidden lg:flex border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 gap-1.5 px-2.5"
                  >
                    <Brain className="w-4 h-4 shrink-0" />
                    <span className="hidden xl:inline">Intelligence</span>
                  </Button>
                </Link>
                <a href="/os/">
                  <Button
                    size="sm"
                    variant="outline"
                    className="hidden lg:flex border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 gap-1.5 px-2.5"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span className="hidden xl:inline">Nexus OS</span>
                  </Button>
                </a>
              </>
            )}

            {backHref && backLabel && (
              <Link href={backHref}>
                <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-muted/50">
                  {backLabel}
                </Button>
              </Link>
            )}

            {primaryCta ?? (
              user ? (
                <Link href="/">
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold whitespace-nowrap">
                    <span className="hidden sm:inline">Go to App</span>
                    <span className="sm:hidden">App</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : showProductLinks ? (
                <>
                  <Link href="/start-trial?plan=professional&utm_source=product&utm_medium=nav">
                    <Button
                      size="sm"
                      variant="outline"
                      className="hidden xl:flex border-border text-foreground hover:bg-muted/50 whitespace-nowrap"
                    >
                      Free trial
                    </Button>
                  </Link>
                  <a href="#pricing">
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold whitespace-nowrap">
                      <span className="hidden lg:inline">Become a Founding Member</span>
                      <span className="lg:hidden">Join</span>
                    </Button>
                  </a>
                </>
              ) : null
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
