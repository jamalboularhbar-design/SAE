import { useState } from 'react';
import { Shield, Check, X, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Role = 'admin' | 'editor' | 'viewer' | 'trial';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const PERMISSIONS: Permission[] = [
  // Documents
  { id: 'doc_view', name: 'View Documents', description: 'Read published documents', category: 'Documents' },
  { id: 'doc_create', name: 'Create Documents', description: 'Create new documents', category: 'Documents' },
  { id: 'doc_edit', name: 'Edit Documents', description: 'Modify existing documents', category: 'Documents' },
  { id: 'doc_delete', name: 'Delete Documents', description: 'Remove documents permanently', category: 'Documents' },
  { id: 'doc_publish', name: 'Publish Documents', description: 'Make documents publicly visible', category: 'Documents' },
  { id: 'doc_archive', name: 'Archive Documents', description: 'Move documents to archive', category: 'Documents' },
  // Users
  { id: 'user_view', name: 'View Users', description: 'See user list and profiles', category: 'Users' },
  { id: 'user_invite', name: 'Invite Users', description: 'Send team invitations', category: 'Users' },
  { id: 'user_manage', name: 'Manage Roles', description: 'Change user roles and permissions', category: 'Users' },
  { id: 'user_remove', name: 'Remove Users', description: 'Deactivate or remove users', category: 'Users' },
  // Analytics
  { id: 'analytics_view', name: 'View Analytics', description: 'Access usage dashboards', category: 'Analytics' },
  { id: 'analytics_export', name: 'Export Data', description: 'Download CSV/reports', category: 'Analytics' },
  { id: 'analytics_leads', name: 'View Leads', description: 'Access lead management', category: 'Analytics' },
  // Settings
  { id: 'settings_branding', name: 'Branding Settings', description: 'Customize look and feel', category: 'Settings' },
  { id: 'settings_integrations', name: 'Manage Integrations', description: 'Configure SSO, webhooks, APIs', category: 'Settings' },
  { id: 'settings_billing', name: 'Billing & Plans', description: 'Manage subscription and payments', category: 'Settings' },
  // Content
  { id: 'content_templates', name: 'Manage Templates', description: 'Create and edit templates', category: 'Content' },
  { id: 'content_quizzes', name: 'Manage Quizzes', description: 'Create assessment quizzes', category: 'Content' },
  { id: 'content_announcements', name: 'Send Announcements', description: 'Publish announcements', category: 'Content' },
];

const DEFAULT_MATRIX: Record<Role, Record<string, boolean>> = {
  admin: Object.fromEntries(PERMISSIONS.map(p => [p.id, true])),
  editor: {
    doc_view: true, doc_create: true, doc_edit: true, doc_delete: false, doc_publish: true, doc_archive: true,
    user_view: true, user_invite: false, user_manage: false, user_remove: false,
    analytics_view: true, analytics_export: true, analytics_leads: false,
    settings_branding: false, settings_integrations: false, settings_billing: false,
    content_templates: true, content_quizzes: true, content_announcements: true,
  },
  viewer: {
    doc_view: true, doc_create: false, doc_edit: false, doc_delete: false, doc_publish: false, doc_archive: false,
    user_view: false, user_invite: false, user_manage: false, user_remove: false,
    analytics_view: false, analytics_export: false, analytics_leads: false,
    settings_branding: false, settings_integrations: false, settings_billing: false,
    content_templates: false, content_quizzes: false, content_announcements: false,
  },
  trial: {
    doc_view: true, doc_create: true, doc_edit: true, doc_delete: false, doc_publish: false, doc_archive: false,
    user_view: false, user_invite: false, user_manage: false, user_remove: false,
    analytics_view: true, analytics_export: false, analytics_leads: false,
    settings_branding: false, settings_integrations: false, settings_billing: false,
    content_templates: true, content_quizzes: true, content_announcements: false,
  },
};

const ROLE_COLORS: Record<Role, string> = {
  admin: 'bg-red-500/20 text-red-500',
  editor: 'bg-blue-500/20 text-blue-500',
  viewer: 'bg-green-500/20 text-green-500',
  trial: 'bg-amber-500/20 text-amber-500',
};

export default function AdminPermissionsPage() {
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const togglePermission = (role: Role, permId: string) => {
    if (role === 'admin') return; // Admin always has all permissions
    setMatrix(prev => ({
      ...prev,
      [role]: { ...prev[role], [permId]: !prev[role][permId] },
    }));
  };

  const handleSave = () => {
    toast.success('Permissions matrix saved successfully');
  };

  const categories = Array.from(new Set(PERMISSIONS.map(p => p.category)));
  const roles: Role[] = ['admin', 'editor', 'viewer', 'trial'];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Role Permissions
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure granular access control for each role
            </p>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        {/* Role Legend */}
        <div className="flex gap-3">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(selectedRole === role ? null : role)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedRole === role ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              <Badge className={ROLE_COLORS[role]}>{role}</Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {PERMISSIONS.filter(p => matrix[role][p.id]).length}/{PERMISSIONS.length} permissions
              </p>
            </button>
          ))}
        </div>

        {/* Permissions Matrix */}
        {categories.map(category => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium w-1/3">Permission</th>
                      {roles.map(role => (
                        <th key={role} className="text-center p-3 font-medium capitalize">{role}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSIONS.filter(p => p.category === category).map(perm => (
                      <tr key={perm.id} className="border-t border-border hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{perm.name}</span>
                            <span className="text-xs text-muted-foreground hidden sm:inline">{perm.description}</span>
                          </div>
                        </td>
                        {roles.map(role => (
                          <td key={role} className="text-center p-3">
                            <button
                              onClick={() => togglePermission(role, perm.id)}
                              disabled={role === 'admin'}
                              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                                matrix[role][perm.id]
                                  ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                                  : 'bg-red-500/10 text-red-500/50 hover:bg-red-500/20'
                              } ${role === 'admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            >
                              {matrix[role][perm.id] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Info */}
        <Card className="border-blue-500/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">About Role Permissions</p>
                <p className="text-muted-foreground mt-1">
                  Admin permissions cannot be modified. Changes to Editor, Viewer, and Trial roles take effect immediately for all users with that role. 
                  Custom roles can be created from the Team Management page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
