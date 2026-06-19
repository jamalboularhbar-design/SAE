import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Swords, Target, AlertTriangle, CheckCircle2, XCircle, Zap } from 'lucide-react';

interface BattleCard {
  competitor: string;
  tagline: string;
  strengths: string[];
  weaknesses: string[];
  ourAdvantages: string[];
  commonObjections: { objection: string; response: string }[];
  idealSwitch: string;
  pricingComparison: string;
}

const BATTLE_CARDS: BattleCard[] = [
  {
    competitor: 'Notion',
    tagline: 'General-purpose workspace, not built for operations',
    strengths: [
      'Strong brand recognition and large user base',
      'Flexible page/database structure',
      'Good for personal notes and project wikis',
      'Free tier for individuals',
    ],
    weaknesses: [
      'No AI-powered semantic search across documents',
      'No reading progress tracking or comprehension quizzes',
      'No knowledge graph visualization',
      'No built-in lead capture or CRM integration',
      'No role-based operational personas',
      'Performance degrades with large document sets (500+)',
    ],
    ourAdvantages: [
      'Purpose-built for operational knowledge management',
      'AI search finds answers across all docs instantly',
      'Knowledge graph shows document relationships',
      'Built-in analytics: who read what, when, and how well',
      'Dual-persona system for different team functions',
      'Integrated trial/lead management for your own customers',
    ],
    commonObjections: [
      {
        objection: "We already use Notion and it works fine",
        response: "Notion is great for general notes, but operations teams need more: semantic search across 500+ docs, reading progress tracking, comprehension verification, and knowledge graphs. Ask them: 'How long does it take a new hire to find the right SOP?' If it's more than 30 seconds, NexusAI Playbooks pays for itself.",
      },
      {
        objection: "Notion is cheaper",
        response: "Notion Business is $15/user/month. For a 50-person team, that's $750/mo without any of the operational intelligence features. NexusAI Playbooks Professional at $599/mo includes AI search, analytics, knowledge graphs, and comprehension tracking — features you'd need 3-4 additional tools to replicate.",
      },
      {
        objection: "Our team already knows Notion",
        response: "NexusAI Playbooks's interface is intuitive — most teams are productive within 1 day. Plus, we offer a migration tool that imports Notion exports directly. The learning curve is minimal, but the operational gains are massive.",
      },
    ],
    idealSwitch: 'Teams with 20+ members who have outgrown Notion for operational documentation and need analytics on team engagement.',
    pricingComparison: 'Notion Business: $15/user/mo ($750 for 50 users) vs NexusAI Playbooks Pro: $599/mo flat (unlimited users in tier)',
  },
  {
    competitor: 'Confluence',
    tagline: 'Legacy enterprise wiki, complex and slow',
    strengths: [
      'Deep Atlassian ecosystem integration (Jira, Bitbucket)',
      'Enterprise compliance certifications',
      'Established in large enterprises',
      'Powerful permissions and spaces model',
    ],
    weaknesses: [
      'Notoriously slow and bloated interface',
      'Search is keyword-based, not semantic',
      'No AI capabilities without expensive add-ons',
      'Complex administration and maintenance',
      'No reading progress or engagement analytics',
      'Expensive at scale ($5.75/user Standard)',
      'Poor mobile experience',
    ],
    ourAdvantages: [
      'Lightning-fast AI search vs keyword matching',
      'Modern, responsive interface (mobile-first)',
      'Zero admin overhead — no server management',
      'Built-in engagement analytics without add-ons',
      'Knowledge graph included, not a $50k add-on',
      '10x faster onboarding for new team members',
    ],
    commonObjections: [
      {
        objection: "We need Jira integration",
        response: "We integrate with any workflow tool via webhooks and our API. The question is: does your ops team actually use Jira for knowledge management, or just for tickets? NexusAI Playbooks handles the knowledge layer while Jira handles task tracking — they complement each other.",
      },
      {
        objection: "We need enterprise compliance (SOC2, etc.)",
        response: "NexusAI Playbooks is built on enterprise-grade infrastructure with encryption at rest and in transit. We're pursuing SOC2 Type II certification. For immediate needs, we offer BAAs and custom security reviews for Enterprise tier customers.",
      },
      {
        objection: "Migration from Confluence seems risky",
        response: "We offer a white-glove migration service for Enterprise customers. Our team handles the export, restructuring, and import. Most migrations complete in under 2 weeks with zero downtime for your team.",
      },
    ],
    idealSwitch: 'Teams frustrated with Confluence speed, paying for expensive add-ons, or whose ops team doesn\'t use Jira heavily.',
    pricingComparison: 'Confluence Standard: $5.75/user/mo ($287.50 for 50 users) + add-ons ($100-500/mo) vs NexusAI Playbooks Pro: $599/mo all-inclusive',
  },
  {
    competitor: 'Guru',
    tagline: 'Knowledge verification tool, limited scope',
    strengths: [
      'Good Slack/browser extension integration',
      'Card-based knowledge verification workflow',
      'Clean, simple interface',
      'AI-assisted answers in Slack',
    ],
    weaknesses: [
      'Card format limits complex documentation',
      'No knowledge graph or relationship mapping',
      'No reading progress or comprehension tracking',
      'Limited analytics (just views, not engagement depth)',
      'No built-in quiz/certification system',
      'Expensive per-user pricing ($15/user/mo)',
      'No dual-persona or role-based content delivery',
    ],
    ourAdvantages: [
      'Full document support, not just cards',
      'Knowledge graph shows how docs relate',
      'Deep analytics: reading time, quiz scores, completion rates',
      'Built-in certification and comprehension verification',
      'Flat pricing means no per-seat anxiety',
      'Integrated lead/trial management for customer-facing docs',
    ],
    commonObjections: [
      {
        objection: "Guru's Slack integration is essential for us",
        response: "We understand Slack is where your team lives. NexusAI Playbooks's AI search is accessible via API, and we're building native Slack integration. But consider: Guru answers questions reactively. NexusAI Playbooks proactively ensures your team has read and understood critical docs before issues arise.",
      },
      {
        objection: "We like Guru's verification workflow",
        response: "NexusAI Playbooks goes further: not only can you verify docs are current (like Guru), but you can verify your team actually read and understood them through built-in quizzes and reading progress. It's verification at both the content AND comprehension level.",
      },
      {
        objection: "Guru is simpler to set up",
        response: "NexusAI Playbooks deploys in under 30 minutes. Import your existing docs, invite your team, and the AI indexes everything automatically. The simplicity is comparable, but the depth of features you get from day one is significantly greater.",
      },
    ],
    idealSwitch: 'Teams that need more than card-based knowledge, want engagement analytics, or are hitting per-user cost limits with growing teams.',
    pricingComparison: 'Guru All-in-One: $15/user/mo ($750 for 50 users) vs NexusAI Playbooks Pro: $599/mo flat',
  },
];

