import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import {
  ZoomIn, ZoomOut, Maximize2, ExternalLink, GitBranch, Link2, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type GraphNode = {
  id: string;
  docId?: number;
  label: string;
  slug: string;
  group: string | null;
  wordCount?: number;
};

export type GraphEdge = {
  source: string;
  target: string;
  type: 'dependency' | 'reference' | 'suggested' | string;
  label?: string | null;
};

type KnowledgeGraphViewProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  searchQuery?: string;
  selectedCategory?: string;
  height?: number;
};

type SimNode = GraphNode & { x: number; y: number; vx: number; vy: number; degree: number };

const CATEGORY_PALETTE = [
  '#14b8a6', '#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899',
  '#10b981', '#f97316', '#6366f1', '#ef4444', '#06b6d4',
];

function categoryColor(group: string | null, index: number): string {
  if (!group) return '#94a3b8';
  let hash = 0;
  for (let i = 0; i < group.length; i++) hash = group.charCodeAt(i) + ((hash << 5) - hash);
  return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
}

function wrapLabel(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 2): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) break;
    } else {
      current = test;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = last.length > 3 ? `${last.slice(0, -1)}…` : `${last}…`;
  }
  return lines.length ? lines : [text.slice(0, 24) + (text.length > 24 ? '…' : '')];
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number, fromY: number,
  toX: number, toY: number,
  nodeRadius: number,
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
  const ux = dx / dist;
  const uy = dy / dist;
  const startX = fromX + ux * (nodeRadius + 2);
  const startY = fromY + uy * (nodeRadius + 2);
  const endX = toX - ux * (nodeRadius + 6);
  const endY = toY - uy * (nodeRadius + 6);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  const headLen = 8;
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - ux * headLen - uy * 4, endY - uy * headLen + ux * 4);
  ctx.lineTo(endX - ux * headLen + uy * 4, endY - uy * headLen - ux * 4);
  ctx.closePath();
  ctx.fill();
}

