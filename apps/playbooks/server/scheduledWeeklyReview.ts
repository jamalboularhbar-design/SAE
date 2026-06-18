import { Request, Response } from "express";
import { getDb } from "./db";
import { notifyOwner } from "./_core/notification";
import { users, documents, leads, activityLog, recentlyViewed, documentComments, documentFeedback } from "../drizzle/schema";
import { count, sql, desc, eq } from "drizzle-orm";

/**
 * Weekly Metrics Review — Scheduled Endpoint
 * 
 * Runs every Monday at 9 AM ET (14:00 UTC) via Heartbeat cron.
 * Collects platform metrics and sends a summary notification to the owner.
 * 
 * Path: POST /api/scheduled/weekly-review
 */
export async function weeklyReviewHandler(req: Request, res: Response) {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    // --- Collect metrics ---

    // Total users
    const [userStats] = await db.select({ total: count() }).from(users);
    const totalUsers = userStats?.total || 0;

    // New users this week
    const [newUsersWeek] = await db.select({ total: count() }).from(users)
      .where(sql`${users.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const newUsersThisWeek = newUsersWeek?.total || 0;

    // Total documents
    const [docStats] = await db.select({ 
      total: count(),
      totalViews: sql<number>`COALESCE(SUM(${documents.viewCount}), 0)`,
    }).from(documents);
    const totalDocuments = docStats?.total || 0;
    const totalViews = docStats?.totalViews || 0;

    // Views this week
    const [weekViews] = await db.select({ total: count() }).from(activityLog)
      .where(sql`${activityLog.action} = 'view' AND ${activityLog.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const viewsThisWeek = weekViews?.total || 0;

    // Unique readers this week
    const [weekReaders] = await db.select({
      total: sql<number>`COUNT(DISTINCT ${recentlyViewed.visitorId})`,
    }).from(recentlyViewed)
      .where(sql`${recentlyViewed.viewedAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const uniqueReadersThisWeek = weekReaders?.total || 0;

    // New comments this week
    const [weekComments] = await db.select({ total: count() }).from(documentComments)
      .where(sql`${documentComments.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const commentsThisWeek = weekComments?.total || 0;

    // New feedback this week
    const [weekFeedback] = await db.select({ total: count() }).from(documentFeedback)
      .where(sql`${documentFeedback.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const feedbackThisWeek = weekFeedback?.total || 0;

    // Leads this week
    const [weekLeads] = await db.select({ total: count() }).from(leads)
      .where(sql`${leads.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const leadsThisWeek = weekLeads?.total || 0;

    // Total leads
    const [totalLeadsResult] = await db.select({ total: count() }).from(leads);
    const totalLeads = totalLeadsResult?.total || 0;

    // Documents updated this week
    const [docsUpdated] = await db.select({ total: count() }).from(documents)
      .where(sql`${documents.updatedAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const docsUpdatedThisWeek = docsUpdated?.total || 0;

    // --- Build notification ---

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    const dateRange = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    const title = `📊 ARG Builder Weekly Review — ${dateRange}`;

    const content = `## Weekly Metrics Summary

**Platform Growth**
• Total Users: ${totalUsers} (+${newUsersThisWeek} this week)
• Total Documents: ${totalDocuments}
• Total Leads: ${totalLeads} (+${leadsThisWeek} this week)

**Engagement (Last 7 Days)**
• Document Views: ${viewsThisWeek.toLocaleString()}
• Unique Readers: ${uniqueReadersThisWeek}
• Comments: ${commentsThisWeek}
• Feedback Submissions: ${feedbackThisWeek}
• Documents Updated: ${docsUpdatedThisWeek}

**All-Time**
• Total Views: ${totalViews.toLocaleString()}

---

*Review your full dashboard at argbuilder.io/admin/dashboard*
*Manage this schedule in Settings → Schedules*`;

    // Send notification to owner
    const sent = await notifyOwner({ title, content });

    res.json({
      ok: true,
      notificationSent: sent,
      metrics: {
        totalUsers,
        newUsersThisWeek,
        totalDocuments,
        totalViews,
        viewsThisWeek,
        uniqueReadersThisWeek,
        commentsThisWeek,
        feedbackThisWeek,
        leadsThisWeek,
        totalLeads,
        docsUpdatedThisWeek,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[WeeklyReview] Error:", error);
    res.status(500).json({
      error: error.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      context: { url: req.url, taskUid: req.headers["x-manus-cron-task-uid"] },
      timestamp: new Date().toISOString(),
    });
  }
}
