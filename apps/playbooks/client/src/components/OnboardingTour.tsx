import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, Sparkles, Network, BookOpen, Hexagon } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { BRAND } from '@/lib/brand';
import { useAuth } from '@/_core/hooks/useAuth';

interface TourStep {
  title: string;
  description: string;
  target: string | null;
  cta?: { label: string; href: string }[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: `Welcome to ${BRAND.productName}`,
    description: `${BRAND.tagline}. Your workspace is organized as Library → Graph → ${BRAND.aiHubName} → ${BRAND.nexusOsName}. This tour takes ~60 seconds.`,
    target: null,
  },
  {
    title: 'Product architecture',
    description: 'Four layers: structured playbooks, the knowledge graph, AI tools, and Nexus OS runtime. Click any card to jump in.',
    target: '[data-tour="architecture"]',
  },
  {
    title: 'Vertical demos',
    description: 'Live case studies and industry reference verticals. Riad & Routes is our Morocco proof deployment.',
    target: '[data-tour="vertical-demos"]',
  },
  {
    title: 'Document library',
    description: '570+ documents by business function. Filter, pin, and export — this is your primary work surface.',
    target: '[data-tour="library"]',
  },
  {
    title: BRAND.aiHubName,
    description: `${BRAND.aiHubTagline}. Use the Intelligence button anytime, or try example prompts at /ai.`,
    target: '[data-tour="intelligence"]',
  },
  {
    title: "You're ready",
    description: 'Explore the graph, run a Nexus OS request, or browse demo workspaces below the library.',
    target: null,
    cta: [
      { label: 'Open knowledge graph', href: '/graph' },
      { label: `Open ${BRAND.nexusOsName}`, href: `${BRAND.nexusOsPath}/` },
      { label: 'Browse case studies', href: '/case-studies' },
    ],
  },
];

const TOUR_KEY = 'onboarding_tour_completed_v2';

export default function OnboardingTour() {
  const { isAuthenticated } = useAuth({ redirectOnUnauthenticated: false });
  const [location] = useLocation();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || location !== '/') return;
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, location]);

  const positionTooltip = useCallback(() => {
    const currentStep = TOUR_STEPS[step];
    if (!currentStep.target) {
      setTooltipPos(null);
      return;
    }
    const el = document.querySelector(currentStep.target);
    if (!el) {
      setTooltipPos(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setTooltipPos({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    });
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [step]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(positionTooltip, 200);
      return () => clearTimeout(timer);
    }
  }, [visible, step, positionTooltip]);

  const handleComplete = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    setVisible(false);
  };

  const handleNext = () => {
    if (step >= TOUR_STEPS.length - 1) {
      handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!visible || !isAuthenticated || location !== '/') return null;

  const currentStep = TOUR_STEPS[step];
  const hasTarget = tooltipPos !== null;
  const isLast = step >= TOUR_STEPS.length - 1;

  const StepIcon = step === 4 ? Sparkles : step === 3 ? BookOpen : step === 2 ? Network : step === 1 ? Hexagon : Sparkles;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0" onClick={handleComplete}>
        <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <mask id="tour-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {hasTarget && (
                <rect
                  x={tooltipPos.left - 8}
                  y={tooltipPos.top - 8}
                  width={tooltipPos.width + 16}
                  height={tooltipPos.height + 16}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#tour-mask)" />
        </svg>
      </div>

      {hasTarget && (
        <div
          className="absolute border-2 border-accent rounded-lg pointer-events-none animate-pulse"
          style={{
            top: tooltipPos.top - 8,
            left: tooltipPos.left - 8,
            width: tooltipPos.width + 16,
            height: tooltipPos.height + 16,
          }}
        />
      )}

      <div
        className="absolute bg-card border border-border rounded-xl shadow-2xl max-w-sm w-full p-5"
        style={
          hasTarget
            ? {
                top: tooltipPos.top + tooltipPos.height + 24,
                left: Math.max(16, Math.min(tooltipPos.left, window.innerWidth - 400)),
              }
            : {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }
        }
      >
        <button
          onClick={handleComplete}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close tour"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <StepIcon className="w-4 h-4 text-accent" />
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1.5">{currentStep.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{currentStep.description}</p>

        {currentStep.cta && (
          <div className="flex flex-col gap-2 mb-4">
            {currentStep.cta.map((link) => (
              <Link key={link.href} href={link.href.startsWith('/os') ? '/product#demo' : link.href}>
                <Button
                  size="sm"
                  variant={link.href.includes('graph') ? 'default' : 'outline'}
                  className="w-full h-8 text-xs"
                  onClick={handleComplete}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 mb-4">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${i === step ? 'w-5 bg-accent' : 'w-1.5 bg-border'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button size="sm" variant="ghost" onClick={handlePrev} disabled={step === 0} className="text-muted-foreground h-8 text-xs">
            <ChevronLeft className="w-3 h-3 mr-0.5" /> Back
          </Button>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleComplete} className="text-muted-foreground h-8 text-xs">
              Skip
            </Button>
            <Button size="sm" onClick={handleNext} className="h-8 text-xs">
              {isLast ? 'Done' : 'Next'} <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
