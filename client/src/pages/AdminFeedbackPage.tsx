import { trpc } from '@/lib/trpc';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function AdminFeedbackPage() {
  const { data: allDocs } = trpc.documents.list.useQuery({ limit: 200, status: 'all' });
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { data: feedback } = trpc.feedback.get.useQuery(
    { slug: selectedSlug || '' },
    { enabled: !!selectedSlug }
  );

  const docs = allDocs?.documents || [];

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-2">Document Feedback Overview</h1>
      <p className="text-sm text-muted-foreground mb-6">View reader sentiment and feedback comments across all documents.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document list */}
        <div className="md:col-span-1 space-y-1 max-h-[600px] overflow-y-auto border border-border rounded-lg p-2">
          {docs.map((doc) => (
            <button
              key={doc.slug}
              onClick={() => setSelectedSlug(doc.slug)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedSlug === doc.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`}
            >
              {doc.title}
            </button>
          ))}
          {docs.length === 0 && <p className="text-sm text-muted-foreground p-3">No documents found.</p>}
        </div>

        {/* Feedback detail */}
        <div className="md:col-span-2">
          {!selectedSlug && (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Select a document to view its feedback</p>
            </div>
          )}
          {selectedSlug && feedback && (
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-green-600">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">{feedback.positive}</span>
                  <span className="text-sm text-muted-foreground">positive</span>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <ThumbsDown className="w-5 h-5" />
                  <span className="text-2xl font-bold">{feedback.negative}</span>
                  <span className="text-sm text-muted-foreground">negative</span>
                </div>
                {(feedback.positive + feedback.negative) > 0 && (
                  <div className="ml-auto text-sm text-muted-foreground">
                    {Math.round((feedback.positive / (feedback.positive + feedback.negative)) * 100)}% positive
                  </div>
                )}
              </div>

              {feedback.comments.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Comments</h3>
                  {feedback.comments.map((fb, i) => (
                    <div key={i} className="border border-border rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={fb.sentiment === 'positive' ? 'text-green-600' : 'text-red-600'}>
                          {fb.sentiment === 'positive' ? <ThumbsUp className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-xs text-muted-foreground">{fb.visitorId.slice(0, 8)}...</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No written feedback yet for this document.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
