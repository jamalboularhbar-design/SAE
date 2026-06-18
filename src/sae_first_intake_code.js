const item = $input.first().json;
const body = item.body && typeof item.body === 'object' ? item.body : item;

const text = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
const lower = (value) => text(value).toLowerCase();
const includesAny = (value, terms) => terms.some((term) => value.includes(term));
const slugify = (value) => text(value)
  .toUpperCase()
  .replace(/[^A-Z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 28) || 'LEAD';

const companyName = text(body.companyName, body.company, body.businessName, 'Unknown company');
const contactName = text(body.contactName, body.name, body.fullName);
const email = text(body.email, body.contactEmail);
const phone = text(body.phone, body.whatsapp, body.contactPhone);
const website = text(body.website, body.url);
const market = text(body.market, body.country, body.region, 'Morocco');
const problem = text(body.problem, body.challenge, body.request, body.message);
const channel = lower(body.channel, body.source, 'website');
const urgency = lower(body.urgency, body.timeline, 'standard');
const budget = lower(body.budget, body.budgetRange);
const language = text(body.language, body.preferredLanguage, 'fr');
const industryInput = lower(body.industry, body.sector);
const companySize = text(body.companySize, body.teamSize, body.size);

const corpus = `${industryInput} ${lower(market)} ${lower(problem)} ${lower(companyName)}`;

const industryRules = [
  ['healthcare', ['clinic', 'dental', 'doctor', 'medical', 'patient', 'health', 'cabinet']],
  ['real_estate', ['real estate', 'immobilier', 'property', 'agent', 'apartment', 'villa', 'rental']],
  ['education', ['school', 'ecole', 'training', 'course', 'student', 'academy']],
  ['ecommerce', ['ecommerce', 'shop', 'store', 'retail', 'orders', 'delivery']],
  ['hospitality', ['hotel', 'restaurant', 'riad', 'booking', 'reservation']],
  ['agency', ['agency', 'studio', 'client delivery', 'outsourcing', 'white label']],
  ['professional_services', ['law', 'accounting', 'consulting', 'service business']],
];

const detectedIndustry = industryRules.find(([, terms]) => includesAny(corpus, terms))?.[0]
  || text(body.industry, body.sector, 'general_business');

const useCaseRules = [
  ['agency_delivery_partner', ['agency', 'white label', 'outsourcing', 'client delivery']],
  ['ai_whatsapp_assistant', ['whatsapp', 'customer support', 'support', 'customer message', 'lead follow-up', 'appointment', 'booking']],
  ['mvp_app_launch', ['app', 'mvp', 'platform', 'portal', 'dashboard', 'internal tool']],
  ['lead_generation', ['lead', 'sales', 'prospect', 'pipeline', 'crm']],
  ['operations_automation', ['invoice', 'admin', 'report', 'workflow', 'manual', 'operations', 'spreadsheet']],
  ['content_localization', ['content', 'translation', 'arabic', 'french', 'localization']],
];

const primaryUseCase = useCaseRules.find(([, terms]) => includesAny(corpus, terms))?.[0] || 'ai_opportunity_audit';
const isMoroccanMarket = includesAny(lower(market), ['morocco', 'maroc', 'ma', 'casablanca', 'rabat', 'marrakech', 'tanger', 'agadir', 'fes', 'fez']);
const isInternational = !isMoroccanMarket || includesAny(corpus, ['global', 'international', 'abroad', 'europe', 'usa', 'uk', 'france']);
const isHighUrgency = includesAny(urgency, ['urgent', 'this week', 'asap', 'now', 'immediate']);
const isWarmChannel = includesAny(channel, ['intch', 'referral', 'partner', 'whatsapp']);
const hasProblem = problem.length >= 20;
const hasBudget = Boolean(budget);
const hasContact = Boolean(email || phone);

const scoreBreakdown = {
  problemClarity: hasProblem ? 1 : 0,
  budgetSignal: hasBudget ? 1 : 0,
  urgency: isHighUrgency ? 1 : 0,
  warmChannel: isWarmChannel ? 1 : 0,
  marketFit: (isMoroccanMarket || isInternational) ? 1 : 0,
  contactability: hasContact ? 1 : 0,
};

const score = Object.values(scoreBreakdown).reduce((total, value) => total + value, 0);
const qualification = score >= 5 ? 'hot' : score >= 3 ? 'warm' : 'early';

const offerByUseCase = {
  ai_whatsapp_assistant: 'AI WhatsApp Assistant',
  mvp_app_launch: 'MVP/App Launch Sprint',
  lead_generation: 'Business Automation Sprint',
  operations_automation: 'Business Automation Sprint',
  agency_delivery_partner: 'AI Outsourcing Partner',
  content_localization: 'Free AI Opportunity Audit',
  ai_opportunity_audit: 'Free AI Opportunity Audit',
};

const recommendedOffer = offerByUseCase[primaryUseCase] || 'Free AI Opportunity Audit';
const nextAction = qualification === 'hot'
  ? 'Book a discovery call and prepare a paid pilot proposal.'
  : qualification === 'warm'
    ? 'Offer a free 30-minute AI audit and ask the discovery questions.'
    : 'Send a short clarification message before offering the audit.';

const dataSensitivity = ['healthcare', 'finance', 'hr', 'legal'].includes(detectedIndustry) ? 'high' : 'standard';
const capturedAt = new Date().toISOString();
const leadId = `SAE-${capturedAt.slice(0, 10).replaceAll('-', '')}-${slugify(companyName)}`;
const summary = `${companyName} is a ${qualification} lead for ${recommendedOffer}.`;

const auditChecklist = [
  'Confirm the business goal and success metric.',
  'Map the current lead/customer workflow.',
  'Identify the first automation that can ship without sensitive data.',
  'Confirm tools to connect first.',
  'Define the pilot acceptance criteria.',
];

const discoveryQuestions = [
  'Which workflow currently costs the most time each week?',
  'Who owns the follow-up after a lead or customer message arrives?',
  'Which tools must the automation connect to first?',
  'What data should never leave your current systems?',
  'What result would make this pilot worth paying for?',
];

const recommendedStack = primaryUseCase === 'ai_whatsapp_assistant'
  ? ['n8n', 'WhatsApp Business API provider', 'Google Sheets/CRM', 'Claude or OpenAI for response drafting']
  : primaryUseCase === 'mvp_app_launch'
    ? ['Next.js', 'Supabase or Neon Postgres', 'n8n', 'Claude/OpenAI for assistant features']
    : ['n8n', 'Google Sheets/Notion/Airtable', 'Email or WhatsApp notifications', 'Claude/OpenAI proposal generation'];

const persistenceRecord = {
  leadId,
  companyName,
  contactName,
  email,
  phone,
  website,
  market,
  language,
  detectedIndustry,
  companySize,
  primaryUseCase,
  sourceChannel: channel,
  problem,
  urgency,
  budget,
  qualification,
  score,
  scoreBreakdown,
  recommendedOffer,
  nextAction,
  status: qualification === 'hot' ? 'Discovery call needed' : qualification === 'warm' ? 'Audit offered' : 'Needs clarification',
  dataSensitivity,
  capturedAt,
  tags: ['sae', 'nexusai', qualification, detectedIndustry, primaryUseCase, recommendedOffer.toLowerCase().replace(/[^a-z0-9]+/g, '-')],
  cndpNote: dataSensitivity === 'high'
    ? 'High-sensitivity lead. Confirm CNDP, client consent, hosting, and data minimization before processing personal or sensitive data.'
    : 'Store only lead-intake data needed for follow-up; confirm CNDP and client data requirements before adding sensitive fields.',
};

const notification = {
  shouldNotify: qualification === 'hot',
  priority: qualification === 'hot' ? 'high' : 'normal',
  channels: ['whatsapp', 'email', 'slack-or-telegram'],
  title: `${qualification === 'hot' ? 'Hot' : 'New'} SAE lead: ${companyName}`,
  message: `${summary} Source: ${channel}. Market: ${market}. Use case: ${primaryUseCase}. Next action: ${nextAction}`,
  callToAction: nextAction,
};

const proposalDraft = {
  title: `${recommendedOffer} for ${companyName}`,
  opening: `Thanks for sharing the challenge. Based on the intake, the best next step is ${recommendedOffer}.`,
  diagnosis: [
    `Main problem: ${problem || 'Needs discovery.'}`,
    `Market context: ${market}`,
    `Detected industry: ${detectedIndustry}`,
    `Primary use case: ${primaryUseCase}`,
    `Lead temperature: ${qualification} (${score}/6)`,
  ],
  proposedScope: [
    'Map the current workflow and success criteria.',
    'Ship a working first automation or app slice.',
    'Connect the first operational system or lead source.',
    'Review results and define the next paid rollout.',
  ],
  firstMilestone: qualification === 'hot'
    ? 'Prepare a paid pilot proposal after discovery call.'
    : 'Run the free AI opportunity audit first.',
  auditChecklist,
  discoveryQuestions,
  recommendedStack,
  aiPrompt: `Write a concise professional proposal for ${companyName}. Offer: ${recommendedOffer}. Industry: ${detectedIndustry}. Use case: ${primaryUseCase}. Problem: ${problem}. Market: ${market}. Data sensitivity: ${dataSensitivity}. Tone: confident, practical, bilingual-friendly for Moroccan B2B.`,
};

const connectorTargets = {
  notion: 'Create a database item using persistenceRecord fields.',
  airtable: 'Create a record using persistenceRecord as fields.',
  googleSheets: 'Append one row from persistenceRecord values.',
  crm: 'Create or update a lead, then attach proposalDraft and notification.message.',
  notification: 'If notification.shouldNotify is true, send notification.message to WhatsApp, email, Slack, or Telegram.',
  aiProposal: 'Send proposalDraft.aiPrompt to Claude, OpenAI, Gemini, or Cursor to generate the first client-facing proposal.',
};

return [{
  json: {
    saeTemplate: 'first-ai-opportunity-intake',
    status: 'qualified',
    leadId,
    companyName,
    contactName,
    email,
    phone,
    website,
    market,
    language,
    detectedIndustry,
    primaryUseCase,
    dataSensitivity,
    sourceChannel: channel,
    qualification,
    score,
    scoreBreakdown,
    recommendedOffer,
    nextAction,
    summary,
    capturedAt,
    persistenceRecord,
    notification,
    proposalDraft,
    connectorTargets,
  },
}];
