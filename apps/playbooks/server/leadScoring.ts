/**
 * Smart Lead Scoring System
 * Scores leads based on engagement signals, company fit, and behavior.
 * Score range: 0-100
 * 
 * Tiers:
 * - Hot (80-100): Ready to buy, prioritize outreach
 * - Warm (50-79): Engaged, nurture actively
 * - Cool (20-49): Early stage, continue awareness
 * - Cold (0-19): Low engagement, passive nurture
 */

export interface LeadScoreFactors {
  // Company fit signals (max 30 points)
  hasCompanyName: boolean;        // +5
  hasJobTitle: boolean;           // +5
  teamSize: string;               // +5 to +15 based on size
  industry: string;               // +5 if target industry

  // Engagement signals (max 40 points)
  source: string;                 // +5 to +15 based on source quality
  hasMessage: boolean;            // +5
  requestedDemo: boolean;         // +15
  startedTrial: boolean;          // +10
  chatEscalation: boolean;        // +10

  // Behavioral signals (max 30 points)
  visitedPricing: boolean;        // +10
  visitedCaseStudies: boolean;    // +5
  usedROICalculator: boolean;     // +10
  referredByUser: boolean;        // +5
}

const TARGET_INDUSTRIES = [
  'travel', 'hospitality', 'healthcare', 'saas', 'technology',
  'manufacturing', 'professional services', 'retail',
];

const TEAM_SIZE_SCORES: Record<string, number> = {
  '1-10 employees': 5,
  '11-50 employees': 8,
  '51-200 employees': 12,
  '201-1000 employees': 15,
  '1000+ employees': 15,
};

const SOURCE_SCORES: Record<string, number> = {
  'demo_request_form': 15,
  'chat_sales_escalation': 12,
  'roi_calculator': 10,
  'pricing_page': 8,
  'case_studies': 7,
  'landing_page': 5,
  'referral': 8,
  'organic': 3,
};

export function calculateLeadScore(factors: Partial<LeadScoreFactors>): {
  score: number;
  tier: 'hot' | 'warm' | 'cool' | 'cold';
  breakdown: { category: string; points: number; maxPoints: number }[];
} {
  let companyFit = 0;
  let engagement = 0;
  let behavioral = 0;

  // Company fit (max 30)
  if (factors.hasCompanyName) companyFit += 5;
  if (factors.hasJobTitle) companyFit += 5;
  if (factors.teamSize && TEAM_SIZE_SCORES[factors.teamSize]) {
    companyFit += TEAM_SIZE_SCORES[factors.teamSize];
  }
  if (factors.industry && TARGET_INDUSTRIES.some(t => factors.industry!.toLowerCase().includes(t))) {
    companyFit += 5;
  }
  companyFit = Math.min(companyFit, 30);

  // Engagement (max 40)
  if (factors.source && SOURCE_SCORES[factors.source]) {
    engagement += SOURCE_SCORES[factors.source];
  }
  if (factors.hasMessage) engagement += 5;
  if (factors.requestedDemo) engagement += 15;
  if (factors.startedTrial) engagement += 10;
  if (factors.chatEscalation) engagement += 10;
  engagement = Math.min(engagement, 40);

  // Behavioral (max 30)
  if (factors.visitedPricing) behavioral += 10;
  if (factors.visitedCaseStudies) behavioral += 5;
  if (factors.usedROICalculator) behavioral += 10;
  if (factors.referredByUser) behavioral += 5;
  behavioral = Math.min(behavioral, 30);

  const score = Math.min(companyFit + engagement + behavioral, 100);

  let tier: 'hot' | 'warm' | 'cool' | 'cold';
  if (score >= 80) tier = 'hot';
  else if (score >= 50) tier = 'warm';
  else if (score >= 20) tier = 'cool';
  else tier = 'cold';

  return {
    score,
    tier,
    breakdown: [
      { category: 'Company Fit', points: companyFit, maxPoints: 30 },
      { category: 'Engagement', points: engagement, maxPoints: 40 },
      { category: 'Behavioral', points: behavioral, maxPoints: 30 },
    ],
  };
}

/**
 * Score a lead from the database record
 */
export function scoreLeadFromRecord(lead: {
  company?: string | null;
  jobTitle?: string | null;
  teamSize?: string | null;
  source?: string | null;
  message?: string | null;
}) {
  return calculateLeadScore({
    hasCompanyName: !!lead.company,
    hasJobTitle: !!lead.jobTitle,
    teamSize: lead.teamSize || '',
    source: lead.source || '',
    hasMessage: !!lead.message,
    requestedDemo: lead.source === 'demo_request_form',
    chatEscalation: lead.source === 'chat_sales_escalation',
  });
}
