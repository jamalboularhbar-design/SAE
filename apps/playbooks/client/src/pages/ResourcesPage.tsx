import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Video, Download, Search, ArrowRight } from 'lucide-react';
import SEO, { PAGE_SEO } from '@/components/SEO';

type ResourceType = 'all' | 'blog' | 'whitepaper' | 'video' | 'guide';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  readTime?: string;
  date: string;
  featured?: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'The Complete Guide to Operational Reference Systems',
    description: 'Learn how enterprise teams use structured reference guides to reduce onboarding time by 60% and eliminate knowledge silos across departments.',
    type: 'whitepaper',
    category: 'Operations',
    readTime: '12 min read',
    date: '2026-05-15',
    featured: true,
  },
  {
    id: '2',
    title: 'How Luxury Travel Agencies Scale with AI-Powered Knowledge Bases',
    description: 'Case study: How a boutique travel concierge reduced response time from 4 hours to 15 minutes using ARG Builder.',
    type: 'blog',
    category: 'Travel & Hospitality',
    readTime: '6 min read',
    date: '2026-05-10',
  },
  {
    id: '3',
    title: 'Building Your First Operational Playbook',
    description: 'Step-by-step video tutorial on creating a comprehensive operational playbook with dual personas, process timelines, and team permissions.',
    type: 'video',
    category: 'Getting Started',
    readTime: '18 min watch',
    date: '2026-05-08',
  },
  {
    id: '4',
    title: 'Enterprise Knowledge Management: 2026 Trends Report',
    description: 'Research report covering AI-assisted documentation, real-time collaboration, and the shift from static wikis to interactive reference systems.',
    type: 'whitepaper',
    category: 'Industry Research',
    readTime: '20 min read',
    date: '2026-05-01',
    featured: true,
  },
  {
    id: '5',
    title: 'Reducing Team Onboarding Time by 73%',
    description: 'How a 200-person SaaS company used structured reference guides to cut new hire ramp-up from 6 weeks to 11 days.',
    type: 'blog',
    category: 'SaaS & Technology',
    readTime: '8 min read',
    date: '2026-04-28',
  },
  {
    id: '6',
    title: 'Healthcare Compliance Documentation Best Practices',
    description: 'Downloadable guide covering HIPAA-compliant documentation workflows, audit trails, and version control for medical teams.',
    type: 'guide',
    category: 'Healthcare',
    readTime: '15 min read',
    date: '2026-04-20',
  },
  {
    id: '7',
    title: 'Advanced Search & AI Features Tutorial',
    description: 'Deep dive into semantic search, AI-powered summaries, and intelligent document recommendations within ARG Builder.',
    type: 'video',
    category: 'Product Features',
    readTime: '12 min watch',
    date: '2026-04-15',
  },
  {
    id: '8',
    title: 'The ROI of Structured Knowledge Management',
    description: 'Data-driven analysis showing how companies save $2,400 per employee annually by replacing scattered documentation with centralized reference systems.',
    type: 'whitepaper',
    category: 'Business Case',
    readTime: '10 min read',
    date: '2026-04-10',
  },
  {
    id: '9',
    title: 'Manufacturing SOPs: From Paper to Digital',
    description: 'How a mid-size manufacturer digitized 500+ standard operating procedures and reduced compliance incidents by 45%.',
    type: 'blog',
    category: 'Manufacturing',
    readTime: '7 min read',
    date: '2026-04-05',
  },
  {
    id: '10',
    title: 'Team Collaboration & Permissions Setup Guide',
    description: 'Complete walkthrough of setting up team roles, document permissions, and collaborative editing workflows.',
    type: 'guide',
    category: 'Getting Started',
    readTime: '10 min read',
    date: '2026-03-28',
  },
  {
    id: '11',
    title: 'Integrating ARG Builder with Your Existing Stack',
    description: 'Technical guide covering API integration, webhooks, SSO setup, and connecting with tools like Slack, Notion, and Jira.',
    type: 'guide',
    category: 'Integrations',
    readTime: '14 min read',
    date: '2026-03-20',
  },
  {
    id: '12',
    title: 'Building a Knowledge-First Culture',
    description: 'Leadership playbook for fostering documentation habits, measuring knowledge sharing KPIs, and incentivizing team contributions.',
    type: 'blog',
    category: 'Leadership',
    readTime: '9 min read',
    date: '2026-03-15',
  },
];

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  blog: BookOpen,
  whitepaper: FileText,
  video: Video,
  guide: Download,
};

const TYPE_COLORS: Record<string, string> = {
  blog: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  whitepaper: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  video: 'bg-red-500/10 text-red-400 border-red-500/20',
  guide: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function ResourcesPage() {
  const [filter, setFilter] = useState<ResourceType>('all');
  const [search, setSearch] = useState('');

  const filtered = RESOURCES.filter((r) => {
    const matchesType = filter === 'all' || r.type === filter;
    const matchesSearch = !search || 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const featured = RESOURCES.filter((r) => r.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO {...PAGE_SEO.resources} />
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/product">
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">&larr; Back to Product</span>
          </Link>
          <Link href="/start-trial">
            <Button size="sm">Start Free Trial</Button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Resources & Learning Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Guides, research, and tutorials to help your team build better operational systems and maximize the value of structured knowledge management.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {(['all', 'blog', 'whitepaper', 'video', 'guide'] as ResourceType[]).map((type) => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All Resources' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {filter === 'all' && !search && (
        <section className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((resource) => {
                const Icon = TYPE_ICONS[resource.type] || BookOpen;
                return (
                  <div key={resource.id} className="border border-primary/20 rounded-lg p-6 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className={`mb-2 text-xs ${TYPE_COLORS[resource.type]}`}>
                          {resource.type}
                        </Badge>
                        <h3 className="font-semibold mb-2">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{resource.readTime}</span>
                          <span>&middot;</span>
                          <span>{resource.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Resources */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">
            {filter === 'all' ? 'All Resources' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
            <span className="text-sm font-normal text-muted-foreground ml-2">({filtered.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resource) => {
              const Icon = TYPE_ICONS[resource.type] || BookOpen;
              return (
                <div key={resource.id} className="border border-border rounded-lg p-5 hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline" className={`text-xs ${TYPE_COLORS[resource.type]}`}>
                      {resource.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{resource.date}</span>
                  </div>
                  <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                    <span className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No resources found matching your criteria.</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFilter('all'); setSearch(''); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to transform your operations?</h2>
          <p className="text-muted-foreground mb-6">Start your 14-day free trial and see how ARG Builder can help your team.</p>
          <div className="flex justify-center gap-3">
            <Link href="/start-trial"><Button>Start Free Trial</Button></Link>
            <Link href="/request-demo"><Button variant="outline">Request Demo</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
