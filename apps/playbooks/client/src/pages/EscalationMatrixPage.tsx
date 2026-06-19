import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Phone, Mail, Clock, Shield, Plane, Palette, ChevronDown, ChevronUp } from 'lucide-react';

type Persona = 'riad-routes' | 'artkech';
type Severity = 'critical' | 'high' | 'medium' | 'low';

interface EscalationLevel {
  level: number;
  title: string;
  responseTime: string;
  contacts: { name: string; role: string; phone: string; email: string }[];
  actions: string[];
}

interface EscalationScenario {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  levels: EscalationLevel[];
}

const RR_SCENARIOS: EscalationScenario[] = [
  {
    id: 'rr-medical',
    title: 'Guest Medical Emergency During Trip',
    severity: 'critical',
    description: 'Guest requires immediate medical attention during a tour, transfer, or while at a provider property.',
    levels: [
      { level: 1, title: 'Immediate Response', responseTime: '< 2 minutes', contacts: [{ name: 'On-Duty Concierge', role: 'Concierge Lead', phone: '+212 6XX-XXXXXX', email: 'concierge@riadandroutes.com' }], actions: ['Call emergency services (15 or 141)', 'Notify accommodation provider staff immediately', 'Contact guest\'s travel insurance provider', 'Stay on the line with guest until help arrives'] },
      { level: 2, title: 'Coordination & Family Contact', responseTime: '< 10 minutes', contacts: [{ name: 'Operations Director', role: 'Director', phone: '+212 6XX-XXXXXX', email: 'ops@riadandroutes.com' }], actions: ['Contact guest\'s emergency contact from booking file', 'Coordinate with provider to ensure room/facility access for medics', 'Arrange hospital transport if needed', 'Assign team member to accompany guest'] },
      { level: 3, title: 'Insurance & Follow-up', responseTime: '< 30 minutes', contacts: [{ name: 'Business Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@riadandroutes.com' }], actions: ['Notify business owner', 'File incident report with travel insurance', 'Coordinate with provider on any property-related factors', 'Arrange trip modification or cancellation as needed'] }
    ]
  },
  {
    id: 'rr-provider-failure',
    title: 'Provider Service Failure',
    severity: 'critical',
    description: 'Accommodation provider cancels last-minute, room not ready, or serious quality issue discovered on guest arrival.',
    levels: [
      { level: 1, title: 'Immediate Guest Protection', responseTime: '< 5 minutes', contacts: [{ name: 'Concierge Lead', role: 'Concierge', phone: '+212 6XX-XXXXXX', email: 'concierge@riadandroutes.com' }], actions: ['Contact backup provider from preferred list', 'Keep guest informed and comfortable (arrange café/lounge)', 'Document the failure with photos/messages', 'Apologize and offer immediate comfort gesture'] },
      { level: 2, title: 'Alternative Arrangement', responseTime: '< 30 minutes', contacts: [{ name: 'Operations Director', role: 'Director', phone: '+212 6XX-XXXXXX', email: 'ops@riadandroutes.com' }], actions: ['Confirm alternative accommodation of equal or higher standard', 'Arrange transport to new property', 'Offer complimentary experience as compensation', 'Formally escalate issue with failing provider'] },
      { level: 3, title: 'Provider Relationship Review', responseTime: '< 24 hours', contacts: [{ name: 'Business Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@riadandroutes.com' }], actions: ['Schedule provider accountability meeting', 'Update provider quality scorecard', 'Review partnership terms and SLA', 'Decide on provider status (warning/suspension/termination)'] }
    ]
  },
  {
    id: 'rr-safety',
    title: 'Guest Safety Concern at Provider Property',
    severity: 'critical',
    description: 'Guest reports feeling unsafe, security issue at riad/hotel, or structural concern at provider property.',
    levels: [
      { level: 1, title: 'Immediate Extraction', responseTime: '< 10 minutes', contacts: [{ name: 'On-Duty Concierge', role: 'Concierge', phone: '+212 6XX-XXXXXX', email: 'concierge@riadandroutes.com' }], actions: ['Call guest to assess situation', 'If immediate danger: call police (19) and arrange extraction', 'Contact provider management directly', 'Offer to relocate guest immediately'] },
      { level: 2, title: 'Relocation & Documentation', responseTime: '< 30 minutes', contacts: [{ name: 'Operations Director', role: 'Director', phone: '+212 6XX-XXXXXX', email: 'ops@riadandroutes.com' }], actions: ['Arrange transfer to verified safe alternative', 'Document incident thoroughly', 'File police report if criminal activity involved', 'Ensure guest belongings are secured and transferred'] },
      { level: 3, title: 'Legal & Provider Action', responseTime: '< 2 hours', contacts: [{ name: 'Business Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@riadandroutes.com' }], actions: ['Suspend provider from active roster immediately', 'Consult legal advisor on liability', 'Notify other guests currently at same provider', 'Conduct full provider safety audit before reinstatement'] }
    ]
  },
  {
    id: 'rr-complaint',
    title: 'Severe Guest Complaint (Public Threat)',
    severity: 'high',
    description: 'Guest threatens negative public review, demands refund, or escalates dissatisfaction with trip experience.',
    levels: [
      { level: 1, title: 'De-escalation', responseTime: '< 10 minutes', contacts: [{ name: 'Guest Relations Lead', role: 'Guest Relations', phone: '+212 6XX-XXXXXX', email: 'relations@riadandroutes.com' }], actions: ['Listen actively without interrupting', 'Acknowledge the issue and take ownership', 'Offer immediate gesture (upgrade, experience, refund portion)', 'Document complaint in detail'] },
      { level: 2, title: 'Resolution & Compensation', responseTime: '< 30 minutes', contacts: [{ name: 'Operations Director', role: 'Director', phone: '+212 6XX-XXXXXX', email: 'ops@riadandroutes.com' }], actions: ['Director takes over if unresolved', 'Authorize compensation up to 50% of booking value', 'If provider-caused: escalate to provider for their contribution', 'Follow up within 2 hours with resolution'] },
      { level: 3, title: 'Owner Decision', responseTime: '< 2 hours', contacts: [{ name: 'Business Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@riadandroutes.com' }], actions: ['Full refund authorization if needed', 'Legal consultation if threats persist', 'Proactive review response preparation', 'Post-incident process review with provider'] }
    ]
  },
  {
    id: 'rr-noshow',
    title: 'Driver No-Show / Transport Failure',
    severity: 'medium',
    description: 'Assigned driver fails to arrive for airport transfer or tour pickup, leaving guest stranded.',
    levels: [
      { level: 1, title: 'Immediate Backup', responseTime: '< 5 minutes', contacts: [{ name: 'Fleet Coordinator', role: 'Transport', phone: '+212 6XX-XXXXXX', email: 'fleet@riadandroutes.com' }], actions: ['Call backup driver from roster', 'Contact guest with updated ETA and apology', 'If airport: dispatch emergency taxi as bridge', 'Notify provider if guest will arrive late'] },
      { level: 2, title: 'Operations Review', responseTime: '< 1 hour', contacts: [{ name: 'Operations Director', role: 'Director', phone: '+212 6XX-XXXXXX', email: 'ops@riadandroutes.com' }], actions: ['Investigate no-show reason', 'Document for driver performance file', 'Offer guest complimentary experience as apology', 'Update fleet availability and backup protocols'] }
    ]
  }
];

