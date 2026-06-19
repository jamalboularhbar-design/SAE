/**
 * Email Nurture Sequence for Trial Users
 * 
 * Sequence steps triggered at specific days after trial start:
 * - Day 0: Welcome email (triggered immediately on signup)
 * - Day 3: Tips & quick wins
 * - Day 7: Value highlight (features they haven't tried)
 * - Day 12: Expiry warning + upgrade incentive
 * - Day 14: Trial expired + final offer
 * 
 * This module defines the sequence and provides the logic to determine
 * which emails should be sent. Actual email delivery uses the notification system.
 */

import { notifyOwner } from "./_core/notification";
import { getLastNurtureStep, recordNurtureEmail, getAllTrials, updateTrialStatus } from "./db";
import { BRAND } from "./brand";

const { productName, teamSignature, activeAppUrl } = BRAND;

export interface NurtureStep {
  id: string;
  dayTrigger: number;
  subject: string;
  previewText: string;
  templateContent: string;
}

export const NURTURE_SEQUENCE: NurtureStep[] = [
  {
    id: "welcome",
    dayTrigger: 0,
    subject: `Welcome to ${productName} — Your 14-day trial starts now!`,
    previewText: "Here's how to get the most out of your trial",
    templateContent: `Welcome to ${productName}!

Your 14-day free trial of the {{planTier}} plan is now active.

Here's what you can do right now:
• Browse 500+ operational documents
• Try AI-powered search (just type naturally)
• Set up your team workspace
• Explore the Knowledge Graph

Quick tip: Start by searching for a topic your team asks about frequently. You'll see how ${productName} surfaces the right answer instantly.

Need help? Reply to this email or book a 15-min onboarding call.

Best,
${teamSignature}`,
  },
  {
    id: "day3_tips",
    dayTrigger: 3,
    subject: `3 quick wins you can achieve today with ${productName}`,
    previewText: "Most teams see results within the first week",
    templateContent: `Hi {{fullName}},

You're 3 days into your trial. Here are 3 quick wins most teams achieve this week:

1. **Import your existing docs** — Bulk import from Google Docs, Notion, or Confluence in one click.

2. **Set up AI summaries** — Let our AI create executive summaries for your longest documents.

3. **Share with your team** — Invite 2-3 colleagues and see how collaboration features work.

Teams that complete these 3 steps are 4x more likely to see measurable time savings.

→ Log in now: {{appUrl}}

Questions? Just reply to this email.

Best,
${teamSignature}`,
  },
  {
    id: "day7_value",
    dayTrigger: 7,
    subject: "You're halfway through — here's what you might have missed",
    previewText: "Features that save teams 12+ hours per week",
    templateContent: `Hi {{fullName}},

You're halfway through your trial! Here are features that teams love but often discover late:

📊 **Analytics Dashboard** — See which documents get read most, identify knowledge gaps.

🔗 **Knowledge Graph** — Visualize how your documents connect and find hidden relationships.

🔍 **Smart Search** — Ask questions in natural language, get instant answers from your docs.

📋 **Reading Goals** — Track team progress and ensure everyone stays up to date.

The average team saves 12+ hours per week after fully adopting ${productName}.

→ Explore these features: {{appUrl}}

Want a personalized walkthrough? Book a 15-min call with our team.

Best,
${teamSignature}`,
  },
  {
    id: "day12_warning",
    dayTrigger: 12,
    subject: "Your trial expires in 2 days — lock in your team's progress",
    previewText: "Don't lose the work you've done",
    templateContent: `Hi {{fullName}},

Your ${productName} trial expires in 2 days.

Here's what you'll lose access to:
• All imported documents and AI summaries
• Team collaboration features
• Analytics and reading insights
• Knowledge Graph visualization

**Special offer:** Upgrade before your trial ends and get 20% off your first 3 months with code EARLYBIRD20.

→ Upgrade now: {{appUrl}}/pricing

Not ready? No worries — your data is saved for 30 days. You can upgrade anytime.

Questions about pricing or features? Reply to this email and I'll personally help.

Best,
${teamSignature}`,
  },
  {
    id: "day14_expired",
    dayTrigger: 14,
    subject: "Your trial has ended — but your data is safe",
    previewText: "Reactivate anytime within 30 days",
    templateContent: `Hi {{fullName}},

Your 14-day ${productName} trial has ended.

Good news: Your data is safely stored for 30 days. You can reactivate anytime and pick up right where you left off.

**Final offer:** Use code COMEBACK25 for 25% off your first 3 months if you upgrade within the next 7 days.

→ Reactivate now: {{appUrl}}/pricing

If ${productName} isn't the right fit, I'd love to hear why. Your feedback helps us improve.

Thank you for trying ${productName}. We hope to see you back!

Best,
${teamSignature}`,
  },
];

/**
 * Get the next nurture step for a trial based on days elapsed
 */
export function getNextNurtureStep(daysSinceStart: number, lastStep: string | null): NurtureStep | null {
  const lastIndex = lastStep ? NURTURE_SEQUENCE.findIndex(s => s.id === lastStep) : -1;

  for (let i = lastIndex + 1; i < NURTURE_SEQUENCE.length; i++) {
    if (daysSinceStart >= NURTURE_SEQUENCE[i].dayTrigger) {
      return NURTURE_SEQUENCE[i];
    }
  }
  return null;
}

/**
 * Process all active trials and send pending nurture emails.
 * This should be called periodically (e.g., every hour via heartbeat).
 */
export async function processNurtureEmails(): Promise<{ sent: number; expired: number }> {
  let sent = 0;
  let expired = 0;

  const { trials: activeTrials } = await getAllTrials({ status: 'active', limit: 500 });

  for (const trial of activeTrials) {
    const daysSinceStart = Math.floor(
      (Date.now() - new Date(trial.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Auto-expire trials past 14 days
    if (daysSinceStart >= 14) {
      await updateTrialStatus(trial.id, 'expired');
      expired++;
    }

    // Check for pending nurture email
    const lastStep = await getLastNurtureStep(trial.id);
    const nextStep = getNextNurtureStep(daysSinceStart, lastStep);

    if (nextStep) {
      // Record the nurture email as sent
      await recordNurtureEmail(trial.id, trial.email, nextStep.id);
      sent++;

      // Notify owner about nurture email trigger (in production, this would send actual email)
      await notifyOwner({
        title: `Nurture Email Triggered: ${nextStep.subject}`,
        content: `Trial user ${trial.fullName} (${trial.email}) - Day ${daysSinceStart} - Step: ${nextStep.id}`,
      });
    }
  }

  return { sent, expired };
}

/**
 * Get the full nurture sequence configuration (for admin display)
 */
export function getNurtureSequenceConfig() {
  return NURTURE_SEQUENCE.map(step => ({
    id: step.id,
    dayTrigger: step.dayTrigger,
    subject: step.subject,
    previewText: step.previewText,
  }));
}
