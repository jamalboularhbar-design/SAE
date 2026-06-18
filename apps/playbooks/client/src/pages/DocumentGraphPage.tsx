import { useMemo, useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Network, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// Simple force-directed graph rendered on canvas
interface Node { id: string; label: string; category: string; size: number; x: number; y: number; vx: number; vy: number; }
interface Edge { source: string; target: string; }

const CATEGORY_COLORS: Record<string, string> = {
  'Operations': '#c9a96e',
  'Customer Success': '#4ade80',
  'Finance': '#60a5fa',
  'Marketing': '#f472b6',
  'Technology': '#a78bfa',
  'HR': '#fb923c',
  'Legal': '#f87171',
  'Sales': '#34d399',
  'Strategy': '#fbbf24',
  'Product': '#818cf8',
  'Data': '#2dd4bf',
  'Security': '#ef4444',
  'Design': '#e879f9',
  'Partnerships': '#22d3ee',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#c9a96e';
}

export default function DocumentGraphPage() {
  const [, navigate] = useLocation();
  const { data: graphData, isLoading } = trpc.documentGraph.get.useQuery();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animRef = useRef<number>(0);

  // Initialize nodes with random positions
  const initialized = useMemo(() => {
    if (!graphData) return false;
    const nodes: Node[] = graphData.nodes.map((n, i) => ({
      ...n,
      x: 400 + Math.cos(i * 0.5) * 200 + Math.random() * 100,
      y: 300 + Math.sin(i * 0.5) * 200 + Math.random() * 100,
      vx: 0,
      vy: 0,
    }));
    nodesRef.current = nodes;
    edgesRef.current = graphData.edges;
    return true;
  }, [graphData]);

  // Force simulation
  useEffect(() => {
    if (!initialized || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    let iteration = 0;

    function simulate() {
      if (!running) return;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const damping = Math.max(0.01, 0.1 - iteration * 0.001);

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = 500 / (dist * dist);
          nodes[i].vx -= (dx / dist) * force;
          nodes[i].vy -= (dy / dist) * force;
          nodes[j].vx += (dx / dist) * force;
          nodes[j].vy += (dy / dist) * force;
        }
      }

      // Attraction along edges
      const nodeMap = new Map(nodes.map(n => [n.id, n]));
      for (const edge of edges) {
        const s = nodeMap.get(edge.source);
        const t = nodeMap.get(edge.target);
        if (!s || !t) continue;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = (dist - 100) * 0.01;
        s.vx += (dx / dist) * force;
        s.vy += (dy / dist) * force;
        t.vx -= (dx / dist) * force;
        t.vy -= (dy / dist) * force;
      }

      // Center gravity
      for (const node of nodes) {
        node.vx += (400 - node.x) * 0.001;
        node.vy += (300 - node.y) * 0.001;
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx * damping * 10;
        node.y += node.vy * damping * 10;
      }

      iteration++;
      draw();
      if (iteration < 300) {
        animRef.current = requestAnimationFrame(simulate);
      }
    }

    function draw() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2 * (1 - zoom), h / 2 * (1 - zoom));
      ctx.scale(zoom, zoom);

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const nodeMap = new Map(nodes.map(n => [n.id, n]));

      // Draw edges
      ctx.strokeStyle = 'rgba(201, 169, 110, 0.2)';
      ctx.lineWidth = 1;
      for (const edge of edges) {
        const s = nodeMap.get(edge.source);
        const t = nodeMap.get(edge.target);
        if (!s || !t) continue;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const radius = Math.max(3, Math.min(8, Math.sqrt(node.size / 500)));
        const isHovered = hoveredNode === node.id;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? radius + 2 : radius, 0, Math.PI * 2);
        ctx.fillStyle = getCategoryColor(node.category);
        ctx.fill();
        if (isHovered) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Draw label
          ctx.fillStyle = '#fff';
          ctx.font = '10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.label.slice(0, 30), node.x, node.y - radius - 6);
        }
      }

      ctx.restore();
    }

    simulate();
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [initialized, zoom, hoveredNode]);

  // Mouse hover detection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;
    let found: string | null = null;
    for (const node of nodesRef.current) {
      const dx = node.x - mx;
      const dy = node.y - my;
      if (dx * dx + dy * dy < 100) { found = node.id; break; }
    }
    setHoveredNode(found);
  };

  const handleClick = () => {
    if (hoveredNode) navigate(`/docs/${hoveredNode}`);
  };

  // Legend
  const categories = useMemo(() => {
    if (!graphData) return [];
    const cats = Array.from(new Set(graphData.nodes.map(n => n.category)));
    return cats.slice(0, 10);
  }, [graphData]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Network className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Document Graph</h1>
          <span className="text-xs text-muted-foreground ml-2">Relationship visualization</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-1.5 rounded-md hover:bg-card/50 text-muted-foreground">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-1.5 rounded-md hover:bg-card/50 text-muted-foreground">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(1)} className="p-1.5 rounded-md hover:bg-card/50 text-muted-foreground">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-[600px] text-muted-foreground">Loading graph data...</div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-[600px] cursor-crosshair"
              onMouseMove={handleMouseMove}
              onClick={handleClick}
            />
            {/* Legend */}
            <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-card/90 border border-border/50 backdrop-blur-sm">
              <p className="text-xs font-semibold text-foreground mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-1">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(cat) }} />
                    <span className="text-[10px] text-muted-foreground">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Stats */}
            <div className="absolute top-4 right-4 p-3 rounded-lg bg-card/90 border border-border/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">{graphData?.nodes.length || 0} documents</p>
              <p className="text-xs text-muted-foreground">{graphData?.edges.length || 0} connections</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
