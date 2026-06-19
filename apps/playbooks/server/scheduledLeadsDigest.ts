import { Request, Response } from "express";
import { getDb } from "./db";
import { notifyOwner } from "./_core/notification";
import { leads } from "../drizzle/schema";
import { count, sql, desc, eq } from "drizzle-orm";
import { BRAND } from "./brand";

/**
 * Weekly Leads Digest — Scheduled Endpoint
 * 
 * Runs every Monday at 8 AM ET (13:00 UTC) via Heartbeat cron.
 * Collects lead pipeline metrics from local DB and Close CRM,
 * then sends a focused digest notification to the owner.
 * 
 * Path: POST /api/scheduled/leads-digest
 */

const CLOSE_API_KEY = process.env.CLOSE_CRM_API_KEY || "";
const CLOSE_BASE_URL = "https://api.close.com/api/v1";

async function fetchCloseStats(): Promise<{
  totalLeads: number;
  openOpportunities: number;
  wonThisWeek: number;
  totalPipelineValue: number;
} | null> {
  if (!CLOSE_API_KEY) return null;

  try {
    const auth = Buffer.from(`${CLOSE_API_KEY}:`).toString("base64");
    const headers = {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    };

    // Get lead count
    const leadsRes = await fetch(`${CLOSE_BASE_URL}/lead/?_limit=0`, { headers });
    const leadsData = await leadsRes.json() as any;
    const totalLeads = leadsData.total_results || 0;

    // Get opportunities
    const oppsRes = await fetch(`${CLOSE_BASE_URL}/opportunity/?_limit=0&status_type=active`, { headers });
    const oppsData = await oppsRes.json() as any;
    const openOpportunities = oppsData.total_results || 0;

    // Get won opportunities this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const dateFilter = weekAgo.toISOString().split("T")[0];
    const wonRes = await fetch(
      `${CLOSE_BASE_URL}/opportunity/?_limit=0&status_type=won&date_won__gte=${dateFilter}`,
      { headers }
    );
    const wonData = await wonRes.json() as any;
    const wonThisWeek = wonData.total_results || 0;

    // Calculate pipeline value from active opportunities
    let totalPipelineValue = 0;
    if (openOpportunities > 0) {
      const pipelineRes = await fetch(
        `${CLOSE_BASE_URL}/opportunity/?_limit=100&status_type=active&_fields=value,value_period`,
        { headers }
      );
      const pipelineData = await pipelineRes.json() as any;
      for (const opp of pipelineData.data || []) {
        totalPipelineValue += opp.value || 0;
      }
    }

    return { totalLeads, openOpportunities, wonThisWeek, totalPipelineValue };
  } catch (error) {
    console.error("[LeadsDigest] Close CRM fetch error:", error);
    return null;
  }
}

export async function leadsDigestHandler(req: Request, res: Response) {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    // --- Local DB metrics ---
    const [totalResult] = await db.select({ total: count() }).from(leads);
    const totalLocalLeads = totalResult?.total || 0;

    const [weekResult] = await db.select({ total: count() }).from(leads)
      .where(sql`${leads.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const newLeadsThisWeek = weekResult?.total || 0;

    const [contactedResult] = await db.select({ total: count() }).from(leads)
      .where(eq(leads.status, "contacted"));
    const contactedLeads = contactedResult?.total || 0;

    const [convertedResult] = await db.select({ total: count() }).from(leads)
      .where(eq(leads.status, "converted"));
    const convertedLeads = convertedResult?.total || 0;

    // Recent leads (last 7 days)
    const recentLeads = await db.select({
      fullName: leads.fullName,
      email: leads.email,
      company: leads.company,
      createdAt: leads.createdAt,
    }).from(leads)
      .where(sql`${leads.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
      .orderBy(desc(leads.createdAt))
      .limit(10);

    // --- Close CRM metrics ---
    const closeStats = await fetchCloseStats();

    // --- Build notification ---
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    const dateRange = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    const title = `🎯 Weekly Leads Digest — ${dateRange}`;

    let content = `## Lead Pipeline Summary

**Website Leads (${BRAND.productName})**
• Total Leads: ${totalLocalLeads}
• New This Week: ${newLeadsThisWeek}
• Contacted: ${contactedLeads}
• Converted: ${convertedLeads}
• Conversion Rate: ${totalLocalLeads > 0 ? ((convertedLeads / totalLocalLeads) * 100).toFixed(1) : 0}%
`;

    if (closeStats) {
      content += `
**Close CRM Pipeline**
• Total Leads in Close: ${closeStats.totalLeads}
• Open Opportunities: ${closeStats.openOpportunities}
• Won This Week: ${closeStats.wonThisWeek}
• Pipeline Value: $${(closeStats.totalPipelineValue / 100).toLocaleString()}
`;
    }

    if (recentLeads.length > 0) {
      content += `
**Recent Demo Requests (Last 7 Days)**
`;
      for (const lead of recentLeads) {
        const date = new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        content += `• ${lead.fullName} (${lead.company || "N/A"}) — ${lead.email} [${date}]\n`;
      }
    } else {
      content += `\n*No new demo requests this week.*\n`;
    }

    content += `
---
*View full pipeline at ${BRAND.activeAppUrl.replace("https://", "")}/admin/leads*
*Manage in Close CRM: app.close.com*`;

    // Send notification
    const sent = await notifyOwner({ title, content });

    res.json({
      ok: true,
      notificationSent: sent,
      metrics: {
        totalLocalLeads,
        newLeadsThisWeek,
        contactedLeads,
        convertedLeads,
        closeStats,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[LeadsDigest] Error:", error);
    res.status(500).json({
      error: error.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      context: { url: req.url, taskUid: req.headers["x-manus-cron-task-uid"] },
      timestamp: new Date().toISOString(),
    });
  }
}
