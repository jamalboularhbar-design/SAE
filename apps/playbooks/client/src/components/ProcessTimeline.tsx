import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

interface Stage {
  number: number;
  title: string;
  description: string;
  details?: string[];
}

interface ProcessTimelineProps {
  stages: Stage[];
  title: string;
  description?: string;
}

export default function ProcessTimeline({ stages, title, description }: ProcessTimelineProps) {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="font-display text-2xl mb-2 text-foreground">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div key={stage.number} className="relative">
            {/* Connector line */}
            {index < stages.length - 1 && (
              <div className="absolute left-5 sm:left-6 top-14 sm:top-16 w-0.5 h-6 sm:h-8 bg-gradient-to-b from-accent/50 to-accent/20" />
            )}

            {/* Stage card */}
            <button
              onClick={() => setExpandedStage(expandedStage === stage.number ? null : stage.number)}
              className="w-full text-left transition-all duration-300"
            >
              <Card className="card-premium hover:border-accent/50 transition-all">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Stage number badge */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                      <span className="font-display font-bold text-base sm:text-lg text-accent-foreground">
                        {stage.number}
                      </span>
                    </div>

                    {/* Stage content */}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg mb-1">{stage.title}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{stage.description}</p>
                    </div>

                    {/* Expand indicator */}
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                        expandedStage === stage.number ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>

                {/* Expanded content */}
                {expandedStage === stage.number && (
                  <CardContent className="border-t border-border/50 pt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">{stage.description}</p>
                      {stage.details && stage.details.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Activities</p>
                          <ul className="space-y-2">
                            {stage.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </button>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 pt-4 border-t border-border/50">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent/50 transition-all duration-300"
            style={{ width: `${((expandedStage || 0) / stages.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {stages.length} Stages
        </span>
      </div>
    </div>
  );
}
