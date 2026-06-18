import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Target, Sparkles, Users, Lightbulb } from 'lucide-react';

export default function CreativeStudio() {
  const characteristics = [
    {
      icon: Sparkles,
      title: 'Visionary & Artistic',
      description: 'Keen eye for design, understanding aesthetic principles and current trends'
    },
    {
      icon: Target,
      title: 'Strategic & Problem-Solver',
      description: 'Identifies reader problems and develops creative solutions into tangible products'
    },
    {
      icon: Palette,
      title: 'Meticulous & Quality-Focused',
      description: 'Every design element meets highest standards, commanding premium pricing'
    },
    {
      icon: Users,
      title: 'Collaborative & Communicative',
      description: 'Effectively communicates design concepts and manages client expectations'
    },
    {
      icon: Lightbulb,
      title: 'Innovative',
      description: 'Stays abreast of design trends, printing technologies, and publishing best practices'
    }
  ];

  const processStages = [
    {
      stage: '1. Discovery & Briefing',
      description: 'Understand client vision, target audience, and the specific "reader problem" the project aims to solve.'
    },
    {
      stage: '2. Strategy & Concept',
      description: 'Develop brand identity or editorial strategy. Present initial concepts focusing on premium aesthetics and market positioning.'
    },
    {
      stage: '3. Design & Development',
      description: 'Execute design work (editorial layout, brand assets). Ensure meticulous attention to detail and premium standard alignment.'
    },
    {
      stage: '4. Production & Photography',
      description: 'Coordinate and direct photography or asset creation. Ensure all visual elements meet the studio\'s high-quality bar.'
    },
    {
      stage: '5. Review & Refinement',
      description: 'Present near-final designs to client. Incorporate feedback while maintaining premium design integrity.'
    },
    {
      stage: '6. Pre-Press & Publishing',
      description: 'Prepare files for print, select premium materials (paper, binding), oversee printing process to guarantee "shelf presence."'
    },
    {
      stage: '7. Delivery & Launch',
      description: 'Deliver final physical or digital products. Provide guidance on launch strategies to maximize impact and perceived value.'
    }
  ];

  const responsibilities = [
    'Client onboarding for design projects',
    'Developing brand identity strategies and visual guidelines',
    'Overseeing editorial design projects',
    'Managing photography production',
    'Guiding independent publishing process',
    'Ensuring premium design quality and shelf presence',
    'Project management and budget oversight'
  ];

  const productTypes = [
    'Brand Identity & Visual Guidelines',
    'Editorial Design & Layouts',
    'Photography Production',
    'Journals & Activity Books',
    'Specialty Titles & Publications',
    'Premium Packaging Design'
  ];

  return (
    <div className="space-y-8">
      {/* Persona Header */}
      <div className="card-premium">
        <h2 className="font-display text-2xl sm:text-3xl mb-2">ArtKech Lead Designer</h2>
        <p className="text-muted-foreground mb-4">Full-Service Creative Studio - Premium Design & Independent Publishing</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Visionary</Badge>
          <Badge variant="secondary">Strategic</Badge>
          <Badge variant="secondary">Quality-Focused</Badge>
          <Badge variant="secondary">Innovative</Badge>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="characteristics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
          <TabsTrigger value="process">Process Flow</TabsTrigger>
          <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
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
                      <div className="w-10 h-10 rounded-lg bg-secondary/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-secondary" />
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
                <p className="font-semibold text-sm mb-1">Professional & Articulate</p>
                <p className="text-sm text-muted-foreground">Focus on design principles and project objectives</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Emphasizes Premium Value</p>
                <p className="text-sm text-muted-foreground">Design quality, shelf presence, and problem-solving through design</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Clear Project Updates</p>
                <p className="text-sm text-muted-foreground">Manages expectations and solicits feedback effectively</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Visual Communication</p>
                <p className="text-sm text-muted-foreground">Uses visual language and examples to convey concepts</p>
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
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{resp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Services and deliverables offered by ArtKech</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {productTypes.map((product, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{product}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
