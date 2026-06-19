import { Link } from "wouter";
import { ArrowRight, Building2, Hotel, Palette, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CASE_STUDIES,
  caseStudyStatusLabel,
  type CaseStudy,
} from "@shared/caseStudies";

const VERTICAL_ICONS: Record<string, typeof Plane> = {
  "riad-routes": Plane,
  artkech: Palette,
  "atlas-collective": Building2,
  "maison-voyager": Hotel,
};

type VerticalShowcaseProps = {
  /** Called when user picks a live workspace with an interactive demo */
  onOpenWorkspace?: (tab: "travel" | "artkech") => void;
  compact?: boolean;
};

function statusVariant(study: CaseStudy): "default" | "secondary" | "outline" {
  if (study.status === "live" && study.improvementsNeeded) return "secondary";
  if (study.status === "live") return "default";
  return "outline";
}

export default function VerticalShowcase({ onOpenWorkspace, compact }: VerticalShowcaseProps) {
  return (
    <section className="mb-10 sm:mb-16">
      <div className="text-center mb-6 sm:mb-8">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
          Vertical demos
        </p>
        <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
          Four industries, one platform
        </h2>
        {!compact && (
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Live case studies on argbuilder.io plus agency and hospitality reference verticals —
            aligned with our Notion Case Study Tracker.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CASE_STUDIES.map((study) => {
          const Icon = VERTICAL_ICONS[study.id] ?? Building2;
          const primaryAction =
            study.workspaceTab && onOpenWorkspace ? (
              <button
                type="button"
                onClick={() => onOpenWorkspace(study.workspaceTab!)}
                className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Open workspace <ArrowRight className="w-4 h-4" />
              </button>
            ) : study.personaPath ? (
              <Link href={study.personaPath}>
                <span className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Browse SOPs <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ) : (
              <Link href={`/case-studies?study=${study.id}`}>
                <span className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  View story <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );

          return (
            <Card
              key={study.id}
              className="border-border/60 hover:border-primary/40 transition-colors h-full"
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={statusVariant(study)} className="text-[10px] shrink-0">
                    {caseStudyStatusLabel(study)}
                  </Badge>
                </div>
                <p className="font-semibold text-foreground text-sm leading-snug mb-1">
                  {study.company}
                </p>
                <p className="text-xs text-muted-foreground mb-3">{study.industry}</p>
                {!compact && (
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                    {study.subtitle}
                  </p>
                )}
                <div className="mt-auto pt-2">{primaryAction}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <Link href="/case-studies">
          <span className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
            All customer stories <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
