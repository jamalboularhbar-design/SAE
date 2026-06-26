import { CheckCircle2, X, Minus } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { totalDocuments } from '@/lib/documentCatalog';
import { PLATFORM_STATS } from '@shared/platformStats';

const AI_TOOL_COUNT = PLATFORM_STATS.aiTools;

type CellKind = 'win' | 'lose' | 'partial' | 'neutral';

interface ComparisonRow {
  feature: string;
  us: string;
  notion: string;
  templates: string;
  usKind?: CellKind;
}

const ROWS: ComparisonRow[] = [
  {
    feature: 'Pre-written operating library',
    us: `${totalDocuments} docs ready day one`,
    notion: 'Start blank',
    templates: 'Static files',
    usKind: 'win',
  },
  {
    feature: 'Built-in AI tools',
    us: `${AI_TOOL_COUNT} tools at /ai`,
    notion: 'Add-on AI',
    templates: 'None',
    usKind: 'win',
  },
  {
    feature: 'Knowledge graph & dependencies',
    us: `${PLATFORM_STATS.graphEdges.toLocaleString()} cross-ref edges`,
    notion: 'Manual linking',
    templates: 'None',
    usKind: 'win',
  },
  {
    feature: 'Multi-agent runtime (Nexus OS)',
    us: 'Native at /os',
    notion: 'Not available',
    templates: 'Not available',
    usKind: 'win',
  },
  {
    feature: 'Multi-brand workspaces',
    us: 'Native — RR, ArtKech, agency demos',
    notion: 'Workspaces only',
    templates: 'N/A',
    usKind: 'win',
  },
  {
    feature: 'Structured COO-grade taxonomy',
    us: `${PLATFORM_STATS.businessFunctions} functions, one architecture`,
    notion: 'You design it',
    templates: 'Inconsistent',
    usKind: 'win',
  },
  {
    feature: 'Print / PDF with client branding',
    us: 'Confidential footers per workspace',
    notion: 'Basic export',
    templates: 'Manual',
    usKind: 'win',
  },
  {
    feature: 'Search & versioning',
    us: 'Full platform + freshness scores',
    notion: 'Yes',
    templates: 'Manual',
    usKind: 'neutral',
  },
  {
    feature: 'Time to deploy',
    us: 'Minutes',
    notion: 'Weeks–months',
    templates: 'Hours (setup only)',
    usKind: 'win',
  },
  {
    feature: 'Maintained as software',
    us: 'Updates ship with the platform',
    notion: 'You maintain',
    templates: 'Buy once, stale',
    usKind: 'win',
  },
];

function cellKind(value: string, explicit?: CellKind): CellKind {
  if (explicit) return explicit;
  if (value === 'Yes' || value === 'Native' || value.includes('docs') || value.includes('tools') || value.includes('edges')) {
    return 'win';
  }
  if (value === 'None' || value === 'Start blank' || value === 'N/A' || value === 'Not available') {
    return 'lose';
  }
  if (value === 'Add-on AI' || value === 'Manual' || value === 'Inconsistent' || value === 'You maintain') {
    return 'partial';
  }
  return 'neutral';
}

function CompareCell({ value, kind }: { value: string; kind: CellKind }) {
  if (kind === 'win') {
    return (
      <span className="text-teal-700 dark:text-teal-400 font-medium inline-flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        {value}
      </span>
    );
  }
  if (kind === 'lose') {
    return (
      <span className="text-muted-foreground inline-flex items-center justify-center gap-1.5">
        <X className="w-4 h-4 shrink-0 opacity-60" />
        {value}
      </span>
    );
  }
  if (kind === 'partial') {
    return (
      <span className="text-muted-foreground inline-flex items-center justify-center gap-1.5">
        <Minus className="w-4 h-4 shrink-0 opacity-60" />
        {value}
      </span>
    );
  }
  return <span className="text-muted-foreground">{value}</span>;
}

export default function ProductComparisonTable() {
  return (
    <section id="compare" className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Why operators choose {BRAND.productName}
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Pre-built library + knowledge graph + AI + runtime — not blank pages, dead files, or bolt-on tools.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left p-4 font-semibold text-muted-foreground min-w-[180px]">Capability</th>
                <th className="p-4 font-semibold text-teal-700 dark:text-teal-400 min-w-[160px]">
                  {BRAND.productName}
                </th>
                <th className="p-4 font-semibold text-muted-foreground min-w-[140px]">Notion</th>
                <th className="p-4 font-semibold text-muted-foreground min-w-[140px]">Template packs</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-border/60 hover:bg-muted/10">
                  <td className="p-4 text-foreground/90 font-medium">{row.feature}</td>
                  <td className="p-4 text-center bg-teal-500/5">
                    <CompareCell value={row.us} kind={cellKind(row.us, row.usKind ?? 'win')} />
                  </td>
                  <td className="p-4 text-center">
                    <CompareCell value={row.notion} kind={cellKind(row.notion)} />
                  </td>
                  <td className="p-4 text-center">
                    <CompareCell value={row.templates} kind={cellKind(row.templates)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