const AK_SCENARIOS: EscalationScenario[] = [
  {
    id: 'ak-deadline',
    title: 'Critical Deadline Miss',
    severity: 'critical',
    description: 'Client deliverable cannot be completed by agreed deadline — risk of contract breach.',
    levels: [
      { level: 1, title: 'Immediate Assessment', responseTime: '< 1 hour', contacts: [{ name: 'Project Manager', role: 'PM', phone: '+212 6XX-XXXXXX', email: 'pm@artkech.com' }], actions: ['Assess remaining work vs. time available', 'Identify what can be delivered partially', 'Draft client communication with options', 'Reallocate team resources immediately'] },
      { level: 2, title: 'Client Communication', responseTime: '< 2 hours', contacts: [{ name: 'Creative Director', role: 'CD', phone: '+212 6XX-XXXXXX', email: 'cd@artkech.com' }], actions: ['CD calls client directly (not email)', 'Propose revised timeline with justification', 'Offer partial delivery + completion date', 'Document agreement in writing'] },
      { level: 3, title: 'Commercial Resolution', responseTime: '< 4 hours', contacts: [{ name: 'Studio Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@artkech.com' }], actions: ['Authorize overtime/weekend work if needed', 'Engage freelancer for emergency support', 'Offer discount or added deliverable as goodwill', 'Post-mortem to prevent recurrence'] }
    ]
  },
  {
    id: 'ak-data-loss',
    title: 'File Loss / Corruption',
    severity: 'critical',
    description: 'Project files corrupted, accidentally deleted, or hardware failure causing data loss.',
    levels: [
      { level: 1, title: 'Recovery Attempt', responseTime: '< 30 minutes', contacts: [{ name: 'Studio Manager', role: 'IT/Ops', phone: '+212 6XX-XXXXXX', email: 'studio@artkech.com' }], actions: ['STOP all work on affected machine', 'Check cloud backup (Google Drive/Dropbox)', 'Check local Time Machine / version history', 'Do NOT write new data to affected drive'] },
      { level: 2, title: 'Professional Recovery', responseTime: '< 2 hours', contacts: [{ name: 'Creative Director', role: 'CD', phone: '+212 6XX-XXXXXX', email: 'cd@artkech.com' }], actions: ['Contact data recovery specialist if needed', 'Assess what can be recreated from exports/PDFs', 'Notify affected clients of potential delay', 'Redistribute work to unaffected machines'] },
      { level: 3, title: 'Client & Insurance', responseTime: '< 24 hours', contacts: [{ name: 'Studio Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@artkech.com' }], actions: ['Full client disclosure if deliverables affected', 'Insurance claim if hardware failure', 'Implement additional backup protocol', 'Review and upgrade backup infrastructure'] }
    ]
  },
  {
    id: 'ak-client-dispute',
    title: 'Client Payment Dispute / Scope Creep',
    severity: 'high',
    description: 'Client refuses payment, disputes scope, or demands work beyond agreement.',
    levels: [
      { level: 1, title: 'Documentation Review', responseTime: '< 2 hours', contacts: [{ name: 'Account Manager', role: 'Accounts', phone: '+212 6XX-XXXXXX', email: 'accounts@artkech.com' }], actions: ['Pull original brief and signed quotation', 'Document all revision requests with dates', 'Calculate hours spent vs. quoted', 'Prepare scope comparison document'] },
      { level: 2, title: 'Negotiation', responseTime: '< 24 hours', contacts: [{ name: 'Creative Director', role: 'CD', phone: '+212 6XX-XXXXXX', email: 'cd@artkech.com' }], actions: ['Schedule call with client decision-maker', 'Present scope comparison clearly', 'Offer compromise: partial additional work at cost', 'Set firm boundary on unpaid work'] },
      { level: 3, title: 'Legal / Collection', responseTime: '< 48 hours', contacts: [{ name: 'Studio Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@artkech.com' }], actions: ['Send formal payment demand letter', 'Pause all active work for this client', 'Consult legal advisor if > 10,000 MAD', 'Add client to risk register for future projects'] }
    ]
  },
  {
    id: 'ak-print-error',
    title: 'Print Production Error',
    severity: 'high',
    description: 'Printed materials have errors (wrong colors, typos, wrong stock) discovered after production.',
    levels: [
      { level: 1, title: 'Damage Assessment', responseTime: '< 1 hour', contacts: [{ name: 'Production Manager', role: 'Production', phone: '+212 6XX-XXXXXX', email: 'production@artkech.com' }], actions: ['Photograph errors clearly', 'Determine if error is ours or printer\'s', 'Check if partial batch is usable', 'Contact print vendor immediately'] },
      { level: 2, title: 'Resolution & Reprint', responseTime: '< 4 hours', contacts: [{ name: 'Creative Director', role: 'CD', phone: '+212 6XX-XXXXXX', email: 'cd@artkech.com' }], actions: ['Negotiate reprint at vendor cost if their error', 'If our error: authorize emergency reprint', 'Notify client with revised delivery date', 'Rush production if event-dependent'] },
      { level: 3, title: 'Cost Recovery', responseTime: '< 24 hours', contacts: [{ name: 'Studio Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@artkech.com' }], actions: ['Absorb cost if our error (do not charge client)', 'Formal complaint to vendor if their error', 'Review QA checklist for gaps', 'Update pre-flight process to prevent recurrence'] }
    ]
  },
  {
    id: 'ak-freelancer',
    title: 'Freelancer Disappearance / Non-Delivery',
    severity: 'medium',
    description: 'Contracted freelancer stops responding or fails to deliver assigned work.',
    levels: [
      { level: 1, title: 'Contact Attempts', responseTime: '< 4 hours', contacts: [{ name: 'Project Manager', role: 'PM', phone: '+212 6XX-XXXXXX', email: 'pm@artkech.com' }], actions: ['Try all contact methods (phone, email, WhatsApp)', 'Check if partial work was submitted', 'Review contract terms and deadlines', 'Identify backup freelancer from roster'] },
      { level: 2, title: 'Reassignment', responseTime: '< 8 hours', contacts: [{ name: 'Creative Director', role: 'CD', phone: '+212 6XX-XXXXXX', email: 'cd@artkech.com' }], actions: ['Assign work to backup freelancer or in-house', 'Adjust project timeline if needed', 'Notify client if delivery affected', 'Withhold payment for undelivered work'] },
      { level: 3, title: 'Blacklist & Recovery', responseTime: '< 48 hours', contacts: [{ name: 'Studio Owner', role: 'Owner', phone: '+212 6XX-XXXXXX', email: 'owner@artkech.com' }], actions: ['Remove from approved freelancer list', 'Recover any advance payments if possible', 'Review contractor vetting process', 'Update freelancer agreement terms'] }
    ]
  }
];

