import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, FileText, Copy, Download, Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

const templateTypes = [
  { value: 'sop', label: 'Standard Operating Procedure' },
  { value: 'playbook', label: 'Operational Playbook' },
  { value: 'guide', label: 'Reference Guide' },
  { value: 'checklist', label: 'Process Checklist' },
  { value: 'policy', label: 'Policy Document' },
  { value: 'report', label: 'Report Template' },
  { value: 'proposal', label: 'Business Proposal' },
  { value: 'onboarding', label: 'Onboarding Document' },
];

const industries = [
  { value: 'hospitality', label: 'Hospitality & Travel' },
  { value: 'creative', label: 'Creative & Design' },
  { value: 'tech', label: 'Technology' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'general', label: 'General Business' },
];

export default function AITemplatesPage() {

  const [description, setDescription] = useState('');
  const [templateType, setTemplateType] = useState('sop');
  const [industry, setIndustry] = useState('general');
  const [sections, setSections] = useState('5');
  const [generatedTemplate, setGeneratedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const writerMutation = trpc.ai.write.useMutation();

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please describe the document you need.');
      return;
    }
    setIsGenerating(true);
    setGeneratedTemplate('');
    try {
      const prompt = `Generate a ${templateTypes.find(t => t.value === templateType)?.label || 'document'} template for the ${industries.find(i => i.value === industry)?.label || 'general'} industry.\n\nDescription: ${description}\n\nRequirements:\n- Include ${sections} main sections\n- Use professional formatting with headers, subheaders, and placeholder text\n- Include [PLACEHOLDER] markers where specific content should be filled in\n- Add helpful guidance notes in italics\n- Make it actionable and ready to customize`;
      const result = await writerMutation.mutateAsync({ prompt, mode: 'draft', context: `Template type: ${templateType}, Industry: ${industry}` });
      setGeneratedTemplate(result.content);
    } catch (error) {
      toast.error('Unable to generate template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTemplate);
    toast.success('Template copied to clipboard.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <Wand2 className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Template Generator</h1>
              <p className="text-sm text-muted-foreground">Describe the document you need and AI will generate a full template with sections</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configure Template</CardTitle>
              <CardDescription>Describe what you need and select options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Document Description</label>
                <Textarea
                  placeholder="e.g., A standard operating procedure for handling VIP guest check-ins at a luxury riad, including pre-arrival preparation, welcome protocols, and room orientation..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Template Type</label>
                  <Select value={templateType} onValueChange={setTemplateType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {templateTypes.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Industry</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {industries.map(i => (
                        <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Number of Sections</label>
                <Select value={sections} onValueChange={setSections}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['3', '4', '5', '6', '7', '8', '10'].map(n => (
                      <SelectItem key={n} value={n}>{n} sections</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} disabled={isGenerating || !description.trim()} className="w-full gap-2">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isGenerating ? 'Generating...' : 'Generate Template'}
              </Button>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Generated Template</CardTitle>
                {generatedTemplate && (
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 text-xs">
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-3" />
                  <p className="text-sm">Generating your template...</p>
                </div>
              ) : generatedTemplate ? (
                <div className="prose prose-sm prose-invert max-w-none max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs text-foreground bg-muted p-4 rounded-lg">{generatedTemplate}</pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">Your generated template will appear here</p>
                  <p className="text-xs mt-1">Fill in the form and click Generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
