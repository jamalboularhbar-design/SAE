import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Palette, ChevronRight, CheckSquare, ClipboardList, Shield, Calendar, BarChart3, FolderOpen, Building2, MessageSquare, Users, TrendingUp } from 'lucide-react';
import TravelConcierge from '@/components/personas/TravelConcierge';
import CreativeStudio from '@/components/personas/CreativeStudio';
import Header from '@/components/Header';
import Search from '@/components/Search';
import CommandPalette from '@/components/CommandPalette';
import ProcessTimeline from '@/components/ProcessTimeline';
import DocumentLibrary from '@/components/DocumentLibrary';
import DocumentStats from '@/components/DocumentStats';
import RecentlyViewed from '@/components/RecentlyViewed';
import Favorites from '@/components/Favorites';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import PopularDocuments from '@/components/PopularDocuments';
import TrendingDocumentsSection from '@/components/TrendingDocumentsSection';
import ReadingStreak from '@/components/ReadingStreak';
import SmartSuggestions from '@/components/SmartSuggestions';
import PinnedDocuments from '@/components/PinnedDocuments';
import StickyHeader from '@/components/StickyHeader';
import AIHubPromo from '@/components/AIHubPromo';
import { BRAND } from '@/lib/brand';
import { generatePersonaContent, exportToPDF } from '@/lib/exportPdf';

