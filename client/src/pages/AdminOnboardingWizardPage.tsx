import { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Users, Shield, FileUp, Palette, Puzzle, Rocket, 
  CheckCircle, ChevronRight, ChevronLeft, Circle, Loader2, Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface StepField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'checkbox' | 'multi-email';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  helpText?: string;
}

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: StepField[];
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Organization Profile',
    description: 'Set up your organization details and preferences',
    icon: <Building2 className="w-5 h-5" />,
    fields: [
      { id: 'orgName', label: 'Organization Name', type: 'text', placeholder: 'Acme Corporation', required: true },
      { id: 'industry', label: 'Industry', type: 'select', options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Consulting', 'Government', 'Non-Profit', 'Other'], required: true },
      { id: 'size', label: 'Company Size', type: 'select', options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'], required: true },
      { id: 'website', label: 'Company Website', type: 'text', placeholder: 'https://example.com' },
      { id: 'timezone', label: 'Primary Timezone', type: 'select', options: ['UTC-8 (Pacific)', 'UTC-7 (Mountain)', 'UTC-6 (Central)', 'UTC-5 (Eastern)', 'UTC+0 (GMT)', 'UTC+1 (CET)', 'UTC+2 (EET)', 'UTC+5:30 (IST)', 'UTC+8 (CST)', 'UTC+9 (JST)'] },
    ],
  },
  {
    id: 2,
    title: 'Invite Team Members',
    description: 'Add your team and assign initial roles',
    icon: <Users className="w-5 h-5" />,
    fields: [
      { id: 'adminEmails', label: 'Admin Users (full access)', type: 'multi-email', placeholder: 'admin@company.com', helpText: 'These users will have full administrative access' },
      { id: 'editorEmails', label: 'Editor Users (create & edit)', type: 'multi-email', placeholder: 'editor@company.com', helpText: 'Can create and edit documents but not manage settings' },
      { id: 'viewerEmails', label: 'Viewer Users (read only)', type: 'multi-email', placeholder: 'viewer@company.com', helpText: 'Can view and search documents only' },
    ],
  },
  {
    id: 3,
    title: 'Authentication & SSO',
    description: 'Configure how your team will sign in',
    icon: <Shield className="w-5 h-5" />,
    fields: [
      { id: 'authMethod', label: 'Authentication Method', type: 'select', options: ['Email/Password (Default)', 'SAML 2.0 (Okta, Azure AD)', 'OAuth 2.0 (Google Workspace)', 'Custom OIDC Provider'], required: true },
      { id: 'enforceMfa', label: 'Require Multi-Factor Authentication (MFA)', type: 'checkbox', helpText: 'Enforce TOTP-based 2FA for all users' },
      { id: 'sessionTimeout', label: 'Session Timeout', type: 'select', options: ['1 hour', '4 hours', '8 hours', '24 hours', '7 days', '30 days'] },
      { id: 'ipWhitelist', label: 'IP Whitelist (optional)', type: 'textarea', placeholder: '192.168.1.0/24\n10.0.0.0/8', helpText: 'Restrict access to specific IP ranges, one per line' },
    ],
  },
  {
    id: 4,
    title: 'Import Documents',
    description: 'Bring your existing knowledge base content',
    icon: <FileUp className="w-5 h-5" />,
    fields: [
      { id: 'importSource', label: 'Import Source', type: 'select', options: ['None (start fresh)', 'Confluence', 'Notion', 'Google Drive', 'SharePoint', 'CSV/Markdown files', 'Custom API'] },
      { id: 'importCategories', label: 'Default Categories to Create', type: 'textarea', placeholder: 'Engineering\nProduct\nSales\nHR\nOperations', helpText: 'One category per line. These will be created as document categories.' },
      { id: 'importTags', label: 'Initial Tags', type: 'textarea', placeholder: 'onboarding, policy, sop, template', helpText: 'Comma-separated list of tags to pre-create' },
    ],
  },
  {
    id: 5,
    title: 'Branding & Appearance',
    description: 'Customize the look and feel for your organization',
    icon: <Palette className="w-5 h-5" />,
    fields: [
      { id: 'brandColor', label: 'Primary Brand Color', type: 'text', placeholder: '#2563eb', helpText: 'Hex color code for your brand accent' },
      { id: 'logoUrl', label: 'Logo URL', type: 'text', placeholder: 'https://example.com/logo.png', helpText: 'URL to your company logo (recommended: 200x50px)' },
      { id: 'customDomain', label: 'Custom Domain (optional)', type: 'text', placeholder: 'docs.yourcompany.com', helpText: 'Point your own domain to this knowledge base' },
      { id: 'welcomeMessage', label: 'Welcome Message', type: 'textarea', placeholder: 'Welcome to our knowledge base! Find everything you need to succeed.', helpText: 'Shown to users on their first visit' },
    ],
  },
  {
    id: 6,
    title: 'Integrations',
    description: 'Connect your existing tools and workflows',
    icon: <Puzzle className="w-5 h-5" />,
    fields: [
      { id: 'slackIntegration', label: 'Connect Slack', type: 'checkbox', helpText: 'Get notifications and share documents in Slack' },
      { id: 'teamsIntegration', label: 'Connect Microsoft Teams', type: 'checkbox', helpText: 'Integrate with Teams for notifications' },
      { id: 'zapierIntegration', label: 'Enable Zapier', type: 'checkbox', helpText: 'Automate workflows with 5000+ apps' },
      { id: 'webhookUrl', label: 'Webhook URL (optional)', type: 'text', placeholder: 'https://hooks.yourapp.com/events', helpText: 'Receive real-time event notifications' },
    ],
  },
  {
    id: 7,
    title: 'Go Live Checklist',
    description: 'Review and launch your enterprise knowledge base',
    icon: <Rocket className="w-5 h-5" />,
    fields: [
      { id: 'reviewOrg', label: 'Organization profile is complete', type: 'checkbox' },
      { id: 'reviewTeam', label: 'Team members have been invited', type: 'checkbox' },
      { id: 'reviewAuth', label: 'Authentication is configured', type: 'checkbox' },
      { id: 'reviewContent', label: 'Initial content has been imported or created', type: 'checkbox' },
      { id: 'reviewBranding', label: 'Branding matches your organization', type: 'checkbox' },
      { id: 'reviewIntegrations', label: 'Key integrations are connected', type: 'checkbox' },
    ],
  },
];

