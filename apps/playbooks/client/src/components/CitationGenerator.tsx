import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Quote, Copy } from 'lucide-react';

interface CitationGeneratorProps {
  documentId: number;
  title: string;
  author?: string;
  createdAt?: string;
}

export default function CitationGenerator({ documentId, title, author, createdAt }: CitationGeneratorProps) {
  const [style, setStyle] = useState('apa');
  const { data: cached } = trpc.citations.get.useQuery({ documentId, style });
  const generateMut = trpc.citations.generate.useMutation({
    onSuccess: () => {
      toast.success('Citation generated');
    },
    onError: () => toast.error('Failed to generate citation'),
  });

  const citation = cached?.citation || (generateMut.data as any)?.citation;

  const handleGenerate = () => {
    generateMut.mutate({
      documentId,
      style,
      title,
      author: author || undefined,
      date: createdAt || undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  };

  const handleCopy = () => {
    if (citation) {
      navigator.clipboard.writeText(citation);
      toast.success('Citation copied to clipboard');
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Quote className="w-4 h-4" />
          Cite This Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apa">APA</SelectItem>
              <SelectItem value="mla">MLA</SelectItem>
              <SelectItem value="chicago">Chicago</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generateMut.isPending}>
            Generate
          </Button>
        </div>
        {citation && (
          <div className="relative p-3 bg-muted rounded-lg">
            <p className="text-sm italic pr-8">{citation}</p>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-7 w-7 p-0"
              onClick={handleCopy}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
