import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Paintbrush, Save, Loader2, Eye, Palette, Type, Image, Globe, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const BRANDING_KEYS = [
  { key: 'site_title', label: 'Site Title', placeholder: 'NexusAI Playbooks', type: 'text', tab: 'identity' },
  { key: 'tagline', label: 'Tagline', placeholder: 'Operational processes & best practices', type: 'text', tab: 'identity' },
  { key: 'accent_color', label: 'Accent Color', placeholder: '#e8783a', type: 'color', tab: 'colors' },
  { key: 'secondary_color', label: 'Secondary Color', placeholder: '#1a1a2e', type: 'color', tab: 'colors' },
  { key: 'background_color', label: 'Background Color', placeholder: '#0f0f1a', type: 'color', tab: 'colors' },
  { key: 'text_color', label: 'Text Color', placeholder: '#e5e5e5', type: 'color', tab: 'colors' },
  { key: 'logo_url', label: 'Logo URL', placeholder: '/logo.svg', type: 'text', tab: 'assets' },
  { key: 'favicon_url', label: 'Favicon URL', placeholder: '/favicon.ico', type: 'text', tab: 'assets' },
  { key: 'footer_text', label: 'Footer Text', placeholder: 'Riad & Routes — riadandroutes.com', type: 'text', tab: 'identity' },
  { key: 'font_family', label: 'Font Family', placeholder: 'Inter', type: 'text', tab: 'typography' },
  { key: 'custom_css', label: 'Custom CSS Override', placeholder: '/* Custom styles */', type: 'textarea', tab: 'advanced' },
  { key: 'words_per_minute', label: 'Reading Speed (words/min)', placeholder: '200', type: 'number', tab: 'identity' },
];

const FONT_OPTIONS = ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Poppins', 'Playfair Display', 'Space Grotesk', 'DM Sans', 'Work Sans'];

export default function AdminBrandingPage() {
  const { data: settings, isLoading } = trpc.branding.get.useQuery();
  const updateMutation = trpc.branding.update.useMutation();
  const utils = trpc.useUtils();

  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s: { settingKey: string; settingValue: string }) => {
        map[s.settingKey] = s.settingValue;
      });
      setValues(map);
    }
  }, [settings]);

  const handleSave = async (key: string) => {
    await updateMutation.mutateAsync({ key, value: values[key] || '' });
    utils.branding.get.invalidate();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  const handleSaveAll = async () => {
    for (const { key } of BRANDING_KEYS) {
      if (values[key]) {
        await updateMutation.mutateAsync({ key, value: values[key] });
      }
    }
    utils.branding.get.invalidate();
    toast.success('White-label settings applied across the platform.');
  };

  const renderField = (item: typeof BRANDING_KEYS[0]) => {
    const { key, label, placeholder, type } = item;
    return (
      <Card key={key}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {type === 'color' ? (
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="color"
                  value={values[key] || '#e8783a'}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  className="w-10 h-10 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={values[key] || ''}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
                />
              </div>
            ) : type === 'textarea' ? (
              <textarea
                value={values[key] || ''}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-mono h-24 resize-y"
              />
            ) : (
              <input
                type={type}
                value={values[key] || ''}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
              />
            )}
            <Button size="sm" onClick={() => handleSave(key)} disabled={updateMutation.isPending}>
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Paintbrush className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">White-Label Branding</h1>
              <p className="text-sm text-muted-foreground">Customize platform appearance for your organization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && <Badge className="bg-green-500/20 text-green-500">Saved!</Badge>}
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button size="sm" onClick={handleSaveAll} disabled={updateMutation.isPending}>
              <Save className="w-4 h-4 mr-2" /> Save All
            </Button>
          </div>
        </div>

        {previewMode ? (
          <Card className="overflow-hidden">
            <div
              className="p-8 min-h-[300px]"
              style={{
                backgroundColor: values['background_color'] || '#0f0f1a',
                color: values['text_color'] || '#e5e5e5',
                fontFamily: values['font_family'] || 'Inter',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                {values['logo_url'] ? (
                  <img src={values['logo_url']} alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: values['accent_color'] || '#e8783a' }}>
                    <span className="text-white font-bold">{(values['site_title'] || 'A')[0]}</span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{values['site_title'] || 'NexusAI Playbooks'}</h2>
                  <p className="text-sm opacity-70">{values['tagline'] || 'Operational Reference System'}</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: values['accent_color'] || '#e8783a' }}>
                Welcome to {values['site_title'] || 'NexusAI Playbooks'}
              </h3>
              <p className="opacity-80 max-w-lg mb-4">Preview of your branded platform. Colors, fonts, and logos apply consistently across all pages.</p>
              <button className="px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: values['accent_color'] || '#e8783a' }}>
                Primary Action
              </button>
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="identity" className="space-y-6">
            <TabsList>
              <TabsTrigger value="identity"><Globe className="w-4 h-4 mr-1" /> Identity</TabsTrigger>
              <TabsTrigger value="colors"><Palette className="w-4 h-4 mr-1" /> Colors</TabsTrigger>
              <TabsTrigger value="typography"><Type className="w-4 h-4 mr-1" /> Typography</TabsTrigger>
              <TabsTrigger value="assets"><Image className="w-4 h-4 mr-1" /> Assets</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="space-y-4">
              {BRANDING_KEYS.filter(b => b.tab === 'identity').map(renderField)}
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              {BRANDING_KEYS.filter(b => b.tab === 'colors').map(renderField)}
              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium mb-2">Color Preview</p>
                  <div className="flex gap-2">
                    {['accent_color', 'secondary_color', 'background_color', 'text_color'].map(k => (
                      <div key={k} className="w-12 h-12 rounded-lg border border-border" style={{ backgroundColor: values[k] || '#333' }} title={k} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
              {BRANDING_KEYS.filter(b => b.tab === 'typography').map(renderField)}
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium mb-2">Quick Select Font</p>
                  <div className="grid grid-cols-5 gap-2">
                    {FONT_OPTIONS.map(font => (
                      <button
                        key={font}
                        onClick={() => { setValues({ ...values, font_family: font }); handleSave('font_family'); }}
                        className={`p-2 rounded-lg border text-xs text-center ${values['font_family'] === font ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              {BRANDING_KEYS.filter(b => b.tab === 'assets').map(renderField)}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {BRANDING_KEYS.filter(b => b.tab === 'advanced').map(renderField)}
            </TabsContent>
          </Tabs>
        )}

        {/* Enterprise callout */}
        <Card className="mt-8 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Enterprise White-Label</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise plan includes: custom login page, branded email templates, custom domain with SSL, branded PDF exports, and full removal of NexusAI Playbooks references.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
