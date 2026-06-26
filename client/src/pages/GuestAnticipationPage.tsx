import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Clock, Heart, AlertCircle, Plane, Gift, Utensils, Star } from 'lucide-react';

type TimeFrame = 'pre-arrival' | 'during-stay' | 'pre-departure';

interface AnticipationAction {
  id: string;
  title: string;
  description: string;
  timeFrame: TimeFrame;
  triggerDays: string;
  providerAction: string;
  conciergeAction: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const ANTICIPATION_ACTIONS: AnticipationAction[] = [
  // Pre-Arrival
  { id: 'a1', title: 'Dietary & Allergy Brief', description: 'Send guest dietary requirements and allergies to provider kitchen team', timeFrame: 'pre-arrival', triggerDays: '3 days before', providerAction: 'Prepare allergen-free menu options, brief kitchen staff', conciergeAction: 'Extract from booking form, confirm with guest via WhatsApp', priority: 'high', category: 'F&B' },
  { id: 'a2', title: 'Room Preference Setup', description: 'Communicate room temperature, pillow type, minibar preferences to provider', timeFrame: 'pre-arrival', triggerDays: '2 days before', providerAction: 'Configure room per preferences, stock minibar accordingly', conciergeAction: 'Review guest history, send preference sheet to provider', priority: 'high', category: 'Accommodation' },
  { id: 'a3', title: 'Welcome Amenity Coordination', description: 'Arrange personalized welcome gift based on guest profile (honeymoon, birthday, anniversary)', timeFrame: 'pre-arrival', triggerDays: '2 days before', providerAction: 'Place welcome amenity in room, prepare welcome card', conciergeAction: 'Identify occasion from booking, select appropriate amenity, brief provider', priority: 'medium', category: 'Experience' },
  { id: 'a4', title: 'Transfer Timing Optimization', description: 'Confirm flight details and optimize airport transfer timing with buffer', timeFrame: 'pre-arrival', triggerDays: '1 day before', providerAction: 'Ensure early check-in if flight arrives before standard time', conciergeAction: 'Track flight, confirm driver, notify provider of ETA', priority: 'high', category: 'Transport' },
  { id: 'a5', title: 'Local Experience Pre-booking', description: 'Pre-book restaurant reservations, spa treatments based on guest interests', timeFrame: 'pre-arrival', triggerDays: '3 days before', providerAction: 'Reserve spa slots, prepare treatment rooms', conciergeAction: 'Suggest experiences based on profile, confirm bookings', priority: 'medium', category: 'Experience' },
  // During Stay
  { id: 'a6', title: 'Day 2 Check-in Call', description: 'Proactive satisfaction check after first night — catch issues early', timeFrame: 'during-stay', triggerDays: 'Morning of day 2', providerAction: 'Be prepared to resolve any room/service issues immediately', conciergeAction: 'WhatsApp guest: "How was your first night? Anything we can improve?"', priority: 'high', category: 'Service' },
  { id: 'a7', title: 'Weather-Adaptive Itinerary', description: 'Monitor weather and proactively suggest indoor alternatives if rain expected', timeFrame: 'during-stay', triggerDays: 'Daily check', providerAction: 'Ensure indoor activities (hammam, cooking class) are available', conciergeAction: 'Check forecast, message guest with alternative suggestions', priority: 'medium', category: 'Experience' },
  { id: 'a8', title: 'Special Occasion Surprise', description: 'If birthday/anniversary during stay, coordinate surprise with provider', timeFrame: 'during-stay', triggerDays: 'Day of occasion', providerAction: 'Prepare cake/flowers/decoration in room, arrange special dinner setup', conciergeAction: 'Confirm occasion date, brief provider on surprise elements', priority: 'high', category: 'Experience' },
  { id: 'a9', title: 'Mid-Stay Refresh', description: 'For stays 4+ nights, offer room refresh or upgrade if available', timeFrame: 'during-stay', triggerDays: 'Day 3-4', providerAction: 'Check upgrade availability, prepare fresh amenities', conciergeAction: 'Offer upgrade/refresh via WhatsApp, coordinate with provider', priority: 'low', category: 'Accommodation' },
  { id: 'a10', title: 'Restaurant Reservation Proactive', description: 'Suggest dinner reservations for popular spots before guest asks', timeFrame: 'during-stay', triggerDays: 'Daily by 2pm', providerAction: 'Provide in-house dining option as backup', conciergeAction: 'Message guest with tonight\'s restaurant suggestion + reservation offer', priority: 'medium', category: 'F&B' },
  // Pre-Departure
  { id: 'a11', title: 'Departure Logistics', description: 'Confirm checkout time, arrange luggage storage if late flight, confirm transfer', timeFrame: 'pre-departure', triggerDays: '1 day before departure', providerAction: 'Prepare luggage storage, arrange late checkout if possible', conciergeAction: 'Confirm flight details, arrange transfer, offer luggage storage', priority: 'high', category: 'Transport' },
  { id: 'a12', title: 'Feedback Collection', description: 'Collect feedback while experience is fresh, before departure', timeFrame: 'pre-departure', triggerDays: 'Evening before departure', providerAction: 'Prepare farewell amenity, ensure smooth checkout process', conciergeAction: 'Send feedback form, ask for review, offer return booking incentive', priority: 'medium', category: 'Service' },
  { id: 'a13', title: 'Souvenir & Shopping Assistance', description: 'Offer last-minute shopping assistance for authentic local products', timeFrame: 'pre-departure', triggerDays: '2 days before departure', providerAction: 'Provide trusted artisan/shop recommendations if asked', conciergeAction: 'Suggest curated shopping experiences, offer guide for souk visit', priority: 'low', category: 'Experience' },
  { id: 'a14', title: 'Return Trip Seed', description: 'Plant seed for return visit — mention upcoming seasonal highlights', timeFrame: 'pre-departure', triggerDays: 'Day of departure', providerAction: 'Include "welcome back" card with farewell gift', conciergeAction: 'Mention next season\'s highlights, offer early-bird return booking', priority: 'medium', category: 'Service' },
];

const TIME_FRAME_CONFIG: Record<TimeFrame, { label: string; icon: typeof Plane; color: string }> = {
  'pre-arrival': { label: 'Pre-Arrival', icon: Plane, color: 'bg-blue-100 text-blue-800' },
  'during-stay': { label: 'During Stay', icon: Heart, color: 'bg-green-100 text-green-800' },
  'pre-departure': { label: 'Pre-Departure', icon: Gift, color: 'bg-purple-100 text-purple-800' },
};

export default function GuestAnticipationPage() {
  const [, navigate] = useLocation();
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(ANTICIPATION_ACTIONS.map(a => a.category)));
    return ['all', ...cats];
  }, []);

  const filtered = useMemo(() => {
    return ANTICIPATION_ACTIONS.filter(a => {
      if (activeTimeFrame !== 'all' && a.timeFrame !== activeTimeFrame) return false;
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      return true;
    });
  }, [activeTimeFrame, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/60 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" /> Guest Anticipation Playbook
            </h1>
            <p className="text-slate-500 text-sm">Proactive actions to delight guests before they ask — coordinated with providers</p>
          </div>
        </div>

        {/* Time Frame Tabs */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <button onClick={() => setActiveTimeFrame('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTimeFrame === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            All Phases
          </button>
          {(Object.entries(TIME_FRAME_CONFIG) as [TimeFrame, typeof TIME_FRAME_CONFIG[TimeFrame]][]).map(([key, config]) => (
            <button key={key} onClick={() => setActiveTimeFrame(key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTimeFrame === key ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              <config.icon className="w-4 h-4" /> {config.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${activeCategory === cat ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Actions Grid */}
        <div className="space-y-4">
          {filtered.map(action => {
            const tfConfig = TIME_FRAME_CONFIG[action.timeFrame];
            return (
              <Card key={action.id} className="hover:shadow-sm transition">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{action.title}</h3>
                        <Badge className={tfConfig.color}>{tfConfig.label}</Badge>
                        <Badge variant="outline" className="text-xs">{action.category}</Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {action.triggerDays}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{action.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-blue-700 mb-1">Concierge Action:</p>
                          <p className="text-xs text-blue-600">{action.conciergeAction}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-amber-700 mb-1">Provider Action:</p>
                          <p className="text-xs text-amber-600">{action.providerAction}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No actions match current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
