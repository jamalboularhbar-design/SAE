import { Link } from 'wouter';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { LIVE_CASE_STUDIES } from '@/lib/brand';
import { Button } from '@/components/ui/button';

export default function ProductCaseStudyROI() {
  return (
    <section id="case-studies" className="py-20 px-4 bg-gradient-to-b from-muted/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-medium mb-2">
            Proof from live deployments
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Quantifiable ROI — not hypotheticals</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Founding clients run real operations on ARG-Builder. These numbers come from live workspace rollouts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {LIVE_CASE_STUDIES.map((study) => (
            <article
              key={study.id}
              className="rounded-xl border border-border bg-card p-6 sm:p-8 hover:border-teal-500/30 transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-medium text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                    {study.industry}
                  </span>
                  <h3 className="text-lg font-semibold mt-1 leading-snug">{study.company}</h3>
                </div>
                <span className="shrink-0 w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-sm font-bold text-teal-600">
                  {study.logo}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {study.results.map((r) => (
                  <div key={r.label} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
                      <span className="text-xl font-bold text-foreground">{r.metric}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.label}</p>
                  </div>
                ))}
              </div>

              <blockquote className="text-sm text-muted-foreground italic border-l-2 border-teal-500/40 pl-3 mb-5 flex-1">
                &ldquo;{study.quote}&rdquo;
                <footer className="not-italic text-xs mt-2 text-foreground/70">— {study.quoteAuthor}</footer>
              </blockquote>

              <div className="flex flex-wrap gap-2">
                {study.personaPath && (
                  <Link href={study.personaPath}>
                    <Button size="sm" variant="outline" className="border-border gap-1.5">
                      Explore workspace <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                )}
                <Link href={`/case-studies?study=${study.id}`}>
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black gap-1.5">
                    Full story <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/case-studies">
            <Button variant="outline" className="border-border gap-2">
              View all case studies <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
