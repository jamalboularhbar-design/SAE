import { useState } from 'react';
import { Globe, Shield, CheckCircle, AlertTriangle, Copy, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DomainConfig {
  id: string;
  domain: string;
  type: 'primary' | 'alias';
  sslStatus: 'active' | 'pending' | 'expired';
  dnsVerified: boolean;
  addedAt: string;
}

const DEMO_DOMAINS: DomainConfig[] = [
  { id: '1', domain: 'docs.yourcompany.com', type: 'primary', sslStatus: 'active', dnsVerified: true, addedAt: '2025-04-15' },
  { id: '2', domain: 'knowledge.yourcompany.com', type: 'alias', sslStatus: 'active', dnsVerified: true, addedAt: '2025-04-20' },
];

const DNS_RECORDS = [
  { type: 'CNAME', name: 'docs', value: 'custom.argbuilder.com', ttl: '3600' },
  { type: 'TXT', name: '_verify', value: 'arg-verify=abc123def456', ttl: '3600' },
];

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<DomainConfig[]>(DEMO_DOMAINS);
  const [newDomain, setNewDomain] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    const domain: DomainConfig = {
      id: Date.now().toString(),
      domain: newDomain.trim(),
      type: domains.length === 0 ? 'primary' : 'alias',
      sslStatus: 'pending',
      dnsVerified: false,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setDomains([...domains, domain]);
    setNewDomain('');
    setShowAddForm(false);
    toast.success(`Domain ${domain.domain} added. Please configure DNS records.`);
  };

  const handleRemoveDomain = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
    toast.success('Domain removed');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              Custom Domains
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure custom domains for your knowledge base
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Domain
          </Button>
        </div>

        {/* Add Domain Form */}
        {showAddForm && (
          <Card className="border-primary/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Add Custom Domain</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newDomain}
                  onChange={e => setNewDomain(e.target.value)}
                  placeholder="docs.yourcompany.com"
                  className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-sm"
                />
                <Button onClick={handleAddDomain}>Add</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter the subdomain you want to point to your knowledge base (e.g., docs.yourcompany.com)
              </p>
            </CardContent>
          </Card>
        )}

        {/* Active Domains */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {domains.map(domain => (
                <div key={domain.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${domain.dnsVerified ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{domain.domain}</span>
                        <Badge variant="outline" className="text-xs">{domain.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Added {domain.addedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Shield className={`w-4 h-4 ${domain.sslStatus === 'active' ? 'text-green-500' : 'text-amber-500'}`} />
                      <span className="text-xs">{domain.sslStatus === 'active' ? 'SSL Active' : 'SSL Pending'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {domain.dnsVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="text-xs">{domain.dnsVerified ? 'Verified' : 'Pending'}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.success('Checking DNS...')}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleRemoveDomain(domain.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DNS Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">DNS Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add these DNS records to your domain registrar to verify ownership and route traffic.
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Value</th>
                    <th className="text-left p-3 font-medium">TTL</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {DNS_RECORDS.map((record, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-3"><Badge variant="outline">{record.type}</Badge></td>
                      <td className="p-3 font-mono text-xs">{record.name}</td>
                      <td className="p-3 font-mono text-xs max-w-[200px] truncate">{record.value}</td>
                      <td className="p-3">{record.ttl}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(record.value)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* SSL Certificate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SSL Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Let's Encrypt Certificate</p>
                  <p className="text-xs text-muted-foreground">Auto-renewed every 90 days. No action required.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-500">Valid</p>
                <p className="text-xs text-muted-foreground">Expires Aug 18, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                <span>Add your custom domain above (e.g., docs.yourcompany.com)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                <span>Log in to your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
                <span>Add the CNAME and TXT records shown above</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">4</span>
                <span>Wait for DNS propagation (usually 5-30 minutes, up to 48 hours)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">5</span>
                <span>Click "Verify" to confirm your domain is connected. SSL will be provisioned automatically.</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
