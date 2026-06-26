import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Workflow, Sparkles, Loader2, ArrowDown, Clock, Zap } from 'lucide-react';

export default function AIWorkflowPage() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<{
    name: string; trigger: string;
    steps: { id: number; action: string; description: string; condition?: string }[];
    estimatedTime: string; complexity: string;
  } | null>(null);

  const generate = trpc.ai.generateWorkflow.useMutation({
    onSuccess: (data) => { setResult(data); toast.success('Workflow generated'); },
    onError: () => toast.error('Generation failed'),
  });

  const handleGenerate = () => {
    if (description.trim().length < 10) { toast.error('Describe your workflow in more detail'); return; }
    generate.mutate({ description });
  };

  const complexityColor = (c: string) => {
    if (c === 'low') return 'bg-green-500/10 text-green-600';
    if (c === 'high') return 'bg-red-500/10 text-red-600';
    return 'bg-amber-500/10 text-amber-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-indigo-500/10 text-indigo-600">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Workflow className="w-6 h-6 text-indigo-500" /> Intelligent Workflow Builder
          </h1>
          <p className="text-muted-foreground mt-1">Describe a workflow in plain English and AI generates the trigger-action sequence</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-5 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Describe your workflow</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. When a new client signs up, send a welcome email, assign them to an account manager, create a shared folder, and schedule a 30-minute onboarding call within 48 hours."
                className="w-full h-32 px-4 py-3 rounded-lg bg-muted/30 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={generate.isPending} className="bg-indigo-600 hover:bg-indigo-700">
                {generate.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Workflow
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            {/* Header */}
            <Card className="border-indigo-500/30">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{result.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Zap className="w-3 h-3" /> Trigger: {result.trigger}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={complexityColor(result.complexity)}>{result.complexity}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {result.estimatedTime}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Steps */}
            <div className="space-y-0">
              {result.steps.map((step, i) => (
                <div key={step.id}>
                  <Card className="relative">
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-indigo-600">{step.id}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{step.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                          {step.condition && (
                            <Badge variant="outline" className="mt-2 text-xs">Condition: {step.condition}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {i < result.steps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