export default function Home() {
  const [activePersona, setActivePersona] = useState<'travel' | 'artkech'>('travel');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    document.title = BRAND.seoTitle;
    
    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = BRAND.seoDescription;

    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = `NexusAI, operational intelligence, knowledge management, multi-brand playbooks, AI writing assistant, semantic search, ${BRAND.productName}`;

    // Open Graph meta tags
    const ogImageUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663609289051/2ZSCuHTjdaVo7h4vqS7dZB/og-image-argbuilder-ZutmaYZHU87mr4cVDB2dma.png';
    const ogTags: Record<string, string> = {
      'og:type': 'website',
      'og:url': window.location.origin,
      'og:title': BRAND.seoTitle,
      'og:description': BRAND.seoDescription,
      'og:site_name': BRAND.parentName,
      'og:image': ogImageUrl,
      'og:image:width': '2560',
      'og:image:height': '1440',
    };
    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Twitter Card meta tags
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': BRAND.seoTitle,
      'twitter:description': BRAND.seoDescription,
      'twitter:image': ogImageUrl,
    };
    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin;

    // JSON-LD Structured Data (SoftwareApplication schema)
    let jsonLd = document.querySelector('script[data-schema="nexusai-playbooks"]') as HTMLScriptElement;
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.type = 'application/ld+json';
      jsonLd.setAttribute('data-schema', 'nexusai-playbooks');
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': BRAND.productName,
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web',
      'description': BRAND.seoDescription,
      'url': window.location.origin,
      'offers': [
        {
          '@type': 'Offer',
          'name': 'Starter',
          'price': '299',
          'priceCurrency': 'USD',
          'priceValidUntil': '2027-12-31',
          'description': 'Flat rate for teams up to 25 users'
        },
        {
          '@type': 'Offer',
          'name': 'Professional',
          'price': '15',
          'priceCurrency': 'USD',
          'priceValidUntil': '2027-12-31',
          'description': 'Per user per month, 25-seat minimum'
        }
      ],
      'publisher': {
        '@type': 'Organization',
        'name': BRAND.parentName,
        'url': BRAND.marketingUrl
      },
      'featureList': [
        'AI-Powered Knowledge Management',
        'Operational Workflow Automation',
        'Multi-Vertical Support',
        'Team Collaboration Tools',
        'Analytics & Reporting',
        'Custom Integrations'
      ]
    });

    // Cleanup on unmount
    return () => {
      const schemaScript = document.querySelector('script[data-schema="nexusai-playbooks"]');
      if (schemaScript) schemaScript.remove();
    };
  }, []);

  const handleExport = () => {
    const content = generatePersonaContent(activePersona);
    exportToPDF(activePersona, content);
  };

  const travelStages = [
    {
      number: 1,
      title: 'Inquiry & Qualification',
      description: 'Receive initial inquiry, assess client profile (net worth, travel history, preferences), and determine fit for exclusive services.',
      details: ['Profile assessment', 'Service fit analysis', 'Initial consultation scheduling']
    },
    {
      number: 2,
      title: 'Consultation & Proposal',
      description: 'Conduct detailed consultation to understand specific desires. Present high-level, bespoke itinerary proposal highlighting unique experiences.',
      details: ['Detailed needs assessment', 'Proposal development', 'Exclusive access planning']
    },
    {
      number: 3,
      title: 'Itinerary Refinement',
      description: 'Iterate on proposal based on client feedback, securing tentative holds on luxury accommodations and exclusive access.',
      details: ['Feedback integration', 'Accommodation holds', 'Experience confirmation']
    },
    {
      number: 4,
      title: 'Booking & Confirmation',
      description: 'Finalize all bookings (private jets, riads, dining, tours). Provide comprehensive, polished itinerary document.',
      details: ['Final bookings', 'Itinerary documentation', 'Special requests confirmation']
    },
    {
      number: 5,
      title: 'Pre-Trip Preparation',
      description: 'Coordinate logistics, share packing recommendations, ensure all special requests (dietary, security) are communicated to partners.',
      details: ['Logistics coordination', 'Packing guidance', 'Partner communication']
    },
    {
      number: 6,
      title: 'In-Trip Concierge',
      description: 'Provide 24/7 support, manage real-time adjustments, ensure flawless execution of all planned activities.',
      details: ['24/7 availability', 'Real-time support', 'Activity management']
    },
    {
      number: 7,
      title: 'Post-Trip Follow-up',
      description: 'Gather feedback, update client profile with preferences learned during trip, nurture relationship for future travel.',
      details: ['Feedback collection', 'Profile updates', 'Relationship nurturing']
    }
  ];

  const artkechStages = [
    {
      number: 1,
      title: 'Discovery & Briefing',
      description: 'Understand client vision, target audience, and the specific "reader problem" the project aims to solve.',
      details: ['Vision alignment', 'Audience analysis', 'Problem identification']
    },
    {
      number: 2,
      title: 'Strategy & Concept',
      description: 'Develop brand identity or editorial strategy. Present initial concepts focusing on premium aesthetics and market positioning.',
      details: ['Strategy development', 'Concept creation', 'Market positioning']
    },
    {
      number: 3,
      title: 'Design & Development',
      description: 'Execute design work (editorial layout, brand assets). Ensure meticulous attention to detail and premium standard alignment.',
      details: ['Design execution', 'Asset creation', 'Quality assurance']
    },
    {
      number: 4,
      title: 'Production & Photography',
      description: 'Coordinate and direct photography or asset creation. Ensure all visual elements meet the studio\'s high-quality bar.',
      details: ['Photography direction', 'Asset production', 'Quality standards']
    },
    {
      number: 5,
      title: 'Review & Refinement',
      description: 'Present near-final designs to client. Incorporate feedback while maintaining premium design integrity.',
      details: ['Design presentation', 'Feedback integration', 'Refinement iterations']
    },
    {
      number: 6,
      title: 'Pre-Press & Publishing',
      description: 'Prepare files for print, select premium materials (paper, binding), oversee printing process to guarantee "shelf presence."',
      details: ['File preparation', 'Material selection', 'Print oversight']
    },
    {
      number: 7,
      title: 'Delivery & Launch',
      description: 'Deliver final physical or digital products. Provide guidance on launch strategies to maximize impact and perceived value.',
      details: ['Product delivery', 'Launch strategy', 'Impact maximization']
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <StickyHeader>
        <Header />
      </StickyHeader>
      
      <main className="container py-12">
        {/* Top toolbar */}
        <div className="flex items-center justify-between mb-12 gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-3xl mb-1 text-foreground">{BRAND.productName}</h2>
            <p className="text-muted-foreground text-sm">{BRAND.tagline}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="px-3 py-2 rounded-lg bg-card border border-border/50 text-muted-foreground hover:border-accent/50 transition-colors text-sm"
            >
              🔍 Search
            </button>
            <CommandPalette onExport={handleExport} onSwitchPersona={setActivePersona} />
          </div>
        </div>

        {/* Search Panel */}
        {showSearch && (
          <Card className="card-premium mb-12">
            <CardHeader>
              <CardTitle>Advanced Search</CardTitle>
              <CardDescription>Search across all personas, processes, and guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <Search />
            </CardContent>
          </Card>
        )}

        <AIHubPromo />

        {/* Hero Section */}
        <div className="mb-10 sm:mb-16 text-center py-8 sm:py-12">
          <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 border border-accent/20">
            <p className="text-xs sm:text-sm font-semibold text-accent">Multi-Brand Workspaces</p>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl mb-4 sm:mb-6 text-foreground leading-tight">
            {BRAND.parentName}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
            {BRAND.description}
          </p>
          <div className="max-w-lg mx-auto" data-tour="search">
            <SearchAutocomplete placeholder="Quick search 525+ documents..." className="text-left" />
          </div>
        </div>

        {/* Persona Selection Tabs */}
        <div className="mb-10 sm:mb-16">
          <Tabs value={activePersona} onValueChange={(value) => setActivePersona(value as 'travel' | 'artkech')} className="w-full">
            <TabsList data-tour="personas" className="grid w-full max-w-sm sm:max-w-md mx-auto grid-cols-2 mb-8 sm:mb-12 bg-card/50 border border-border/50 p-1 rounded-lg">
              <TabsTrigger value="travel" className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                <span>Riad & Routes</span>
              </TabsTrigger>
              <TabsTrigger value="artkech" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>ArtKech Studio</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="travel" className="mt-8 space-y-8">
              <TravelConcierge />
              {/* Persona Operations Quick Access */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/persona/riad-routes">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-sky-400" />
                      <div><p className="text-sm font-medium">Browse SOPs</p><p className="text-xs text-muted-foreground">16 process docs</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/daily-checklist">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <CheckSquare className="w-5 h-5 text-green-400" />
                      <div><p className="text-sm font-medium">Daily Checklist</p><p className="text-xs text-muted-foreground">18 daily tasks</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/shift-handover">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <ClipboardList className="w-5 h-5 text-amber-400" />
                      <div><p className="text-sm font-medium">Shift Handover</p><p className="text-xs text-muted-foreground">Notes & priorities</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/escalation-matrix">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-red-400" />
                      <div><p className="text-sm font-medium">Escalation Matrix</p><p className="text-xs text-muted-foreground">Emergency protocols</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/seasonal-calendar">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div><p className="text-sm font-medium">Seasonal Calendar</p><p className="text-xs text-muted-foreground">Events & peaks</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/operational-kpis">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      <div><p className="text-sm font-medium">KPI Scorecards</p><p className="text-xs text-muted-foreground">12 key metrics</p></div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              {/* Provider Tools Quick Access */}
              <div className="mt-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">Provider Tools</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/provider-directory">
                    <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                      <CardContent className="p-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-orange-400" />
                        <p className="text-xs font-medium">Provider Directory</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/provider-compare">
                    <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                      <CardContent className="p-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <p className="text-xs font-medium">Compare Providers</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/whatsapp-templates">
                    <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                      <CardContent className="p-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        <p className="text-xs font-medium">WhatsApp Templates</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/guest-matching">
                    <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                      <CardContent className="p-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-violet-400" />
                        <p className="text-xs font-medium">Guest Matching</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Process Timeline</CardTitle>
                  <CardDescription>7-stage operational workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProcessTimeline stages={travelStages} title="Riad & Routes Concierge Process" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="artkech" className="mt-8 space-y-8">
              <CreativeStudio />
              {/* Persona Operations Quick Access */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/persona/artkech">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-purple-400" />
                      <div><p className="text-sm font-medium">Browse SOPs</p><p className="text-xs text-muted-foreground">16 process docs</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/daily-checklist">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <CheckSquare className="w-5 h-5 text-green-400" />
                      <div><p className="text-sm font-medium">Daily Checklist</p><p className="text-xs text-muted-foreground">18 daily tasks</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/shift-handover">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <ClipboardList className="w-5 h-5 text-amber-400" />
                      <div><p className="text-sm font-medium">Shift Handover</p><p className="text-xs text-muted-foreground">Notes & priorities</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/escalation-matrix">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-red-400" />
                      <div><p className="text-sm font-medium">Escalation Matrix</p><p className="text-xs text-muted-foreground">Emergency protocols</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/seasonal-calendar">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div><p className="text-sm font-medium">Seasonal Calendar</p><p className="text-xs text-muted-foreground">Events & peaks</p></div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/operational-kpis">
                  <Card className="cursor-pointer hover:border-accent/50 transition-colors h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      <div><p className="text-sm font-medium">KPI Scorecards</p><p className="text-xs text-muted-foreground">12 key metrics</p></div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Process Timeline</CardTitle>
                  <CardDescription>7-stage operational workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProcessTimeline stages={artkechStages} title="ArtKech Design Process" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* General Capabilities Section */}
        <section className="mt-16 sm:mt-24 mb-12 sm:mb-20 pt-8 sm:pt-12 border-t border-border/50">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-foreground">General Capabilities</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">Core competencies across both business operations</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Context Switching',
                description: 'Seamlessly transition between personas based on task context'
              },
              {
                title: 'Client Communication',
                description: 'Professional interactions with exceptional service focus'
              },
              {
                title: 'Project Management',
                description: 'Track progress, manage timelines, allocate resources'
              },
              {
                title: 'Information Synthesis',
                description: 'Access and process information from multiple sources'
              },
              {
                title: 'Automation & Efficiency',
                description: 'Streamline workflows and improve operational efficiency'
              },
              {
                title: 'Quality Assurance',
                description: 'Ensure deliverables meet highest standards'
              }
            ].map((capability, index) => (
              <Card key={index} className="card-premium">
                <CardHeader>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pinned Documents */}
        <PinnedDocuments />

        {/* Reading Streak */}
        <section className="mt-8">
          <ReadingStreak />
        </section>

        {/* Smart Suggestions */}
        <section className="mt-6">
          <SmartSuggestions />
        </section>

        {/* Favorites & Recently Viewed */}
        <Favorites />
        <RecentlyViewed />

        {/* Popular/Trending Documents */}
        <PopularDocuments />

        {/* Trending Now (weighted recency) */}
        <TrendingDocumentsSection />

        {/* Document Statistics */}
        <section className="mt-16">
          <DocumentStats />
        </section>

        {/* Document Library Section */}
        <div data-tour="library">
          <DocumentLibrary />
        </div>

        {/* Operational Guidelines Section */}
        <section className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-border/50">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-foreground">Operational Guidelines</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">Core principles guiding all operations</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Prioritization',
                description: 'Tasks prioritized by urgency, client value, and strategic importance'
              },
              {
                title: 'Confidentiality',
                description: 'All client information handled with utmost security'
              },
              {
                title: 'Brand Alignment',
                description: 'Communications adhere to brand voice and quality standards'
              },
              {
                title: 'Escalation',
                description: 'Complex issues promptly escalated to appropriate team members'
              },
              {
                title: 'Feedback Integration',
                description: 'Continuously improve through client and team feedback'
              },
              {
                title: 'Proactive Problem Solving',
                description: 'Identify issues before they arise and implement preventative measures'
              }
            ].map((guideline, index) => (
              <Card key={index} className="card-premium">
                <CardHeader>
                  <CardTitle className="text-lg">{guideline.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{guideline.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
