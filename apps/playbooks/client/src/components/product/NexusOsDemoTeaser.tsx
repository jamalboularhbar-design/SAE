import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Play, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';

const DEMO_FLOWS = [
  {
    id: 'shift-briefing',
    label: 'Prepare shift briefing',
    query: 'Prepare a shift briefing for 5 new production operators — checklist, owners, and approval step.',
    steps: [
      { agent: 'Ops Researcher', action: 'Retrieved 3 playbooks: Operator Onboarding, Shift Handover, Safety Checklist' },
      { agent: 'Briefing Writer', action: 'Drafted 1-page briefing with owners and due times' },
      { agent: 'Approval Gate', action: 'Routed to team lead — ready for Slack + Notion publish' },
    ],
  },
  {
    id: 'supplier-compliance',
    label: 'Supplier compliance',
    query: 'Summarize Morocco cross-border supplier onboarding checklists and flag missing compliance docs.',
    steps: [
      { agent: 'Compliance Scanner', action: 'Matched 4 docs: Vendor Intake, Cross-Border SLA, KYC Checklist' },
      { agent: 'Gap Analyst', action: '2 gaps flagged — insurance cert and local tax registration' },
      { agent: 'Action Planner', action: 'Created follow-up tasks with owners in Notion template' },
    ],
  },
] as const;

type Phase = 'idle' | 'running' | 'done';

export default function NexusOsDemoTeaser() {
  const [activeFlow, setActiveFlow] = useState<(typeof DEMO_FLOWS)[number] | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stepIndex, setStepIndex] = useState(0);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runFlow = useCallback((flow: (typeof DEMO_FLOWS)[number]) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setActiveFlow(flow);
    setPhase('running');
    setStepIndex(0);

    flow.steps.forEach((_, i) => {
      timersRef.current.push(
        setTimeout(() => setStepIndex(i), 600 + i * 900)
      );
    });
    timersRef.current.push(
      setTimeout(() => setPhase('done'), 600 + flow.steps.length * 900 + 400)
    );
  }, []);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const flow = activeFlow ?? DEMO_FLOWS[0];

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-card to-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Hexagon className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{BRAND.nexusOsName} — live preview</p>
          <p className="text-xs text-muted-foreground">Read-only demo · Ask once → multi-agent execution</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="rounded-lg bg-background/80 border border-border font-mono text-xs p-3 min-h-[3rem] flex items-center">
          <span className="text-indigo-400 mr-2">›</span>
          <span className="text-foreground/90">{flow.query}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {DEMO_FLOWS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => runFlow(f)}
              disabled={phase === 'running'}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeFlow?.id === f.id
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300'
                  : 'border-border text-muted-foreground hover:border-indigo-500/30 hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 min-h-[140px]">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Execution trace</p>
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                Pick an example flow above — watch playbook retrieval and agent handoffs simulate in real time.
              </motion.p>
            )}
            {(phase === 'running' || phase === 'done') && (
              <motion.ul
                key="steps"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {flow.steps.map((step, i) => {
                  const visible = phase === 'done' || i <= stepIndex;
                  if (!visible) return null;
                  const isActive = phase === 'running' && i === stepIndex;
                  return (
                    <motion.li
                      key={step.agent}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2 text-xs"
                    >
                      {isActive ? (
                        <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold text-indigo-300">{step.agent}</span>
                        <span className="text-muted-foreground"> — {step.action}</span>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400" />
          Ask once → executes across Slack, Notion, Gmail (with approval gates)
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <a href={`${BRAND.nexusOsPath}/`}>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5">
              Try it now <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </a>
          <Button
            size="sm"
            variant="outline"
            className="border-border gap-1.5"
            onClick={() => runFlow(activeFlow ?? DEMO_FLOWS[0])}
            disabled={phase === 'running'}
          >
            <Play className="w-3.5 h-3.5" /> Replay demo
          </Button>
        </div>
      </div>
    </div>
  );
}
