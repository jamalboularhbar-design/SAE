import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Smartphone, Globe, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationChannel {
  id: string;
  label: string;
  icon: typeof Bell;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export default function NotificationPrefsPage() {

  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [channels, setChannels] = useState<NotificationChannel[]>([
    { id: 'email', label: 'Email Notifications', icon: Mail, enabled: true },
    { id: 'push', label: 'Push Notifications', icon: Smartphone, enabled: true },
    { id: 'inApp', label: 'In-App Notifications', icon: Globe, enabled: true },
  ]);

  const [categories, setCategories] = useState<NotificationCategory[]>([
    { id: 'documents', label: 'Document Updates', description: 'New documents, edits, and review requests', email: true, push: true, inApp: true },
    { id: 'team', label: 'Team Activity', description: 'New members, role changes, and invitations', email: true, push: false, inApp: true },
    { id: 'ai', label: 'AI Service Alerts', description: 'AI task completions, errors, and usage warnings', email: false, push: true, inApp: true },
    { id: 'billing', label: 'Billing & Usage', description: 'Invoice ready, usage limits, and plan changes', email: true, push: false, inApp: true },
    { id: 'security', label: 'Security Alerts', description: 'Login attempts, API key usage, and access changes', email: true, push: true, inApp: true },
    { id: 'system', label: 'System Updates', description: 'Maintenance windows, feature releases, and status changes', email: false, push: false, inApp: true },
    { id: 'comments', label: 'Comments & Mentions', description: 'When someone comments on your docs or mentions you', email: true, push: true, inApp: true },
    { id: 'workflows', label: 'Workflow Triggers', description: 'Automated workflow completions and failures', email: false, push: true, inApp: true },
  ]);

  const [digestFrequency, setDigestFrequency] = useState('daily');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');

  const toggleChannel = (channelId: string) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, enabled: !c.enabled } : c));
    setSaved(false);
  };

  const toggleCategory = (categoryId: string, channel: 'email' | 'push' | 'inApp') => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, [channel]: !c[channel] } : c));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Notification preferences saved.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20">
              <Bell className="h-7 w-7 text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notification Preferences</h1>
              <p className="text-sm text-muted-foreground">Control how and when you receive notifications</p>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved' : 'Save Changes'}
          </Button>
        </div>

        {/* Channels */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Notification Channels</CardTitle>
            <CardDescription>Enable or disable entire notification channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channels.map(channel => {
                const Icon = channel.icon;
                return (
                  <div key={channel.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{channel.label}</span>
                    </div>
                    <Switch checked={channel.enabled} onCheckedChange={() => toggleChannel(channel.id)} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Category Preferences</CardTitle>
            <CardDescription>Fine-tune notifications by category and channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {/* Header Row */}
              <div className="grid grid-cols-[1fr_60px_60px_60px] gap-2 pb-2 border-b border-border mb-3">
                <span className="text-xs font-medium text-muted-foreground">Category</span>
                <span className="text-xs font-medium text-muted-foreground text-center">Email</span>
                <span className="text-xs font-medium text-muted-foreground text-center">Push</span>
                <span className="text-xs font-medium text-muted-foreground text-center">In-App</span>
              </div>
              {categories.map(cat => (
                <div key={cat.id} className="grid grid-cols-[1fr_60px_60px_60px] gap-2 items-center py-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">{cat.label}</div>
                    <div className="text-xs text-muted-foreground">{cat.description}</div>
                  </div>
                  <div className="flex justify-center">
                    <Switch checked={cat.email} onCheckedChange={() => toggleCategory(cat.id, 'email')} disabled={!channels.find(c => c.id === 'email')?.enabled} />
                  </div>
                  <div className="flex justify-center">
                    <Switch checked={cat.push} onCheckedChange={() => toggleCategory(cat.id, 'push')} disabled={!channels.find(c => c.id === 'push')?.enabled} />
                  </div>
                  <div className="flex justify-center">
                    <Switch checked={cat.inApp} onCheckedChange={() => toggleCategory(cat.id, 'inApp')} disabled={!channels.find(c => c.id === 'inApp')?.enabled} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Digest & Quiet Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email Digest</CardTitle>
              <CardDescription>Batch non-urgent emails into a digest</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={digestFrequency} onValueChange={v => { setDigestFrequency(v); setSaved(false); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time (no batching)</SelectItem>
                  <SelectItem value="hourly">Hourly digest</SelectItem>
                  <SelectItem value="daily">Daily digest</SelectItem>
                  <SelectItem value="weekly">Weekly digest</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quiet Hours</CardTitle>
              <CardDescription>Suppress push notifications during set hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Enable quiet hours</span>
                  <Switch checked={quietHoursEnabled} onCheckedChange={v => { setQuietHoursEnabled(v); setSaved(false); }} />
                </div>
                {quietHoursEnabled && (
                  <div className="flex items-center gap-2 text-sm">
                    <input type="time" value={quietStart} onChange={e => { setQuietStart(e.target.value); setSaved(false); }} className="bg-muted border border-border rounded px-2 py-1 text-foreground text-xs" />
                    <span className="text-muted-foreground">to</span>
                    <input type="time" value={quietEnd} onChange={e => { setQuietEnd(e.target.value); setSaved(false); }} className="bg-muted border border-border rounded px-2 py-1 text-foreground text-xs" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
