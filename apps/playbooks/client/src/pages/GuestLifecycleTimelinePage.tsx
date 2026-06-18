import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Calendar, MessageSquare, Star, Home, Zap } from 'lucide-react';

interface TimelineEvent {
  date: string;
  type: 'booking' | 'stay' | 'feedback' | 'preference' | 'communication' | 'special_request';
  title: string;
  description: string;
  details?: string;
  rating?: number;
  provider?: string;
}

const GUEST_TIMELINE: TimelineEvent[] = [
  {
    date: 'May 2026',
    type: 'booking',
    title: 'Booking #5 Confirmed',
    description: 'Suite Deluxe, Royal Mansour',
    details: 'June 15-22, 2026 • €3,500',
    provider: 'Royal Mansour',
  },
  {
    date: 'Apr 2026',
    type: 'feedback',
    title: 'Post-Stay Feedback',
    description: 'Rated stay 5/5 stars',
    rating: 5,
    provider: 'La Mamounia',
  },
  {
    date: 'Apr 2026',
    type: 'stay',
    title: 'Checkout',
    description: 'La Mamounia (Suite Prestige)',
    details: 'April 8-15, 2026 • 7 nights',
    provider: 'La Mamounia',
  },
  {
    date: 'Apr 2026',
    type: 'special_request',
    title: 'Special Request Added',
    description: 'Requested: Rose petals + champagne on arrival',
    provider: 'La Mamounia',
  },
  {
    date: 'Apr 2026',
    type: 'stay',
    title: 'Check-in',
    description: 'La Mamounia (Suite Prestige)',
    provider: 'La Mamounia',
  },
  {
    date: 'Mar 2026',
    type: 'communication',
    title: 'Pre-Arrival Coordination',
    description: 'Confirmed dietary preferences and room setup',
    provider: 'La Mamounia',
  },
  {
    date: 'Mar 2026',
    type: 'booking',
    title: 'Booking #4 Confirmed',
    description: 'Suite Prestige, La Mamounia',
    details: 'April 8-15, 2026 • €2,800',
    provider: 'La Mamounia',
  },
  {
    date: 'Feb 2026',
    type: 'preference',
    title: 'Preference Updated',
    description: 'Updated: Prefers garden views, early breakfast',
  },
  {
    date: 'Jan 2026',
    type: 'feedback',
    title: 'Post-Stay Feedback',
    description: 'Rated stay 4.5/5 stars',
    rating: 4.5,
    provider: 'Selman Marrakech',
  },
  {
    date: 'Jan 2026',
    type: 'stay',
    title: 'Checkout',
    description: 'Selman Marrakech (Junior Suite)',
    details: 'January 18-25, 2026 • 7 nights',
    provider: 'Selman Marrakech',
  },
];

const TYPE_ICONS: Record<string, any> = {
  booking: <Calendar className="w-5 h-5 text-blue-400" />,
  stay: <Home className="w-5 h-5 text-green-400" />,
  feedback: <Star className="w-5 h-5 text-amber-400" />,
  preference: <Zap className="w-5 h-5 text-purple-400" />,
  communication: <MessageSquare className="w-5 h-5 text-cyan-400" />,
  special_request: <Zap className="w-5 h-5 text-orange-400" />,
};

export default function GuestLifecycleTimelinePage() {
  const [, navigate] = useLocation();
  const [selectedGuest] = useState('Margaret Chen');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Guest Lifecycle Timeline
            </h1>
            <p className="text-sm text-muted-foreground">{selectedGuest} • 5 stays • Member since Jan 2026</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Total Stays</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">€13k+</p>
              <p className="text-xs text-muted-foreground">Lifetime Value</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-transparent" />

          {/* Events */}
          <div className="space-y-6">
            {GUEST_TIMELINE.map((event, idx) => (
              <div key={idx} className="relative pl-16">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-background border-2 border-purple-500 flex items-center justify-center">
                  {TYPE_ICONS[event.type]}
                </div>

                {/* Event card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <h3 className="text-sm font-medium mt-1">{event.title}</h3>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">{event.type.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    {event.details && <p className="text-xs text-muted-foreground mt-2">{event.details}</p>}
                    {event.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(event.rating!) ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">{event.rating}/5</span>
                      </div>
                    )}
                    {event.provider && (
                      <Badge variant="outline" className="text-xs mt-2">
                        {event.provider}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Guest Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✓ <span className="text-muted-foreground">Prefers luxury properties (Platinum tier)</span></p>
              <p>✓ <span className="text-muted-foreground">Books 6-8 weeks in advance</span></p>
              <p>✓ <span className="text-muted-foreground">Consistently high satisfaction (4.8/5 avg)</span></p>
              <p>✓ <span className="text-muted-foreground">Romantic travel style (couples retreats)</span></p>
              <p>✓ <span className="text-muted-foreground">Appreciates special touches (rose petals, champagne)</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
