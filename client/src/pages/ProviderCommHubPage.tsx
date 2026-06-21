import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Phone, Mail, Clock, Building2, Send, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CommLog {
  id: string;
  provider: string;
  channel: 'whatsapp' | 'email' | 'phone' | 'in_person';
  subject: string;
  summary: string;
  date: string;
  status: 'sent' | 'received' | 'pending';
  urgent: boolean;
}

const CHANNEL_ICONS: Record<string, any> = {
  whatsapp: <MessageCircle className="w-3 h-3 text-green-400" />,
  email: <Mail className="w-3 h-3 text-blue-400" />,
  phone: <Phone className="w-3 h-3 text-amber-400" />,
  in_person: <Building2 className="w-3 h-3 text-purple-400" />,
};

const SAMPLE_LOGS: CommLog[] = [
  { id: '1', provider: 'Grand Palace Hotel', channel: 'whatsapp', subject: 'VIP Guest Arrival - Mitchell', summary: 'Confirmed rose petal setup, champagne in room, late checkout approved.', date: '2026-05-20', status: 'sent', urgent: false },
  { id: '2', provider: 'Cedar Boutique Hotel', channel: 'email', subject: 'Room 3 Availability June 18-22', summary: 'Confirmed availability for Pierre Dupont. Requesting dietary menu in advance.', date: '2026-05-19', status: 'received', urgent: false },
  { id: '3', provider: 'Riverside Luxury Hotel', channel: 'phone', subject: 'Pool Maintenance Notice', summary: 'Pool closed June 1-3 for maintenance. Need to inform affected guests.', date: '2026-05-18', status: 'received', urgent: true },
  { id: '4', provider: 'Highland Retreat', channel: 'whatsapp', subject: 'Transfer Coordination', summary: 'Driver confirmed for Hans Weber pickup. Flight AR302 arriving 14:30.', date: '2026-05-18', status: 'sent', urgent: false },
  { id: '5', provider: 'Garden Court Hotel', channel: 'email', subject: 'Rate Update for Peak Season', summary: 'New rates effective March 2027. 8% increase across all room categories.', date: '2026-05-17', status: 'received', urgent: false },
  { id: '6', provider: 'Vista Resort', channel: 'whatsapp', subject: 'Guest Complaint Follow-up', summary: 'AC issue in suite 12 resolved. Complimentary spa session offered to guest.', date: '2026-05-16', status: 'received', urgent: true },
];

const QUICK_MESSAGES = [
  { label: 'Booking Confirmation', template: 'Dear [Provider], please confirm the following reservation:\n\nGuest: [Name]\nDates: [Check-in] to [Check-out]\nRoom: [Type]\nSpecial Requests: [Details]\n\nPlease confirm availability and rate.\n\nBest regards,\nRiad & Routes Team' },
  { label: 'Pre-Arrival Brief', template: 'Dear [Provider],\n\nGuest [Name] arrives [Date]. Key details:\n\n• VIP Level: [Level]\n• Dietary: [Restrictions]\n• Room Preference: [Preference]\n• Special Occasion: [Details]\n• Transfer: [Arranged/Not needed]\n\nPlease ensure all preparations are in place.\n\nThank you,\nRiad & Routes' },
  { label: 'Issue Escalation', template: 'URGENT - [Provider]\n\nIssue: [Description]\nGuest Affected: [Name]\nSeverity: [High/Critical]\n\nRequired Action:\n[Steps needed]\n\nPlease respond within [X] minutes.\n\nRiad & Routes Operations' },
  { label: 'Feedback Follow-up', template: 'Dear [Provider],\n\nFollowing the recent stay of [Guest Name], we received the following feedback:\n\nRating: [X/5]\nComment: "[Feedback]"\n\nPlease review and let us know what improvements can be made.\n\nBest,\nRiad & Routes Quality Team' },
];

export default function ProviderCommHubPage() {
  const [, navigate] = useLocation();
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const filtered = SAMPLE_LOGS.filter(l => channelFilter === 'all' || l.channel === channelFilter);

  const copyTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
    toast.success('Template copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-400" />
              Provider Communication Hub
            </h1>
            <p className="text-sm text-muted-foreground">Track all provider communications and use quick templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Communication Log */}
          <div className="lg:col-span-2">
            <div className="flex gap-1 mb-4">
              {['all', 'whatsapp', 'email', 'phone', 'in_person'].map(ch => (
                <Button key={ch} variant={channelFilter === ch ? 'default' : 'outline'} size="sm" onClick={() => setChannelFilter(ch)} className="text-xs capitalize">
                  {ch === 'in_person' ? 'In Person' : ch}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              {filtered.map(log => (
                <Card key={log.id} className={log.urgent ? 'border-red-500/30' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{CHANNEL_ICONS[log.channel]}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{log.subject}</span>
                          {log.urgent && <Badge className="bg-red-500/20 text-red-300 text-xs">Urgent</Badge>}
                          <Badge variant="outline" className="text-xs">{log.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{log.summary}</p>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{log.provider}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{log.date}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Templates */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" /> Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {QUICK_MESSAGES.map((msg, idx) => (
                    <div key={idx}>
                      <Button variant="outline" className="w-full justify-between text-xs h-auto py-2" onClick={() => setSelectedTemplate(selectedTemplate === idx ? null : idx)}>
                        {msg.label}
                        <Copy className="w-3 h-3" />
                      </Button>
                      {selectedTemplate === idx && (
                        <div className="mt-2 p-3 bg-card/50 border border-border rounded text-xs">
                          <pre className="whitespace-pre-wrap text-muted-foreground font-sans">{msg.template}</pre>
                          <Button size="sm" className="mt-2 text-xs h-6" onClick={() => copyTemplate(msg.template)}>
                            <Copy className="w-3 h-3 mr-1" /> Copy to Clipboard
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