export default function KnowledgeGraphView({
  nodes,
  edges,
  searchQuery = '',
  selectedCategory = 'all',
  height = 640,
}: KnowledgeGraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<SimNode[]>([]);
  const animRef = useRef<number>(0);
  const [, navigate] = useLocation();
  const { theme } = useTheme();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [showDependencies, setShowDependencies] = useState(true);
  const [showReferences, setShowReferences] = useState(true);

  const isDark = theme === 'dark';

  const filtered = useMemo(() => {
    let fn = nodes;
    if (selectedCategory !== 'all') {
      fn = fn.filter((n) => n.group === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      fn = fn.filter(
        (n) =>
          n.label.toLowerCase().includes(q) ||
          (n.group || '').toLowerCase().includes(q) ||
          n.slug.toLowerCase().includes(q),
      );
    }
    const ids = new Set(fn.map((n) => n.id));
    const fe = edges.filter(
      (e) =>
        ids.has(e.source) &&
        ids.has(e.target) &&
        (e.type === 'dependency' ? showDependencies : showReferences),
    );
    return { nodes: fn, edges: fe };
  }, [nodes, edges, searchQuery, selectedCategory, showDependencies, showReferences]);

  const degreeMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of filtered.edges) {
      m.set(e.source, (m.get(e.source) ?? 0) + 1);
      m.set(e.target, (m.get(e.target) ?? 0) + 1);
    }
    return m;
  }, [filtered.edges]);

  const highlightIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(filtered.nodes.filter((n) => n.label.toLowerCase().includes(q)).map((n) => n.id));
  }, [filtered.nodes, searchQuery]);

  const selectedNode = useMemo(
    () => filtered.nodes.find((n) => n.id === selectedId) ?? null,
    [filtered.nodes, selectedId],
  );

  const nodeRelations = useMemo(() => {
    if (!selectedId) return { prerequisites: [], dependents: [], references: [] as GraphEdge[] };
    const prerequisites = filtered.edges.filter((e) => e.target === selectedId && e.type === 'dependency');
    const dependents = filtered.edges.filter((e) => e.source === selectedId && e.type === 'dependency');
    const references = filtered.edges.filter(
      (e) => (e.source === selectedId || e.target === selectedId) && e.type !== 'dependency',
    );
    return { prerequisites, dependents, references };
  }, [filtered.edges, selectedId]);

  const nodeLabel = useCallback(
    (id: string) => filtered.nodes.find((n) => n.id === id)?.label ?? id,
    [filtered.nodes],
  );

  // Initialize simulation nodes
  useEffect(() => {
    const W = 900;
    const H = height;
    simRef.current = filtered.nodes.map((n, i) => ({
      ...n,
      x: W / 2 + Math.cos(i * 2.399) * Math.min(W, H) * 0.32,
      y: H / 2 + Math.sin(i * 2.399) * Math.min(W, H) * 0.32,
      vx: 0,
      vy: 0,
      degree: degreeMap.get(n.id) ?? 0,
    }));
  }, [filtered.nodes, degreeMap, height]);

  const screenToWorld = useCallback(
    (sx: number, sy: number, canvasW: number, canvasH: number) => {
      const cx = canvasW / 2;
      const cy = canvasH / 2;
      return {
        x: (sx - cx - pan.x) / zoom + cx,
        y: (sy - cy - pan.y) / zoom + cy,
      };
    },
    [pan, zoom],
  );

  const findNodeAt = useCallback(
    (wx: number, wy: number) => {
      for (const node of simRef.current) {
        const r = 10 + Math.min(node.degree * 2, 14);
        const dx = node.x - wx;
        const dy = node.y - wy;
        if (dx * dx + dy * dy <= (r + 14) * (r + 14)) return node.id;
      }
      return null;
    },
    [],
  );

  // Simulation + draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || filtered.nodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let running = true;

    const run = () => {
      if (!running) return;
      const W = canvas.width;
      const H = canvas.height;
      const simNodes = simRef.current;
      const nodeIndex = new Map(simNodes.map((n, i) => [n.id, i]));

      if (frame < 120) {
        for (let i = 0; i < simNodes.length; i++) {
          for (let j = i + 1; j < simNodes.length; j++) {
            const dx = simNodes[j].x - simNodes[i].x;
            const dy = simNodes[j].y - simNodes[i].y;
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const force = 8000 / (dist * dist);
            simNodes[i].vx -= (dx / dist) * force;
            simNodes[i].vy -= (dy / dist) * force;
            simNodes[j].vx += (dx / dist) * force;
            simNodes[j].vy += (dy / dist) * force;
          }
        }
        for (const edge of filtered.edges) {
          const si = nodeIndex.get(edge.source);
          const ti = nodeIndex.get(edge.target);
          if (si === undefined || ti === undefined) continue;
          const dx = simNodes[ti].x - simNodes[si].x;
          const dy = simNodes[ti].y - simNodes[si].y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const ideal = edge.type === 'dependency' ? 140 : 100;
          const force = (dist - ideal) * 0.015;
          simNodes[si].vx += (dx / dist) * force;
          simNodes[si].vy += (dy / dist) * force;
          simNodes[ti].vx -= (dx / dist) * force;
          simNodes[ti].vy -= (dy / dist) * force;
        }
        for (const node of simNodes) {
          node.vx += (W / 2 - node.x) * 0.002;
          node.vy += (H / 2 - node.y) * 0.002;
          node.x += node.vx * 0.4;
          node.y += node.vy * 0.4;
          node.vx *= 0.85;
          node.vy *= 0.85;
          node.x = Math.max(60, Math.min(W - 60, node.x));
          node.y = Math.max(60, Math.min(H - 60, node.y));
        }
        frame++;
      }

      // Background
      ctx.fillStyle = isDark ? '#0f1419' : '#f8fafc';
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(W / 2 + pan.x, H / 2 + pan.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-W / 2, -H / 2);

      const connectedToSelected = new Set<string>();
      if (selectedId) {
        connectedToSelected.add(selectedId);
        for (const e of filtered.edges) {
          if (e.source === selectedId) connectedToSelected.add(e.target);
          if (e.target === selectedId) connectedToSelected.add(e.source);
        }
      }

      // Edges
      for (const edge of filtered.edges) {
        const si = nodeIndex.get(edge.source);
        const ti = nodeIndex.get(edge.target);
        if (si === undefined || ti === undefined) continue;
        const sn = simNodes[si];
        const tn = simNodes[ti];
        const isActive =
          selectedId &&
          (edge.source === selectedId || edge.target === selectedId);
        const isHighlight =
          highlightIds.has(edge.source) || highlightIds.has(edge.target);

        if (edge.type === 'dependency') {
          ctx.strokeStyle = isActive
            ? '#f59e0b'
            : isHighlight
              ? 'rgba(245,158,11,0.55)'
              : isDark
                ? 'rgba(245,158,11,0.35)'
                : 'rgba(217,119,6,0.45)';
          ctx.fillStyle = ctx.strokeStyle;
          ctx.lineWidth = isActive ? 2.5 : 1.5;
          ctx.setLineDash([]);
          drawArrow(ctx, sn.x, sn.y, tn.x, tn.y, 10 + Math.min(sn.degree * 2, 14));
        } else {
          ctx.strokeStyle = isActive
            ? '#14b8a6'
            : edge.type === 'suggested'
              ? isDark ? 'rgba(148,163,184,0.25)' : 'rgba(100,116,139,0.35)'
              : isHighlight
                ? 'rgba(20,184,166,0.5)'
                : isDark
                  ? 'rgba(20,184,166,0.3)'
                  : 'rgba(13,148,136,0.4)';
          ctx.lineWidth = isActive ? 2 : 1;
          ctx.setLineDash(edge.type === 'suggested' ? [4, 4] : []);
          ctx.beginPath();
          ctx.moveTo(sn.x, sn.y);
          ctx.lineTo(tn.x, tn.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Nodes
      for (let i = 0; i < simNodes.length; i++) {
        const node = simNodes[i];
        const color = categoryColor(node.group, i);
        const isSelected = selectedId === node.id;
        const isHovered = hoveredId === node.id;
        const isDimmed =
          (highlightIds.size > 0 && !highlightIds.has(node.id)) ||
          (selectedId && !connectedToSelected.has(node.id));
        const radius = 10 + Math.min(node.degree * 2, 14);

        // Glow
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? `${color}33` : `${color}22`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? `${color}88` : color;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#fff' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)';
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Degree badge
        if (node.degree > 0) {
          ctx.fillStyle = isDark ? '#0f1419' : '#fff';
          ctx.font = 'bold 9px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(node.degree), node.x, node.y);
        }

        // Label card below node
        const labelAlpha = isDimmed ? 0.35 : isSelected || isHovered ? 1 : 0.92;
        ctx.font = `${isSelected ? 'bold ' : ''}10px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const lines = wrapLabel(ctx, node.label, 100, 2);
        const lineH = 13;
        const padY = 4;
        const padX = 6;
        const boxW = Math.max(...lines.map((l) => ctx.measureText(l).width)) + padX * 2;
        const boxH = lines.length * lineH + padY * 2;
        const boxX = node.x - boxW / 2;
        const boxY = node.y + radius + 6;

        ctx.fillStyle = isDark ? `rgba(15,20,25,${labelAlpha * 0.92})` : `rgba(255,255,255,${labelAlpha * 0.95})`;
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${labelAlpha * 0.15})` : `rgba(0,0,0,${labelAlpha * 0.08})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark
          ? `rgba(248,250,252,${labelAlpha})`
          : `rgba(15,23,42,${labelAlpha})`;
        lines.forEach((line, li) => {
          ctx.fillText(line, node.x, boxY + padY + li * lineH);
        });

        // Category pill
        if (node.group && (isSelected || isHovered)) {
          ctx.font = '8px Inter, sans-serif';
          const catText = node.group.length > 18 ? node.group.slice(0, 16) + '…' : node.group;
          const catW = ctx.measureText(catText).width + 8;
          ctx.fillStyle = `${color}33`;
          ctx.fillRect(node.x - catW / 2, boxY + boxH + 3, catW, 12);
          ctx.fillStyle = color;
          ctx.fillText(catText, node.x, boxY + boxH + 5);
        }
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(run);
    };

    animRef.current = requestAnimationFrame(run);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [filtered, hoveredId, selectedId, highlightIds, zoom, pan, isDark, height]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.parentElement?.clientWidth ?? 900;
      canvas.height = height;
    });
    ro.observe(canvas.parentElement ?? canvas);
    canvas.width = canvas.parentElement?.clientWidth ?? 900;
    canvas.height = height;
    return () => ro.disconnect();
  }, [height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (isDragging) {
      setPan({
        x: dragStart.current.panX + (sx - dragStart.current.x),
        y: dragStart.current.panY + (sy - dragStart.current.y),
      });
      return;
    }

    const { x, y } = screenToWorld(sx, sy, canvas.width, canvas.height);
    setHoveredId(findNodeAt(x, y));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { x, y } = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, canvas.width, canvas.height);
    const hit = findNodeAt(x, y);
    if (hit) {
      setSelectedId(hit);
    } else {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, panX: pan.x, panY: pan.y };
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom((z) => Math.min(2.5, Math.max(0.4, z - e.deltaY * 0.001)));
  };

  const depCount = filtered.edges.filter((e) => e.type === 'dependency').length;
  const refCount = filtered.edges.filter((e) => e.type !== 'dependency').length;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 min-w-0 rounded-xl border border-border overflow-hidden bg-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
          <button
            onClick={() => setShowDependencies((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              showDependencies ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' : 'text-muted-foreground'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> Dependencies ({depCount})
          </button>
          <button
            onClick={() => setShowReferences((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              showReferences ? 'bg-teal-500/15 text-teal-700 dark:text-teal-400' : 'text-muted-foreground'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" /> References ({refCount})
          </button>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Reset view">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full cursor-grab active:cursor-grabbing"
          style={{ height }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { setIsDragging(false); setHoveredId(null); }}
          onWheel={handleWheel}
        />

        <div className="px-3 py-2 border-t border-border text-[10px] text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
          <span><span className="inline-block w-3 h-0.5 bg-amber-500 align-middle mr-1" /> Dependency (prerequisite → doc)</span>
          <span><span className="inline-block w-3 h-0.5 bg-teal-500 align-middle mr-1" /> Cross-reference</span>
          <span><span className="inline-block w-3 h-0.5 border-t border-dashed border-muted-foreground align-middle mr-1" /> Suggested link</span>
          <span className="ml-auto">Click node for details · Drag canvas to pan</span>
        </div>
      </div>

      {/* Detail panel */}
      <aside className="w-full lg:w-80 shrink-0 rounded-xl border border-border bg-card p-4 flex flex-col gap-4 max-h-[720px] overflow-y-auto">
        {selectedNode ? (
          <>
            <div>
              <Badge variant="outline" className="mb-2 text-[10px]">{selectedNode.group || 'Uncategorized'}</Badge>
              <h3 className="font-semibold text-foreground leading-snug">{selectedNode.label}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{selectedNode.slug}</p>
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={() => navigate(`/docs/${selectedNode.slug}`)}
            >
              Open document <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </Button>

            {nodeRelations.prerequisites.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" /> Prerequisites ({nodeRelations.prerequisites.length})
                </h4>
                <ul className="space-y-1.5">
                  {nodeRelations.prerequisites.map((e) => (
                    <li key={`${e.source}-${e.target}`}>
                      <button
                        onClick={() => setSelectedId(e.source)}
                        className="w-full text-left text-xs px-2.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 text-foreground transition-colors"
                      >
                        <span className="text-muted-foreground">Read first → </span>
                        {nodeLabel(e.source)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {nodeRelations.dependents.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" /> Dependents ({nodeRelations.dependents.length})
                </h4>
                <ul className="space-y-1.5">
                  {nodeRelations.dependents.map((e) => (
                    <li key={`${e.source}-${e.target}-dep`}>
                      <button
                        onClick={() => setSelectedId(e.target)}
                        className="w-full text-left text-xs px-2.5 py-2 rounded-lg bg-muted/50 border border-border hover:bg-muted text-foreground transition-colors"
                      >
                        {nodeLabel(e.target)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {nodeRelations.references.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Related ({nodeRelations.references.length})
                </h4>
                <ul className="space-y-1.5">
                  {nodeRelations.references.map((e) => {
                    const otherId = e.source === selectedId ? e.target : e.source;
                    return (
                      <li key={`${e.source}-${e.target}-ref`}>
                        <button
                          onClick={() => setSelectedId(otherId)}
                          className="w-full text-left text-xs px-2.5 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/15 text-foreground transition-colors"
                        >
                          {nodeLabel(otherId)}
                          {e.label && e.label !== 'related' && (
                            <span className="block text-[10px] text-muted-foreground mt-0.5">{e.label}</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {nodeRelations.prerequisites.length === 0 &&
              nodeRelations.dependents.length === 0 &&
              nodeRelations.references.length === 0 && (
                <p className="text-xs text-muted-foreground">No dependencies or cross-references recorded for this document yet.</p>
              )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <GitBranch className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium text-foreground mb-1">Select a document</p>
            <p className="text-xs">Click any node to see its prerequisites, dependents, and related docs.</p>
            <div className="mt-6 text-left space-y-2 text-xs">
              <p><strong>{filtered.nodes.length}</strong> documents</p>
              <p><strong>{depCount}</strong> dependency edges</p>
              <p><strong>{refCount}</strong> cross-reference edges</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
