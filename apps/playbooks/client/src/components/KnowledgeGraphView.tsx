import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import {
  ZoomIn, ZoomOut, Maximize2, ExternalLink, GitBranch, Link2, ArrowRight,
  FileText, Layers,
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
  initialFocusSlug?: string | null;
};

type SimNode = GraphNode & { x: number; y: number; vx: number; vy: number; degree: number };

type ClusterNode = {
  id: string;
  label: string;
  count: number;
  nodeIds: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
};

/* Atlassian-inspired palette (Rovo / Teamwork Graph) */
const ROVO_PALETTE = [
  { accent: '#6554C0', glow: 'rgba(101,84,192,0.35)' },
  { accent: '#0052CC', glow: 'rgba(0,82,204,0.35)' },
  { accent: '#00B8D9', glow: 'rgba(0,184,217,0.35)' },
  { accent: '#FF5630', glow: 'rgba(255,86,48,0.35)' },
  { accent: '#36B37E', glow: 'rgba(54,179,126,0.35)' },
  { accent: '#FFAB00', glow: 'rgba(255,171,0,0.35)' },
  { accent: '#8777D9', glow: 'rgba(135,119,217,0.35)' },
  { accent: '#2684FF', glow: 'rgba(38,132,255,0.35)' },
  { accent: '#403294', glow: 'rgba(64,50,148,0.35)' },
  { accent: '#00875A', glow: 'rgba(0,135,90,0.35)' },
];

const CARD_W = 172;
const CARD_H = 68;
const CARD_W_COMPACT = 108;
const CARD_H_COMPACT = 38;
const CLUSTER_W = 196;
const CLUSTER_H = 84;

function categoryStyle(group: string | null, index: number) {
  if (!group) return ROVO_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < group.length; i++) hash = group.charCodeAt(i) + ((hash << 5) - hash);
  return ROVO_PALETTE[Math.abs(hash) % ROVO_PALETTE.length];
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function curvedPath(x1: number, y1: number, x2: number, y2: number, curvature = 0.22) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const cx = mx - (y2 - y1) * curvature;
  const cy = my + (x2 - x1) * curvature;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function anchorPoints(
  sx: number, sy: number, sw: number, sh: number,
  tx: number, ty: number, tw: number, th: number,
) {
  const scx = sx + sw / 2;
  const scy = sy + sh / 2;
  const tcx = tx + tw / 2;
  const tcy = ty + th / 2;
  const dx = tcx - scx;
  const dy = tcy - scy;
  const angle = Math.atan2(dy, dx);

  const srcHalfW = sw / 2;
  const srcHalfH = sh / 2;
  const tgtHalfW = tw / 2;
  const tgtHalfH = th / 2;

  const srcDist = Math.abs(Math.cos(angle)) < 0.001
    ? srcHalfH
    : Math.abs(Math.sin(angle)) < 0.001
      ? srcHalfW
      : Math.min(Math.abs(srcHalfW / Math.cos(angle)), Math.abs(srcHalfH / Math.sin(angle)));
  const tgtDist = Math.abs(Math.cos(angle)) < 0.001
    ? tgtHalfH
    : Math.abs(Math.sin(angle)) < 0.001
      ? tgtHalfW
      : Math.min(Math.abs(tgtHalfW / Math.cos(angle)), Math.abs(tgtHalfH / Math.sin(angle)));

  return {
    x1: scx + Math.cos(angle) * (srcDist - 2),
    y1: scy + Math.sin(angle) * (srcDist - 2),
    x2: tcx - Math.cos(angle) * (tgtDist - 6),
    y2: tcy - Math.sin(angle) * (tgtDist - 6),
  };
}

function buildClusters(nodes: GraphNode[], edges: GraphEdge[]): ClusterNode[] {
  const groups = new Map<string, GraphNode[]>();
  for (const n of nodes) {
    const key = n.group || 'Uncategorized';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(n);
  }

  const clusters: ClusterNode[] = [];
  let i = 0;
  for (const [label, members] of Array.from(groups.entries())) {
    const angle = i * 2.399;
    clusters.push({
      id: `cluster:${label}`,
      label,
      count: members.length,
      nodeIds: members.map((m: GraphNode) => m.id),
      x: 450 + Math.cos(angle) * 280,
      y: 320 + Math.sin(angle) * 220,
      vx: 0,
      vy: 0,
    });
    i++;
  }

  return clusters;
}

