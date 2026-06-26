import { Link } from "wouter";
import { Quote, ArrowRight } from "lucide-react";
import { CASE_STUDIES } from "@/lib/brand";

const PRIMARY = CASE_STUDIES.find((s) => s.id === "riad-routes") ?? CASE_STUDIES[0];

type SocialProofStripProps = {
  className?: string;
};

export default function SocialProofStrip({ className = "" }: SocialProofStripProps) {
  return (
    <section className={`py-8 sm:py-10 border-t border-border/50 ${className}`} aria-labelledby="social-proof-heading">
      <div className="rounded-xl border border-border/60 bg-card/40 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-medium mb-2">
              Live case study
            </p>
            <h2 id="social-proof-heading" className="font-display text-xl sm:text-2xl text-foreground mb-3">
              {PRIMARY.company}
            </h2>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
              <Quote className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
              <p className="italic">&ldquo;{PRIMARY.quote}&rdquo;</p>
            </div>
            <p className="text-xs text-muted-foreground">— {PRIMARY.quoteAuthor}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-shrink-0">
            {PRIMARY.results.slice(0, 4).map((r) => (
              <div key={r.label} className="text-center p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="text-2xl font-bold text-teal-700 dark:text-teal-300 tabular-nums">{r.metric}</div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border/50">
          <Link href="/case-studies">
            <span className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
              Read all customer stories <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
