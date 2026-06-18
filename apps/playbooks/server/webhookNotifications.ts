/**
 * Webhook Notifications for Key Conversion Events
 * 
 * Fires notifications to the owner when important conversion events occur:
 * - New trial started
 * - Demo requested
 * - Hot lead detected (score >= 80)
 * - Trial converting (user upgraded)
 * - Chat sales escalation
 */

import { notifyOwner } from './_core/notification';

export type ConversionEvent = 
  | 'trial_started'
  | 'demo_requested'
  | 'hot_lead_detected'
  | 'trial_expired'
  | 'chat_escalation'
  | 'referral_signup';

interface EventPayload {
  event: ConversionEvent;
  email: string;
  name: string;
  company?: string;
  details?: string;
  score?: number;
}

const EVENT_TEMPLATES: Record<ConversionEvent, { title: string; formatContent: (p: EventPayload) => string }> = {
  trial_started: {
    title: '🚀 New Trial Started',
    formatContent: (p) => `${p.name} (${p.email})${p.company ? ` from ${p.company}` : ''} just started a 14-day free trial.${p.details ? `\n\nDetails: ${p.details}` : ''}`,
  },
  demo_requested: {
    title: '📞 Demo Requested',
    formatContent: (p) => `${p.name} (${p.email})${p.company ? ` from ${p.company}` : ''} requested a custom demo.${p.details ? `\n\nUse case: ${p.details}` : ''}`,
  },
  hot_lead_detected: {
    title: '🔥 Hot Lead Detected',
    formatContent: (p) => `${p.name} (${p.email})${p.company ? ` from ${p.company}` : ''} scored ${p.score || 80}+ and is ready for outreach.${p.details ? `\n\nSignals: ${p.details}` : ''}`,
  },
  trial_expired: {
    title: '⏰ Trial Expired',
    formatContent: (p) => `${p.name} (${p.email})${p.company ? ` from ${p.company}` : ''}'s trial has expired without conversion. Consider a follow-up call.`,
  },
  chat_escalation: {
    title: '💬 Sales Chat Escalation',
    formatContent: (p) => `${p.name} (${p.email}) asked a sales question in chat.${p.details ? `\n\nMessage: "${p.details}"` : ''}`,
  },
  referral_signup: {
    title: '🎉 Referral Signup',
    formatContent: (p) => `${p.name} (${p.email}) signed up via referral.${p.details ? `\n\nReferred by: ${p.details}` : ''}`,
  },
};

/**
 * Send a conversion event notification to the owner
 */
export async function notifyConversionEvent(payload: EventPayload): Promise<boolean> {
  const template = EVENT_TEMPLATES[payload.event];
  if (!template) {
    console.warn(`[Webhook] Unknown event type: ${payload.event}`);
    return false;
  }

  try {
    const result = await notifyOwner({
      title: template.title,
      content: template.formatContent(payload),
    });
    console.log(`[Webhook] Notification sent for ${payload.event}: ${result.sent}`);
    return result.sent;
  } catch (error) {
    console.error(`[Webhook] Failed to send notification for ${payload.event}:`, error);
    return false;
  }
}
