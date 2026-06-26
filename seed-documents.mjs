import fs from 'fs';
import path from 'path';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const categories = {
  'Engineering': ['engineering', 'ci-cd', 'cicd', 'devops', 'kubernetes', 'docker', 'api', 'database', 'testing', 'code', 'monorepo', 'microservice', 'serverless', 'webhook', 'graphql', 'typescript', 'frontend', 'backend', 'deployment', 'pipeline', 'observability', 'monitoring', 'logging', 'caching', 'pagination', 'dependency', 'git', 'release', 'feature-flag', 'feature-toggle', 'architecture', 'infrastructure', 'terraform', 'iac', 'container', 'edge-computing', 'cdn', 'service-mesh', 'gateway', 'queue', 'background-job', 'secrets', 'configuration', 'environment', 'error-handling', 'resilience', 'performance', 'memory', 'load-test', 'chaos', 'trunk-based', 'platform-team', 'zero-trust', 'opentelemetry', 'canary', 'rollout', 'crdt', 'devsecops', 'regression', 'snapshot', 'finops'],
  'Customer Success': ['customer', 'onboarding', 'churn', 'retention', 'nps', 'csat', 'health-score', 'qbr', 'renewal', 'upsell', 'expansion', 'win-back', 'escalation', 'implementation', 'self-service', 'advocacy', 'champion', 'lifecycle', 'success', 'satisfaction', 'feedback', 'migration', 'digital-twin', 'proactive-outreach', 'revenue-retention-waterfall'],
  'Sales': ['sales', 'sdr', 'deal', 'pipeline', 'territory', 'quota', 'commission', 'demo', 'discovery', 'objection', 'negotiation', 'closing', 'competitive', 'battle-card', 'forecast', 'handoff', 'mutual-action', 'pov', 'pilot', 'proof-of-concept', 'intent-data', 'buyer-signal', 'procurement', 'rfp', 'revenue-intelligence', 'win-loss', 'revops'],
  'Marketing': ['marketing', 'seo', 'content', 'email', 'landing-page', 'demand-gen', 'abm', 'account-based', 'influencer', 'podcast', 'video', 'webinar', 'social', 'linkedin', 'paid-advertising', 'affiliate', 'event', 'press-kit', 'brand', 'messaging', 'attribution'],
  'Product': ['product', 'roadmap', 'design-system', 'accessibility', 'wcag', 'notification', 'permission', 'rbac', 'search', 'drag-drop', 'builder', 'gamification', 'dark-mode', 'theming', 'changelog', 'undo-redo', 'keyboard', 'information-architecture', 'growth-loop', 'experimentation', 'contextual-help', 'knowledge-base', 'personalization-engine', 'collaborative-editing', 'multiplayer'],
  'Finance & Legal': ['finance', 'legal', 'tax', 'accounting', 'billing', 'revenue-recognition', 'asc-606', 'cap-table', 'equity', 'esop', 'espp', 'fundraising', 'investor', 'series', 'seed', 'venture-debt', 'banking', 'treasury', 'insurance', 'ip', 'patent', 'trademark', 'entity', 'incorporation', 'payroll', 'startup-cfo', 'secondaries', 'liquidity', 'convertible', 'safe'],
  'Strategy & Operations': ['strategy', 'okr', 'planning', 'annual', 'board', 'governance', 'advisor', 'culture', 'values', 'offsite', 'retreat', 'operating-cadence', 'cross-functional', 'knowledge-management', 'wiki', 'async', 'communication', 'internal', 'town-hall', 'crisis', 'vendor', 'procurement', 'workspace', 'office', 'founder', 'burnout', 'mental-health', 'dei', 'diversity', 'employee-handbook', 'sustainability', 'green-software'],
  'People & Culture': ['hiring', 'talent', 'interview', 'performance-review', 'onboarding-employee', 'employee', 'compensation', 'benefits', 'remote', 'distributed'],
  'Revenue & Pricing': ['pricing', 'monetization', 'usage-based', 'freemium', 'downsell', 'acv', 'unit-economics', 'roi-calculator', 'feature-gating', 'tiered-access'],
  'Security & Compliance': ['security', 'compliance', 'soc-2', 'iso-27001', 'hipaa', 'gdpr', 'privacy', 'data-governance', 'audit', 'pci-dss', 'fedramp', 'sox', 'compliance-as-code', 'rate-limiting'],
  'Partnerships & GTM': ['partner', 'channel', 'marketplace', 'gtm', 'referral', 'reseller', 'co-sell', 'white-label', 'oem', 'devrel', 'developer-relations', 'ecosystem'],
  'Data & Analytics': ['data-infrastructure', 'warehouse', 'analytics', 'cohort', 'product-analytics', 'customer-data-platform', 'cdp', 'data-enrichment', 'segmentation', 'predictive-revenue', 'embedded-analytics', 'data-lake', 'customer-360', 'unified-data'],
  'AI & Developer': ['ai', 'ml', 'machine-learning', 'copilot', 'agent', 'vertical-ai', 'agentic', 'chatbot'],
  'Operations': ['incident', 'on-call', 'runbook', 'post-mortem', 'disaster-recovery', 'business-continuity', 'capacity-planning']
};

function categorize(name) {
  const nameLower = name.toLowerCase();
  let bestCat = 'Strategy & Operations';
  let bestScore = 0;
  for (const [category, keywords] of Object.entries(categories)) {
    const score = keywords.filter(kw => nameLower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCat = category;
    }
  }
  return bestCat;
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const connection = await createConnection(dbUrl);
  console.log('Connected to database');

  // Get all ARG-Builder markdown files
  const docsDir = '/home/ubuntu';
  const files = fs.readdirSync(docsDir)
    .filter(f => f.startsWith('ARG-Builder-') && f.endsWith('.md'))
    .sort();

  console.log(`Found ${files.length} documents to seed`);

  // Clear existing documents
  await connection.execute('DELETE FROM documents');
  console.log('Cleared existing documents');

  let inserted = 0;
  const batchSize = 50;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const values = [];
    const placeholders = [];

    for (const filename of batch) {
      const slug = filename.replace('ARG-Builder-', '').replace('.md', '');
      const title = slug.replace(/-/g, ' ');
      const category = categorize(slug);
      const filePath = path.join(docsDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const wordCount = content.split(/\s+/).length;

      placeholders.push('(?, ?, ?, ?, ?, ?)');
      values.push(slug, title, category, filename, content, wordCount);
    }

    const sql = `INSERT INTO documents (slug, title, category, filename, content, wordCount) VALUES ${placeholders.join(', ')}`;
    await connection.execute(sql, values);
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${files.length} documents`);
  }

  console.log(`\nSeeding complete! ${inserted} documents persisted to database.`);
  await connection.end();
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
