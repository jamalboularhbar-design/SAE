/**
 * One-time importer: seeds all documents from the /docs folder into the database.
 * Run once after deploy: node seed-from-files.mjs
 * Safe to re-run — clears and re-seeds each time.
 */
import fs from 'fs';
import path from 'path';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, 'docs-seed');

const categories = {
  'Engineering': ['engineering','ci-cd','cicd','devops','kubernetes','docker','api','database','testing','code','monorepo','microservice','serverless','webhook','graphql','typescript','frontend','backend','deployment','pipeline','observability','monitoring','logging','caching','pagination','dependency','git','release','feature-flag','architecture','infrastructure','terraform','container','gateway','queue','secrets','configuration','environment','error-handling','resilience','performance','load-test','chaos','trunk-based','zero-trust','opentelemetry','canary','rollout','devsecops','regression','finops'],
  'Sales': ['sales','sdr','deal','pipeline','territory','quota','commission','demo','discovery','objection','negotiation','closing','competitive','battle-card','forecast','handoff','proof-of-concept','intent-data','buyer-signal','procurement','rfp','revenue-intelligence','win-loss','revops','outreach','cold'],
  'Marketing': ['marketing','seo','content','email','landing-page','demand-gen','abm','account-based','influencer','podcast','video','webinar','social','linkedin','paid','affiliate','event','press','brand','messaging','attribution','launch','product-hunt'],
  'Customer Success': ['customer','onboarding','churn','retention','nps','csat','health-score','qbr','renewal','upsell','expansion','win-back','escalation','implementation','self-service','advocacy','champion','lifecycle','success','satisfaction','feedback','migration'],
  'Product': ['product','roadmap','design-system','accessibility','notification','permission','rbac','search','builder','gamification','dark-mode','changelog','keyboard','growth-loop','experimentation','contextual-help','knowledge-base','personalization','collaborative','multiplayer','prototype','specification'],
  'Finance & Legal': ['finance','legal','tax','accounting','billing','revenue-recognition','cap-table','equity','fundraising','investor','series','seed','banking','treasury','insurance','ip','patent','trademark','incorporation','payroll','cfo','convertible','safe','stripe','pricing'],
  'Strategy & Operations': ['strategy','okr','planning','annual','board','governance','advisor','culture','values','offsite','retreat','operating','cross-functional','knowledge-management','wiki','async','communication','internal','town-hall','crisis','vendor','workspace','founder','burnout','mental-health','diversity','handbook','sustainability','implementation','deploy','checklist','weekly','metrics','dashboard','summary','report','template','script'],
  'People & Culture': ['hiring','talent','interview','performance-review','employee','compensation','benefits','remote','distributed','team','hr'],
  'AI & Developer': ['ai','ml','machine-learning','copilot','agent','agentic','chatbot','llm','gpt','semantic','sentiment','governance'],
  'Security & Compliance': ['security','compliance','soc-2','iso-27001','hipaa','gdpr','privacy','data-governance','audit','pci','sox','rate-limiting','hardening'],
  'Partnerships & GTM': ['partner','channel','marketplace','gtm','referral','reseller','co-sell','white-label','devrel','developer-relations','ecosystem'],
  'Data & Analytics': ['data','warehouse','analytics','cohort','product-analytics','cdp','enrichment','segmentation','predictive','embedded-analytics','lake','unified'],
  'Horizon Concierge': ['RR-','riad','routes','luxury-travel','concierge','hospitality','guest','booking','tour','morocco','travel'],
  'Meridian Creative Studio': ['AK-','artkech','brand-identity','creative-brief','design-review','portfolio','photography','freelancer','contractor'],
};

function categorize(filename) {
  if (filename.includes('ARG-Builder-RR-') || filename.includes('RR-')) return 'Horizon Concierge';
  if (filename.includes('ARG-Builder-AK-') || filename.includes('AK-')) return 'Meridian Creative Studio';
  
  const nameLower = filename.toLowerCase();
  let best = 'Strategy & Operations';
  let bestScore = 0;
  
  for (const [cat, keywords] of Object.entries(categories)) {
    if (cat === 'Horizon Concierge' || cat === 'Meridian Creative Studio') continue;
    const score = keywords.filter(kw => nameLower.includes(kw.toLowerCase())).length;
    if (score > bestScore) { bestScore = score; best = cat; }
  }
  return best;
}

function slugify(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 200);
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.error('DATABASE_URL not set'); process.exit(1); }
  if (!fs.existsSync(DOCS_DIR)) { console.error(`docs-seed/ folder not found at ${DOCS_DIR}`); process.exit(1); }

  const connection = await createConnection(dbUrl);
  console.log('Connected to database');

  const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md')).sort();
  console.log(`Found ${files.length} documents to seed`);

  // Clear existing docs
  await connection.execute('DELETE FROM documents');
  console.log('Cleared existing documents');

  let inserted = 0;
  const batchSize = 10;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const values = [];
    const placeholders = [];

    for (const filename of batch) {
      const filePath = path.join(DOCS_DIR, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const slug = slugify(filename);
      const title = filename.replace(/\.md$/, '').replace(/ARG-Builder[-: ]+/gi, '').replace(/[-_]/g, ' ').trim();
      const category = categorize(filename);

      placeholders.push('(?, ?, ?, ?, ?, ?)');
      values.push(slug, title, category, filename, content, wordCount);
    }

    const sql = `INSERT IGNORE INTO documents (slug, title, category, filename, content, wordCount) VALUES ${placeholders.join(', ')}`;
    await connection.execute(sql, values);
    inserted += batch.length;
    process.stdout.write(`\rInserted ${inserted}/${files.length} documents`);
  }

  console.log(`\nDone! ${inserted} documents seeded.`);
  await connection.end();
}

main().catch(err => { console.error('Seed failed:', err); process.exit(1); });
