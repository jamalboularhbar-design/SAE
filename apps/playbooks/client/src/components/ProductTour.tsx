import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: string;
  highlight?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to NexusAI Playbooks',
    description: 'Your enterprise knowledge management platform. Let us show you around in 60 seconds.',
    icon: '👋',
  },
  {
    title: 'Multi-Brand Workspaces',
    description: 'Switch between Horizon Concierge and Meridian Creative workspaces — each with specialized playbooks and workflows.',
    icon: '🎭',
  },
  {
    title: 'AI-Powered Search',
    description: 'Find any document instantly with semantic search. Ask questions in natural language and get precise answers.',
    icon: '🔍',
  },
  {
    title: 'Knowledge Graph',
    description: 'Visualize relationships between documents, categories, and team members. See how knowledge connects.',
    icon: '🕸️',
  },
  {
    title: 'Reading Progress & Quizzes',
    description: 'Track team engagement with reading progress, comprehension quizzes, and completion certificates.',
    icon: '📊',
  },
  {
    title: 'Team Collaboration',
    description: 'Invite team members with role-based access. Editors create content, viewers consume it, admins manage everything.',
    icon: '👥',
  },
  {
    title: 'Ready to Start?',
    description: 'Start your 14-day free trial with full access to all features. No credit card required.',
    icon: '🚀',
  },
];

const TOUR_STORAGE_KEY = 'arg_tour_completed';

export default function ProductTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTrigger, setShowTrigger] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      // Show tour trigger after 3 seconds for new visitors
      const timer = setTimeout(() => setShowTrigger(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setIsOpen(true);
    setShowTrigger(false);
    setCurrentStep(0);
  };

  const closeTour = () => {
    setIsOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      closeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen && !showTrigger) return null;

  // Floating trigger button
  if (!isOpen && showTrigger) {
    return (
      <div className="fixed bottom-24 left-6 z-50 animate-bounce">
        <Button
          onClick={startTour}
          className="rounded-full shadow-lg gap-2 px-4 py-2"
          size="sm"
        >
          <Sparkles className="w-4 h-4" />
          Take a Tour
        </Button>
      </div>
    );
  }

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeTour} />

      {/* Tour Card */}
      <div className="relative w-full max-w-md mx-4 bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={closeTour}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">{step.icon}</div>
          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 pb-6">
          <div className="flex items-center gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep ? 'bg-primary w-4' : i < currentStep ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" onClick={nextStep} className="gap-1">
              {currentStep === TOUR_STEPS.length - 1 ? (
                'Start Free Trial'
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Skip link */}
        <div className="text-center pb-4">
          <button
            onClick={closeTour}
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
