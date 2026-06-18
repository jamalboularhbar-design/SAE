import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'wouter';
import SEO, { PAGE_SEO } from '@/components/SEO';
import { trpc } from '@/lib/trpc';
import { CheckCircle2, Calendar, Users, Building2, Clock, ArrowRight } from 'lucide-react';

const INDUSTRIES = [
  'Travel & Hospitality',
  'Healthcare',
  'Financial Services',
  'Technology / SaaS',
  'Manufacturing',
  'Retail & E-commerce',
  'Education',
  'Government',
  'Other',
];

const TEAM_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1000 employees',
  '1000+ employees',
];

const TIMELINES = [
  'Immediately',
  'Within 1 month',
  'Within 3 months',
  'Just exploring',
];

const PAIN_POINTS = [
  'Team onboarding takes too long',
  'Knowledge is siloed across tools',
  'Hard to find the right document',
  'No visibility into what team reads',
  'Compliance documentation is outdated',
  'New hires ramp up slowly',
  'Other',
];

export default function RequestDemoPage() {
  const submitLead = trpc.leads.submit.useMutation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
    industry: '',
    teamSize: '',
    timeline: '',
    painPoints: [] as string[],
    message: '',
  });

  const togglePainPoint = (point: string) => {
    setForm(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(point)
        ? prev.painPoints.filter(p => p !== point)
        : [...prev.painPoints, point],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.company) {
      toast.error('Please fill in your name, email, and company');
      return;
    }

    try {
      await submitLead.mutateAsync({
        fullName: form.fullName,
        email: form.email,
        company: form.company,
        jobTitle: form.jobTitle,
        teamSize: form.teamSize,
        message: `[Demo Request] Industry: ${form.industry} | Timeline: ${form.timeline} | Pain Points: ${form.painPoints.join(', ')} | Notes: ${form.message}`,
        source: 'demo_request_form',
      });
      setSubmitted(true);
      toast.success('Demo request submitted!');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Demo Request Received!</h2>
            <p className="text-muted-foreground mb-6">
              We'll review your requirements and reach out within 24 hours to schedule a personalized demo tailored to your team's needs.
            </p>
            <div className="space-y-3">
              <Link href="/start-trial">
                <Button className="w-full">
                  Start Free Trial While You Wait <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button variant="outline" className="w-full">
                  Read Case Studies
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.requestDemo} />
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-lg font-bold text-primary cursor-pointer">ARG Builder</span>
          </Link>
          <Link href="/start-trial">
            <span className="text-sm font-medium text-primary cursor-pointer">Start Free Trial &rarr;</span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Left - Benefits */}
          <div className="md:col-span-2">
            <Badge variant="outline" className="mb-4">Personalized Demo</Badge>
            <h1 className="text-3xl font-bold mb-4">See ARG Builder in Action</h1>
            <p className="text-muted-foreground mb-8">
              Get a personalized walkthrough tailored to your industry and team size. We'll show you exactly how ARG Builder solves your specific challenges.
            </p>

            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">30-Minute Session</h3>
                  <p className="text-sm text-muted-foreground">Quick, focused demo covering your specific use case</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Custom Setup Plan</h3>
                  <p className="text-sm text-muted-foreground">Get a migration roadmap for your existing documentation</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Enterprise Pricing</h3>
                  <p className="text-sm text-muted-foreground">Custom quotes for teams with 50+ members</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Response Within 24h</h3>
                  <p className="text-sm text-muted-foreground">Our team will reach out to schedule at your convenience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Request Your Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Contact Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Full Name *</label>
                      <Input
                        value={form.fullName}
                        onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Work Email *</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Company *</label>
                      <Input
                        value={form.company}
                        onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                        placeholder="Acme Corp"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Job Title</label>
                      <Input
                        value={form.jobTitle}
                        onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))}
                        placeholder="VP of Operations"
                      />
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Industry</label>
                      <select
                        value={form.industry}
                        onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                      >
                        <option value="">Select industry...</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Team Size</label>
                      <select
                        value={form.teamSize}
                        onChange={e => setForm(p => ({ ...p, teamSize: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                      >
                        <option value="">Select size...</option>
                        {TEAM_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Timeline</label>
                    <select
                      value={form.timeline}
                      onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                    >
                      <option value="">When are you looking to implement?</option>
                      {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Pain Points */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">What challenges are you facing? (select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {PAIN_POINTS.map(point => (
                        <button
                          key={point}
                          type="button"
                          onClick={() => togglePainPoint(point)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition ${
                            form.painPoints.includes(point)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          {point}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">Anything else we should know?</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full h-24 p-3 rounded-md border border-border bg-background text-sm resize-y"
                      placeholder="Tell us about your current documentation setup, specific requirements, or questions..."
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={submitLead.isPending}>
                    {submitLead.isPending ? 'Submitting...' : 'Request Demo'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By submitting, you agree to receive communications from ARG Builder. No spam, ever.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
