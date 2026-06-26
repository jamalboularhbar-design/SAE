import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Network, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLATFORM_STATS } from '@shared/platformStats';

const NODES = [
  { id: 'pricing', x: 18, y: 35, label: 'Pricing' },
  { id: 'onboarding', x: 42, y: 18, label: 'Onboarding' },
  { id: 'compliance', x: 68, y: 28, label: 'Compliance' },
  { id: 'incident', x: 55, y: 58, label: 'Incidents' },
  { id: 'hiring', x: 28, y: 62, label: 'Hiring' },
  { id: 'security', x: 78, y: 55, label: 'Security' },
];

const EDGES: [string, string][] = [
  ['pricing', 'onboarding'],
  ['onboarding', 'hiring'],
  ['onboarding', 'compliance'],
  ['compliance', 'security'],
  ['compliance', 'incident'],
  ['incident', 'security'],
];

export default function KnowledgeGraphTeaser() {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-card to-card overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Network className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Knowledge graph</p>
            <p className="text-xs text-muted-foreground">
              {PLATFORM_STATS.graphEdges.toLocaleString()} edges · dependencies & cross-refs
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-[200px] p-4">
        <svg viewBox="0 0 100 80" className="w-full h-full" aria-hidden="true">
          {EDGES.map(([a, b], i) => {
            const na = nodeMap[a];
            const nb = nodeMap[b];
            if (!na || !nb) return null;
            return (
              <motion.line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="currentColor"
                strokeWidth="0.4"
                className="text-cyan-500/40"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              />
            );
          })}
          {NODES.map((node, i) => (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="3.5"
                className="fill-cyan-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
              />
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="6"
                className="fill-cyan-400/20 stroke-cyan-400/50"
                strokeWidth="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ delay: 1 + i * 0.2, duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <text
                x={node.x}
                y={node.y + 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[3px] font-medium"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
        <p className="absolute bottom-3 left-4 right-4 text-xs text-muted-foreground">
          See load-bearing SOPs before someone leaves — zoom, filter, and follow dependencies live.
        </p>
      </div>

      <div className="px-5 pb-5">
        <Link href="/graph">
          <Button size="sm" className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5">
            Try it now — open /graph <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
