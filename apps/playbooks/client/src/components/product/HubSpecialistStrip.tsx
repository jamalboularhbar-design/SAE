import { Link } from 'wouter';
import { Brain } from 'lucide-react';
import { HUB_MARKETING_SAMPLE, HUB_ROSTER_STATS } from '@/lib/hub';
import { BRAND } from '@/lib/brand';

export default function HubSpecialistStrip() {
  return (
    <section className="py-12 px-4 border-y border-border/50 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-teal-500/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-indigo-400 font-medium mb-1 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> Hub Specialist · {HUB_ROSTER_STATS.hubVersion}
            </p>
            <h2 className="text-2xl font-bold">The right specialist, every time</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Hub Specialist is the core of {BRAND.nexusOsName}: Chief of Staff reads your request, picks the best
              expert from {HUB_ROSTER_STATS.specialists} specialists across {HUB_ROSTER_STATS.businesses} workspaces,
              and routes work with approvals — not one-size-fits-all AI.
            </p>
          </div>
          <Link href="/runtime">
            <span className="text-sm text-indigo-400 hover:underline cursor-pointer">See runtime demo →</span>
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {HUB_MARKETING_SAMPLE.map((s) =>
            s ? (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border/60 bg-card/80"
                style={{ borderColor: `${s.accent}33` }}
              >
                <span style={{ color: s.accent }}>{s.icon}</span>
                {s.name}
              </span>
            ) : null
          )}
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs text-muted-foreground border border-dashed border-border">
            +{HUB_ROSTER_STATS.specialists - HUB_MARKETING_SAMPLE.length} more in Hub
          </span>
        </div>
      </div>
    </section>
  );
}
