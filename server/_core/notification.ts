/**
 * Owner notifications — standalone version (no Manus dependency).
 *
 * In production, notifications are logged to the server console.
 * To get real notifications, set up an email provider (e.g. Resend, SendGrid)
 * and add sending logic in the `notifyOwner` function below.
 *
 * Env vars to add for email (optional):
 *   NOTIFY_EMAIL=you@example.com
 *   RESEND_API_KEY=re_...
 */

export type NotificationPayload = {
  title: string;
  content: string;
};

/**
 * Send a notification to the owner.
 * Currently logs to console. Wire up email here when ready.
 */
export async function notifyOwner(payload: NotificationPayload): Promise<{ sent: boolean }> {
  const { title, content } = payload;

  if (!title?.trim() || !content?.trim()) {
    return { sent: false };
  }

  // Always log — visible in Railway/server logs
  console.info(`[Notification] ${title}\n${content}`);

  // ── Optional: send via Resend (https://resend.com — free 3k emails/month) ──
  // Uncomment and install: pnpm add resend
  //
  // const notifyEmail = process.env.NOTIFY_EMAIL;
  // const resendKey = process.env.RESEND_API_KEY;
  // if (notifyEmail && resendKey) {
  //   const { Resend } = await import("resend");
  //   const resend = new Resend(resendKey);
  //   await resend.emails.send({
  //     from: "NexusAI Playbooks <noreply@argbuilder.io>",
  //     to: notifyEmail,
  //     subject: title,
  //     text: content,
  //   });
  // }

  return { sent: true };
}
