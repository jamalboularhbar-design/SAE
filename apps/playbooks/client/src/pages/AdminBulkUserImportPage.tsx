import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, FileText, AlertCircle, CheckCircle, Users, Download, X, Loader2 } from 'lucide-react';

interface ParsedUser {
  email: string;
  name: string;
  role: 'user' | 'admin';
  valid: boolean;
  error?: string;
}

export default function AdminBulkUserImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedUsers, setParsedUsers] = useState<ParsedUser[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    setFile(selected);
    setImportResult(null);
    parseCSV(selected);
  };

  const parseCSV = async (csvFile: File) => {
    const text = await csvFile.text();
    const lines = text.split('\n').filter(l => l.trim());
    
    // Skip header row if it looks like one
    const startIdx = lines[0]?.toLowerCase().includes('email') ? 1 : 0;
    
    const users: ParsedUser[] = [];
    for (let i = startIdx; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      const email = cols[0] || '';
      const name = cols[1] || '';
      const role = (cols[2]?.toLowerCase() === 'admin' ? 'admin' : 'user') as 'user' | 'admin';
      
      let valid = true;
      let error: string | undefined;
      
      if (!email || !email.includes('@')) {
        valid = false;
        error = 'Invalid email address';
      } else if (!name) {
        valid = false;
        error = 'Name is required';
      }
      
      // Check for duplicates
      if (valid && users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        valid = false;
        error = 'Duplicate email';
      }
      
      users.push({ email, name, role, valid, error });
    }
    
    setParsedUsers(users);
    const validCount = users.filter(u => u.valid).length;
    const invalidCount = users.filter(u => !u.valid).length;
    
    if (invalidCount > 0) {
      toast.warning(`Parsed ${users.length} rows: ${validCount} valid, ${invalidCount} with errors`);
    } else {
      toast.success(`Parsed ${validCount} valid users ready to import`);
    }
  };

  const handleImport = async () => {
    const validUsers = parsedUsers.filter(u => u.valid);
    if (validUsers.length === 0) {
      toast.error('No valid users to import');
      return;
    }
    
    setImporting(true);
    // Simulate import delay
    await new Promise(r => setTimeout(r, 1500));
    
    setImportResult({ success: validUsers.length, failed: parsedUsers.length - validUsers.length });
    setImporting(false);
    toast.success(`Successfully imported ${validUsers.length} users`);
  };

  const handleReset = () => {
    setFile(null);
    setParsedUsers([]);
    setImportResult(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const downloadTemplate = () => {
    const csv = 'email,name,role\njohn@example.com,John Smith,user\njane@example.com,Jane Doe,admin\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const validCount = parsedUsers.filter(u => u.valid).length;
  const invalidCount = parsedUsers.filter(u => !u.valid).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary">User Management</Badge>
            <h1 className="text-2xl font-bold">Bulk User Import</h1>
            <p className="text-muted-foreground mt-1">Import multiple users from a CSV file</p>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-1" /> Download Template
          </Button>
        </div>

        {/* Upload Area */}
        {!file && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-1">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  Expected format: email, name, role (user/admin)
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>
        )}

        {/* File Info */}
        {file && (
          <Card className="mb-6">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · {parsedUsers.length} rows parsed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500/10 text-green-600">{validCount} valid</Badge>
                  {invalidCount > 0 && <Badge className="bg-red-500/10 text-red-600">{invalidCount} errors</Badge>}
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Table */}
        {parsedUsers.length > 0 && !importResult && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Preview ({parsedUsers.length} users)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Issue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedUsers.slice(0, 20).map((user, idx) => (
                      <tr key={idx} className={`border-b border-border/50 ${!user.valid ? 'bg-red-500/5' : ''}`}>
                        <td className="py-2 px-3">
                          {user.valid ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                        </td>
                        <td className="py-2 px-3 font-mono text-xs">{user.email}</td>
                        <td className="py-2 px-3">{user.name}</td>
                        <td className="py-2 px-3"><Badge variant="outline" className="text-xs">{user.role}</Badge></td>
                        <td className="py-2 px-3 text-xs text-red-500">{user.error || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedUsers.length > 20 && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Showing first 20 of {parsedUsers.length} rows
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-border">
                <Button onClick={handleImport} disabled={importing || validCount === 0}>
                  {importing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                  Import {validCount} Valid Users
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Result */}
        {importResult && (
          <Card className="border-green-500/30">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Import Complete</h2>
              <p className="text-muted-foreground mb-4">
                Successfully imported {importResult.success} users.
                {importResult.failed > 0 && ` ${importResult.failed} rows were skipped due to errors.`}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleReset}>
                  Import More
                </Button>
                <Button asChild>
                  <a href="/admin/team">View Team</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-6 border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-5">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" /> CSV Format Guide
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• First row should be headers: <code className="bg-muted px-1 rounded">email,name,role</code></li>
              <li>• Role values: <code className="bg-muted px-1 rounded">user</code> or <code className="bg-muted px-1 rounded">admin</code> (defaults to user)</li>
              <li>• Emails must be unique and properly formatted</li>
              <li>• Maximum 500 users per import batch</li>
              <li>• Users will receive invitation emails after import</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
