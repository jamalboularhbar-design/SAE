import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { FileText, Copy, Plus, Trash2, X, Eye } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

export default function TemplatesGalleryPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [, navigate] = useLocation();
  const { data: templates, refetch } = trpc.templates.list.useQuery({});
  const createMutation = trpc.templates.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); } });
  const useMutation = trpc.templates.use.useMutation();
  const deleteMutation = trpc.templates.delete.useMutation({ onSuccess: () => refetch() });

  const [showForm, setShowForm] = useState(false);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', content: '', icon: '' });

  const { data: previewTemplate } = trpc.templates.getById.useQuery(
    { id: previewId! },
    { enabled: previewId !== null }
  );

  const handleUseTemplate = async (id: number) => {
    const template = await useMutation.mutateAsync({ id });
    if (template) {
      // Navigate to admin editor with template content pre-filled via query params
      navigate(`/admin/editor?template=${encodeURIComponent(template.name)}&category=${encodeURIComponent(template.category)}`);
    }
  };

  const categories = Array.from(new Set(templates?.map((t: any) => t.category) || []));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#d4af37]" />
            <div>
              <h1 className="text-3xl font-bold text-[#d4af37]">Templates Gallery</h1>
              <p className="text-gray-400 text-sm">Reusable document templates to jumpstart your writing</p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-black rounded-lg hover:bg-[#c4a030] text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> New Template
            </button>
          )}
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-[#12121a] border border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Template</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Template name" className="px-3 py-2 bg-[#0a0a0f] border border-gray-700 rounded text-white" />
              <input value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} placeholder="Category" className="px-3 py-2 bg-[#0a0a0f] border border-gray-700 rounded text-white" />
              <input value={formData.icon} onChange={e => setFormData(p => ({ ...p, icon: e.target.value }))} placeholder="Icon (emoji)" className="px-3 py-2 bg-[#0a0a0f] border border-gray-700 rounded text-white" />
            </div>
            <input value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-700 rounded text-white mb-4" />
            <textarea value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} placeholder="Template content (Markdown)" rows={8} className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-700 rounded text-white mb-4 font-mono text-sm" />
            <button
              onClick={() => createMutation.mutate(formData)}
              disabled={!formData.name || !formData.category || !formData.content}
              className="px-4 py-2 bg-[#d4af37] text-black rounded font-medium hover:bg-[#c4a030] disabled:opacity-50"
            >
              Create Template
            </button>
          </div>
        )}

        {/* Preview Modal */}
        {previewId && previewTemplate && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewId(null)}>
            <div className="bg-[#12121a] border border-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{previewTemplate.name}</h3>
                <button onClick={() => setPreviewId(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-[#0a0a0f] p-4 rounded">{previewTemplate.content}</pre>
              <div className="mt-4 flex gap-3">
                <button onClick={() => { handleUseTemplate(previewTemplate.id); setPreviewId(null); }} className="px-4 py-2 bg-[#d4af37] text-black rounded font-medium hover:bg-[#c4a030]">
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Templates by Category */}
        {categories.map(cat => (
          <div key={cat} className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates?.filter((t: any) => t.category === cat).map((t: any) => (
                <div key={t.id} className="bg-[#12121a] border border-gray-800 rounded-lg p-5 hover:border-[#d4af37]/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{t.icon || '📄'}</span>
                      <h3 className="font-semibold text-white">{t.name}</h3>
                    </div>
                    {isAdmin && (
                      <button onClick={() => deleteMutation.mutate({ id: t.id })} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {t.description && <p className="text-sm text-gray-400 mb-3">{t.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Used {t.usageCount} times</span>
                    <div className="flex gap-2">
                      <button onClick={() => setPreviewId(t.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                      <button onClick={() => handleUseTemplate(t.id)} className="flex items-center gap-1 text-xs text-[#d4af37] hover:text-[#c4a030]">
                        <Copy className="w-3 h-3" /> Use
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {(!templates || templates.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No templates yet. {isAdmin ? 'Create one above!' : 'Ask an admin to add templates.'}
          </div>
        )}
      </div>
    </div>
  );
}
