import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Kanban, Plus, Calendar, User, Building2, DollarSign, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type Stage = 'inquiry' | 'quoted' | 'confirmed' | 'pre_arrival' | 'checked_in' | 'checked_out';

interface Booking {
  id: string;
  guestName: string;
  provider: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  value: number;
  stage: Stage;
  notes?: string;
}

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: 'inquiry', label: 'Inquiry', color: 'border-blue-500/50' },
  { key: 'quoted', label: 'Quoted', color: 'border-amber-500/50' },
  { key: 'confirmed', label: 'Confirmed', color: 'border-green-500/50' },
  { key: 'pre_arrival', label: 'Pre-Arrival', color: 'border-purple-500/50' },
  { key: 'checked_in', label: 'Checked In', color: 'border-cyan-500/50' },
  { key: 'checked_out', label: 'Checked Out', color: 'border-zinc-500/50' },
];

const SAMPLE_BOOKINGS: Booking[] = [
  { id: '1', guestName: 'James & Sarah Mitchell', provider: 'Royal Mansour', checkIn: '2026-06-15', checkOut: '2026-06-20', nights: 5, value: 8500, stage: 'confirmed', notes: 'Anniversary trip, need rose petals' },
  { id: '2', guestName: 'Pierre Dupont', provider: 'Riad Yasmine', checkIn: '2026-06-18', checkOut: '2026-06-22', nights: 4, value: 3200, stage: 'pre_arrival', notes: 'Returning guest, prefers room 3' },
  { id: '3', guestName: 'Akiko Tanaka', provider: 'La Mamounia', checkIn: '2026-07-01', checkOut: '2026-07-05', nights: 4, value: 6800, stage: 'inquiry', notes: 'First time in Morocco' },
  { id: '4', guestName: 'Hans Weber', provider: 'Kasbah Tamadot', checkIn: '2026-06-10', checkOut: '2026-06-14', nights: 4, value: 5200, stage: 'quoted' },
  { id: '5', guestName: 'Maria Santos', provider: 'Dar Anika', checkIn: '2026-06-08', checkOut: '2026-06-12', nights: 4, value: 2800, stage: 'checked_in' },
  { id: '6', guestName: 'Robert Chen', provider: 'Selman Marrakech', checkIn: '2026-05-28', checkOut: '2026-06-02', nights: 5, value: 7500, stage: 'checked_out' },
  { id: '7', guestName: 'Elena Rossi', provider: 'Riad Kniza', checkIn: '2026-06-20', checkOut: '2026-06-24', nights: 4, value: 2400, stage: 'inquiry' },
  { id: '8', guestName: 'David Thompson', provider: 'Riad 72', checkIn: '2026-06-25', checkOut: '2026-06-28', nights: 3, value: 1800, stage: 'quoted', notes: 'Needs airport transfer' },
];

export default function BookingPipelinePage() {
  const [, navigate] = useLocation();
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);

  const moveBooking = (id: string, direction: 'forward' | 'back') => {
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const currentIdx = STAGES.findIndex(s => s.key === b.stage);
      const newIdx = direction === 'forward' ? Math.min(currentIdx + 1, STAGES.length - 1) : Math.max(currentIdx - 1, 0);
      toast.success(`Moved to ${STAGES[newIdx].label}`);
      return { ...b, stage: STAGES[newIdx].key };
    }));
  };

  const totalValue = bookings.filter(b => b.stage !== 'checked_out').reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Kanban className="w-6 h-6 text-blue-400" />
              Booking Pipeline
            </h1>
            <p className="text-sm text-muted-foreground">Track bookings from inquiry to checkout</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Active Pipeline Value</p>
            <p className="text-xl font-bold text-green-400">${totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
          {STAGES.map(stage => {
            const stageBookings = bookings.filter(b => b.stage === stage.key);
            const stageValue = stageBookings.reduce((sum, b) => sum + b.value, 0);
            return (
              <div key={stage.key} className="min-w-[250px]">
                <div className={`border-t-2 ${stage.color} rounded-t-lg bg-card/30 p-3 mb-2`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{stage.label}</h3>
                    <Badge variant="outline" className="text-xs">{stageBookings.length}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">${stageValue.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  {stageBookings.map(booking => (
                    <Card key={booking.id} className="hover:border-accent/50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-1 mb-2">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <p className="text-sm font-medium truncate">{booking.guestName}</p>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{booking.provider}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{booking.checkIn} ({booking.nights}n)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-green-400 font-medium">${booking.value.toLocaleString()}</span>
                          </div>
                        </div>
                        {booking.notes && <p className="text-xs text-amber-400/80 mt-2 italic">{booking.notes}</p>}
                        <div className="flex gap-1 mt-2">
                          {stage.key !== 'inquiry' && (
                            <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => moveBooking(booking.id, 'back')}>
                              ← Back
                            </Button>
                          )}
                          {stage.key !== 'checked_out' && (
                            <Button variant="ghost" size="sm" className="text-xs h-6 px-2 ml-auto" onClick={() => moveBooking(booking.id, 'forward')}>
                              Next <ChevronRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
