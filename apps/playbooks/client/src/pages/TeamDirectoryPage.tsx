import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Phone, Mail, Search, Plane, Palette, MapPin, Clock } from 'lucide-react';

type Persona = 'riad-routes' | 'artkech';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  whatsapp: string;
  availability: string;
  location: string;
  persona: Persona;
}

const TEAM_MEMBERS: TeamMember[] = [
  // Riad & Routes team
  { id: 'rr-tm1', name: 'Ahmed Khalil', role: 'Concierge Lead', department: 'Guest Services', phone: '+212 661 234 567', email: 'ahmed@riadandroutes.com', whatsapp: '+212 661 234 567', availability: 'Mon-Sat 7:00-19:00', location: 'Marrakech Office', persona: 'riad-routes' },
  { id: 'rr-tm2', name: 'Fatima Lahlou', role: 'Guest Relations Manager', department: 'Guest Services', phone: '+212 662 345 678', email: 'fatima@riadandroutes.com', whatsapp: '+212 662 345 678', availability: 'Mon-Fri 8:00-18:00', location: 'Marrakech Office', persona: 'riad-routes' },
  { id: 'rr-tm3', name: 'Youssef Mansouri', role: 'Operations Manager', department: 'Operations', phone: '+212 663 456 789', email: 'youssef@riadandroutes.com', whatsapp: '+212 663 456 789', availability: 'Mon-Sat 6:00-22:00 (on-call)', location: 'Marrakech Office', persona: 'riad-routes' },
  { id: 'rr-tm4', name: 'Nadia Bennis', role: 'Experience Coordinator', department: 'Experiences', phone: '+212 664 567 890', email: 'nadia@riadandroutes.com', whatsapp: '+212 664 567 890', availability: 'Tue-Sun 9:00-18:00', location: 'Medina Hub', persona: 'riad-routes' },
  { id: 'rr-tm5', name: 'Rachid El Ouafi', role: 'Tour Coordinator', department: 'Experiences', phone: '+212 665 678 901', email: 'rachid@riadandroutes.com', whatsapp: '+212 665 678 901', availability: 'Mon-Sat 7:00-17:00', location: 'Medina Hub', persona: 'riad-routes' },
  { id: 'rr-tm6', name: 'Samira Tazi', role: 'Finance & Billing', department: 'Finance', phone: '+212 666 789 012', email: 'samira@riadandroutes.com', whatsapp: '+212 666 789 012', availability: 'Mon-Fri 9:00-17:00', location: 'Marrakech Office', persona: 'riad-routes' },
  { id: 'rr-tm7', name: 'Omar Idrissi', role: 'Quality Manager', department: 'Quality', phone: '+212 667 890 123', email: 'omar@riadandroutes.com', whatsapp: '+212 667 890 123', availability: 'Mon-Fri 8:00-18:00', location: 'Marrakech Office', persona: 'riad-routes' },
  { id: 'rr-tm8', name: 'Karim Berrada', role: 'Marketing & Reviews', department: 'Marketing', phone: '+212 668 901 234', email: 'karim@riadandroutes.com', whatsapp: '+212 668 901 234', availability: 'Mon-Fri 9:00-18:00', location: 'Remote', persona: 'riad-routes' },
  // ArtKech team
  { id: 'ak-tm1', name: 'Sara Benjelloun', role: 'Creative Director', department: 'Creative', phone: '+212 671 234 567', email: 'sara@artkech.com', whatsapp: '+212 671 234 567', availability: 'Mon-Fri 9:00-18:00', location: 'ArtKech Design Studio', persona: 'artkech' },
  { id: 'ak-tm2', name: 'Mehdi Alaoui', role: 'Studio Manager', department: 'Operations', phone: '+212 672 345 678', email: 'mehdi@artkech.com', whatsapp: '+212 672 345 678', availability: 'Mon-Fri 8:30-18:30', location: 'ArtKech Design Studio', persona: 'artkech' },
  { id: 'ak-tm3', name: 'Leila Fassi', role: 'Senior Designer', department: 'Creative', phone: '+212 673 456 789', email: 'leila@artkech.com', whatsapp: '+212 673 456 789', availability: 'Mon-Fri 9:00-18:00', location: 'ArtKech Design Studio', persona: 'artkech' },
  { id: 'ak-tm4', name: 'Amine Chraibi', role: 'Account Manager', department: 'Client Services', phone: '+212 674 567 890', email: 'amine@artkech.com', whatsapp: '+212 674 567 890', availability: 'Mon-Fri 9:00-19:00', location: 'ArtKech Design Studio', persona: 'artkech' },
  { id: 'ak-tm5', name: 'Zineb Ouazzani', role: 'Production Manager', department: 'Production', phone: '+212 675 678 901', email: 'zineb@artkech.com', whatsapp: '+212 675 678 901', availability: 'Mon-Sat 8:00-17:00', location: 'Print Workshop', persona: 'artkech' },
  { id: 'ak-tm6', name: 'Hassan Moussaoui', role: 'Photographer', department: 'Creative', phone: '+212 676 789 012', email: 'hassan@artkech.com', whatsapp: '+212 676 789 012', availability: 'Flexible / On Assignment', location: 'Mobile', persona: 'artkech' },
  { id: 'ak-tm7', name: 'Kenza Amrani', role: 'Content & Social Media', department: 'Marketing', phone: '+212 677 890 123', email: 'kenza@artkech.com', whatsapp: '+212 677 890 123', availability: 'Mon-Fri 9:00-18:00', location: 'Remote', persona: 'artkech' },
];

export default function TeamDirectoryPage() {
  const [, navigate] = useLocation();
  const [activePersona, setActivePersona] = useState<Persona>('riad-routes');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = TEAM_MEMBERS
    .filter(m => m.persona === activePersona)
    .filter(m => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase()) || m.department.toLowerCase().includes(searchQuery.toLowerCase()));

  const departments = Array.from(new Set(filtered.map(m => m.department)));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Users className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold">Team Directory</h1>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <button onClick={() => setActivePersona('riad-routes')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'riad-routes' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}>
              <Plane className="w-4 h-4" /> Riad & Routes
            </button>
            <button onClick={() => setActivePersona('artkech')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'artkech' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}>
              <Palette className="w-4 h-4" /> ArtKech Design Studio
            </button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, role, or department..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm" />
          </div>
        </div>

        {/* Team by Department */}
        {departments.map(dept => (
          <div key={dept} className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{dept}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.filter(m => m.department === dept).map(member => (
                <Card key={member.id} className="hover:border-accent/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-accent">{member.role}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{member.department}</Badge>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Phone className="w-3 h-3" /> {member.phone}
                      </a>
                      <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Mail className="w-3 h-3" /> {member.email}
                      </a>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {member.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {member.availability}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