export default function AdminBattleCardsPage() {
  const [activeCard, setActiveCard] = useState(BATTLE_CARDS[0].competitor);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Competitive Battle Cards</h1>
          </div>
          <p className="text-muted-foreground">
            Sales enablement: positioning, objection handling, and competitive advantages for each major competitor.
          </p>
        </div>

        {/* Competitor Tabs */}
        <Tabs value={activeCard} onValueChange={setActiveCard}>
          <TabsList className="mb-6">
            {BATTLE_CARDS.map(card => (
              <TabsTrigger key={card.competitor} value={card.competitor}>
                {card.competitor}
              </TabsTrigger>
            ))}
          </TabsList>

          {BATTLE_CARDS.map(card => (
            <TabsContent key={card.competitor} value={card.competitor}>
              {/* Tagline */}
              <div className="mb-6 p-4 rounded-lg bg-muted border-l-4 border-primary">
                <p className="text-sm font-medium">Positioning: <span className="text-muted-foreground font-normal">{card.tagline}</span></p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Their Strengths */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Their Strengths (Acknowledge)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {card.strengths.map((s, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-amber-500 mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Their Weaknesses */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Their Weaknesses (Exploit)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {card.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Our Advantages */}
              <Card className="mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Our Advantages (Lead With)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {card.ourAdvantages.map((a, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <Zap className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{a}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Objection Handling */}
              <Card className="mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Objection Handling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {card.commonObjections.map((obj, i) => (
                      <div key={i} className="border border-border rounded-lg p-4">
                        <p className="text-sm font-medium text-red-400 mb-2">
                          "{obj.objection}"
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          <span className="font-medium text-green-400">Response: </span>
                          {obj.response}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Ideal Switch Candidate</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{card.idealSwitch}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">Pricing</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{card.pricingComparison}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
