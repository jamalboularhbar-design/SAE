import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Network, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLATFORM_STATS } from '@shared/platformStats';

/** Compact doc-card nodes — sized to fit the teaser graph without crowding. */
const NODES = [
  { id: 'pricing', x: 14, y: 38, label: 'Pricing', w: 11, h: 5.5 },
  { id: 'onboarding', x: 38, y: 14, label: 'Onboarding', w: 13, h: 5.5 },
  { id: 'compliance', x: 66, y: 24, label: 'Compliance', w: 13, h: 5.5 },
  { id: 'incident', x: 52, y: 56, label: 'Incidents', w: 12, h: 5.5 },
  { id: 'hiring', x: 22, y: 60, label: 'Hiring', w: 10, h: 5.5 },
  { id: 'security', x: 76, y: 52, label: 'Security', w: 11, h: 5.5 },
];

const EDGES: [string, string][] = [
  ['pricing', 'onboarding'],
  ['onboarding', 'hiring'],
  ['onboarding', 'compliance'],
  ['compliance', 'security'],
  ['compliance', 'incident'],
  ['incident', 'security'],
];

function DocCardNode({
  node,
  index,
}: {
  node: (typeof NODES)[number];
  index: number;
}) {
  const cx = node.x;
  const cy = node.y;
  const halfW = node.w / 2;
  const halfH = node.h / 2;

  return (
    <g>
      <motion.rect
        x={cx - halfW}
        y={cy - halfH}
        width={node.w}
        height={node.h}
        rx={0.8}
        className="fill-card stroke-cyan-400/60"
        strokeWidth="0.35"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15 + index * 0.08, type: 'spring', stiffness: 260 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* Doc fold corner */}
      <rect
        x={cx + halfW - 1.6}
        y={cy - halfH}
        width={1.6}
        height={1.6}
        className="fill-cyan-500/25"
      />
      {/* Title line */}
      <line
        x1={cx - halfW + 1.2}
        y1={cy - 0.4}
        x2={cx + halfW - 2.4}
        y2={cy - 0.4}
        className="stroke-cyan-400/50"
        strokeWidth="0.25"
      />
      <line
        x1={cx - halfW + 1.2}
        y1={cy + 0.6}
        x2={cx + halfW - 3}
        y2={cy + 0.6}
        className="stroke-cyan-400/30"
        strokeWidth="0.2"
      />
      <motion.rect
        x={cx - halfW - 0.6}
        y={cy - halfH - 0.6}
        width={node.w + 1.2}
        height={node.h + 1.2}
        rx={1}
        className="fill-none stroke-cyan-400/25"
        strokeWidth="0.25"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ delay: 0.8 + index * 0.15, duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
      />
      <text
        x={cx}
        y={cy + halfH + 2.8}
        textAnchor="middle"
        className="fill-muted-foreground text-[2.4px] font-medium"
      >
        {node.label}
      </text>
    </g>
  );
}

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
        <svg viewBox="0 0 100 72" className="w-full h-full" aria-hidden="true">
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
                strokeWidth="0.3"
                className="text-cyan-500/35"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              />
            );
          })}
          {NODES.map((node, i) => (
            <DocCardNode key={node.id} node={node} index={i} />
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
