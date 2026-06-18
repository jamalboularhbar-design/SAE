import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  target: string | null; // CSS selector for the target element
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to the ARG Builder!',
    description: 'This is your comprehensive operational guide for Riad & Routes. Let us show you around the key features.',
    target: null,
  },
  {
    title: 'Dual Persona System',
    description: 'Switch between the Travel Concierge and Design Studio personas using these tabs. Each persona has its own set of operational processes.',
    target: '[data-tour="personas"]',
  },
  {
    title: 'Search & Command Palette',
    description: 'Use the search bar to find any document instantly. Press Ctrl+K to open the command palette for quick navigation.',
    target: '[data-tour="search"]',
  },
  {
    title: 'Document Library',
    description: 'Browse all operational documents organized by category. Filter, sort, and explore at your own pace.',
    target: '[data-tour="library"]',
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Press ? at any time to see all available keyboard shortcuts. Use G+H to go home, G+G for glossary, and more.',
    target: null,
  },
  {
    title: "You're All Set!",
    description: 'Explore the guide at your own pace. Bookmark documents, add notes, and track your reading progress. Happy exploring!',
    target: null,
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
    // Scroll element into view
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [step]);

  useEffect(() => {
    if (visible) {
      // Small delay to let DOM settle
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

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop with cutout for highlighted element */}
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
          <rect
            x="0" y="0" width="100%" height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#tour-mask)"
          />
        </svg>
      </div>

      {/* Highlight ring around target */}
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

      {/* Tooltip card - positioned near target or centered */}
      <div
        className="absolute bg-card border border-border rounded-xl shadow-2xl max-w-sm w-full p-5"
        style={hasTarget ? {
          top: tooltipPos.top + tooltipPos.height + 24,
          left: Math.max(16, Math.min(tooltipPos.left, window.innerWidth - 400)),
        } : {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <button
          onClick={handleComplete}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1.5">{currentStep.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{currentStep.description}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-1 mb-4">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${i === step ? 'w-5 bg-accent' : 'w-1.5 bg-border'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrev}
            disabled={step === 0}
            className="text-muted-foreground h-8 text-xs"
          >
            <ChevronLeft className="w-3 h-3 mr-0.5" /> Back
          </Button>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleComplete} className="text-muted-foreground h-8 text-xs">
              Skip
            </Button>
            <Button size="sm" onClick={handleNext} className="h-8 text-xs">
              {step >= TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'} <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
