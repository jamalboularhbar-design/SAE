import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Users, Zap, Shield, Heart } from 'lucide-react';

export default function TravelConcierge() {
  const characteristics = [
    {
      icon: Shield,
      title: 'Sophisticated & Discreet',
      description: 'Communicates with refined tone, understanding privacy and exclusivity needs'
    },
    {
      icon: MapPin,
      title: 'Knowledgeable',
      description: 'Deep expertise in luxury travel, Morocco, accommodations, and cultural nuances'
    },
    {
      icon: Zap,
      title: 'Proactive & Detail-Oriented',
      description: 'Anticipates needs, meticulously plans itineraries, manages all logistics'
    },
    {
      icon: Users,
      title: 'Resourceful',
      description: 'Sources exclusive access, manages complex arrangements, resolves issues'
    },
    {
      icon: Heart,
      title: 'Empathetic',
      description: 'Understands desires of discerning travelers, provides personalized service'
    }
  ];

  const processStages = [
    {
      stage: '1. Inquiry & Qualification',
      description: 'Receive initial inquiry, assess client profile (net worth, travel history, preferences), and determine fit for exclusive services.'
    },
    {
      stage: '2. Consultation & Proposal',
      description: 'Conduct detailed consultation to understand specific desires. Present high-level, bespoke itinerary proposal highlighting unique experiences.'
    },
    {
      stage: '3. Itinerary Refinement',
      description: 'Iterate on proposal based on client feedback, securing tentative holds on luxury accommodations and exclusive access.'
    },
    {
      stage: '4. Booking & Confirmation',
      description: 'Finalize all bookings (private jets, riads, dining, tours). Provide comprehensive, polished itinerary document.'
    },
    {
      stage: '5. Pre-Trip Preparation',
      description: 'Coordinate logistics, share packing recommendations, ensure all special requests (dietary, security) are communicated to partners.'
    },
    {
      stage: '6. In-Trip Concierge',
      description: 'Provide 24/7 support, manage real-time adjustments, ensure flawless execution of all planned activities.'
    },
    {
      stage: '7. Post-Trip Follow-up',
      description: 'Gather feedback, update client profile with preferences learned during trip, nurture relationship for future travel.'
    }
  ];

  const responsibilities = [
    'Client onboarding and qualification',
    'Crafting bespoke itineraries for luxury Moroccan travel',
    'Coordinating private transportation and accommodations',
    'Managing reservations for fine dining and cultural experiences',
    'Providing 24/7 support and crisis management',
    'Maintaining detailed client profiles'
  ];

  return (
    <div className="space-y-8">
      {/* Persona Header */}
      <div className="card-premium">
        <h2 className="font-display text-2xl sm:text-3xl mb-2">Horizon Concierge</h2>
        <p className="text-muted-foreground mb-4">Horizon Concierge — horizonconcierge.demo — Bespoke luxury travel for discerning clients</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Sophisticated</Badge>
          <Badge variant="secondary">Discreet</Badge>
          <Badge variant="secondary">Knowledgeable</Badge>
          <Badge variant="secondary">Resourceful</Badge>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="characteristics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
          <TabsTrigger value="process">Process Flow</TabsTrigger>
          <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
        </TabsList>

        {/* Characteristics Tab */}
        <TabsContent value="characteristics" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characteristics.map((char, index) => {
              const Icon = char.icon;
              return (
                <Card key={index} className="card-premium">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <CardTitle className="text-lg">{char.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{char.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Communication Style */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Communication Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-1">Formal yet personable</p>
                <p className="text-sm text-muted-foreground">Using precise language</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Emphasizes exclusivity</p>
                <p className="text-sm text-muted-foreground">Bespoke experiences and unparalleled service</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Clear & concise updates</p>
                <p className="text-sm text-muted-foreground">Confirmations and transparent communication</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Utmost confidentiality</p>
                <p className="text-sm text-muted-foreground">Professional handling of all inquiries</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Process Flow Tab */}
        <TabsContent value="process" className="space-y-4 mt-6">
          <div className="space-y-3">
            {processStages.map((item, index) => (
              <Card key={index} className="card-premium">
                <CardHeader>
                  <CardTitle className="text-base">{item.stage}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Responsibilities Tab */}
        <TabsContent value="responsibilities" className="mt-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{resp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
