import { useState } from 'react';
import { Play, Quote, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  industry: string;
  quote: string;
  rating: number;
  metric: string;
  metricLabel: string;
  avatarInitials: string;
  color: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    role: 'VP of Operations',
    company: 'Luxe Voyages',
    industry: 'Travel & Hospitality',
    quote: 'NexusAI Playbooks transformed how our 45-person team handles destination knowledge. New agents now ramp up in 2 weeks instead of 3 months. The AI search alone saves us 15 hours per week.',
    rating: 5,
    metric: '87%',
    metricLabel: 'Faster Onboarding',
    avatarInitials: 'SM',
    color: 'bg-amber-500',
  },
  {
    name: 'Dr. James Chen',
    role: 'Chief Medical Officer',
    company: 'Pacific Health Network',
    industry: 'Healthcare',
    quote: 'Compliance documentation used to be our biggest headache. Now every protocol is searchable, versioned, and our staff can find the right procedure in seconds. Audit prep went from 2 weeks to 2 days.',
    rating: 5,
    metric: '92%',
    metricLabel: 'Audit Time Saved',
    avatarInitials: 'JC',
    color: 'bg-rose-500',
  },
  {
    name: 'Marcus Thompson',
    role: 'Director of Engineering',
    company: 'ScaleStack',
    industry: 'SaaS & Technology',
    quote: 'We replaced Confluence + Notion + Google Docs with NexusAI Playbooks. The knowledge graph alone justified the switch — engineers can trace how decisions connect across 200+ architecture docs.',
    rating: 5,
    metric: '3x',
    metricLabel: 'Faster Doc Discovery',
    avatarInitials: 'MT',
    color: 'bg-cyan-500',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Operations Manager',
    company: 'Precision Manufacturing Co.',
    industry: 'Manufacturing',
    quote: 'Every shift supervisor now has instant access to SOPs, quality checklists, and safety protocols. Defect rates dropped 34% in the first quarter after deployment. The reading progress tracking ensures compliance.',
    rating: 5,
    metric: '34%',
    metricLabel: 'Fewer Defects',
    avatarInitials: 'ER',
    color: 'bg-orange-500',
  },
];

export default function TestimonialVideos() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Customer Stories</Badge>
          <h2 className="text-3xl font-bold mb-3">Trusted by Operations Leaders</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how mid-market companies across industries use NexusAI Playbooks to transform their operational knowledge management.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="group relative bg-background rounded-xl border border-border p-6 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            >
              {/* Metric Badge */}
              <div className="absolute -top-3 right-6">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                  {t.metric} {t.metricLabel}
                </div>
              </div>

              {/* Quote */}
              <div className="flex gap-3 mb-4 pt-2">
                <Quote className="w-5 h-5 text-primary/40 shrink-0 mt-1" />
                <p className={`text-sm leading-relaxed ${expandedIndex === i ? '' : 'line-clamp-3'}`}>
                  "{t.quote}"
                </p>
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.avatarInitials}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">
                  {t.industry}
                </Badge>
              </div>

              {/* Play indicator for video feel */}
              <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="w-3 h-3 text-primary fill-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground mb-2">
            Join 200+ operations teams already using NexusAI Playbooks
          </p>
          <a href="/start-trial" className="text-primary font-medium text-sm hover:underline">
            Start your 14-day free trial &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
