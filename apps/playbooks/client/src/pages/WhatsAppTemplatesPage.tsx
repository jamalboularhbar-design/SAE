import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Copy, Check, Search, Plane, Palette } from 'lucide-react';
import { toast } from 'sonner';

type Persona = 'riad-routes' | 'artkech';

interface MessageTemplate {
  id: string;
  title: string;
  category: string;
  language: 'en' | 'fr' | 'ar';
  template: string;
  variables: string[];
  useCase: string;
}

const RR_TEMPLATES: MessageTemplate[] = [
  { id: 'rr-t1', title: 'Booking Confirmation to Provider', category: 'Booking', language: 'en', template: 'Dear {provider_contact},\n\nWe have a confirmed booking for {guest_name} arriving {check_in_date} and departing {check_out_date}.\n\nRoom: {room_type}\nGuests: {guest_count}\nSpecial requests: {special_requests}\n\nPlease confirm room readiness by {confirmation_deadline}.\n\nBest regards,\nHorizon Concierge Concierge Team', variables: ['provider_contact', 'guest_name', 'check_in_date', 'check_out_date', 'room_type', 'guest_count', 'special_requests', 'confirmation_deadline'], useCase: 'Send to provider when a new booking is confirmed' },
  { id: 'rr-t2', title: 'Pre-Arrival Guest Brief', category: 'Pre-Arrival', language: 'en', template: 'Hi {provider_contact},\n\nGuest arriving tomorrow: {guest_name}\n\n🕐 ETA: {arrival_time}\n🚗 Transfer: {transfer_status}\n🍽️ Dietary: {dietary_needs}\n⭐ VIP Level: {vip_level}\n📝 Preferences: {preferences}\n\nPlease ensure:\n- Welcome amenities in room\n- {special_prep}\n\nThank you!', variables: ['provider_contact', 'guest_name', 'arrival_time', 'transfer_status', 'dietary_needs', 'vip_level', 'preferences', 'special_prep'], useCase: 'Send 24h before guest arrival with their preferences' },
  { id: 'rr-t3', title: 'Issue Escalation', category: 'Escalation', language: 'en', template: '⚠️ URGENT - Guest Issue\n\nProvider: {provider_name}\nGuest: {guest_name}\nRoom: {room_number}\n\nIssue: {issue_description}\nSeverity: {severity}\nReported at: {time_reported}\n\nRequired action: {action_needed}\nDeadline: {resolution_deadline}\n\nPlease acknowledge receipt and provide ETA for resolution.', variables: ['provider_name', 'guest_name', 'room_number', 'issue_description', 'severity', 'time_reported', 'action_needed', 'resolution_deadline'], useCase: 'Escalate guest complaints or urgent issues to provider management' },
  { id: 'rr-t4', title: 'Special Request Coordination', category: 'Special Request', language: 'en', template: 'Hi {provider_contact},\n\nSpecial request for guest {guest_name} (Room {room_number}):\n\n📋 Request: {request_details}\n📅 When: {when_needed}\n💰 Budget: {budget_range}\n\nCan you confirm availability and arrange this? Please reply by {reply_deadline}.\n\nThank you,\nRR Team', variables: ['provider_contact', 'guest_name', 'room_number', 'request_details', 'when_needed', 'budget_range', 'reply_deadline'], useCase: 'Coordinate special guest requests with provider (spa, dining, experiences)' },
  { id: 'rr-t5', title: 'Departure Feedback Share', category: 'Feedback', language: 'en', template: 'Hi {provider_contact},\n\nGuest {guest_name} checked out today. Here\'s their feedback:\n\n⭐ Overall: {rating}/5\n👍 Positives: {positives}\n⚡ Improvements: {improvements}\n💬 Quote: "{guest_quote}"\n\nThis helps us maintain our quality standards together. Let\'s discuss any action items.\n\nBest,\nRR Quality Team', variables: ['provider_contact', 'guest_name', 'rating', 'positives', 'improvements', 'guest_quote'], useCase: 'Share guest departure feedback with provider for continuous improvement' },
  { id: 'rr-t6', title: 'Seasonal Rate Request', category: 'Commercial', language: 'en', template: 'Dear {provider_contact},\n\nAs we approach {season_name}, we\'d like to update our rate cards.\n\nCould you please share:\n- Updated room rates for {date_range}\n- Any new packages or promotions\n- Minimum stay requirements\n- Early booking discounts available\n\nDeadline for our marketing materials: {deadline}\n\nThank you for your partnership.\nHorizon Concierge Commercial Team', variables: ['provider_contact', 'season_name', 'date_range', 'deadline'], useCase: 'Request updated seasonal rates from providers for marketing' },
  { id: 'rr-t7', title: 'Confirmation de Réservation', category: 'Booking', language: 'fr', template: 'Cher(e) {provider_contact},\n\nNous confirmons la réservation suivante:\n\nClient: {guest_name}\nArrivée: {check_in_date}\nDépart: {check_out_date}\nChambre: {room_type}\nDemandes spéciales: {special_requests}\n\nMerci de confirmer la disponibilité avant {deadline}.\n\nCordialement,\nÉquipe Horizon Concierge', variables: ['provider_contact', 'guest_name', 'check_in_date', 'check_out_date', 'room_type', 'special_requests', 'deadline'], useCase: 'French version of booking confirmation for francophone providers' },
  { id: 'rr-t8', title: 'Monthly Performance Review', category: 'Quality', language: 'en', template: 'Hi {provider_contact},\n\n📊 Monthly Performance Summary - {month_year}\n\nBookings placed: {booking_count}\nAvg guest rating: {avg_rating}/5\nResponse time: {avg_response_time}\nIssues reported: {issue_count}\nResolution rate: {resolution_rate}%\n\nOverall tier status: {tier_status}\n\nLet\'s schedule a call to discuss improvements and upcoming opportunities.\n\nBest,\nRR Partnership Team', variables: ['provider_contact', 'month_year', 'booking_count', 'avg_rating', 'avg_response_time', 'issue_count', 'resolution_rate', 'tier_status'], useCase: 'Monthly performance review sharing with provider partners' },
];

