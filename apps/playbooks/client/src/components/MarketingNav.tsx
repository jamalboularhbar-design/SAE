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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link href={backHref} className="flex items-center gap-3">
              <LogoMark />
              <span className="text-xl font-bold tracking-tight">{title ?? BRAND.parentName}</span>
            </Link>
          ) : (
            <>
              <LogoMark />
              <span className="text-xl font-bold tracking-tight">{title ?? BRAND.parentName}</span>
              {subtitle && (
                <span className="hidden sm:inline text-xs text-muted-foreground font-normal">{subtitle}</span>
              )}
            </>
          )}
        </div>

        {showProductLinks && (
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#why" className="hover:text-foreground transition-colors">Why</a>
            <a href="#library" className="hover:text-foreground transition-colors">Library</a>
            <a href="#intelligence" className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-purple-700 dark:text-purple-400/90">Intelligence</a>
            <a href="#platform" className="hover:text-foreground transition-colors">Platform</a>
            <a href="#compare" className="hover:text-foreground transition-colors">Compare</a>
            <Link href="/product/templates" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors text-teal-700 dark:text-teal-400/90">Templates</Link>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
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
                <Button size="sm" variant="outline" className="hidden sm:flex border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 gap-1.5">
                  <Brain className="w-4 h-4" /> Intelligence
                </Button>
              </Link>
              <a href="/os/">
                <Button size="sm" variant="outline" className="hidden sm:flex border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 gap-1.5">
                  <Sparkles className="w-4 h-4" /> Nexus OS
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
                <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold">
                  Go to App <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : showProductLinks ? (
              <>
                <Link href="/start-trial?plan=professional&utm_source=product&utm_medium=nav">
                  <Button size="sm" variant="outline" className="hidden sm:flex border-border text-foreground hover:bg-muted/50">
                    Free trial
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold">
                    Become a Founding Member
                  </Button>
                </a>
              </>
            ) : null
          )}
        </div>
      </div>
    </nav>
  );
}
