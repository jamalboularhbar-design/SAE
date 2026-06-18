import { useState } from 'react';
import { AIChatBox, Message } from '@/components/AIChatBox';
import { trpc } from '@/lib/trpc';
import { Brain, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your ARG Builder AI Assistant. I can help you with:\n\n- **Finding documents** — Ask me about any operational process\n- **Summarizing content** — Get quick overviews of complex documents\n- **Writing help** — Draft emails, reports, or documentation\n- **Workflow advice** — Get recommendations for process improvements\n\nHow can I help you today?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatMutation = trpc.ai.chat.useMutation();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
      });
      setMessages([...updatedMessages, { role: 'assistant', content: response.content }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: 'assistant', content: 'I apologize, but I encountered an error processing your request. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Brain className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Chat Assistant</h1>
              <p className="text-sm text-muted-foreground">Context-aware conversational AI for your operational knowledge base</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              <Info className="h-3 w-3 mr-1" />
              Knows all 525+ documents
            </Badge>
            <Badge variant="outline" className="text-xs">Streaming responses</Badge>
            <Badge variant="outline" className="text-xs">Markdown support</Badge>
          </div>
        </div>

        {/* Chat Interface */}
        <AIChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Ask me anything about your operational guides, processes, or best practices..."
          height="600px"
        />
      </div>
    </div>
  );
}