const AK_TEMPLATES: MessageTemplate[] = [
  { id: 'ak-t1', title: 'Project Kickoff Brief', category: 'Onboarding', language: 'en', template: 'Hi {client_name},\n\nExcited to kick off {project_name}! Here\'s what we need to get started:\n\n📋 Brand guidelines (logo, colors, fonts)\n📸 Any reference images or mood boards\n📝 Content/copy (if available)\n📅 Key milestone dates\n\nOur timeline:\n- Concepts: {concept_date}\n- First review: {review_date}\n- Final delivery: {delivery_date}\n\nQuestions? Just reply here.\n\nBest,\nMeridian Creative Studio', variables: ['client_name', 'project_name', 'concept_date', 'review_date', 'delivery_date'], useCase: 'Send to new clients after project agreement is signed' },
  { id: 'ak-t2', title: 'Design Review Ready', category: 'Review', language: 'en', template: 'Hi {client_name},\n\n🎨 Your {project_name} designs are ready for review!\n\nView here: {review_link}\n\nPlease share feedback by {feedback_deadline}. We have {revision_count} revision rounds included.\n\nTips for feedback:\n- Be specific about what you like/dislike\n- Reference specific elements\n- Share with all stakeholders before responding\n\nLooking forward to your thoughts!\nMeridian Creative Team', variables: ['client_name', 'project_name', 'review_link', 'feedback_deadline', 'revision_count'], useCase: 'Notify client that designs are ready for their review' },
  { id: 'ak-t3', title: 'Invoice Reminder', category: 'Billing', language: 'en', template: 'Hi {client_name},\n\nFriendly reminder that invoice #{invoice_number} for {amount} is due on {due_date}.\n\nProject: {project_name}\nIssued: {issue_date}\n\nPayment methods:\n- Bank transfer (details in invoice)\n- Online payment: {payment_link}\n\nPlease let us know if you have any questions.\n\nThank you,\nMeridian Creative Finance', variables: ['client_name', 'invoice_number', 'amount', 'due_date', 'project_name', 'issue_date', 'payment_link'], useCase: 'Gentle payment reminder for overdue or upcoming invoices' },
  { id: 'ak-t4', title: 'Freelancer Brief', category: 'Team', language: 'en', template: 'Hi {freelancer_name},\n\nNew assignment for you:\n\n📋 Project: {project_name}\n🎯 Task: {task_description}\n📅 Deadline: {deadline}\n💰 Rate: {agreed_rate}\n📁 Files: {file_link}\n\nBrand guidelines attached. Please confirm you can deliver by the deadline.\n\nQuestions? Reach out anytime.\n\nMeridian Creative Studio', variables: ['freelancer_name', 'project_name', 'task_description', 'deadline', 'agreed_rate', 'file_link'], useCase: 'Brief freelancers on new assignments with all necessary details' },
  { id: 'ak-t5', title: 'Project Delay Notice', category: 'Updates', language: 'en', template: 'Hi {client_name},\n\nUpdate on {project_name}:\n\nUnfortunately, we need to adjust our timeline. The {milestone_name} originally scheduled for {original_date} will now be delivered by {new_date}.\n\nReason: {reason}\nImpact: {impact}\n\nWe\'re doing everything to minimize delays. Happy to jump on a call if you\'d like to discuss.\n\nApologies for the inconvenience.\nMeridian Creative Team', variables: ['client_name', 'project_name', 'milestone_name', 'original_date', 'new_date', 'reason', 'impact'], useCase: 'Proactively communicate project delays to clients' },
  { id: 'ak-t6', title: 'Portfolio Feature Request', category: 'Marketing', language: 'en', template: 'Hi {client_name},\n\nWe\'d love to feature {project_name} in our portfolio!\n\nWould you be comfortable with us:\n- Showing the final designs on our website\n- Including a brief case study\n- Sharing on our social media\n\nWe\'ll send you the draft for approval before publishing. This also gives your brand extra visibility.\n\nLet us know!\nMeridian Creative Marketing', variables: ['client_name', 'project_name'], useCase: 'Request permission to feature completed work in portfolio' },
];

