import type { Request, Response } from "express";
import { processNurtureEmails } from "./nurtureSequence";

/**
 * Heartbeat handler for processing nurture emails.
 * Called daily by the platform cron at /api/scheduled/nurture.
 * Processes all active trials and sends pending nurture emails.
 */
export async function nurtureHandler(req: Request, res: Response) {
  try {
    const result = await processNurtureEmails();
    console.log(`[Nurture Heartbeat] Processed: ${result.sent} emails sent, ${result.expired} trials expired`);
    res.json({
      ok: true,
      sent: result.sent,
      expired: result.expired,
      processedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Nurture Heartbeat] Error:", error);
    res.status(500).json({
      error: error.message || "Unknown error",
      stack: error.stack,
      context: { url: req.url },
      timestamp: new Date().toISOString(),
    });
  }
}
