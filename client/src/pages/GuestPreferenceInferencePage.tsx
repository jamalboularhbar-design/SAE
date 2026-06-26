import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Zap, Users, TrendingUp, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GuestInference {
  guestId: string;
  guestName: string;
  totalStays: number;
  inferred: {
    roomType: string;
    mealPreference: string;
    activityLevel: string;
    budgetTier: string;
    travelStyle: string;
    specialRequests: string[];
  };
  confidence: number;
  sources: string[];
}

const SAMPLE_INFERENCES: GuestInference[] = [
  {
    guestId: '1',
    guestName: 'Margaret Chen',
    totalStays: 8,
    inferred: {
      roomType: 'Deluxe Suite with Terrace',
      mealPreference: 'Continental breakfast + à la carte dinners',
      activityLevel: 'Moderate (cultural tours, spa)',
      budgetTier: 'Luxury (€300-400/night)',
      travelStyle: 'Couples retreat, anniversary-focused',
      specialRequests: ['Rose petal setup', 'Champagne on arrival', 'Private dinner option'],
    },
    confidence: 94,
    sources: ['7 previous stays', '12 feedback reviews', '5 special requests', 'Booking patterns'],
  },
  {
    guestId: '2',
    guestName: 'James Morrison',
    totalStays: 5,
    inferred: {
      roomType: 'Standard Room with Garden View',
      mealPreference: 'Buffet breakfast, local cuisine',
      activityLevel: 'High (hiking, adventure tours)',
      budgetTier: 'Mid-range (€150-200/night)',
      travelStyle: 'Solo explorer, adventure-seeking',
      specialRequests: ['Early checkout', 'Packed lunch service', 'Local guide recommendations'],
    },
    confidence: 87,
    sources: ['4 previous stays', '8 feedback reviews', '3 special requests', 'Activity bookings'],
  },
  {
    guestId: '3',
    guestName: 'Fatima Al-Rashid',
    totalStays: 12,
    inferred: {
      roomType: 'Presidential Suite',
      mealPreference: 'Halal cuisine, private dining',
      activityLevel: 'Low (relaxation, wellness)',
      budgetTier: 'Ultra-luxury (€500+/night)',
      travelStyle: 'Family VIP, wellness-focused',
      specialRequests: ['Prayer room access', 'Halal chef', 'Family suite configuration', 'Concierge 24/7'],
    },
    confidence: 98,
    sources: ['11 previous stays', '18 feedback reviews', '8 special requests', 'Loyalty patterns'],
  },
];

export default function GuestPreferenceInferencePage() {
  const [, navigate] = useLocation();
  const [selectedGuest, setSelectedGuest] = useState<GuestInference | null>(SAMPLE_INFERENCES[0]);
  const [inferring, setInferring] = useState(false);

  const runInference = () => {
    setInferring(true);
    setTimeout(() => {
      setInferring(false);
      toast.success('Preferences updated from latest feedback');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              AI Guest Preference Inference
            </h1>
            <p className="text-sm text-muted-foreground">Automatically infer guest preferences from stay history and feedback</p>
          </div>
          <Button onClick={runInference} disabled={inferring} className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="w-4 h-4 mr-1" /> {inferring ? 'Inferring...' : 'Run Inference'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guest List */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" /> Guests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {SAMPLE_INFERENCES.map(guest => (
                    <button
                      key={guest.guestId}
                      onClick={() => setSelectedGuest(guest)}
                      className={`w-full text-left p-3 rounded border transition-all ${
                        selectedGuest?.guestId === guest.guestId
                          ? 'border-purple-500/50 bg-purple-500/10'
                          : 'border-border hover:border-purple-500/30'
                      }`}
                    >
                      <p className="text-sm font-medium">{guest.guestName}</p>
                      <p className="text-xs text-muted-foreground">{guest.totalStays} stays • {guest.confidence}% confidence</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inferred Preferences */}
          {selectedGuest && (
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Confidence Score */}
                <Card className={selectedGuest.confidence >= 90 ? 'border-green-500/30' : selectedGuest.confidence >= 75 ? 'border-amber-500/30' : 'border-orange-500/30'}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Inference Confidence</span>
                      <Badge className={selectedGuest.confidence >= 90 ? 'bg-green-500/20 text-green-300' : selectedGuest.confidence >= 75 ? 'bg-amber-500/20 text-amber-300' : 'bg-orange-500/20 text-orange-300'}>
                        {selectedGuest.confidence}%
                      </Badge>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${selectedGuest.confidence}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Based on {selectedGuest.sources.length} data sources</p>
                  </CardContent>
                </Card>

                {/* Room Preference */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" /> Room Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedGuest.inferred.roomType}</p>
                    <p className="text-xs text-muted-foreground mt-1">Recommended for next booking</p>
                  </CardContent>
                </Card>

                {/* Meal Preference */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> Meal Preference
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedGuest.inferred.mealPreference}</p>
                  </CardContent>
                </Card>

                {/* Travel Style */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" /> Travel Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Activity Level:</span> {selectedGuest.inferred.activityLevel}</p>
                      <p className="text-sm"><span className="font-medium">Budget Tier:</span> {selectedGuest.inferred.budgetTier}</p>
                      <p className="text-sm"><span className="font-medium">Style:</span> {selectedGuest.inferred.travelStyle}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Special Requests */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-400" /> Anticipated Special Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedGuest.inferred.specialRequests.map((req, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{req}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Data Sources */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Data Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {selectedGuest.sources.map((source, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-400" /> {source}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Apply to Guest CRM</Button>
                  <Button variant="outline" className="flex-1">Share with Provider</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
