import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

/**
 * Lightweight chat widget for the landing page.
 * Uses a simple custom implementation with a floating button that opens
 * a contact form. Can be swapped for Tawk.to/Crisp/Intercom later by
 * replacing the widget content with their embed script.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Auto-show widget hint after 30 seconds
    const timer = setTimeout(() => {
      const btn = document.getElementById('chat-widget-btn');
      if (btn) btn.classList.add('animate-bounce');
      setTimeout(() => btn?.classList.remove('animate-bounce'), 2000);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  // Detect sales-intent keywords for CRM escalation
  const SALES_KEYWORDS = ['pricing', 'price', 'cost', 'enterprise', 'demo', 'contract', 'discount', 'quote', 'plan', 'subscription', 'buy', 'purchase', 'upgrade', 'team size', 'how much', 'free trial'];

  const isSalesQuestion = (text: string) => {
    const lower = text.toLowerCase();
    return SALES_KEYWORDS.some(kw => lower.includes(kw));
  };

  const handleSend = () => {
    if (!message.trim() || !email.trim()) return;
    const escalate = isSalesQuestion(message);
    // Submit to leads endpoint - source indicates chat escalation for CRM priority
    fetch('/api/trpc/leads.submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        json: {
          fullName: name || 'Chat Visitor',
          email,
          company: '',
          jobTitle: '',
          industry: '',
          challenge: `[Chat Widget${escalate ? ' - SALES ESCALATION' : ''}] ${message}`,
          source: escalate ? 'chat_sales_escalation' : 'chat_widget',
        },
      }),
    });
    setSent(true);
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        id="chat-widget-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-400 text-black shadow-lg shadow-teal-500/25 flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? (
          <span className="text-xl font-bold">&times;</span>
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-[#1a2332] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-teal-500 px-4 py-3">
            <h3 className="font-semibold text-black text-sm">Chat with NexusAI Playbooks</h3>
            <p className="text-xs text-black/70">We typically reply within a few hours</p>
          </div>

          {!sent ? (
            <div className="p-4 space-y-3">
              <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-300">
                Hi there! 👋 How can we help you today? Ask us anything about NexusAI Playbooks.
              </div>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm placeholder:text-gray-600"
              />
              <input
                type="email"
                placeholder="Your email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm placeholder:text-gray-600"
                required
              />
              <textarea
                placeholder="Type your message... *"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm placeholder:text-gray-600 resize-none"
                required
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || !email.trim()}
                className="w-full py-2 rounded-md bg-teal-500 hover:bg-teal-400 text-black font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send Message
              </button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-sm text-gray-300 font-medium mb-1">Message sent!</p>
              <p className="text-xs text-gray-500">We'll get back to you at {email}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
