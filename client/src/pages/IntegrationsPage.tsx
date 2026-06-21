import { useState } from 'react';
import { Puzzle, Search, CheckCircle, ExternalLink, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'available' | 'connected' | 'coming_soon';
  icon: string;
  popular?: boolean;
}

const INTEGRATIONS: Integration[] = [
  { id: 'slack', name: 'Slack', description: 'Send notifications and share documents directly in Slack channels', category: 'Communication', status: 'available', icon: '💬', popular: true },
  { id: 'teams', name: 'Microsoft Teams', description: 'Integrate with Teams for notifications and document sharing', category: 'Communication', status: 'available', icon: '🟦' },
  { id: 'zapier', name: 'Zapier', description: 'Connect with 5000+ apps through automated workflows', category: 'Automation', status: 'available', icon: '⚡', popular: true },
  { id: 'make', name: 'Make (Integromat)', description: 'Build complex automation scenarios with visual workflows', category: 'Automation', status: 'available', icon: '🔄' },
  { id: 'google_drive', name: 'Google Drive', description: 'Import and sync documents from Google Drive', category: 'Storage', status: 'connected', icon: '📁', popular: true },
  { id: 'notion', name: 'Notion', description: 'Import pages and databases from Notion workspaces', category: 'Productivity', status: 'available', icon: '📝' },
  { id: 'confluence', name: 'Confluence', description: 'Migrate or sync content from Atlassian Confluence', category: 'Productivity', status: 'available', icon: '🔷' },
  { id: 'jira', name: 'Jira', description: 'Link documents to Jira tickets and track project references', category: 'Project Management', status: 'coming_soon', icon: '🎯' },
  { id: 'github', name: 'GitHub', description: 'Sync documentation from repositories and wikis', category: 'Development', status: 'available', icon: '🐙' },
  { id: 'okta', name: 'Okta SSO', description: 'Enterprise single sign-on with Okta identity provider', category: 'Security', status: 'available', icon: '🔐', popular: true },
  { id: 'azure_ad', name: 'Azure AD', description: 'Microsoft Entra ID for enterprise authentication', category: 'Security', status: 'available', icon: '☁️' },
  { id: 'salesforce', name: 'Salesforce', description: 'Sync customer data and link knowledge articles to accounts', category: 'CRM', status: 'coming_soon', icon: '☁️' },
  { id: 'hubspot', name: 'HubSpot', description: 'Connect marketing and sales data with your knowledge base', category: 'CRM', status: 'coming_soon', icon: '🟠' },
  { id: 'intercom', name: 'Intercom', description: 'Surface knowledge articles in customer conversations', category: 'Support', status: 'available', icon: '💙' },
  { id: 'zendesk', name: 'Zendesk', description: 'Link help center articles and support ticket references', category: 'Support', status: 'coming_soon', icon: '🟢' },
  { id: 'webhook', name: 'Custom Webhooks', description: 'Send events to any HTTP endpoint for custom integrations', category: 'Development', status: 'connected', icon: '🪝' },
  { id: 'api', name: 'REST API', description: 'Full programmatic access to all platform features', category: 'Development', status: 'connected', icon: '🔌', popular: true },
  { id: 'dropbox', name: 'Dropbox', description: 'Import and sync files from Dropbox Business', category: 'Storage', status: 'available', icon: '📦' },
];

const CATEGORIES = ['All', 'Communication', 'Automation', 'Storage', 'Productivity', 'Project Management', 'Development', 'Security', 'CRM', 'Support'];

export default function IntegrationsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = INTEGRATIONS.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || i.category === category;
    return matchSearch && matchCategory;
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-green-500/20 text-green-500">Connected</Badge>;
      case 'available': return <Badge className="bg-blue-500/20 text-blue-500">Available</Badge>;
      case 'coming_soon': return <Badge className="bg-muted text-muted-foreground">Coming Soon</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
              <Puzzle className="w-8 h-8 text-primary" />
              Integration Marketplace
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Connect NexusAI Playbooks with your favorite tools. Automate workflows, sync data, and extend your knowledge platform.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search integrations..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Popular */}
        {category === 'All' && !search && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Popular Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {INTEGRATIONS.filter(i => i.popular).map(integration => (
                <Card key={integration.id} className="hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{integration.icon}</span>
                      <span className="font-medium">{integration.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{integration.description}</p>
                    <div className="mt-3">{statusBadge(integration.status)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Integrations Grid */}
        <h2 className="text-lg font-semibold mb-4">
          {category === 'All' ? 'All Integrations' : category} ({filtered.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(integration => (
            <Card key={integration.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-xs text-muted-foreground">{integration.category}</p>
                    </div>
                  </div>
                  {statusBadge(integration.status)}
                </div>
                <p className="text-sm text-muted-foreground mt-3">{integration.description}</p>
                <div className="mt-4">
                  {integration.status === 'connected' ? (
                    <Button size="sm" variant="outline" className="w-full" onClick={() => toast.success('Opening settings...')}>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Manage
                    </Button>
                  ) : integration.status === 'available' ? (
                    <Button size="sm" className="w-full" onClick={() => toast.success(`${integration.name} setup started`)}>
                      Connect <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Request Integration */}
        <Card className="mt-8 border-dashed">
          <CardContent className="pt-6 pb-6 text-center">
            <h3 className="font-semibold">Don't see what you need?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Request a new integration or build your own using our REST API and webhooks.
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Button variant="outline" onClick={() => toast.success('Request submitted!')}>
                Request Integration
              </Button>
              <Button variant="outline" onClick={() => window.open('/api-docs', '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" /> API Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