export default function WhatsAppTemplatesPage() {
  const [, navigate] = useLocation();
  const [activePersona, setActivePersona] = useState<Persona>('riad-routes');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const templates = activePersona === 'riad-routes' ? RR_TEMPLATES : AK_TEMPLATES;
  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filtered = templates.filter(t => {
    const matchesSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.template.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const copyTemplate = (template: MessageTemplate) => {
    navigator.clipboard.writeText(template.template);
    setCopiedId(template.id);
    toast.success('Template copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const langBadge = (lang: string) => {
    if (lang === 'fr') return <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400">FR</Badge>;
    if (lang === 'ar') return <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400">AR</Badge>;
    return <Badge variant="outline" className="text-xs bg-slate-500/10 text-slate-400">EN</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <MessageCircle className="w-5 h-5 text-green-500" />
          <h1 className="text-lg font-bold">WhatsApp Templates</h1>
          <Badge variant="secondary" className="ml-auto">{filtered.length} templates</Badge>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Persona Toggle */}
        <div className="flex gap-2">
          <button onClick={() => { setActivePersona('riad-routes'); setCategoryFilter('all'); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'riad-routes' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}>
            <Plane className="w-4 h-4" /> Horizon Concierge
          </button>
          <button onClick={() => { setActivePersona('artkech'); setCategoryFilter('all'); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'artkech' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}>
            <Palette className="w-4 h-4" /> Meridian Creative Studio
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCategoryFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${categoryFilter === 'all' ? 'bg-accent/10 border-accent text-accent' : 'border-border text-muted-foreground'}`}>All</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${categoryFilter === cat ? 'bg-accent/10 border-accent text-accent' : 'border-border text-muted-foreground'}`}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-4">
          {filtered.map(template => (
            <Card key={template.id} className="hover:border-accent/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    {template.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {langBadge(template.language)}
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                    <button
                      onClick={() => copyTemplate(template)}
                      className="p-1.5 rounded hover:bg-accent/10 transition-colors"
                      title="Copy template"
                    >
                      {copiedId === template.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{template.useCase}</p>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono bg-muted/30 p-3 rounded-lg border border-border/50 max-h-48 overflow-y-auto">
                  {template.template}
                </pre>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.variables.map(v => (
                    <span key={v} className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded">{`{${v}}`}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