export default function AdminOnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load saved state from backend
  const { data: savedState, isLoading } = trpc.onboardingWizard.getState.useQuery();
  const utils = trpc.useUtils();
  const saveMutation = trpc.onboardingWizard.saveState.useMutation({
    onSuccess: () => {
      setHasUnsavedChanges(false);
      toast.success('Progress saved');
    },
    onError: () => {
      toast.error('Failed to save progress');
    },
  });
  const resetMutation = trpc.onboardingWizard.resetState.useMutation({
    onSuccess: () => {
      setCurrentStep(0);
      setFormData({});
      setCompletedSteps(new Set());
      setHasUnsavedChanges(false);
      setInitialized(false);
      utils.onboardingWizard.getState.invalidate();
      toast.success('Onboarding wizard has been reset. You can start fresh.');
    },
    onError: () => toast.error('Failed to reset onboarding'),
  });
  const inviteMutation = trpc.onboardingWizard.sendInvites.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.invited} invitation(s) sent successfully!`);
    },
    onError: () => toast.error('Failed to send invitations'),
  });

  // Restore state from DB on load
  useEffect(() => {
    if (savedState && !initialized) {
      setCurrentStep(savedState.currentStep);
      setCompletedSteps(new Set(savedState.completedSteps));
      setFormData(savedState.formData);
      setInitialized(true);
    }
  }, [savedState, initialized]);

  const step = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const persistState = useCallback((nextStep: number, nextCompleted: Set<number>, nextFormData: Record<string, string | boolean>, isComplete?: boolean) => {
    saveMutation.mutate({
      currentStep: nextStep,
      completedSteps: Array.from(nextCompleted),
      formData: nextFormData,
      isComplete,
    });
  }, [saveMutation]);

  const updateField = (fieldId: string, value: string | boolean) => {
    setFormData(prev => {
      const next = { ...prev, [fieldId]: value };
      setHasUnsavedChanges(true);
      return next;
    });
  };

  const handleSendInvites = (role: 'admin' | 'user', fieldId: string) => {
    const emailsRaw = (formData[fieldId] as string) || '';
    const emails = emailsRaw.split(/[\n,]+/).map(e => e.trim()).filter(e => e && e.includes('@'));
    if (emails.length === 0) {
      toast.error('No valid emails found. Enter one email per line.');
      return;
    }
    inviteMutation.mutate({ emails, role });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the onboarding wizard? All progress will be lost.')) {
      resetMutation.mutate();
    }
  };

  const handleNext = () => {
    const nextCompleted = new Set(Array.from(completedSteps));
    nextCompleted.add(currentStep);
    setCompletedSteps(nextCompleted);

    const nextStep = Math.min(currentStep + 1, WIZARD_STEPS.length - 1);
    setCurrentStep(nextStep);
    persistState(nextStep, nextCompleted, formData);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const nextStep = currentStep - 1;
      setCurrentStep(nextStep);
      persistState(nextStep, completedSteps, formData);
    }
  };

  const handleFinish = () => {
    const nextCompleted = new Set(Array.from(completedSteps));
    nextCompleted.add(currentStep);
    setCompletedSteps(nextCompleted);
    persistState(currentStep, nextCompleted, formData, true);
    toast.success('Enterprise onboarding complete! Your knowledge base is ready to go.');
  };

  const handleSkip = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      persistState(nextStep, completedSteps, formData);
    }
  };

  const handleSave = () => {
    persistState(currentStep, completedSteps, formData);
  };

  const handleStepClick = (idx: number) => {
    setCurrentStep(idx);
    if (hasUnsavedChanges) {
      persistState(idx, completedSteps, formData);
    }
  };

  const renderField = (field: StepField) => {
    const value = formData[field.id] ?? '';

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              value={value as string}
              onChange={e => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
          </div>
        );
      case 'multi-email':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={value as string}
              onChange={e => updateField(field.id, e.target.value)}
              placeholder={`${field.placeholder}\nuser2@company.com\nuser3@company.com`}
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm resize-none"
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
          </div>
        );
      case 'select':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value as string}
              onChange={e => updateField(field.id, e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
            >
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
          </div>
        );
      case 'textarea':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={value as string}
              onChange={e => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm resize-none"
            />
            {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="flex items-start gap-3 py-2">
            <input
              type="checkbox"
              checked={!!formData[field.id]}
              onChange={e => updateField(field.id, e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border"
            />
            <div>
              <label className="text-sm font-medium cursor-pointer">{field.label}</label>
              {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-3">Loading your setup progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <Badge className="mb-3 bg-primary/10 text-primary">Enterprise Setup</Badge>
              <h1 className="text-2xl font-bold">Onboarding Wizard</h1>
              <p className="text-muted-foreground mt-1">
                Complete these steps to configure your enterprise knowledge base
              </p>
            </div>
            {hasUnsavedChanges && (
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Save
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {WIZARD_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleStepClick(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    idx === currentStep
                      ? 'bg-primary/10 text-primary font-medium'
                      : completedSteps.has(idx)
                      ? 'text-green-600 hover:bg-muted/50'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {completedSteps.has(idx) ? (
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  ) : idx === currentStep ? (
                    <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </nav>

            {savedState?.isComplete && (
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-600 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Setup Complete
                </p>
              </div>
            )}

            {/* Reset Onboarding Button */}
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-destructive"
                onClick={handleReset}
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                Reset Onboarding
              </Button>
            </div>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {step.fields.map(field => renderField(field))}
                </div>

                {/* Send Invites Actions (Step 2 only) */}
                {currentStep === 1 && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <p className="text-xs text-muted-foreground mb-2">Send invitations to the emails listed above:</p>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => handleSendInvites('admin', 'adminEmails')} disabled={inviteMutation.isPending}>
                        {inviteMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Users className="w-3 h-3 mr-1" />}
                        Send Admin Invites
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSendInvites('user', 'editorEmails')} disabled={inviteMutation.isPending}>
                        {inviteMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Users className="w-3 h-3 mr-1" />}
                        Send Editor Invites
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSendInvites('user', 'viewerEmails')} disabled={inviteMutation.isPending}>
                        {inviteMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Users className="w-3 h-3 mr-1" />}
                        Send Viewer Invites
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>

                  <div className="flex gap-3">
                    {currentStep < WIZARD_STEPS.length - 1 && (
                      <Button variant="ghost" onClick={handleSkip}>
                        Skip for now
                      </Button>
                    )}
                    {currentStep < WIZARD_STEPS.length - 1 ? (
                      <Button onClick={handleNext} disabled={saveMutation.isPending}>
                        {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700" disabled={saveMutation.isPending}>
                        {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}
                        Launch Knowledge Base
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contextual Tips */}
            {currentStep === 0 && (
              <Card className="mt-4 border-blue-500/20 bg-blue-500/5">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Tip:</strong> Your organization name will appear in the navigation bar and email notifications. You can change it later in Settings.
                  </p>
                </CardContent>
              </Card>
            )}
            {currentStep === 1 && (
              <Card className="mt-4 border-blue-500/20 bg-blue-500/5">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Tip:</strong> Enter one email per line. Invitations will be sent immediately. You can always add more team members later from the Team page.
                  </p>
                </CardContent>
              </Card>
            )}
            {currentStep === 6 && (
              <Card className="mt-4 border-amber-500/20 bg-amber-500/5">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    <strong>Almost there!</strong> Check off each item to confirm you are ready. You can always come back and adjust settings after launch.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
