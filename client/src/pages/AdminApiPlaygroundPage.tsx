import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Play, Clock, Zap } from 'lucide-react';

export default function AdminApiPlaygroundPage() {
  const { data: endpoints } = trpc.apiPlayground.listEndpoints.useQuery();
  const testMut = trpc.apiPlayground.testEndpoint.useMutation();
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleTest = (endpoint: string) => {
    setSelected(endpoint);
    setResult(null);
    testMut.mutate({ endpoint }, {
      onSuccess: (data) => setResult(data),
    });
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Code2 className="w-6 h-6 text-orange-400" /> API Playground</h1>
        <p className="text-muted-foreground mt-1">Test tRPC endpoints with authenticated requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Available Endpoints</h2>
          <div className="space-y-2">
            {(endpoints || []).map((ep: any) => (
              <Card key={ep.name} className={`cursor-pointer transition-all ${selected === ep.name ? 'ring-2 ring-orange-400' : 'hover:border-orange-400/50'}`} onClick={() => handleTest(ep.name)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">{ep.method}</Badge>
                        <span className="font-mono text-sm font-medium">{ep.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{ep.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Params: {ep.params}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleTest(ep.name); }}>
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Response</h2>
          <Card className="min-h-[400px]">
            <CardContent className="p-4">
              {testMut.isPending && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-4 h-4 animate-pulse" /> Executing...
                </div>
              )}
              {result && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-green-600">200 OK</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {result.responseTime}ms
                    </span>
                  </div>
                  <pre className="bg-muted/30 rounded p-3 text-xs font-mono overflow-auto max-h-[500px] whitespace-pre-wrap">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              )}
              {!result && !testMut.isPending && (
                <p className="text-muted-foreground text-center py-12">Select an endpoint and click play to test</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
