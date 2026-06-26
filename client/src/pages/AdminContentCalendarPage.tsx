import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Calendar, FileText, Clock, AlertCircle, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-400 border-l-2 border-gray-400',
  review: 'bg-yellow-500/10 text-yellow-400 border-l-2 border-yellow-400',
  published: 'bg-green-500/10 text-green-400 border-l-2 border-green-400',
  created: 'bg-green-500/10 text-green-400',
  scheduled: 'bg-blue-500/10 text-blue-400',
  review_due: 'bg-orange-500/10 text-orange-400',
};

export default function AdminContentCalendarPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [dragItem, setDragItem] = useState<any>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`;

  const utils = trpc.useUtils();
  const { data: events } = trpc.contentCalendar.events.useQuery(
    { startDate, endDate },
    { enabled: isAdmin }
  );

  const rescheduleMut = trpc.scheduledPublish.schedule.useMutation({
    onSuccess: () => {
      utils.contentCalendar.events.invalidate();
      toast.success('Event rescheduled');
    },
    onError: () => toast.error('Failed to reschedule'),
  });

  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  const eventsByDay = useMemo(() => {
    if (!events) return new Map<number, typeof events>();
    const map = new Map<number, typeof events>();
    for (const event of events) {
      if (!event.date) continue;
      const day = new Date(event.date).getDate();
      const existing = map.get(day) || [];
      existing.push(event);
      map.set(day, existing);
    }
    return map;
  }, [events]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleDragStart = (ev: any, event: any) => {
    ev.dataTransfer.setData('text/plain', JSON.stringify(event));
    setDragItem(event);
  };

  const handleDragOver = (ev: any) => {
    ev.preventDefault();
  };

  const handleDrop = (ev: any, targetDay: number) => {
    ev.preventDefault();
    if (!dragItem || dragItem.type !== 'scheduled') {
      toast.error('Only scheduled events can be rescheduled');
      setDragItem(null);
      return;
    }
    const newDate = new Date(year, month, targetDay, 12, 0, 0);
    if (newDate <= new Date()) {
      toast.error('Cannot schedule in the past');
      setDragItem(null);
      return;
    }
    rescheduleMut.mutate({ documentSlug: dragItem.slug, publishAt: newDate.toISOString() });
    setDragItem(null);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Calendar className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Content Calendar</h1>
          <span className="text-xs text-muted-foreground ml-2">(Drag scheduled events to reschedule)</span>
        </div>
      </header>

      <div className="container py-6 max-w-4xl">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-card/50 text-muted-foreground">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-foreground">{monthNames[month]} {year}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-card/50 text-muted-foreground">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-border/30 rounded-xl overflow-hidden border border-border/50">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-card/50 p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
          ))}
          {/* Day cells */}
          {days.map((day, idx) => {
            const dayEvents = day ? eventsByDay.get(day) || [] : [];
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            return (
              <div
                key={idx}
                className={`bg-background min-h-[80px] p-1.5 ${!day ? 'bg-card/20' : ''} ${isToday ? 'ring-1 ring-accent/50' : ''}`}
                onDragOver={day ? handleDragOver : undefined}
                onDrop={day ? (ev) => handleDrop(ev, day) : undefined}
              >
                {day && (
                  <>
                    <span className={`text-xs font-medium ${isToday ? 'text-accent' : 'text-muted-foreground'}`}>{day}</span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 3).map((ev, i) => (
                        <div
                          key={i}
                          draggable={ev.type === 'scheduled'}
                          onDragStart={ev.type === 'scheduled' ? (e) => handleDragStart(e, ev) : undefined}
                          onClick={() => ev.slug && navigate(`/docs/${ev.slug}`)}
                          className={`w-full text-left px-1 py-0.5 rounded text-[9px] truncate cursor-pointer flex items-center gap-0.5 ${
                            STATUS_COLORS[ev.type] || 'bg-gray-500/10 text-gray-400'
                          } ${ev.type === 'scheduled' ? 'cursor-grab active:cursor-grabbing' : ''}`}
                          title={`${ev.title || ''} (${ev.type})`}
                        >
                          {ev.type === 'scheduled' && <GripVertical className="w-2 h-2 flex-shrink-0 opacity-50" />}
                          {ev.type === 'created' && <FileText className="w-2.5 h-2.5 flex-shrink-0" />}
                          {ev.type === 'scheduled' && <Clock className="w-2.5 h-2.5 flex-shrink-0" />}
                          {ev.type === 'review_due' && <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />}
                          <span className="truncate">{ev.title?.slice(0, 15)}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] text-muted-foreground pl-1">+{dayEvents.length - 3} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Created</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Scheduled (draggable)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Review Due</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> In Review</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> Draft</span>
        </div>
      </div>
    </div>
  );
}
