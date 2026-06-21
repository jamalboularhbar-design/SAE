import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Mic, Sparkles, Loader2, Copy, Users, CheckCircle2, ListTodo, MessageSquare, ArrowRight } from 'lucide-react';

export default function AIMeetingNotesPage() {
  const [transcript, setTranscript] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [result, setResult] = useState<{
    summary: string; attendees: string[]; decisions: string[];
    actionItems: { task: string; owner?: string; deadline?: string }[];
    keyTopics: string[]; followUps: string[];
  } | null>(null);

  const analyze = trpc.ai.meetingNotes.useMutation({
    onSuccess: (data) => { setResult(data); toast.success('Meeting notes generated'); },
    onError: () => toast.error('Analysis failed'),
  });

  const handleAnalyze = () => {
    if (transcript.trim().length < 20) { toast.error('Enter at least 20 characters of transcript'); return; }
    analyze.mutate({ transcript, meetingTitle: meetingTitle || undefined });
  };

  const copyAll = () => {
    if (!result) return;
    const text = `# ${meetingTitle || 'Meeting Notes'}\n\n## Summary\n${result.summary}\n\n## Attendees\n${result.attendees.map(a => `- ${a}`).join('\n')}\n\n## Decisions\n${result.decisions.map(d => `- ${d}`).join('\n')}\n\n## Action Items\n${result.actionItems.map(a => `- [ ] ${a.task}${a.owner ? ` (@${a.owner})` : ''}${a.deadline ? ` — due ${a.deadline}` : ''}`).join('\n')}\n\n## Follow-ups\n${result.followUps.map(f => `- ${f}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Notes copied as Markdown');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-cyan-500/10 text-cyan-600">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mic className="w-6 h-6 text-cyan-500" /> AI Meeting Notes
          </h1>
          <p className="text-muted-foreground mt-1">Paste a meeting transcript and extract action items, decisions, and structured notes</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-5 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Meeting Title (optional)</label>
              <input
                value={meetingTitle}
                onChange={e => setMeetingTitle(e.target.value)}
                placeholder="e.g. Q2 Strategy Review"
                className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Transcript</label>
              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here..."
                className="w-full h-48 px-4 py-3 rounded-lg bg-muted/30 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAnalyze} disabled={analyze.isPending} className="bg-cyan-600 hover:bg-cyan-700">
                {analyze.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Extract Notes
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={copyAll}>
                <Copy className="w-3 h-3 mr-1" /> Copy All as Markdown
              </Button>
            </div>

            {/* Summary */}
            <Card className="border-cyan-500/30">
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-cyan-500" /> Summary</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{result.summary}</p></CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attendees */}
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-cyan-500" /> Attendees ({result.attendees.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {result.attendees.map((a, i) => <Badge key={i} variant="outline" className="text-xs">{a}</Badge>)}
                  </div>
                </CardContent>
              </Card>

              {/* Key Topics */}
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-cyan-500" /> Key Topics</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {result.keyTopics.map((t, i) => <Badge key={i} className="bg-cyan-500/10 text-cyan-600 text-xs">{t}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Decisions */}
            {result.decisions.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Decisions ({result.decisions.length})</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.decisions.map((d, i) => <li key={i} className="text-sm flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-green-500 mt-1 shrink-0" />{d}</li>)}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Items */}
            {result.actionItems.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ListTodo className="w-4 h-4 text-amber-500" /> Action Items ({result.actionItems.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.actionItems.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/30">
                        <input type="checkbox" className="mt-1" readOnly />
                        <div className="flex-1">
                          <p className="text-sm">{a.task}</p>
                          <div className="flex gap-3 mt-1">
                            {a.owner && <span className="text-xs text-muted-foreground">Owner: {a.owner}</span>}
                            {a.deadline && <span className="text-xs text-amber-600">Due: {a.deadline}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Follow-ups */}
            {result.followUps.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ArrowRight className="w-4 h-4 text-violet-500" /> Follow-ups</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.followUps.map((f, i) => <li key={i} className="text-sm flex items-start gap-2"><ArrowRight className="w-3 h-3 text-violet-500 mt-1 shrink-0" />{f}</li>)}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
