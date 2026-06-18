import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Mail, Save, Eye, Edit2, RotateCcw } from 'lucide-react';
import { Link } from 'wouter';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  triggerDay: number;
  description: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to ARG Builder — Your 14-Day Trial Starts Now',
    body: `Hi {{name}},

Welcome to ARG Builder! Your 14-day free trial is now active.

Here's what you can do right away:
• Import your first operational document
• Try AI-powered search across your content
• Explore the knowledge graph visualization
• Set up reading goals for your team

Need help getting started? Reply to this email or book a quick onboarding call.

Best,
The ARG Builder Team`,
    triggerDay: 0,
    description: 'Sent immediately when a trial starts',
  },
  {
    id: 'day3_tips',
    name: 'Day 3 — Power Tips',
    subject: '3 features you haven\'t tried yet in ARG Builder',
    body: `Hi {{name}},

You've been using ARG Builder for 3 days — here are some features that power users love:

1. **Knowledge Graph** — See how your documents connect visually
2. **AI Summaries** — Get instant summaries of any document
3. **Reading Goals** — Track your team's knowledge consumption

Pro tip: Try searching with natural language like "How do we handle VIP guest complaints?"

Still exploring? Book a quick demo and we'll show you the fastest path to value.

Cheers,
The ARG Builder Team`,
    triggerDay: 3,
    description: 'Sent 3 days into trial to boost engagement',
  },
  {
    id: 'day7_value',
    name: 'Day 7 — Value Highlight',
    subject: 'Your team could save 12 hours/week with ARG Builder',
    body: `Hi {{name}},

You're halfway through your trial! Here's what teams like yours typically achieve:

📊 **60% faster** onboarding for new team members
⏱️ **12 hours/week** saved on searching for information
📈 **3x more** knowledge sharing across departments

Ready to see your own ROI? Try our calculator: {{roi_link}}

Want to discuss how ARG Builder fits your specific workflow? Let's chat.

Best,
The ARG Builder Team`,
    triggerDay: 7,
    description: 'Sent at trial midpoint to demonstrate value',
  },
  {
    id: 'day12_warning',
    name: 'Day 12 — Expiry Warning',
    subject: 'Your ARG Builder trial expires in 2 days',
    body: `Hi {{name}},

Your free trial expires in just 2 days. Don't lose access to:

• All your imported documents and organization
• AI search and knowledge graph
• Team collaboration features
• Reading analytics and goals

**Upgrade now** to keep everything intact: {{upgrade_link}}

Questions about pricing? Reply to this email — we're happy to find the right plan for your team.

Best,
The ARG Builder Team`,
    triggerDay: 12,
    description: 'Urgency email 2 days before trial ends',
  },
  {
    id: 'day14_expired',
    name: 'Day 14 — Trial Expired',
    subject: 'Your ARG Builder trial has ended — but your data is safe',
    body: `Hi {{name}},

Your 14-day trial has ended, but don't worry — all your data is safely stored.

Reactivate anytime to pick up right where you left off: {{upgrade_link}}

As a thank you for trying ARG Builder, here's **20% off** your first 3 months with code: WELCOME20

We'd also love your feedback — what could we improve? Just reply to this email.

Best,
The ARG Builder Team`,
    triggerDay: 14,
    description: 'Sent when trial expires with win-back offer',
  },
];

export default function AdminEmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('nurture_email_templates');
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const saveTemplates = (updated: EmailTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem('nurture_email_templates', JSON.stringify(updated));
    toast.success('Template saved successfully');
  };

  const handleSave = (id: string, subject: string, body: string) => {
    const updated = templates.map(t => t.id === id ? { ...t, subject, body } : t);
    saveTemplates(updated);
    setEditingId(null);
  };

  const handleReset = (id: string) => {
    const defaultTemplate = DEFAULT_TEMPLATES.find(t => t.id === id);
    if (!defaultTemplate) return;
    const updated = templates.map(t => t.id === id ? defaultTemplate : t);
    saveTemplates(updated);
    toast.info('Template reset to default');
  };

  const previewTemplate = templates.find(t => t.id === previewId);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin/settings">
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">&larr; Settings</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Email Template Editor
            </h1>
            <p className="text-muted-foreground mt-1">
              Customize the nurture email sequence sent to trial users. Changes are saved locally and used by the nurture system.
            </p>
          </div>
        </div>

        {/* Template List */}
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">Day {template.triggerDay}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewId(previewId === template.id ? null : template.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(editingId === template.id ? null : template.id)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReset(template.id)}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </CardHeader>

              {/* Edit Mode */}
              {editingId === template.id && (
                <CardContent>
                  <TemplateEditor
                    template={template}
                    onSave={(subject, body) => handleSave(template.id, subject, body)}
                    onCancel={() => setEditingId(null)}
                  />
                </CardContent>
              )}

              {/* Preview Mode */}
              {previewId === template.id && editingId !== template.id && (
                <CardContent>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Subject: {template.subject}</p>
                    <div className="border-t border-border pt-3">
                      <pre className="text-sm whitespace-pre-wrap font-sans text-muted-foreground">
                        {template.body.replace(/\{\{name\}\}/g, 'John').replace(/\{\{roi_link\}\}/g, 'https://app.argbuilder.com/roi').replace(/\{\{upgrade_link\}\}/g, 'https://app.argbuilder.com/pricing')}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Variable Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-sm">Available Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { var: '{{name}}', desc: 'Recipient name' },
                { var: '{{email}}', desc: 'Recipient email' },
                { var: '{{company}}', desc: 'Company name' },
                { var: '{{days_left}}', desc: 'Trial days remaining' },
                { var: '{{roi_link}}', desc: 'ROI calculator URL' },
                { var: '{{upgrade_link}}', desc: 'Pricing page URL' },
                { var: '{{demo_link}}', desc: 'Book demo URL' },
                { var: '{{unsubscribe}}', desc: 'Unsubscribe link' },
              ].map(v => (
                <div key={v.var} className="text-xs">
                  <code className="text-primary font-mono">{v.var}</code>
                  <p className="text-muted-foreground mt-0.5">{v.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TemplateEditor({ template, onSave, onCancel }: {
  template: EmailTemplate;
  onSave: (subject: string, body: string) => void;
  onCancel: () => void;
}) {
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Subject Line</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email subject..."
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Email Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-64 p-3 rounded-lg border border-border bg-background text-sm font-mono resize-y"
          placeholder="Email body content..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(subject, body)}>
          <Save className="w-4 h-4 mr-1" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