function clusterEdges(clusters: ClusterNode[], edges: GraphEdge[]) {
  const nodeToCluster = new Map<string, string>();
  for (const c of clusters) {
    for (const id of c.nodeIds) nodeToCluster.set(id, c.id);
  }

  const seen = new Set<string>();
  const result: { source: string; target: string; type: string; weight: number }[] = [];

  for (const e of edges) {
    const cs = nodeToCluster.get(e.source);
    const ct = nodeToCluster.get(e.target);
    if (!cs || !ct || cs === ct) continue;
    const key = [cs, ct].sort().join('|') + e.type;
    if (seen.has(key)) {
      const existing = result.find((r) => r.source === cs && r.target === ct && r.type === e.type);
      if (existing) existing.weight++;
      continue;
    }
    seen.add(key);
    result.push({ source: cs, target: ct, type: e.type, weight: 1 });
  }
  return result;
}

export default function KnowledgeGraphView({
  nodes,
  edges,
  searchQuery = '',
  selectedCategory = 'all',
  height = 640,
  initialFocusSlug = null,
}: KnowledgeGraphViewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<SimNode[]>([]);
  const clusterSimRef = useRef<ClusterNode[]>([]);
  const animRef = useRef<number>(0);
  const [, navigate] = useLocation();
  const { theme } = useTheme();

  const [viewportW, setViewportW] = useState(900);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tick, setTick] = useState(0);
  const [localCategory, setLocalCategory] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [showDependencies, setShowDependencies] = useState(true);
  const [showReferences, setShowReferences] = useState(true);

  useEffect(() => {
    if (!initialFocusSlug || nodes.length === 0) return;
    const match = nodes.find((n) => n.slug === initialFocusSlug || n.id === initialFocusSlug);
    if (match) setSelectedId(match.id);
  }, [initialFocusSlug, nodes]);

  const isDark = theme === 'dark';
  const effectiveCategory = localCategory ?? (selectedCategory !== 'all' ? selectedCategory : null);

  const filtered = useMemo(() => {
    let fn = nodes;
    if (effectiveCategory) {
      fn = fn.filter((n) => (n.group || 'Uncategorized') === effectiveCategory);
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
  }, [nodes, edges, searchQuery, effectiveCategory, showDependencies, showReferences]);

  const isClusterMode = zoom < 0.52 && filtered.nodes.length > 35 && !searchQuery.trim();

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

  const cardSize = zoom < 0.72 ? { w: CARD_W_COMPACT, h: CARD_H_COMPACT } : { w: CARD_W, h: CARD_H };

  // Initialize document simulation
  useEffect(() => {
    const W = viewportW;
    const H = height;
    simRef.current = filtered.nodes.map((n, i) => ({
      ...n,
      x: W / 2 + Math.cos(i * 2.399) * Math.min(W, H) * 0.34,
      y: H / 2 + Math.sin(i * 2.399) * Math.min(W, H) * 0.34,
      vx: 0,
      vy: 0,
      degree: degreeMap.get(n.id) ?? 0,
    }));
  }, [filtered.nodes, degreeMap, height, viewportW]);

  // Initialize cluster simulation
  useEffect(() => {
    clusterSimRef.current = buildClusters(filtered.nodes, filtered.edges);
  }, [filtered.nodes, filtered.edges]);

  // Force simulation loop
  useEffect(() => {
    if (filtered.nodes.length === 0) return;
    let frame = 0;
    let running = true;
    const W = viewportW;
    const H = height;
    const pad = 80;
    const cw = isClusterMode ? CLUSTER_W : cardSize.w;
    const ch = isClusterMode ? CLUSTER_H : cardSize.h;

    const run = () => {
      if (!running) return;

      if (isClusterMode) {
        const clusters = clusterSimRef.current;
        const cEdges = clusterEdges(clusters, filtered.edges);
        const cIndex = new Map(clusters.map((c, i) => [c.id, i]));

        if (frame < 100) {
          for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
              const dx = clusters[j].x - clusters[i].x;
              const dy = clusters[j].y - clusters[i].y;
              const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
              const force = 12000 / (dist * dist);
              clusters[i].vx -= (dx / dist) * force;
              clusters[i].vy -= (dy / dist) * force;
              clusters[j].vx += (dx / dist) * force;
              clusters[j].vy += (dy / dist) * force;
            }
          }
          for (const e of cEdges) {
            const si = cIndex.get(e.source);
            const ti = cIndex.get(e.target);
            if (si === undefined || ti === undefined) continue;
            const dx = clusters[ti].x - clusters[si].x;
            const dy = clusters[ti].y - clusters[si].y;
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const ideal = 220;
            const force = (dist - ideal) * 0.02;
            clusters[si].vx += (dx / dist) * force;
            clusters[si].vy += (dy / dist) * force;
            clusters[ti].vx -= (dx / dist) * force;
            clusters[ti].vy -= (dy / dist) * force;
          }
          for (const c of clusters) {
            c.vx += (W / 2 - c.x) * 0.003;
            c.vy += (H / 2 - c.y) * 0.003;
            c.x += c.vx * 0.35;
            c.y += c.vy * 0.35;
            c.vx *= 0.82;
            c.vy *= 0.82;
            c.x = Math.max(pad, Math.min(W - pad - CLUSTER_W, c.x));
            c.y = Math.max(pad, Math.min(H - pad - CLUSTER_H, c.y));
          }
          frame++;
        }
      } else {
        const simNodes = simRef.current;
        const nodeIndex = new Map(simNodes.map((n, i) => [n.id, i]));

        if (frame < 140) {
          for (let i = 0; i < simNodes.length; i++) {
            for (let j = i + 1; j < simNodes.length; j++) {
              const dx = simNodes[j].x - simNodes[i].x;
              const dy = simNodes[j].y - simNodes[i].y;
              const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
              const force = 14000 / (dist * dist);
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
            const ideal = edge.type === 'dependency' ? 200 : 160;
            const force = (dist - ideal) * 0.018;
            simNodes[si].vx += (dx / dist) * force;
            simNodes[si].vy += (dy / dist) * force;
            simNodes[ti].vx -= (dx / dist) * force;
            simNodes[ti].vy -= (dy / dist) * force;
          }
          for (const node of simNodes) {
            node.vx += (W / 2 - node.x) * 0.0025;
            node.vy += (H / 2 - node.y) * 0.0025;
            node.x += node.vx * 0.38;
            node.y += node.vy * 0.38;
            node.vx *= 0.84;
            node.vy *= 0.84;
            node.x = Math.max(pad, Math.min(W - pad - cw, node.x));
            node.y = Math.max(pad, Math.min(H - pad - ch, node.y));
          }
          frame++;
        }
      }

      if (frame % 2 === 0) setTick((t) => t + 1);
      animRef.current = requestAnimationFrame(run);
    };

    frame = 0;
    animRef.current = requestAnimationFrame(run);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [filtered.nodes, filtered.edges, height, viewportW, isClusterMode, cardSize.w, cardSize.h]);

  // Resize observer
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setViewportW(el.clientWidth || 900));
    ro.observe(el);
    setViewportW(el.clientWidth || 900);
    return () => ro.disconnect();
  }, []);

  const connectedToSelected = useMemo(() => {
    const set = new Set<string>();
    if (!selectedId) return set;
    set.add(selectedId);
    for (const e of filtered.edges) {
      if (e.source === selectedId) set.add(e.target);
      if (e.target === selectedId) set.add(e.source);
    }
    return set;
  }, [filtered.edges, selectedId]);

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  };

  const handlePanEnd = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(2.2, Math.max(0.35, z - e.deltaY * 0.001)));
  };

  const expandCluster = (label: string) => {
    setLocalCategory(label);
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
    setSelectedId(null);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setLocalCategory(null);
    setSelectedId(null);
  };

  const depCount = filtered.edges.filter((e) => e.type === 'dependency').length;
  const refCount = filtered.edges.filter((e) => e.type !== 'dependency').length;

  const simNodes = simRef.current;
  const clusters = clusterSimRef.current;
  const cEdges = isClusterMode ? clusterEdges(clusters, filtered.edges) : [];
  const posMap = new Map(simNodes.map((n) => [n.id, n]));
  const clusterMap = new Map(clusters.map((c) => [c.id, c]));

  const showEdge = (source: string, target: string) => {
    if (zoom >= 0.55) return true;
    if (!selectedId && !hoveredId) return false;
    const focus = selectedId ?? hoveredId;
    return source === focus || target === focus;
  };

  // tick dependency for re-render during simulation
  void tick;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 min-w-0 rounded-xl border border-border overflow-hidden bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/20 backdrop-blur-sm">
          <button
            onClick={() => setShowDependencies((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              showDependencies
                ? 'bg-[#FFAB00]/15 text-[#B76E00] dark:text-[#FFAB00] ring-1 ring-[#FFAB00]/25'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> Dependencies ({depCount})
          </button>
          <button
            onClick={() => setShowReferences((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              showReferences
                ? 'bg-[#6554C0]/15 text-[#403294] dark:text-[#8777D9] ring-1 ring-[#6554C0]/25'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" /> References ({refCount})
          </button>

          {isClusterMode && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-[#6554C0]/10 text-[#6554C0] dark:text-[#8777D9]">
              <Layers className="w-3 h-3" /> Category overview — zoom in for documents
            </span>
          )}

          {localCategory && (
            <button
              onClick={() => { setLocalCategory(null); setZoom(0.45); }}
              className="text-[10px] px-2 py-1 rounded-lg border border-[#6554C0]/30 text-[#6554C0] dark:text-[#8777D9] hover:bg-[#6554C0]/5"
            >
              ← All categories
            </button>
          )}

          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setZoom((z) => Math.max(0.35, z - 0.12))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(2.2, z + 0.12))} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={resetView} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="Reset view">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Graph viewport */}
        <div
          ref={viewportRef}
          className={`kg-rovo-viewport relative overflow-hidden ${isDark ? 'kg-rovo-dark' : 'kg-rovo-light'}`}
          style={{ height }}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onWheel={handleWheel}
        >
          <div
            className="kg-rovo-canvas absolute inset-0 will-change-transform"
            style={{
              width: viewportW,
              height,
              transformOrigin: `${viewportW / 2}px ${height / 2}px`,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {/* SVG edges layer */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={viewportW}
              height={height}
              aria-hidden
            >
              <defs>
                <marker id="kg-arrow-dep" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#FFAB00" />
                </marker>
                <marker id="kg-arrow-dep-dim" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,171,0,0.45)" />
                </marker>
                <linearGradient id="kg-edge-ref-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6554C0" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#8777D9" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#6554C0" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {isClusterMode
                ? cEdges.map((e, idx) => {
                    const sn = clusterMap.get(e.source);
                    const tn = clusterMap.get(e.target);
                    if (!sn || !tn) return null;
                    const { x1, y1, x2, y2 } = anchorPoints(sn.x, sn.y, CLUSTER_W, CLUSTER_H, tn.x, tn.y, CLUSTER_W, CLUSTER_H);
                    const isDep = e.type === 'dependency';
                    const stroke = isDep ? '#FFAB00' : '#8777D9';
                    const opacity = Math.min(0.35 + e.weight * 0.08, 0.85);
                    return (
                      <path
                        key={`ce-${idx}`}
                        d={curvedPath(x1, y1, x2, y2, 0.18)}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={Math.min(1 + e.weight * 0.4, 3)}
                        strokeOpacity={opacity}
                        markerEnd={isDep ? 'url(#kg-arrow-dep-dim)' : undefined}
                      />
                    );
                  })
                : filtered.edges.map((e, idx) => {
                    if (!showEdge(e.source, e.target)) return null;
                    const sn = posMap.get(e.source);
                    const tn = posMap.get(e.target);
                    if (!sn || !tn) return null;

                    const { w, h } = cardSize;
                    const { x1, y1, x2, y2 } = anchorPoints(sn.x, sn.y, w, h, tn.x, tn.y, w, h);
                    const isActive = selectedId && (e.source === selectedId || e.target === selectedId);
                    const isHighlight = highlightIds.has(e.source) || highlightIds.has(e.target);
                    const isDep = e.type === 'dependency';

                    let stroke = isDep ? '#FFAB00' : '#8777D9';
                    let opacity = isDark ? 0.35 : 0.45;
                    let width = 1.5;
                    let dash = '';

                    if (isActive) {
                      opacity = 1;
                      width = 2.5;
                      stroke = isDep ? '#FFAB00' : '#6554C0';
                    } else if (isHighlight) {
                      opacity = 0.75;
                      width = 2;
                    } else if (selectedId && !connectedToSelected.has(e.source) && !connectedToSelected.has(e.target)) {
                      opacity = 0.12;
                    }

                    if (e.type === 'suggested') dash = '5 4';

                    return (
                      <path
                        key={`e-${idx}-${e.source}-${e.target}`}
                        d={curvedPath(x1, y1, x2, y2)}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={width}
                        strokeOpacity={opacity}
                        strokeDasharray={dash}
                        markerEnd={isDep ? (isActive ? 'url(#kg-arrow-dep)' : 'url(#kg-arrow-dep-dim)') : undefined}
                      />
                    );
                  })}
            </svg>

            {/* Cluster cards */}
            {isClusterMode &&
              clusters.map((cluster, i) => {
                const style = categoryStyle(cluster.label, i);
                const isHovered = hoveredId === cluster.id;
                return (
                  <button
                    key={cluster.id}
                    type="button"
                    className={`kg-rovo-cluster absolute text-left transition-all duration-200 ${isHovered ? 'kg-rovo-card-active z-20' : 'z-10'}`}
                    style={{
                      left: cluster.x,
                      top: cluster.y,
                      width: CLUSTER_W,
                      height: CLUSTER_H,
                      ['--kg-accent' as string]: style.accent,
                      ['--kg-glow' as string]: style.glow,
                    }}
                    onMouseEnter={() => setHoveredId(cluster.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onMouseDown={(ev) => ev.stopPropagation()}
                    onClick={() => expandCluster(cluster.label)}
                  >
                    <div className="kg-rovo-cluster-inner h-full flex flex-col justify-between">
                      <div className="flex items-start gap-2">
                        <Layers className="w-4 h-4 shrink-0 mt-0.5 opacity-70" style={{ color: style.accent }} />
                        <span className="text-sm font-semibold leading-tight line-clamp-2">{cluster.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{cluster.count} documents</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${style.accent}22`, color: style.accent }}>
                          Explore →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

            {/* Document cards */}
            {!isClusterMode &&
              simNodes.map((node, i) => {
                const style = categoryStyle(node.group, i);
                const isSelected = selectedId === node.id;
                const isHovered = hoveredId === node.id;
                const isDimmed =
                  (highlightIds.size > 0 && !highlightIds.has(node.id)) ||
                  (selectedId !== null && !connectedToSelected.has(node.id));
                const compact = zoom < 0.72;
                const { w, h } = cardSize;

                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`kg-rovo-card absolute text-left transition-all duration-200 ${
                      isSelected ? 'kg-rovo-card-selected z-30' : isHovered ? 'kg-rovo-card-active z-20' : 'z-10'
                    } ${isDimmed ? 'kg-rovo-card-dimmed' : ''} ${compact ? 'kg-rovo-card-compact' : ''}`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: w,
                      height: h,
                      ['--kg-accent' as string]: style.accent,
                      ['--kg-glow' as string]: style.glow,
                    }}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onMouseDown={(ev) => ev.stopPropagation()}
                    onClick={() => setSelectedId(node.id)}
                  >
                    <div className="kg-rovo-card-inner h-full flex flex-col justify-center gap-0.5 overflow-hidden">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileText className="w-3 h-3 shrink-0 opacity-60" style={{ color: style.accent }} />
                        <span className={`font-medium leading-tight truncate ${compact ? 'text-[10px]' : 'text-xs'}`}>
                          {truncate(node.label, compact ? 14 : 28)}
                        </span>
                      </div>
                      {!compact && node.group && (
                        <span className="text-[9px] text-muted-foreground truncate pl-[18px]">
                          {truncate(node.group, 24)}
                        </span>
                      )}
                      {node.degree > 0 && (
                        <span
                          className="absolute top-1.5 right-1.5 text-[9px] font-bold tabular-nums min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center"
                          style={{ background: `${style.accent}22`, color: style.accent }}
                        >
                          {node.degree}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        <div className="px-3 py-2 border-t border-border text-[10px] text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 bg-muted/10">
          <span><span className="inline-block w-4 h-0.5 rounded bg-[#FFAB00] align-middle mr-1" /> Dependency</span>
          <span><span className="inline-block w-4 h-0.5 rounded bg-[#8777D9] align-middle mr-1" /> Cross-reference</span>
          <span><span className="inline-block w-4 h-0.5 border-t border-dashed border-muted-foreground align-middle mr-1" /> Suggested</span>
          <span className="ml-auto">Click card for details · Drag to pan · Scroll to zoom</span>
        </div>
      </div>

      {/* Detail panel — Rovo-style */}
      <aside className="w-full lg:w-80 shrink-0 rounded-xl border border-border bg-card/80 backdrop-blur-md p-4 flex flex-col gap-4 max-h-[720px] overflow-y-auto shadow-sm">
        {selectedNode ? (
          <>
            <div className="kg-rovo-detail-header rounded-lg p-3 border border-border/60">
              <Badge
                variant="outline"
                className="mb-2 text-[10px] border-[#6554C0]/30 text-[#6554C0] dark:text-[#8777D9]"
              >
                {selectedNode.group || 'Uncategorized'}
              </Badge>
              <h3 className="font-semibold text-foreground leading-snug">{selectedNode.label}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{selectedNode.slug}</p>
              {selectedNode.wordCount != null && selectedNode.wordCount > 0 && (
                <p className="text-[10px] text-muted-foreground mt-1">{selectedNode.wordCount.toLocaleString()} words</p>
              )}
            </div>
            <Button
              size="sm"
              className="w-full bg-[#6554C0] hover:bg-[#5243AA] text-white"
              onClick={() => navigate(`/docs/${selectedNode.slug}`)}
            >
              Open document <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </Button>

            {nodeRelations.prerequisites.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#B76E00] dark:text-[#FFAB00] mb-2 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" /> Prerequisites ({nodeRelations.prerequisites.length})
                </h4>
                <ul className="space-y-1.5">
                  {nodeRelations.prerequisites.map((e) => (
                    <li key={`${e.source}-${e.target}`}>
                      <button
                        onClick={() => setSelectedId(e.source)}
                        className="w-full text-left text-xs px-2.5 py-2 rounded-lg bg-[#FFAB00]/10 border border-[#FFAB00]/20 hover:bg-[#FFAB00]/15 text-foreground transition-colors"
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#B76E00] dark:text-[#FFAB00] mb-2 flex items-center gap-1.5">
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#403294] dark:text-[#8777D9] mb-2 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Related ({nodeRelations.references.length})
                </h4>
                <ul className="space-y-1.5">
                  {nodeRelations.references.map((e) => {
                    const otherId = e.source === selectedId ? e.target : e.source;
                    return (
                      <li key={`${e.source}-${e.target}-ref`}>
                        <button
                          onClick={() => setSelectedId(otherId)}
                          className="w-full text-left text-xs px-2.5 py-2 rounded-lg bg-[#6554C0]/10 border border-[#6554C0]/20 hover:bg-[#6554C0]/15 text-foreground transition-colors"
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
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#6554C0]/10 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-[#6554C0] dark:text-[#8777D9] opacity-70" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Select a document</p>
            <p className="text-xs">Click any card to explore prerequisites, dependents, and related docs.</p>
            <div className="mt-6 text-left space-y-2 text-xs rounded-lg border border-border/60 p-3 bg-muted/20">
              <p><strong>{filtered.nodes.length}</strong> documents</p>
              <p><strong>{depCount}</strong> dependency edges</p>
              <p><strong>{refCount}</strong> cross-reference edges</p>
              {isClusterMode && (
                <p className="text-[#6554C0] dark:text-[#8777D9] pt-1 border-t border-border/40">
                  Zoom in to see individual document cards
                </p>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