export default function EscalationMatrixPage() {
  const [, navigate] = useLocation();
  const [activePersona, setActivePersona] = useState<Persona>('riad-routes');
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  const scenarios = activePersona === 'riad-routes' ? RR_SCENARIOS : AK_SCENARIOS;

  const severityColor = (s: Severity) => {
    if (s === 'critical') return 'bg-red-500/10 text-red-400 border-red-500/30';
    if (s === 'high') return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (s === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Shield className="w-5 h-5 text-red-400" />
          <h1 className="text-lg font-bold">Emergency Escalation Matrix</h1>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Persona Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => { setActivePersona('riad-routes'); setExpandedScenario(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'riad-routes' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}
          >
            <Plane className="w-4 h-4" /> Riad & Routes
          </button>
          <button
            onClick={() => { setActivePersona('artkech'); setExpandedScenario(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'artkech' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}
          >
            <Palette className="w-4 h-4" /> ArtKech Design Studio
          </button>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Emergency Protocol</p>
            <p className="text-xs text-muted-foreground mt-1">Follow escalation levels in order. Only advance to next level if the current level cannot resolve within the stated response time. Document all actions taken.</p>
          </div>
        </div>

        {/* Scenarios */}
        <div className="space-y-3">
          {scenarios.map(scenario => (
            <Card key={scenario.id} className="overflow-hidden">
              <div
                className="cursor-pointer"
                onClick={() => setExpandedScenario(expandedScenario === scenario.id ? null : scenario.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={severityColor(scenario.severity)}>{scenario.severity}</Badge>
                      <CardTitle className="text-sm">{scenario.title}</CardTitle>
                    </div>
                    {expandedScenario === scenario.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                </CardHeader>
              </div>

              {expandedScenario === scenario.id && (
                <CardContent className="pt-0 space-y-4">
                  {scenario.levels.map(level => (
                    <div key={level.level} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent flex items-center justify-center text-xs font-bold text-accent">{level.level}</span>
                          <span className="font-medium text-sm">{level.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {level.responseTime}
                        </Badge>
                      </div>

                      {/* Contacts */}
                      <div className="space-y-1.5">
                        {level.contacts.map((contact, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs bg-muted/30 rounded p-2">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-muted-foreground">({contact.role})</span>
                            {contact.phone && (
                              <span className="flex items-center gap-1 text-accent ml-auto">
                                <Phone className="w-3 h-3" /> {contact.phone}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Required Actions:</p>
                        {level.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className="text-accent mt-0.5">•</span>
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
