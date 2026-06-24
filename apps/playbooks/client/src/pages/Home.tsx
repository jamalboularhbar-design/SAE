import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Palette, ChevronRight, CheckSquare, ClipboardList, Shield, Calendar, BarChart3, FolderOpen, Building2, MessageSquare, Users, TrendingUp, Network, Brain, Hexagon } from 'lucide-react';
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
import ProductProofBar from '@/components/product/ProductProofBar';
import ProductArchitectureStrip from '@/components/product/ProductArchitectureStrip';
import SocialProofStrip from '@/components/product/SocialProofStrip';
import IntegrationsStrip from '@/components/product/IntegrationsStrip';
import VerticalShowcase from '@/components/VerticalShowcase';
import { BRAND } from '@/lib/brand';
import { PLATFORM_STATS } from '@shared/platformStats';
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
    const ogImageUrl = BRAND.ogImageUrl;
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
          'name': 'Membership',
          'price': '39',
          'priceCurrency': 'USD',
          'priceValidUntil': '2027-12-31',
          'description': 'Full library access, AI hub, Nexus OS early access'
        },
        {
          '@type': 'Offer',
          'name': 'Founding Member',
          'price': '290',
          'priceCurrency': 'USD',
          'priceValidUntil': '2027-12-31',
          'description': 'Annual founding access — price locked, direct founder onboarding'
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
      
      <main className="container py-4 sm:py-6 pb-24 sm:pb-10">
        {/* Command palette — desktop */}
        <div className="hidden sm:flex justify-end mb-4">
          <CommandPalette onExport={handleExport} onSwitchPersona={setActivePersona} />
        </div>

        {showSearch && (
          <Card className="card-premium mb-8 hidden sm:block">
            <CardHeader>
              <CardTitle>Advanced Search</CardTitle>
              <CardDescription>Search across all workspaces, processes, and guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <Search />
            </CardContent>
          </Card>
        )}

        {/* Hero + quick actions */}
        <section className="mb-4 sm:mb-6 text-center">
          <ProductProofBar className="mb-3 sm:mb-4" />
          <div className="max-w-lg mx-auto mb-3 sm:mb-4" data-tour="search">
            <SearchAutocomplete placeholder={`Quick search ${PLATFORM_STATS.documents}+ documents…`} className="text-left" />
          </div>
          <div className="hidden sm:flex flex-wrap justify-center gap-2">
            <Link href="/graph">
              <Badge variant="outline" className="px-3 py-1.5 gap-1.5 cursor-pointer hover:border-cyan-500/40">
                <Network className="w-3.5 h-3.5" /> Graph
              </Badge>
            </Link>
            <Link href="/ai">
              <Badge variant="outline" className="px-3 py-1.5 gap-1.5 cursor-pointer hover:border-purple-500/40" data-tour="intelligence">
                <Brain className="w-3.5 h-3.5" /> {BRAND.aiHubName}
              </Badge>
            </Link>
            <a href={`${BRAND.nexusOsPath}/`}>
              <Badge variant="outline" className="px-3 py-1.5 gap-1.5 cursor-pointer hover:border-indigo-500/40">
                <Hexagon className="w-3.5 h-3.5" /> {BRAND.nexusOsName}
              </Badge>
            </a>
            <Link href="/toc">
              <Badge variant="outline" className="px-3 py-1.5 gap-1.5 cursor-pointer hover:border-teal-500/40">
                Browse all
              </Badge>
            </Link>
          </div>
        </section>

        <div className="hidden md:block">
          <ProductArchitectureStrip showGovernance />
        </div>

        <div className="hidden md:block">
          <VerticalShowcase
            onOpenWorkspace={(tab) => {
              setActivePersona(tab);
              document.getElementById("workspace-tabs")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>

        {/* Document Library — primary work surface */}
        <DocumentLibrary />

        {/* Live demo workspaces — desktop only; heavy persona UI */}
        <section id="workspace-tabs" className="hidden lg:block mt-12 sm:mt-16 pt-8 border-t border-border/50">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Live demo workspaces</p>
            <h2 className="font-display text-xl sm:text-2xl text-foreground">Explore multi-brand operations</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Riad & Routes and ArtKech — proof deployments on real Morocco operations. Switch tabs to explore tools and process timelines.
            </p>
          </div>
          <Tabs value={activePersona} onValueChange={(value) => setActivePersona(value as 'travel' | 'artkech')} className="w-full">
            <TabsList data-tour="workspaces" className="grid w-full max-w-sm sm:max-w-md mx-auto grid-cols-2 mb-8 sm:mb-12 bg-card/50 border border-border/50 p-1 rounded-lg">
              <TabsTrigger value="travel" className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                <span>Riad & Routes</span>
              </TabsTrigger>
              <TabsTrigger value="artkech" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>ArtKech Design Studio</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="travel" className="mt-8 space-y-8">
              <TravelConcierge />
              {/* Workspace Operations Quick Access */}
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
                  <ProcessTimeline stages={travelStages} title="Riad & Routes Process" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="artkech" className="mt-8 space-y-8">
              <CreativeStudio />
              {/* Workspace Operations Quick Access */}
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
                  <ProcessTimeline stages={artkechStages} title="ArtKech Creative Process" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <div className="hidden sm:block">
          <SocialProofStrip />
          <IntegrationsStrip />
        </div>

        {/* Personal & discovery — end of page */}
        <section className="mt-12 pt-8 border-t border-border/50 space-y-6">
          <div>
            <h2 className="font-display text-lg text-foreground mb-1">Your activity</h2>
            <p className="text-sm text-muted-foreground">Pinned, recent, and trending from your team.</p>
          </div>
          <PinnedDocuments />
          <ReadingStreak />
          <SmartSuggestions />
          <Favorites />
          <RecentlyViewed />
          <PopularDocuments />
          <TrendingDocumentsSection />
          <DocumentStats />
        </section>
      </main>
    </div>
  );
}
