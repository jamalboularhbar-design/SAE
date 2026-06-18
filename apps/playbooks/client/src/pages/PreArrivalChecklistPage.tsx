import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plane, CheckSquare, Square, Clock, AlertCircle, UserCheck } from 'lucide-react';

interface ChecklistStep {
  id: string;
  task: string;
  timing: string;
  responsible: string;
  critical: boolean;
  details: string;
}

const PRE_ARRIVAL_STEPS: ChecklistStep[] = [
  { id: 'pa1', task: 'Confirm booking details with provider', timing: '7 days before', responsible: 'Reservations', critical: true, details: 'Verify room type, dates, rate, and any package inclusions. Ensure provider has the booking in their system.' },
  { id: 'pa2', task: 'Send guest preference brief to provider', timing: '5 days before', responsible: 'Guest Relations', critical: true, details: 'Include dietary requirements, room preferences (pillow type, temperature), past stay notes, and any known allergies.' },
  { id: 'pa3', task: 'Confirm airport transfer arrangements', timing: '5 days before', responsible: 'Operations', critical: true, details: 'Verify flight number, arrival time, driver assignment, vehicle type, and welcome sign details.' },
  { id: 'pa4', task: 'Coordinate welcome amenities with provider', timing: '3 days before', responsible: 'Guest Relations', critical: false, details: 'Arrange welcome basket, flowers, fruit plate, or personalized note based on guest profile and occasion.' },
  { id: 'pa5', task: 'Brief provider on VIP status and special occasions', timing: '3 days before', responsible: 'Concierge Lead', critical: true, details: 'If honeymoon, anniversary, birthday — ensure provider prepares appropriate surprises and room decoration.' },
  { id: 'pa6', task: 'Confirm restaurant reservations for first evening', timing: '3 days before', responsible: 'Experience Coordinator', critical: false, details: 'Book preferred restaurant, communicate dietary needs, arrange transport if needed.' },
  { id: 'pa7', task: 'Verify spa/experience bookings for stay', timing: '2 days before', responsible: 'Experience Coordinator', critical: false, details: 'Confirm all pre-booked experiences (hammam, cooking class, tours) with respective providers.' },
  { id: 'pa8', task: 'Send guest WhatsApp welcome message', timing: '2 days before', responsible: 'Concierge Lead', critical: true, details: 'Introduce yourself, confirm arrival details, ask about any last-minute requests, share weather forecast.' },
  { id: 'pa9', task: 'Final room readiness check with provider', timing: '1 day before', responsible: 'Quality Manager', critical: true, details: 'Confirm room is prepared to standard, amenities placed, any maintenance issues resolved.' },
  { id: 'pa10', task: 'Brief driver with guest details and route', timing: '1 day before', responsible: 'Operations', critical: true, details: 'Share guest photo (if available), flight details, preferred route, water/refreshments in vehicle.' },
  { id: 'pa11', task: 'Prepare concierge welcome folder', timing: '1 day before', responsible: 'Concierge Lead', critical: false, details: 'Print personalized itinerary, local recommendations, emergency contacts, WiFi details.' },
  { id: 'pa12', task: 'Day-of arrival confirmation call to provider', timing: 'Day of arrival', responsible: 'Concierge Lead', critical: true, details: 'Final check: room ready, staff briefed, welcome team in position, any last-minute issues.' },
];

export default function PreArrivalChecklistPage() {
  const [, navigate] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [guestName, setGuestName] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completionRate = PRE_ARRIVAL_STEPS.length > 0
    ? Math.round((completedSteps.size / PRE_ARRIVAL_STEPS.length) * 100)
    : 0;

  const criticalRemaining = PRE_ARRIVAL_STEPS.filter(s => s.critical && !completedSteps.has(s.id)).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Plane className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold">Pre-Arrival Coordination</h1>
          <Badge variant="secondary" className="ml-auto">{completionRate}%</Badge>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Guest Info */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Guest Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="e.g., Mr. & Mrs. Johnson"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Arrival Date</label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={e => setArrivalDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{completedSteps.size} of {PRE_ARRIVAL_STEPS.length} steps completed</span>
            {criticalRemaining > 0 && (
              <span className="text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {criticalRemaining} critical steps remaining
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {PRE_ARRIVAL_STEPS.map(step => {
            const isCompleted = completedSteps.has(step.id);
            return (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all ${isCompleted ? 'opacity-60 border-green-500/30' : step.critical ? 'border-red-500/20 hover:border-red-500/40' : 'hover:border-accent/50'}`}
                onClick={() => toggleStep(step.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-green-500" />
                    ) : (
                      <Square className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {step.task}
                      </p>
                      {step.critical && !isCompleted && (
                        <Badge variant="outline" className="text-xs text-red-400 bg-red-500/10 border-red-500/30">Critical</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{step.details}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {step.timing}</span>
                      <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> {step.responsible}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
