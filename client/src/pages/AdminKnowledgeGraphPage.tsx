import { useRef, useEffect, useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Share2, Loader2, Search, Filter, X } from 'lucide-react';
import { useLocation } from 'wouter';

const COLORS: Record<string, string> = {
  'Luxury Travel': '#e8a04e',
  'Creative Studio': '#4ea0e8',
  'Operations': '#4ee8a0',
  'Marketing': '#e84ea0',
  'Finance': '#a04ee8',
};

function getColor(group: string | null): string {
  if (!group) return '#888';
  return COLORS[group] || `hsl(${Math.abs(group.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 360}, 60%, 55%)`;
}

export default function AdminKnowledgeGraphPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isAdmin = user?.role === 'admin';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data, isLoading } = trpc.knowledgeGraph.data.useQuery(undefined, { enabled: isAdmin });

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<number | string | null>(null);

  // Extract categories from data
  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.nodes.map((n: any) => n.group).filter(Boolean))) as string[];
  }, [data]);

  // Filter nodes based on search and category
  const filteredData = useMemo(() => {
    if (!data) return null;
    let filteredNodes = data.nodes;
    let filteredEdges = data.edges;

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredNodes = filteredNodes.filter((n: any) => n.group === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter((n: any) =>
        (n.label || '').toLowerCase().includes(q) ||
        (n.group || '').toLowerCase().includes(q)
      );
    }

    // Only keep edges between visible nodes
    const nodeIds = new Set(filteredNodes.map((n: any) => n.id));
    filteredEdges = filteredEdges.filter((e: any) => nodeIds.has(e.source) && nodeIds.has(e.target));

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [data, searchQuery, selectedCategory]);

  // Highlighted nodes (search match highlighting)
  const highlightedNodeIds = useMemo(() => {
    if (!searchQuery.trim() || !data) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(
      data.nodes
        .filter((n: any) => (n.label || '').toLowerCase().includes(q))
        .map((n: any) => n.id)
    );
  }, [data, searchQuery]);

  useEffect(() => {
    if (!filteredData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = canvas.parentElement?.clientWidth || 900;
    const H = canvas.height = 600;
    const { nodes, edges } = filteredData;
    if (nodes.length === 0) {
      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No matching documents found', W / 2, H / 2);
      return;
    }

    // Simple force-directed layout
    const positions = nodes.map((_: any, i: number) => ({
      x: W / 2 + (Math.cos(i * 2.399) * Math.min(W, H) * 0.35),
      y: H / 2 + (Math.sin(i * 2.399) * Math.min(W, H) * 0.35),
      vx: 0, vy: 0,
    }));

    const nodeMap = new Map(nodes.map((n: any, i: number) => [n.id, i]));

    // Run simple simulation
    for (let iter = 0; iter < 100; iter++) {
      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = positions[j].x - positions[i].x;
          const dy = positions[j].y - positions[i].y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = 5000 / (dist * dist);
          positions[i].vx -= (dx / dist) * force;
          positions[i].vy -= (dy / dist) * force;
          positions[j].vx += (dx / dist) * force;
          positions[j].vy += (dy / dist) * force;
        }
      }
      // Attraction along edges
      for (const edge of edges) {
        const si = nodeMap.get(edge.source);
        const ti = nodeMap.get(edge.target);
        if (si === undefined || ti === undefined) continue;
        const dx = positions[ti].x - positions[si].x;
        const dy = positions[ti].y - positions[si].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = (dist - 120) * 0.01;
        positions[si].vx += (dx / dist) * force;
        positions[si].vy += (dy / dist) * force;
        positions[ti].vx -= (dx / dist) * force;
        positions[ti].vy -= (dy / dist) * force;
      }
      // Center gravity
      for (let i = 0; i < nodes.length; i++) {
        positions[i].vx += (W / 2 - positions[i].x) * 0.001;
        positions[i].vy += (H / 2 - positions[i].y) * 0.001;
        positions[i].x += positions[i].vx * 0.5;
        positions[i].y += positions[i].vy * 0.5;
        positions[i].vx *= 0.9;
        positions[i].vy *= 0.9;
        positions[i].x = Math.max(40, Math.min(W - 40, positions[i].x));
        positions[i].y = Math.max(40, Math.min(H - 40, positions[i].y));
      }
    }

    // Draw
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, W, H);

    // Edges
    for (const edge of edges) {
      const si = nodeMap.get(edge.source);
      const ti = nodeMap.get(edge.target);
      if (si === undefined || ti === undefined) continue;
      const sourceHighlighted = highlightedNodeIds.has(edge.source);
      const targetHighlighted = highlightedNodeIds.has(edge.target);
      ctx.strokeStyle = (sourceHighlighted || targetHighlighted) ? 'rgba(232,160,78,0.4)' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = (sourceHighlighted || targetHighlighted) ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(positions[si].x, positions[si].y);
      ctx.lineTo(positions[ti].x, positions[ti].y);
      ctx.stroke();
    }

    // Nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const pos = positions[i];
      const color = getColor(node.group);
      const isHighlighted = highlightedNodeIds.size > 0 && highlightedNodeIds.has(node.id);
      const isHovered = hoveredNode === node.id;
      const radius = isHighlighted ? 9 : isHovered ? 8 : 6;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (isHighlighted || isHovered) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();

      // Label
      const opacity = highlightedNodeIds.size > 0 ? (isHighlighted ? 1 : 0.3) : 0.8;
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.font = isHighlighted ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      const label = (node.label || '').length > 20 ? (node.label || '').slice(0, 18) + '…' : (node.label || '');
      ctx.fillText(label, pos.x, pos.y + radius + 12);
    }

    // Legend
    const legendCategories = Array.from(new Set(nodes.map((n: any) => n.group).filter(Boolean)));
    let ly = 20;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    for (const cat of legendCategories) {
      ctx.fillStyle = getColor(cat as string);
      ctx.beginPath();
      ctx.arc(20, ly, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(cat as string, 32, ly + 4);
      ly += 18;
    }
  }, [filteredData, highlightedNodeIds, hoveredNode]);

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Share2 className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Knowledge Graph</h1>
        </div>
      </header>

      <div className="container py-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-3 py-2 text-sm text-accent hover:text-accent/80 border border-accent/30 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Stats bar */}
        {filteredData && (
          <div className="flex gap-4 text-sm text-muted-foreground mb-4">
            <span>{filteredData.nodes.length} documents</span>
            <span>{filteredData.edges.length} connections</span>
            {searchQuery && highlightedNodeIds.size > 0 && (
              <span className="text-accent">{highlightedNodeIds.size} matches highlighted</span>
            )}
            {data && filteredData.nodes.length < data.nodes.length && (
              <span className="text-yellow-400/80">
                Showing {filteredData.nodes.length} of {data.nodes.length} total
              </span>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : filteredData && filteredData.nodes.length > 0 ? (
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <canvas ref={canvasRef} className="w-full" style={{ height: 600 }} />
          </div>
        ) : filteredData && filteredData.nodes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No documents match your search criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 text-accent hover:text-accent/80 text-sm underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Share2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No documents or cross-references found. Add documents and cross-references to visualize the knowledge graph.</p>
          </div>
        )}
      </div>
    </div>
  );
}
