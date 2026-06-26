import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, GripVertical, Eye, EyeOff, Save, LayoutDashboard, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';

const DEFAULT_WIDGETS = [
  { widgetKey: 'stats-overview', label: 'Stats Overview', position: 0, visible: 1, width: 'full' },
  { widgetKey: 'recent-activity', label: 'Recent Activity', position: 1, visible: 1, width: 'half' },
  { widgetKey: 'popular-docs', label: 'Popular Documents', position: 2, visible: 1, width: 'half' },
  { widgetKey: 'content-health', label: 'Content Health', position: 3, visible: 1, width: 'third' },
  { widgetKey: 'stale-docs', label: 'Stale Documents', position: 4, visible: 1, width: 'third' },
  { widgetKey: 'category-distribution', label: 'Category Distribution', position: 5, visible: 1, width: 'third' },
  { widgetKey: 'search-analytics', label: 'Search Analytics', position: 6, visible: 1, width: 'half' },
  { widgetKey: 'reading-trends', label: 'Reading Trends', position: 7, visible: 1, width: 'half' },
];

interface Widget {
  widgetKey: string;
  label?: string;
  position: number;
  visible: number;
  width: string;
}

export default function AdminDashboardWidgetConfigPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isAdmin = user?.role === 'admin';
  const { data: savedConfig, isLoading } = trpc.dashboardWidgets.get.useQuery(undefined, { enabled: isAdmin });
  const saveMut = trpc.dashboardWidgets.save.useMutation({
    onSuccess: () => toast.success('Widget layout saved'),
    onError: () => toast.error('Failed to save layout'),
  });

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    if (savedConfig && savedConfig.length > 0) {
      const merged = DEFAULT_WIDGETS.map(dw => {
        const saved = savedConfig.find((s: any) => s.widgetKey === dw.widgetKey);
        return saved ? { ...dw, position: saved.position, visible: saved.visible, width: saved.width } : dw;
      });
      merged.sort((a, b) => a.position - b.position);
      setWidgets(merged);
    } else if (!isLoading) {
      setWidgets([...DEFAULT_WIDGETS]);
    }
  }, [savedConfig, isLoading]);

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...widgets];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    updated.forEach((w, i) => w.position = i);
    setWidgets(updated);
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const toggleVisibility = (idx: number) => {
    const updated = [...widgets];
    updated[idx].visible = updated[idx].visible ? 0 : 1;
    setWidgets(updated);
  };

  const cycleWidth = (idx: number) => {
    const widths = ['full', 'half', 'third'];
    const updated = [...widgets];
    const current = widths.indexOf(updated[idx].width);
    updated[idx].width = widths[(current + 1) % widths.length];
    setWidgets(updated);
  };

  const handleSave = () => {
    saveMut.mutate({ widgets: widgets.map(w => ({ widgetKey: w.widgetKey, position: w.position, visible: w.visible, width: w.width })) });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <LayoutDashboard className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Dashboard Widget Config</h1>
          <div className="ml-auto">
            <Button onClick={handleSave} disabled={saveMut.isPending} size="sm">
              {saveMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Layout
            </Button>
          </div>
        </div>
      </header>
      <div className="container py-8 max-w-3xl">
        <p className="text-sm text-muted-foreground mb-6">Drag to reorder widgets, toggle visibility, and click the width badge to cycle between full/half/third.</p>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : (
          <div className="space-y-2">
            {widgets.map((w, idx) => (
              <Card
                key={w.widgetKey}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`cursor-grab active:cursor-grabbing transition-all ${dragIdx === idx ? 'ring-2 ring-accent' : ''} ${!w.visible ? 'opacity-50' : ''}`}
              >
                <CardContent className="flex items-center gap-3 py-3 px-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-sm flex-1">{w.label || w.widgetKey}</span>
                  <Badge variant="outline" className="cursor-pointer select-none" onClick={() => cycleWidth(idx)}>
                    {w.width}
                  </Badge>
                  <button onClick={() => toggleVisibility(idx)} className="p-1 rounded hover:bg-muted transition-colors">
                    {w.visible ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
