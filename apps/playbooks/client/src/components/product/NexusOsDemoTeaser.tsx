import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Play, ArrowRight, CheckCircle2, Loader2, Brain } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { HUB_BUSINESSES } from '@shared/hubData';
import { HUB_DEMO_FLOWS, getBusinessById, HUB_SPECIALIST_COUNT } from '@shared/hubDemoFlows';

type Phase = 'idle' | 'running' | 'done';

type NexusOsDemoTeaserProps = {
  /** Pre-select a business workspace (riad | artkech | argbuilder | jb) */
  defaultBusinessId?: string;
};

export default function NexusOsDemoTeaser({ defaultBusinessId = 'argbuilder' }: NexusOsDemoTeaserProps) {
  const [businessId, setBusinessId] = useState(defaultBusinessId);
  const businessFlows = HUB_DEMO_FLOWS.filter((f) => f.businessId === businessId);
  const [activeFlowId, setActiveFlowId] = useState(businessFlows[0]?.id ?? HUB_DEMO_FLOWS[0].id);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activeFlow =
    HUB_DEMO_FLOWS.find((f) => f.id === activeFlowId) ??
    businessFlows[0] ??
    HUB_DEMO_FLOWS[0];
  const business = getBusinessById(businessId);

  useEffect(() => {
    const flows = HUB_DEMO_FLOWS.filter((f) => f.businessId === businessId);
    if (flows.length && !flows.some((f) => f.id === activeFlowId)) {
      setActiveFlowId(flows[0].id);
      setPhase('idle');
    }
  }, [businessId, activeFlowId]);

  const runFlow = useCallback((flow: typeof activeFlow) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setActiveFlowId(flow.id);
    setPhase('running');
    setStepIndex(0);

    flow.steps.forEach((_, i) => {
      timersRef.current.push(setTimeout(() => setStepIndex(i), 600 + i * 900));
    });
    timersRef.current.push(
      setTimeout(() => setPhase('done'), 600 + flow.steps.length * 900 + 400)
    );
  }, []);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-card to-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Hexagon className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Hub Specialist · jamal-hub-v2</p>
          <p className="text-xs text-muted-foreground truncate">
            {HUB_SPECIALIST_COUNT}+ specialists · Chief of Staff orchestrates your team
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Business workspace switcher — matches Nexus OS Hub */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Active workspace</p>
          <div className="flex flex-wrap gap-1.5">
            {HUB_BUSINESSES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setBusinessId(b.id);
                  setPhase('idle');
                }}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  businessId === b.id
                    ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-200'
                    : 'border-border text-muted-foreground hover:border-indigo-500/30'
                }`}
                style={businessId === b.id ? { borderColor: `${b.accent}66` } : undefined}
              >
                <span className="mr-1">{b.icon}</span>
                {b.name}
              </button>
            ))}
          </div>
          {business && (
            <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{business.tagline}</p>
          )}
        </div>

        <div className="rounded-lg bg-background/80 border border-border font-mono text-xs p-3 min-h-[3rem]">
          <span className="text-indigo-400 mr-2">›</span>
          <span className="text-foreground/90">{activeFlow.query}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {businessFlows.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => runFlow(f)}
              disabled={phase === 'running'}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeFlow.id === f.id
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300'
                  : 'border-border text-muted-foreground hover:border-indigo-500/30 hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 min-h-[140px]">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
            <Brain className="w-3 h-3" /> Hub execution trace
          </p>
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                Pick a workspace and example — watch Chief of Staff route to your real Hub specialists
                (same roster as {BRAND.nexusOsPath}).
              </motion.p>
            )}
            {(phase === 'running' || phase === 'done') && (
              <motion.ul
                key="steps"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {activeFlow.steps.map((step, i) => {
                  const visible = phase === 'done' || i <= stepIndex;
                  if (!visible) return null;
                  const isActive = phase === 'running' && i === stepIndex;
                  return (
                    <motion.li
                      key={`${step.specialistId}-${i}`}
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
                        <span className="font-semibold text-indigo-300">{step.specialistName}</span>
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
          Ask once → Hub routes specialists → approval → Slack, Notion, Gmail
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <a href={`${BRAND.nexusOsPath}/`}>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5">
              Open Hub in Nexus OS <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </a>
          <Button
            size="sm"
            variant="outline"
            className="border-border gap-1.5"
            onClick={() => runFlow(activeFlow)}
            disabled={phase === 'running'}
          >
            <Play className="w-3.5 h-3.5" /> Replay
          </Button>
        </div>
      </div>
    </div>
  );
}
