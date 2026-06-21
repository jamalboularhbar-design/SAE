import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Settings2, Sparkles, Save, RotateCcw, Cpu, Thermometer, Hash, DollarSign } from 'lucide-react';

interface ModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

interface ServiceConfig {
  name: string;
  description: string;
  config: ModelConfig;
  estimatedCostPer1k: string;
  usageThisMonth: number;
}

export default function AIConfigPage() {
  const [services, setServices] = useState<ServiceConfig[]>([
    { name: 'Document Summarizer', description: 'Generates executive summaries, bullet points, and action items', config: { model: 'gpt-4o-mini', temperature: 0.3, maxTokens: 1000, systemPrompt: 'You are an expert document analyst.' }, estimatedCostPer1k: '$0.15', usageThisMonth: 142 },
    { name: 'Writing Assistant', description: 'Drafts, rewrites, expands, translates, and simplifies content', config: { model: 'gpt-4o', temperature: 0.7, maxTokens: 2000, systemPrompt: 'You are an expert content writer.' }, estimatedCostPer1k: '$2.50', usageThisMonth: 89 },
    { name: 'Semantic Search', description: 'Natural language document search with intent detection', config: { model: 'gpt-4o-mini', temperature: 0.1, maxTokens: 800, systemPrompt: 'You are a semantic search engine.' }, estimatedCostPer1k: '$0.15', usageThisMonth: 324 },
    { name: 'Lead Scoring', description: 'Predictive conversion probability analysis', config: { model: 'gpt-4o-mini', temperature: 0.2, maxTokens: 500, systemPrompt: 'You are a lead scoring AI.' }, estimatedCostPer1k: '$0.15', usageThisMonth: 56 },
    { name: 'Meeting Notes', description: 'Transcript analysis and structured note extraction', config: { model: 'gpt-4o', temperature: 0.3, maxTokens: 2000, systemPrompt: 'You are a meeting notes AI.' }, estimatedCostPer1k: '$2.50', usageThisMonth: 23 },
    { name: 'Sentiment Analysis', description: 'Multi-text sentiment classification with confidence', config: { model: 'gpt-4o-mini', temperature: 0.1, maxTokens: 800, systemPrompt: 'You are a sentiment analysis AI.' }, estimatedCostPer1k: '$0.15', usageThisMonth: 201 },
    { name: 'Workflow Builder', description: 'Plain English to structured workflow conversion', config: { model: 'gpt-4o', temperature: 0.5, maxTokens: 1500, systemPrompt: 'You are a workflow automation architect.' }, estimatedCostPer1k: '$2.50', usageThisMonth: 34 },
    { name: 'Auto-Tagger', description: 'Content classification and tag suggestion', config: { model: 'gpt-4o-mini', temperature: 0.2, maxTokens: 500, systemPrompt: 'You are a content classification AI.' }, estimatedCostPer1k: '$0.15', usageThisMonth: 167 },
    { name: 'Recommendations', description: 'Smart content suggestions based on context', config: { model: 'gpt-4o-mini', temperature: 0.4, maxTokens: 600, systemPrompt: 'You are a content recommendation engine.' }, estimatedCostPer1k: '$0.15', usageThisMonth: 445 },
  ]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [editing, setEditing] = useState<ModelConfig | null>(null);

  const selected = services[selectedIdx];

  const handleEdit = () => setEditing({ ...selected.config });
  const handleSave = () => {
    if (!editing) return;
    const updated = [...services];
    updated[selectedIdx] = { ...updated[selectedIdx], config: editing };
    setServices(updated);
    setEditing(null);
    toast.success('Configuration saved (local only — persistence coming soon)');
  };
  const handleReset = () => setEditing(null);

  const totalUsage = services.reduce((sum, s) => sum + s.usageThisMonth, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-slate-500/10 text-slate-600">Admin / AI</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-slate-500" /> AI Model Configuration
          </h1>
          <p className="text-muted-foreground mt-1">Manage AI service models, parameters, prompts, and monitor usage</p>
        </div>

        {/* Usage Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <Cpu className="w-5 h-5 text-violet-500" />
              <div>
                <p className="text-xl font-bold">{services.length}</p>
                <p className="text-xs text-muted-foreground">AI Services</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xl font-bold">{totalUsage.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Calls This Month</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xl font-bold">~$12.40</p>
                <p className="text-xs text-muted-foreground">Est. Monthly Cost</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service List */}
          <div className="space-y-2">
            {services.map((s, i) => (
              <button
                key={i}
                onClick={() => { setSelectedIdx(i); setEditing(null); }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedIdx === i ? 'border-violet-500 bg-violet-500/5' : 'border-border hover:border-violet-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{s.name}</span>
                  <Badge variant="outline" className="text-[10px]">{s.usageThisMonth}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.config.model}</p>
              </button>
            ))}
          </div>

          {/* Config Panel */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{selected.name}</CardTitle>
                  {!editing && <Button variant="outline" size="sm" onClick={handleEdit}>Edit Config</Button>}
                </div>
                <p className="text-xs text-muted-foreground">{selected.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <>
                    <div>
                      <label className="text-xs font-medium flex items-center gap-1 mb-1"><Cpu className="w-3 h-3" /> Model</label>
                      <select value={editing.model} onChange={e => setEditing({ ...editing, model: e.target.value })} className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm">
                        <option value="gpt-4o">GPT-4o (High quality)</option>
                        <option value="gpt-4o-mini">GPT-4o-mini (Fast & cheap)</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium flex items-center gap-1 mb-1"><Thermometer className="w-3 h-3" /> Temperature: {editing.temperature}</label>
                      <input type="range" min="0" max="1" step="0.1" value={editing.temperature} onChange={e => setEditing({ ...editing, temperature: parseFloat(e.target.value) })} className="w-full" />
                      <div className="flex justify-between text-[10px] text-muted-foreground"><span>Precise</span><span>Creative</span></div>
                    </div>
                    <div>
                      <label className="text-xs font-medium flex items-center gap-1 mb-1"><Hash className="w-3 h-3" /> Max Tokens</label>
                      <input type="number" value={editing.maxTokens} onChange={e => setEditing({ ...editing, maxTokens: Number(e.target.value) })} min={100} max={4000} className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1">System Prompt</label>
                      <textarea value={editing.systemPrompt} onChange={e => setEditing({ ...editing, systemPrompt: e.target.value })} className="w-full h-24 px-3 py-2 rounded-md bg-muted/30 border border-border text-sm resize-none" />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={handleReset}><RotateCcw className="w-3 h-3 mr-1" /> Cancel</Button>
                      <Button size="sm" onClick={handleSave} className="bg-violet-600 hover:bg-violet-700"><Save className="w-3 h-3 mr-1" /> Save</Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Model</p>
                        <p className="text-sm font-medium">{selected.config.model}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Temperature</p>
                        <p className="text-sm font-medium">{selected.config.temperature}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Max Tokens</p>
                        <p className="text-sm font-medium">{selected.config.maxTokens}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Cost per 1K calls</p>
                        <p className="text-sm font-medium">{selected.estimatedCostPer1k}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">System Prompt</p>
                      <p className="text-sm font-mono">{selected.config.systemPrompt}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
