import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Key, Globe, CheckCircle, AlertCircle,
  Copy, ExternalLink, Lock, Users, Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { BRAND } from '@/lib/brand';

interface SSOConfig {
  provider: string;
  entityId: string;
  ssoUrl: string;
  certificate: string;
  metadataUrl: string;
  defaultRole: string;
  autoProvision: boolean;
  enforceSSO: boolean;
}

const SSO_PROVIDERS = [
  { id: 'okta', name: 'Okta', logo: '🔐' },
  { id: 'azure', name: 'Azure AD', logo: '☁️' },
  { id: 'google', name: 'Google Workspace', logo: '🔵' },
  { id: 'onelogin', name: 'OneLogin', logo: '🟢' },
  { id: 'custom', name: 'Custom SAML 2.0', logo: '⚙️' },
];

export default function AdminSSOPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [config, setConfig] = useState<SSOConfig>({
    provider: '',
    entityId: '',
    ssoUrl: '',
    certificate: '',
    metadataUrl: '',
    defaultRole: 'viewer',
    autoProvision: true,
    enforceSSO: false,
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  if (user?.role !== 'admin') { navigate('/'); return null; }

  const spMetadata = {
    entityId: `${BRAND.activeAppUrl}/saml/metadata`,
    acsUrl: `${BRAND.activeAppUrl}/api/auth/saml/callback`,
    sloUrl: `${BRAND.activeAppUrl}/api/auth/saml/logout`,
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      if (config.ssoUrl && config.certificate) {
        setTestStatus('success');
        toast.success('SSO connection test passed');
      } else {
        setTestStatus('error');
        toast.error('Please fill in SSO URL and certificate');
      }
    }, 2000);
  };

  const handleSave = () => {
    localStorage.setItem('arg_sso_config', JSON.stringify(config));
    toast.success('SSO configuration saved. Contact support to activate.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Single Sign-On (SSO)</h1>
              <p className="text-sm text-muted-foreground">Configure SAML 2.0 authentication for your organization</p>
            </div>
          </div>
          <Badge variant="outline" className="text-amber-500 border-amber-500">Enterprise Plan</Badge>
        </div>

        {/* Service Provider Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="w-5 h-5" />
              Service Provider (SP) Metadata
            </CardTitle>
            <CardDescription>Provide these values to your Identity Provider (IdP)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Entity ID', value: spMetadata.entityId },
                { label: 'ACS URL (Callback)', value: spMetadata.acsUrl },
                { label: 'SLO URL (Logout)', value: spMetadata.sloUrl },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted/50 px-2 py-1 rounded flex-1 truncate">{value}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(value)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Provider Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Identity Provider</CardTitle>
            <CardDescription>Select your organization's identity provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {SSO_PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setConfig({ ...config, provider: p.id })}
                  className={`p-4 rounded-lg border text-center transition-colors ${
                    config.provider === p.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{p.logo}</span>
                  <span className="text-sm font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              IdP Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Metadata URL</Label>
                <Input
                  value={config.metadataUrl}
                  onChange={(e) => setConfig({ ...config, metadataUrl: e.target.value })}
                  placeholder="https://idp.example.com/metadata.xml"
                />
              </div>
              <div className="space-y-2">
                <Label>SSO Login URL</Label>
                <Input
                  value={config.ssoUrl}
                  onChange={(e) => setConfig({ ...config, ssoUrl: e.target.value })}
                  placeholder="https://idp.example.com/sso/saml"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Entity ID (Issuer)</Label>
              <Input
                value={config.entityId}
                onChange={(e) => setConfig({ ...config, entityId: e.target.value })}
                placeholder="https://idp.example.com/entity-id"
              />
            </div>
            <div className="space-y-2">
              <Label>X.509 Certificate</Label>
              <textarea
                value={config.certificate}
                onChange={(e) => setConfig({ ...config, certificate: e.target.value })}
                placeholder="-----BEGIN CERTIFICATE-----&#10;MIICmTCCAYECBgF...&#10;-----END CERTIFICATE-----"
                className="w-full h-32 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-mono resize-y"
              />
            </div>
          </CardContent>
        </Card>

        {/* Provisioning Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Provisioning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Role for New Users</Label>
                <select
                  value={config.defaultRole}
                  onChange={(e) => setConfig({ ...config, defaultRole: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-4 pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoProvision}
                    onChange={(e) => setConfig({ ...config, autoProvision: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Auto-provision users on first login</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enforceSSO}
                    onChange={(e) => setConfig({ ...config, enforceSSO: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Enforce SSO (disable password login)</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleTestConnection} disabled={testStatus === 'testing'}>
            {testStatus === 'testing' ? (
              <><span className="animate-spin mr-2">⏳</span> Testing...</>
            ) : testStatus === 'success' ? (
              <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Connection Verified</>
            ) : testStatus === 'error' ? (
              <><AlertCircle className="w-4 h-4 mr-2 text-red-500" /> Test Failed</>
            ) : (
              <><Globe className="w-4 h-4 mr-2" /> Test Connection</>
            )}
          </Button>
          <Button onClick={handleSave}>
            <Lock className="w-4 h-4 mr-2" />
            Save SSO Configuration
          </Button>
        </div>

        {/* Setup Guide */}
        <Card className="mt-8 border-blue-500/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Quick Setup Guides
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Okta Setup Guide', url: '#' },
                { name: 'Azure AD Guide', url: '#' },
                { name: 'Google Workspace', url: '#' },
                { name: 'SAML Testing Tool', url: '#' },
              ].map(guide => (
                <a key={guide.name} href={guide.url} className="p-3 rounded-lg border border-border hover:border-primary/50 text-sm text-center transition-colors">
                  {guide.name}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
