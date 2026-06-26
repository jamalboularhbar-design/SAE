import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { ArrowRight, DollarSign, Clock, Users, TrendingDown, Calculator, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { BRAND } from '@/lib/brand';
import SEO from '@/components/SEO';
import MarketingNav from '@/components/MarketingNav';
import { BOOTSTRAP_PRICING } from '@shared/pricing';

export default function ROICalculatorPage() {
  const submitLead = trpc.leads.submit.useMutation();

  // Inputs
  const [teamSize, setTeamSize] = useState(100);
  const [avgSalary, setAvgSalary] = useState(75000);
  const [hoursSearching, setHoursSearching] = useState(6);
  const [currentToolCost, setCurrentToolCost] = useState(10);

  // Lead capture
  const [showCapture, setShowCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');

  // Calculations based on industry research
  const results = useMemo(() => {
    const hourlyRate = avgSalary / 2080; // 52 weeks * 40 hours
    const weeklyWastedHours = teamSize * hoursSearching;
    const annualWastedHours = weeklyWastedHours * 52;
    const annualWastedCost = annualWastedHours * hourlyRate;

    // NexusAI Playbooks reduces search time by 60% (conservative estimate based on Guru/Trainual claims of 50-70%)
    const reductionRate = 0.60;
    const hoursSaved = annualWastedHours * reductionRate;
    const costSaved = annualWastedCost * reductionRate;

    const opsCanvasCost = BOOTSTRAP_PRICING.founding.annualUsd;
    const currentToolAnnualCost = teamSize * currentToolCost * 12;

    const netSavings = costSaved - opsCanvasCost + currentToolAnnualCost;
    const roi = opsCanvasCost > 0 ? ((netSavings / opsCanvasCost) * 100) : 0;
    const paybackDays = opsCanvasCost > 0 ? Math.ceil((opsCanvasCost / (costSaved / 365))) : 0;

    // Productivity: hours recovered per employee per week
    const hoursRecoveredPerWeek = hoursSearching * reductionRate;

    return {
      annualWastedCost,
      hoursSaved,
      costSaved,
      opsCanvasCost,
      currentToolAnnualCost,
      netSavings,
      roi,
      paybackDays,
      hoursRecoveredPerWeek,
      weeklyWastedHours,
    };
  }, [teamSize, avgSalary, hoursSearching, currentToolCost]);

  const formatCurrency = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      toast.error('Please enter your name and email');
      return;
    }
    try {
      await submitLead.mutateAsync({
        fullName,
        email,
        company,
        jobTitle: '',
        teamSize: String(teamSize),
        message: `ROI Calculator: ${teamSize} team, ${formatCurrency(results.netSavings)} projected savings, ${results.roi.toFixed(0)}% ROI`,
        source: 'roi_calculator',
      });
      toast.success('Report sent! Check your inbox shortly.');
      setShowCapture(false);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO {...{ title: 'ROI Calculator', description: `Calculate time and cost savings with ${BRAND.productName}.` }} />

      <MarketingNav
        title={BRAND.productName}
        showProductLinks={false}
        backHref="/product"
        primaryCta={
          <Link href="/start-trial?plan=professional&utm_source=roi&utm_medium=nav">
            <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold">
              Start Free Trial
            </Button>
          </Link>
        }
      />

      {/* Hero */}
      <section className="pt-28 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
            <Calculator className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">ROI Calculator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 tracking-tight">
            How much is <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">knowledge chaos</span> costing you?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Adjust the sliders to match your organization. See exactly how much time and money NexusAI Playbooks can save your team.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                Your Organization
              </h2>

              {/* Team Size */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground/80">Team Size</label>
                  <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">{teamSize}</span>
                </div>
                <Slider
                  min={10}
                  max={2000}
                  value={[teamSize]}
                  onValueChange={(v) => setTeamSize(v[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10</span>
                  <span>500</span>
                  <span>1,000</span>
                  <span>2,000</span>
                </div>
              </div>

              {/* Average Salary */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground/80">Average Annual Salary</label>
                  <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">${avgSalary.toLocaleString()}</span>
                </div>
                <Slider
                  min={30000}
                  max={200000}
                  value={[avgSalary]}
                  onValueChange={(v) => setAvgSalary(v[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$30K</span>
                  <span>$75K</span>
                  <span>$125K</span>
                  <span>$200K</span>
                </div>
              </div>

              {/* Hours Searching */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground/80">Hours/Week Searching for Info (per person)</label>
                  <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">{hoursSearching}h</span>
                </div>
                <Slider
                  min={1}
                  max={15}
                  value={[hoursSearching]}
                  onValueChange={(v) => setHoursSearching(v[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1h</span>
                  <span>5h</span>
                  <span>9.3h (avg)</span>
                  <span>15h</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Industry average: 9.3 hours/week (IDC Research)
                </p>
              </div>

              {/* Current Tool Cost */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground/80">Current Tool Cost (per user/month)</label>
                  <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">${currentToolCost}</span>
                </div>
                <Slider
                  min={0}
                  max={30}
                  value={[currentToolCost]}
                  onValueChange={(v) => setCurrentToolCost(v[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0</span>
                  <span>$10</span>
                  <span>$20</span>
                  <span>$30</span>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Net Annual Savings - Hero Metric */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-teal-500/30 rounded-2xl p-8 text-center">
                <p className="text-sm font-medium text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-2">Projected Annual Savings</p>
                <p className="text-5xl sm:text-6xl font-bold text-foreground mb-2">
                  {formatCurrency(results.netSavings)}
                </p>
                <p className="text-sm text-muted-foreground">
                  net savings with NexusAI Playbooks vs. current setup
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-800 dark:text-teal-300 text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  {results.roi.toFixed(0)}% ROI
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <Clock className="w-5 h-5 text-teal-700 dark:text-teal-400 mb-2" />
                  <p className="text-2xl font-bold">{results.hoursSaved.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Hours saved per year</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <DollarSign className="w-5 h-5 text-teal-700 dark:text-teal-400 mb-2" />
                  <p className="text-2xl font-bold">{formatCurrency(results.costSaved)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Productivity recovered</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <Sparkles className="w-5 h-5 text-teal-700 dark:text-teal-400 mb-2" />
                  <p className="text-2xl font-bold">{results.hoursRecoveredPerWeek.toFixed(1)}h</p>
                  <p className="text-xs text-muted-foreground mt-1">Hours back per person/week</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <Calculator className="w-5 h-5 text-teal-700 dark:text-teal-400 mb-2" />
                  <p className="text-2xl font-bold">{results.paybackDays} days</p>
                  <p className="text-xs text-muted-foreground mt-1">Payback period</p>
                </div>
              </div>

              {/* Cost Comparison */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-foreground/80 mb-4 uppercase tracking-wider">Annual Cost Comparison</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current knowledge tools</span>
                    <span className="text-sm font-medium text-red-400">{formatCurrency(results.currentToolAnnualCost)}/yr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lost productivity (search time)</span>
                    <span className="text-sm font-medium text-red-400">{formatCurrency(results.annualWastedCost)}/yr</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ARG-Builder Founding Member</span>
                    <span className="text-sm font-medium text-teal-700 dark:text-teal-400">{formatCurrency(results.opsCanvasCost)}/yr</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Flat annual — ${BOOTSTRAP_PRICING.founding.annualUsd}/yr (≈ {BOOTSTRAP_PRICING.morocco.annualMadApprox.toLocaleString()} MAD)</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowCapture(true)}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-semibold py-6"
                >
                  <Download className="w-4 h-4 mr-2" /> Get Custom Report
                </Button>
                <Link href="/start-trial?plan=professional&utm_source=roi&utm_medium=results" className="flex-1">
                  <Button className="w-full bg-muted hover:bg-muted/80 text-foreground font-semibold py-6 border border-border">
                    Start 14-Day Trial <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/case-studies" className="flex-1">
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted/50 py-6">
                    See case studies
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Methodology Note */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              Calculations based on industry research: IDC estimates employees spend 9.3 hours/week searching for information.
              NexusAI Playbooks assumes a conservative 60% reduction in search time based on structured knowledge management adoption studies.
              Actual results may vary based on organization size, industry, and implementation scope.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Capture Modal */}
      {showCapture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Get Your Custom ROI Report</h3>
            <p className="text-sm text-muted-foreground mb-6">
              We'll email you a detailed breakdown with your projected savings, payback timeline, and implementation roadmap.
            </p>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal-500/50"
              />
              <input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal-500/50"
              />
              <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal-500/50"
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCapture(false)}
                  className="flex-1 border-border text-foreground hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-semibold"
                >
                  {submitLead.isPending ? 'Sending...' : 'Send Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
