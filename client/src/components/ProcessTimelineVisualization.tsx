import { useMemo } from 'react';
import { CheckCircle, Circle, ArrowDown } from 'lucide-react';

interface ProcessStep {
  title: string;
  description?: string;
  duration?: string;
  responsible?: string;
}

interface ProcessTimelineVisualizationProps {
  content: string;
  title?: string;
}

/**
 * Parses markdown content to extract process steps from headers and content.
 * Looks for ## headers as steps, and extracts descriptions from the content below.
 */
function parseStepsFromMarkdown(content: string): ProcessStep[] {
  const steps: ProcessStep[] = [];
  const lines = content.split('\n');
  let currentStep: ProcessStep | null = null;
  let descLines: string[] = [];

  for (const line of lines) {
    // Match ## or ### headers as steps
    const headerMatch = line.match(/^#{2,3}\s+(.+)/);
    if (headerMatch) {
      // Save previous step
      if (currentStep) {
        currentStep.description = descLines.join(' ').trim().slice(0, 200);
        steps.push(currentStep);
      }
      currentStep = { title: headerMatch[1].replace(/^\d+[\.\)]\s*/, '') };
      descLines = [];
    } else if (currentStep && line.trim() && !line.startsWith('#')) {
      // Collect description lines (skip empty lines and sub-headers)
      const cleanLine = line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim();
      if (cleanLine && descLines.length < 3) {
        descLines.push(cleanLine);
      }
      // Extract duration if mentioned
      const durationMatch = line.match(/(\d+\s*(?:min|hour|day|week|month)s?)/i);
      if (durationMatch && !currentStep.duration) {
        currentStep.duration = durationMatch[1];
      }
      // Extract responsible party
      const respMatch = line.match(/(?:responsible|owner|assigned|by):\s*(.+)/i);
      if (respMatch && !currentStep.responsible) {
        currentStep.responsible = respMatch[1].trim();
      }
    }
  }
  // Save last step
  if (currentStep) {
    currentStep.description = descLines.join(' ').trim().slice(0, 200);
    steps.push(currentStep);
  }

  return steps;
}

export default function ProcessTimelineVisualization({ content, title }: ProcessTimelineVisualizationProps) {
  const steps = useMemo(() => parseStepsFromMarkdown(content), [content]);

  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No process steps detected in this document.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="font-semibold text-lg">{title}</h3>}
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Timeline line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />
            )}
            {/* Step indicator */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center z-10">
              <span className="text-xs font-bold text-accent">{index + 1}</span>
            </div>
            {/* Step content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="font-medium text-sm text-foreground">{step.title}</h4>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{step.description}</p>
              )}
              <div className="flex gap-3 mt-1.5">
                {step.duration && (
                  <span className="text-xs text-accent/80 bg-accent/5 px-2 py-0.5 rounded">{step.duration}</span>
                )}
                {step.responsible && (
                  <span className="text-xs text-muted-foreground">{step.responsible}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground border-t border-border/50">
        <CheckCircle className="w-3 h-3 text-green-500" />
        <span>{steps.length} steps in this process</span>
      </div>
    </div>
  );
}
