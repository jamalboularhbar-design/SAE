import { Link } from 'wouter';
import { Crown, ArrowRight, Users } from 'lucide-react';
import { BOOTSTRAP_PRICING } from '@shared/pricing';
import { Button } from '@/components/ui/button';

type FoundingUrgencyBarProps = {
  variant?: 'banner' | 'card';
  className?: string;
};

/** Founding member urgency — seat cap + price lock messaging */
export default function FoundingUrgencyBar({ variant = 'banner', className = '' }: FoundingUrgencyBarProps) {
  const { founding } = BOOTSTRAP_PRICING;

  if (variant === 'card') {
    return (
      <div className={`rounded-xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-purple-500/5 p-6 ${className}`}>
        <div className="flex items-start gap-3">
          <Crown className="w-6 h-6 text-teal-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">Founding Member — ${founding.annualUsd}/year</p>
            <p className="text-sm text-muted-foreground mt-1">
              Price locked forever · {founding.seatCap} seats in the founding cohort · direct founder access
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="/pricing">
                <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black gap-1.5">
                  View pricing <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href="/request-demo">
                <Button size="sm" variant="outline" className="border-border">
                  Book a demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-teal-500/25 bg-teal-500/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3 text-sm">
        <Users className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          <strong className="text-foreground">Founding cohort</strong>
          <span className="text-muted-foreground">
            {' '}— ${founding.annualUsd}/yr locked · limited to {founding.seatCap} seats · saves 38% vs monthly
          </span>
        </span>
      </div>
      <Link href="/pricing">
        <Button size="sm" variant="outline" className="border-teal-500/40 text-teal-800 dark:text-teal-200 shrink-0 gap-1">
          Claim founding pricing <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  );
}
