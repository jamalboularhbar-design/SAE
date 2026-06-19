import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, Sparkles, Brain, Layers } from 'lucide-react';
import { Link } from 'wouter';
import { BRAND, DEMO_WORKSPACES } from '@/lib/brand';

interface TourStep {
  title: string;
  description: string;
  target: string | null;
  cta?: { label: string; href: string }[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: `Welcome to ${BRAND.productName}`,
    description: `${BRAND.parentName} helps multi-brand teams run on playbooks, not memory. You get demo workspaces for ${DEMO_WORKSPACES.travel.name} and ${DEMO_WORKSPACES.creative.name} — add your own brands as you scale.`,
    target: null,
  },
  {
    title: 'Multi-Brand Workspaces',
    description: 'Each workspace is a separate brand with its own playbooks, team directory, and operational tools. Switch tabs to explore different business models.',
    target: '[data-tour="workspaces"]',
  },
  {
    title: BRAND.aiHubTitle,
    description: `${BRAND.aiHubTagline}. Draft SOPs, search semantically, summarize docs, and build workflows — all from the Intelligence button in the header.`,
    target: '[data-tour="intelligence"]',
  },
  {
    title: 'Search & Command Palette',
    description: 'Find any playbook in seconds. Press Ctrl+K (⌘K on Mac) for the command palette — jump to docs, workspaces, or AI tools.',
    target: '[data-tour="search"]',
  },
  {
    title: 'Document Library',
    description: '525+ operational documents organized by function. Filter by category, track reading progress, and pin what your team uses daily.',
    target: '[data-tour="library"]',
  },
  {
    title: "You're ready to go",
    description: 'Explore the demo workspaces, try Intelligence at /ai, or start a free trial to import your own playbooks.',
    target: null,
    cta: [
      { label: 'Open Intelligence Hub', href: '/ai' },
      { label: 'Start free trial', href: '/start-trial?plan=professional&utm_source=onboarding&utm_medium=tour' },
      { label: 'Browse templates', href: '/product/templates' },
    ],
  },
];

const TOUR_KEY = 'onboarding_tour_completed';

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

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

  if (!visible) return null;

  const currentStep = TOUR_STEPS[step];
  const hasTarget = tooltipPos !== null;
  const isLast = step >= TOUR_STEPS.length - 1;

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
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          {step === 2 ? (
            <Brain className="w-4 h-4 text-purple-400" />
          ) : step === 1 ? (
            <Layers className="w-4 h-4 text-accent" />
          ) : (
            <Sparkles className="w-4 h-4 text-accent" />
          )}
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1.5">{currentStep.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{currentStep.description}</p>

        {currentStep.cta && (
          <div className="flex flex-col gap-2 mb-4">
            {currentStep.cta.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  size="sm"
                  variant={link.href.includes('start-trial') ? 'default' : 'outline'}
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
              {isLast ? 'Explore app' : 'Next'} <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
