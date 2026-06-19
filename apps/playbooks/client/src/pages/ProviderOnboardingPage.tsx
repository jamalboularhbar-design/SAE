import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Circle, ClipboardList, FileText, Camera, Handshake, Users, Star } from 'lucide-react';

interface OnboardingStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  responsible: 'concierge' | 'provider' | 'both';
  deliverables: string[];
  timeline: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'ob1', phase: 'Discovery', title: 'Initial Property Assessment', description: 'Visit property, assess quality standards, room categories, and unique selling points', responsible: 'concierge', deliverables: ['Property assessment report', 'Photo documentation', 'Room inventory'], timeline: 'Day 1-3' },
  { id: 'ob2', phase: 'Discovery', title: 'Management Meeting', description: 'Meet property management to discuss partnership terms, expectations, and communication protocols', responsible: 'both', deliverables: ['Meeting notes', 'Preliminary terms sheet', 'Key contact list'], timeline: 'Day 3-5' },
  { id: 'ob3', phase: 'Agreement', title: 'Contract Negotiation', description: 'Finalize commission rates, payment terms, cancellation policies, and SLA expectations', responsible: 'both', deliverables: ['Signed partnership agreement', 'Commission schedule', 'SLA document'], timeline: 'Day 5-10' },
  { id: 'ob4', phase: 'Agreement', title: 'Rate Card Setup', description: 'Establish seasonal pricing, room categories, and special package rates', responsible: 'provider', deliverables: ['Complete rate card', 'Seasonal calendar', 'Package descriptions'], timeline: 'Day 7-12' },
  { id: 'ob5', phase: 'Setup', title: 'Property Photography', description: 'Professional photography of rooms, common areas, and unique features for marketing', responsible: 'concierge', deliverables: ['High-res photo library', 'Virtual tour (if applicable)', 'Marketing descriptions'], timeline: 'Day 10-15' },
  { id: 'ob6', phase: 'Setup', title: 'Staff Introduction & Training', description: 'Introduce concierge team to property staff, establish communication channels and protocols', responsible: 'both', deliverables: ['Staff contact directory', 'WhatsApp group setup', 'Emergency protocol agreement'], timeline: 'Day 12-15' },
  { id: 'ob7', phase: 'Setup', title: 'Systems Integration', description: 'Connect booking systems, set up availability calendar sync, configure notification preferences', responsible: 'both', deliverables: ['Calendar sync active', 'Booking confirmation workflow', 'Notification preferences set'], timeline: 'Day 15-18' },
  { id: 'ob8', phase: 'Launch', title: 'Test Booking', description: 'Run a complete test booking cycle to verify all processes work end-to-end', responsible: 'concierge', deliverables: ['Test booking report', 'Process verification checklist', 'Issue log (if any)'], timeline: 'Day 18-20' },
  { id: 'ob9', phase: 'Launch', title: 'Marketing Activation', description: 'Add property to website, update portfolio materials, brief sales team', responsible: 'concierge', deliverables: ['Website listing live', 'Portfolio updated', 'Sales team briefed'], timeline: 'Day 20-25' },
  { id: 'ob10', phase: 'Launch', title: 'First Guest Placement', description: 'Place first guest with enhanced monitoring and immediate feedback collection', responsible: 'both', deliverables: ['Guest feedback report', 'Provider performance notes', 'Process refinement list'], timeline: 'Day 25-30' },
  { id: 'ob11', phase: 'Review', title: '30-Day Review', description: 'Formal review of first month performance, guest feedback, and process adjustments', responsible: 'both', deliverables: ['Performance review document', 'Adjustment plan', 'Tier confirmation'], timeline: 'Day 30' },
  { id: 'ob12', phase: 'Review', title: '90-Day Tier Assessment', description: 'Comprehensive quality audit and tier assignment based on performance data', responsible: 'concierge', deliverables: ['Quality audit report', 'Final tier assignment', 'Annual review schedule'], timeline: 'Day 90' },
];

const PHASE_COLORS: Record<string, string> = {
  Discovery: 'bg-blue-100 text-blue-800',
  Agreement: 'bg-purple-100 text-purple-800',
  Setup: 'bg-amber-100 text-amber-800',
  Launch: 'bg-green-100 text-green-800',
  Review: 'bg-slate-100 text-slate-800',
};

const RESPONSIBLE_LABELS: Record<string, string> = {
  concierge: 'Riad & Routes',
  provider: 'Provider',
  both: 'Joint',
};

export default function ProviderOnboardingPage() {
  const [, navigate] = useLocation();
  const [activePhase, setActivePhase] = useState<string>('all');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const phases = Array.from(new Set(ONBOARDING_STEPS.map(s => s.phase)));

  const filtered = activePhase === 'all' ? ONBOARDING_STEPS : ONBOARDING_STEPS.filter(s => s.phase === activePhase);

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = Math.round((completedSteps.size / ONBOARDING_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/60 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-6 h-6 text-indigo-600" /> Provider Onboarding Checklist
            </h1>
            <p className="text-slate-500 text-sm">Step-by-step process for onboarding new accommodation partners</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{progress}%</p>
            <p className="text-xs text-slate-500">{completedSteps.size}/{ONBOARDING_STEPS.length} steps</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
          <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setActivePhase('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activePhase === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            All Phases
          </button>
          {phases.map(phase => (
            <button key={phase} onClick={() => setActivePhase(phase)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activePhase === phase ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              {phase}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {filtered.map((step, idx) => {
            const isComplete = completedSteps.has(step.id);
            return (
              <Card key={step.id} className={`transition ${isComplete ? 'opacity-70 bg-green-50/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleStep(step.id)} className="mt-0.5">
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={`font-medium ${isComplete ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {step.title}
                        </h3>
                        <Badge className={PHASE_COLORS[step.phase] || 'bg-gray-100'}>{step.phase}</Badge>
                        <Badge variant="outline" className="text-xs">{RESPONSIBLE_LABELS[step.responsible]}</Badge>
                        <span className="text-xs text-slate-400 ml-auto">{step.timeline}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{step.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.deliverables.map((d, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            <FileText className="w-3 h-3" /> {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
