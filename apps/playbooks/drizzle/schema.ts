import { boolean, float, int, json, mediumtext, mysqlEnum, mysqlTable, text, tinyint, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Documents table - stores all ARG-Builder operational documents
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  filename: varchar("filename", { length: 500 }).notNull(),
  content: mediumtext("content"),
  wordCount: int("wordCount").default(0),
  viewCount: int("viewCount").default(0),
  upvotes: int("upvotes").default(0),
  downvotes: int("downvotes").default(0),
  summary: text("summary"),
  // Workflow states: draft, review, published
  status: mysqlEnum("status", ["draft", "review", "published"]).default("published").notNull(),
  // Pinning: pinned documents appear at top
  pinned: int("pinned").default(0).notNull(),
  // Review/expiry reminder date
  reviewBy: timestamp("reviewBy"),
  // Access control: public (everyone), private (admin only)
  visibility: mysqlEnum("visibility", ["public", "private"]).default("public").notNull(),
  // Language/locale for i18n
  locale: varchar("locale", { length: 10 }).default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// Document ratings - tracks individual user votes
export const documentRatings = mysqlTable("document_ratings", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  rating: mysqlEnum("rating", ["up", "down"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentRating = typeof documentRatings.$inferSelect;

// Reading lists - user-created collections of documents
export const readingLists = mysqlTable("reading_lists", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReadingList = typeof readingLists.$inferSelect;

// Reading list items - documents in a reading list
export const readingListItems = mysqlTable("reading_list_items", {
  id: int("id").autoincrement().primaryKey(),
  listId: int("listId").notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type ReadingListItem = typeof readingListItems.$inferSelect;

// Search analytics - tracks search queries and their results
export const searchAnalytics = mysqlTable("search_analytics", {
  id: int("id").autoincrement().primaryKey(),
  query: varchar("query", { length: 500 }).notNull(),
  resultCount: int("resultCount").default(0),
  visitorId: varchar("visitorId", { length: 100 }),
  clickedSlug: varchar("clickedSlug", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SearchAnalytic = typeof searchAnalytics.$inferSelect;

// Document tags - multi-tag system for documents
export const documentTags = mysqlTable("document_tags", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentTag = typeof documentTags.$inferSelect;

// Document comments/notes - visitor-scoped annotations
export const documentComments = mysqlTable("document_comments", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DocumentComment = typeof documentComments.$inferSelect;

// Document versions - track edit history
export const documentVersions = mysqlTable("document_versions", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: mediumtext("content"),
  editedBy: varchar("editedBy", { length: 100 }),
  changeNote: varchar("changeNote", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentVersion = typeof documentVersions.$inferSelect;

// Custom categories - admin-defined categories beyond the seeded ones
export const customCategories = mysqlTable("custom_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomCategory = typeof customCategories.$inferSelect;

// Download history - tracks document downloads
export const downloadHistory = mysqlTable("download_history", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  visitorId: varchar("visitorId", { length: 100 }),
  format: varchar("format", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DownloadHistoryEntry = typeof downloadHistory.$inferSelect;

// Site announcements - admin-configurable banners
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["info", "warning", "success"]).default("info").notNull(),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;

// Activity log - tracks admin-visible user actions
export const activityLog = mysqlTable("activity_log", {
  id: int("id").autoincrement().primaryKey(),
  action: varchar("action", { length: 50 }).notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }),
  visitorId: varchar("visitorId", { length: 100 }),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLogEntry = typeof activityLog.$inferSelect;

// Glossary terms - definitions for key terms used across documents
export const glossaryTerms = mysqlTable("glossary_terms", {
  id: int("id").autoincrement().primaryKey(),
  term: varchar("term", { length: 200 }).notNull().unique(),
  definition: text("definition").notNull(),
  category: varchar("category", { length: 100 }),
  relatedTerms: text("relatedTerms"), // JSON array of related term strings
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GlossaryTerm = typeof glossaryTerms.$inferSelect;

// Document dependencies/prerequisites
export const documentDependencies = mysqlTable("document_dependencies", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  prerequisiteSlug: varchar("prerequisiteSlug", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentDependency = typeof documentDependencies.$inferSelect;

// Reading goals - weekly reading targets and progress
export const readingGoals = mysqlTable("reading_goals", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  weeklyTarget: int("weeklyTarget").default(5).notNull(), // docs per week
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReadingGoal = typeof readingGoals.$inferSelect;

// Reading progress entries - track individual document reads
export const readingProgress = mysqlTable("reading_progress", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  weekNumber: int("weekNumber").notNull(), // ISO week number
  yearNumber: int("yearNumber").notNull(),
});

export type ReadingProgressEntry = typeof readingProgress.$inferSelect;

// Document templates gallery - reusable document templates
export const documentTemplates = mysqlTable("document_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  content: mediumtext("content").notNull(),
  icon: varchar("icon", { length: 50 }),
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DocumentTemplate = typeof documentTemplates.$inferSelect;

// Document audit trail - detailed changelog per document
export const documentAuditTrail = mysqlTable("document_audit_trail", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(), // created, updated, status_changed, pinned, unpinned, deleted
  field: varchar("field", { length: 100 }), // which field was changed
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  changedBy: varchar("changedBy", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentAuditEntry = typeof documentAuditTrail.$inferSelect;

// Bookmark notes - personal notes attached to bookmarks
export const bookmarkNotes = mysqlTable("bookmark_notes", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookmarkNote = typeof bookmarkNotes.$inferSelect;

// Share links - time-limited share URLs for documents
export const shareLinks = mysqlTable("share_links", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdBy: varchar("createdBy", { length: 100 }),
  accessCount: int("accessCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ShareLink = typeof shareLinks.$inferSelect;

// Scheduled publish - future publish dates for draft documents
export const scheduledPublish = mysqlTable("scheduled_publish", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull().unique(),
  publishAt: timestamp("publishAt").notNull(),
  createdBy: varchar("createdBy", { length: 100 }),
  status: mysqlEnum("status", ["pending", "published", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScheduledPublishEntry = typeof scheduledPublish.$inferSelect;

// Inline comments - contextual comments on highlighted text
export const inlineComments = mysqlTable("inline_comments", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  highlightText: text("highlightText").notNull(), // the highlighted text
  comment: text("comment").notNull(),
  parentId: int("parentId"), // for threaded replies
  resolved: int("resolved").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InlineComment = typeof inlineComments.$inferSelect;

// Branding settings - admin-configurable site branding
export const brandingSettings = mysqlTable("branding_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandingSetting = typeof brandingSettings.$inferSelect;

// Webhooks - configurable HTTP POST endpoints for document events
export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  url: text("url").notNull(),
  events: text("events").notNull(), // JSON array of event types
  secret: varchar("secret", { length: 100 }),
  active: int("active").default(1).notNull(),
  lastTriggeredAt: timestamp("lastTriggeredAt"),
  failCount: int("failCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Webhook = typeof webhooks.$inferSelect;

// Recently viewed - tracks last viewed documents per visitor
export const recentlyViewed = mysqlTable("recently_viewed", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type RecentlyViewedEntry = typeof recentlyViewed.$inferSelect;

// Document feedback - simple thumbs up/down with optional text
export const documentFeedback = mysqlTable("document_feedback", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  sentiment: mysqlEnum("sentiment", ["positive", "negative"]).notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentFeedbackEntry = typeof documentFeedback.$inferSelect;

// Document collections/playlists - curated reading paths
export const documentCollections = mysqlTable("document_collections", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  coverColor: varchar("coverColor", { length: 20 }).default("#c9a96e"),
  isPublished: int("isPublished").default(0).notNull(),
  createdBy: varchar("createdBy", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DocumentCollection = typeof documentCollections.$inferSelect;

// Collection items - ordered documents in a collection
export const collectionItems = mysqlTable("collection_items", {
  id: int("id").autoincrement().primaryKey(),
  collectionId: int("collectionId").notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type CollectionItem = typeof collectionItems.$inferSelect;

// Category ordering - admin-defined display order for categories
export const categoryOrdering = mysqlTable("category_ordering", {
  id: int("id").autoincrement().primaryKey(),
  categoryName: varchar("categoryName", { length: 100 }).notNull().unique(),
  sortOrder: int("sortOrder").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CategoryOrder = typeof categoryOrdering.$inferSelect;

// Document subscriptions - users subscribe to docs/categories for change notifications
export const documentSubscriptions = mysqlTable("document_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  // Either a document slug or a category name
  targetType: mysqlEnum("targetType", ["document", "category"]).notNull(),
  targetValue: varchar("targetValue", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentSubscription = typeof documentSubscriptions.$inferSelect;

// Subscription notifications - unread change notifications for subscribers
export const subscriptionNotifications = mysqlTable("subscription_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  changeType: mysqlEnum("changeType", ["created", "updated", "published"]).notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SubscriptionNotification = typeof subscriptionNotifications.$inferSelect;

// User reading position per-user (server-side) - resume where you left off
export const userReadingPosition = mysqlTable("user_reading_position", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  scrollPercent: int("scrollPercent").default(0).notNull(),
  lastReadAt: timestamp("lastReadAt").defaultNow().notNull(),
});
export type UserReadingPosition = typeof userReadingPosition.$inferSelect;

// Search history - recent searches per user
export const searchHistory = mysqlTable("search_history", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  query: varchar("query", { length: 255 }).notNull(),
  resultCount: int("resultCount").default(0),
  searchedAt: timestamp("searchedAt").defaultNow().notNull(),
});
export type SearchHistoryEntry = typeof searchHistory.$inferSelect;

// AI Summaries - generated document summaries
export const aiSummaries = mysqlTable("ai_summaries", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  summary: mediumtext("summary").notNull(),
  language: varchar("language", { length: 10 }).default("en").notNull(),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
});
export type AISummary = typeof aiSummaries.$inferSelect;

// Document translations - LLM-generated translations
export const documentTranslations = mysqlTable("document_translations", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  language: varchar("language", { length: 10 }).notNull(),
  translatedTitle: varchar("translatedTitle", { length: 500 }).notNull(),
  translatedContent: mediumtext("translatedContent").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentTranslation = typeof documentTranslations.$inferSelect;

// User preferences - per-user settings
export const userPreferences = mysqlTable("user_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull().unique(),
  notificationFrequency: mysqlEnum("notificationFrequency", ["realtime", "daily", "weekly", "off"]).default("realtime").notNull(),
  defaultSort: varchar("defaultSort", { length: 20 }).default("newest"),
  readingSpeedWpm: int("readingSpeedWpm").default(200),
  preferredTheme: varchar("preferredTheme", { length: 10 }).default("dark"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserPreference = typeof userPreferences.$inferSelect;

// Reading streak leaderboard entries (cached)
export const readingStreakLeaderboard = mysqlTable("reading_streak_leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  userName: varchar("userName", { length: 255 }),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  totalDocsRead: int("totalDocsRead").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ReadingStreakEntry = typeof readingStreakLeaderboard.$inferSelect;


// ===== BATCH 17 TABLES =====

// Saved filters/views per user
export const savedFilters = mysqlTable("saved_filters", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  filterConfig: text("filterConfig").notNull(), // JSON: {category, status, sort, search, tags}
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SavedFilter = typeof savedFilters.$inferSelect;

// Document reading quizzes (AI-generated)
export const documentQuizzes = mysqlTable("document_quizzes", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  questions: mediumtext("questions").notNull(), // JSON array of {question, options, correctIndex}
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
});
export type DocumentQuiz = typeof documentQuizzes.$inferSelect;

// Admin scheduled review reminders
export const reviewReminders = mysqlTable("review_reminders", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  reviewDate: timestamp("reviewDate").notNull(),
  frequency: mysqlEnum("frequency", ["once", "weekly", "monthly", "quarterly"]).default("once").notNull(),
  lastNotified: timestamp("lastNotified"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ReviewReminder = typeof reviewReminders.$inferSelect;

// Document annotations/highlights
export const documentAnnotations = mysqlTable("document_annotations", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  highlightText: text("highlightText").notNull(),
  note: text("note"),
  color: varchar("color", { length: 20 }).default("yellow").notNull(),
  startOffset: int("startOffset").notNull(),
  endOffset: int("endOffset").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentAnnotation = typeof documentAnnotations.$inferSelect;

// ============ BATCH 18 TABLES ============

// Custom workflow statuses (admin-defined pipelines)
export const workflowStatuses = mysqlTable("workflow_statuses", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 20 }).default("#6b7280").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isDefault: int("isDefault").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type WorkflowStatus = typeof workflowStatuses.$inferSelect;

// Workflow transitions (which status can transition to which)
export const workflowTransitions = mysqlTable("workflow_transitions", {
  id: int("id").autoincrement().primaryKey(),
  fromStatusId: int("fromStatusId").notNull(),
  toStatusId: int("toStatusId").notNull(),
});

// Document custom status assignments
export const documentWorkflowStatus = mysqlTable("document_workflow_status", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  statusId: int("statusId").notNull(),
  assignedBy: varchar("assignedBy", { length: 64 }).notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
});

// Archival policy settings
export const archivalPolicies = mysqlTable("archival_policies", {
  id: int("id").autoincrement().primaryKey(),
  daysWithoutViews: int("daysWithoutViews").default(90).notNull(),
  enabled: int("enabled").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Archived documents log
export const archivedDocuments = mysqlTable("archived_documents", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  archivedAt: timestamp("archivedAt").defaultNow().notNull(),
  reason: varchar("reason", { length: 255 }).default("auto").notNull(),
});

// Content gap suggestions (AI-generated)
export const contentGapSuggestions = mysqlTable("content_gap_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  suggestedTitle: varchar("suggestedTitle", { length: 500 }).notNull(),
  suggestedDescription: text("suggestedDescription"),
  status: mysqlEnum("gap_status", ["pending", "accepted", "dismissed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ContentGapSuggestion = typeof contentGapSuggestions.$inferSelect;

// Duplicate content pairs (detected by scanner)
export const duplicateContentPairs = mysqlTable("duplicate_content_pairs", {
  id: int("id").autoincrement().primaryKey(),
  documentId1: int("documentId1").notNull(),
  documentId2: int("documentId2").notNull(),
  similarityScore: int("similarityScore").default(0).notNull(),
  status: mysqlEnum("dup_status", ["pending", "resolved", "ignored"]).default("pending").notNull(),
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
});

// User activity feed entries
export const activityFeed = mysqlTable("activity_feed", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  documentId: int("documentId"),
  documentTitle: varchar("documentTitle", { length: 500 }),
  documentSlug: varchar("documentSlug", { length: 255 }),
  category: varchar("category", { length: 100 }),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ActivityFeedEntry = typeof activityFeed.$inferSelect;

// ─── Batch 19 ──────────────────────────────────────────────────────────────

// Document versioned snapshots (named immutable copies)
export const documentSnapshots = mysqlTable("document_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentSnapshot = typeof documentSnapshots.$inferSelect;

// Smart recommendations (collaborative filtering: users who read X also read Y)
export const readingCorrelations = mysqlTable("reading_correlations", {
  id: int("id").autoincrement().primaryKey(),
  documentIdA: int("documentIdA").notNull(),
  documentIdB: int("documentIdB").notNull(),
  score: int("score").default(1).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Document quiz results per user (comprehension score tracking)
export const quizResults = mysqlTable("quiz_results", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  documentId: int("documentId").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  correctAnswers: int("correctAnswers").notNull(),
  score: int("score").notNull(),
  takenAt: timestamp("takenAt").defaultNow().notNull(),
});
export type QuizResult = typeof quizResults.$inferSelect;

// SEO metadata per document
export const documentSeoMeta = mysqlTable("document_seo_meta", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: text("ogDescription"),
  ogImage: varchar("ogImage", { length: 500 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type DocumentSeoMeta = typeof documentSeoMeta.$inferSelect;

// System notification log (centralized notification tracking)
export const systemNotificationLog = mysqlTable("system_notification_log", {
  id: int("id").autoincrement().primaryKey(),
  recipientOpenId: varchar("recipientOpenId", { length: 64 }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  channel: varchar("channel", { length: 50 }).default("in_app").notNull(),
  status: varchar("status", { length: 20 }).default("sent").notNull(),
  retries: int("retries").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SystemNotificationLogEntry = typeof systemNotificationLog.$inferSelect;

// ── Batch 20 ──

// Admin role permissions (granular permissions per user)
export const adminPermissions = mysqlTable("admin_permissions", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  permission: varchar("permission", { length: 100 }).notNull(), // e.g. 'content_editor', 'analytics_viewer', 'user_manager', 'full_admin'
  grantedBy: varchar("grantedBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AdminPermission = typeof adminPermissions.$inferSelect;

// Document approval SLA tracking
export const approvalSlaConfig = mysqlTable("approval_sla_config", {
  id: int("id").autoincrement().primaryKey(),
  maxHoursInReview: int("maxHoursInReview").default(48).notNull(),
  alertEnabled: boolean("alertEnabled").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ApprovalSlaConfig = typeof approvalSlaConfig.$inferSelect;

// Webhook event log
export const webhookEventLog = mysqlTable("webhook_event_log", {
  id: int("id").autoincrement().primaryKey(),
  webhookId: int("webhookId").notNull(),
  event: varchar("event", { length: 50 }).notNull(),
  payload: text("payload"),
  responseStatus: int("responseStatus"),
  responseBody: text("responseBody"),
  success: boolean("success").default(false).notNull(),
  retriesLeft: int("retriesLeft").default(2).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type WebhookEventLogEntry = typeof webhookEventLog.$inferSelect;

// Document access requests
export const documentAccessRequests = mysqlTable("document_access_requests", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  requesterOpenId: varchar("requesterOpenId", { length: 64 }).notNull(),
  requesterName: varchar("requesterName", { length: 255 }),
  reason: text("reason"),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, approved, denied
  reviewedBy: varchar("reviewedBy", { length: 64 }),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentAccessRequest = typeof documentAccessRequests.$inferSelect;

// User onboarding checklist progress
export const onboardingProgress = mysqlTable("onboarding_progress", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  taskKey: varchar("taskKey", { length: 100 }).notNull(), // e.g. 'read_5_docs', 'complete_quiz', 'bookmark_doc', 'create_list', 'set_preferences'
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type OnboardingProgressEntry = typeof onboardingProgress.$inferSelect;

// Document citations
export const documentCitations = mysqlTable("document_citations", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  style: varchar("style", { length: 20 }).notNull(), // apa, mla, chicago
  citation: text("citation").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentCitation = typeof documentCitations.$inferSelect;


// ===== BATCH 21 TABLES =====

// Reading sessions - track time spent per document
export const readingSessions = mysqlTable("reading_sessions", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  durationSeconds: int("durationSeconds").default(0).notNull(),
  scrollDepthPercent: int("scrollDepthPercent").default(0).notNull(),
  completed: int("completed").default(0).notNull(), // 1 = read to end
});
export type ReadingSession = typeof readingSessions.$inferSelect;

// Document quality audits - results of bulk quality checks
export const documentQualityAudits = mysqlTable("document_quality_audits", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  issues: text("issues").notNull(), // JSON array of issue strings
  score: int("score").default(100).notNull(), // 0-100
  auditedAt: timestamp("auditedAt").defaultNow().notNull(),
});
export type DocumentQualityAudit = typeof documentQualityAudits.$inferSelect;

// Email digest config
export const emailDigestConfig = mysqlTable("email_digest_config", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: varchar("ownerId", { length: 100 }).notNull(),
  frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly", "disabled"]).default("weekly").notNull(),
  includeMetrics: int("includeMetrics").default(1).notNull(),
  includeTopDocs: int("includeTopDocs").default(1).notNull(),
  includeNewDocs: int("includeNewDocs").default(1).notNull(),
  lastSentAt: timestamp("lastSentAt"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type EmailDigestConfig = typeof emailDigestConfig.$inferSelect;

// Document media attachments
export const documentMedia = mysqlTable("document_media", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileType: varchar("fileType", { length: 50 }).notNull(), // image, pdf, video, etc.
  fileSize: int("fileSize").default(0).notNull(), // bytes
  caption: text("caption"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentMediaEntry = typeof documentMedia.$inferSelect;


// ===== Batch 22: Multi-tenant workspaces =====
export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: varchar("ownerId", { length: 255 }).notNull(),
  isDefault: tinyint("isDefault").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Workspace = typeof workspaces.$inferSelect;

export const workspaceMembers = mysqlTable("workspace_members", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("member").notNull(), // owner, admin, member
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;

// ===== Batch 22: Automated review scheduling =====
export const reviewSchedules = mysqlTable("review_schedules", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  intervalDays: int("intervalDays").default(90).notNull(),
  assigneeId: varchar("assigneeId", { length: 255 }),
  lastReviewedAt: timestamp("lastReviewedAt"),
  nextReviewAt: timestamp("nextReviewAt"),
  escalationDays: int("escalationDays").default(7).notNull(),
  isActive: tinyint("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ReviewSchedule = typeof reviewSchedules.$inferSelect;

// ===== Batch 22: Co-authoring activity log =====
export const coAuthorActivity = mysqlTable("co_author_activity", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  userName: varchar("userName", { length: 255 }),
  actionType: varchar("actionType", { length: 50 }).notNull(), // edit, comment, review, approve
  fieldChanged: varchar("fieldChanged", { length: 100 }),
  summary: text("summary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CoAuthorActivityEntry = typeof coAuthorActivity.$inferSelect;

// ===== Batch 22: Content migration tool =====
export const migrationJobs = mysqlTable("migration_jobs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, preview, running, completed, failed
  operationType: varchar("operationType", { length: 50 }).notNull(), // re-categorize, re-tag, re-assign
  filterCriteria: text("filterCriteria"), // JSON: category, tags, status filters
  targetValue: text("targetValue"), // JSON: new category, new tags, new assignee
  affectedCount: int("affectedCount").default(0).notNull(),
  processedCount: int("processedCount").default(0).notNull(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});
export type MigrationJob = typeof migrationJobs.$inferSelect;

// ===== Batch 22: Sentiment analysis =====
export const sentimentScores = mysqlTable("sentiment_scores", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  overallScore: float("overallScore").default(0).notNull(), // -1 to 1
  positiveCount: int("positiveCount").default(0).notNull(),
  negativeCount: int("negativeCount").default(0).notNull(),
  neutralCount: int("neutralCount").default(0).notNull(),
  lastAnalyzedAt: timestamp("lastAnalyzedAt").defaultNow().notNull(),
});
export type SentimentScore = typeof sentimentScores.$inferSelect;

// ===== Batch 22: Data retention policies =====
export const retentionPolicies = mysqlTable("retention_policies", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 255 }).notNull(),
  retentionDays: int("retentionDays").default(365).notNull(),
  action: varchar("action", { length: 50 }).default("archive").notNull(), // archive, delete
  isActive: tinyint("isActive").default(1).notNull(),
  lastRunAt: timestamp("lastRunAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type RetentionPolicy = typeof retentionPolicies.$inferSelect;

// ===== Batch 22: Accessibility checks =====
export const accessibilityChecks = mysqlTable("accessibility_checks", {
  id: int("id").autoincrement().primaryKey(),
  documentSlug: varchar("documentSlug", { length: 255 }).notNull(),
  issueType: varchar("issueType", { length: 100 }).notNull(), // missing-alt, heading-skip, empty-link, low-contrast
  severity: varchar("severity", { length: 50 }).default("warning").notNull(), // error, warning, info
  description: text("description"),
  lineReference: text("lineReference"),
  isResolved: tinyint("isResolved").default(0).notNull(),
  checkedAt: timestamp("checkedAt").defaultNow().notNull(),
});
export type AccessibilityCheck = typeof accessibilityChecks.$inferSelect;

// ===== Batch 22: Custom report builder =====
export const customReports = mysqlTable("custom_reports", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  config: text("config").notNull(), // JSON: metrics, filters, groupBy, dateRange, chartType
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  lastRunAt: timestamp("lastRunAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type CustomReport = typeof customReports.$inferSelect;

// ===== Batch 23: Push notifications =====
export const pushNotifications = mysqlTable("push_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // review_assigned, sla_breach, workspace_invite, doc_published, mention
  title: varchar("title", { length: 500 }).notNull(),
  message: text("message"),
  link: varchar("link", { length: 500 }),
  isRead: tinyint("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PushNotification = typeof pushNotifications.$inferSelect;

// ===== Batch 23: Template marketplace =====
export const templateMarketplace = mysqlTable("template_marketplace", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  content: mediumtext("content").notNull(),
  category: varchar("category", { length: 100 }),
  authorId: varchar("authorId", { length: 255 }).notNull(),
  authorName: varchar("authorName", { length: 255 }),
  workspaceId: int("workspaceId"),
  usageCount: int("usageCount").default(0).notNull(),
  avgRating: float("avgRating").default(0),
  totalRatings: int("totalRatings").default(0).notNull(),
  isPublic: tinyint("isPublic").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type TemplateMarketplaceItem = typeof templateMarketplace.$inferSelect;

export const templateRatings = mysqlTable("template_ratings", {
  id: int("id").autoincrement().primaryKey(),
  templateId: int("templateId").notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  rating: int("rating").notNull(), // 1-5
  review: text("review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type TemplateRating = typeof templateRatings.$inferSelect;

// ===== Batch 23: Audit compliance reports =====
export const complianceReports = mysqlTable("compliance_reports", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  dateFrom: timestamp("dateFrom").notNull(),
  dateTo: timestamp("dateTo").notNull(),
  generatedBy: varchar("generatedBy", { length: 255 }).notNull(),
  reportData: mediumtext("reportData"), // JSON: aggregated compliance data
  status: varchar("status", { length: 50 }).default("generated").notNull(), // generating, generated, failed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ComplianceReport = typeof complianceReports.$inferSelect;

// ===== BATCH 24 =====

// Document change log timeline
export const documentChangeLog = mysqlTable("document_change_log", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  documentTitle: varchar("documentTitle", { length: 500 }),
  changeType: varchar("changeType", { length: 50 }).notNull(), // created, edited, published, archived, tagged, categorized, reviewed
  changeDescription: text("changeDescription"),
  changedBy: varchar("changedBy", { length: 255 }).notNull(),
  changedByName: varchar("changedByName", { length: 255 }),
  metadata: text("metadata"), // JSON: additional change details
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentChangeLog = typeof documentChangeLog.$inferSelect;

// User landing page preference
export const userLandingPreference = mysqlTable("user_landing_preference", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 255 }).notNull().unique(),
  landingPage: varchar("landingPage", { length: 100 }).notNull().default("/"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserLandingPreference = typeof userLandingPreference.$inferSelect;

// Bulk export jobs
export const bulkExportJobs = mysqlTable("bulk_export_jobs", {
  id: int("id").autoincrement().primaryKey(),
  requestedBy: varchar("requestedBy", { length: 255 }).notNull(),
  format: varchar("format", { length: 20 }).notNull().default("markdown"),
  documentIds: text("documentIds").notNull(), // JSON array of doc IDs
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  fileUrl: text("fileUrl"),
  totalDocs: int("totalDocs").notNull().default(0),
  processedDocs: int("processedDocs").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});
export type BulkExportJob = typeof bulkExportJobs.$inferSelect;

// Document cross-references (auto-detected related docs)
export const documentCrossReferences = mysqlTable("document_cross_references", {
  id: int("id").autoincrement().primaryKey(),
  sourceDocId: int("sourceDocId").notNull(),
  targetDocId: int("targetDocId").notNull(),
  relevanceScore: float("relevanceScore").notNull().default(0),
  reason: varchar("reason", { length: 500 }),
  status: varchar("status", { length: 50 }).notNull().default("suggested"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DocumentCrossReference = typeof documentCrossReferences.$inferSelect;

// User engagement scorecards
export const userEngagementScorecard = mysqlTable("user_engagement_scorecard", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 255 }).notNull().unique(),
  userName: varchar("userName", { length: 255 }),
  docsRead: int("docsRead").notNull().default(0),
  quizzesTaken: int("quizzesTaken").notNull().default(0),
  commentsMade: int("commentsMade").notNull().default(0),
  streakDays: int("streakDays").notNull().default(0),
  bookmarkCount: int("bookmarkCount").notNull().default(0),
  totalTimeMinutes: int("totalTimeMinutes").notNull().default(0),
  engagementScore: float("engagementScore").notNull().default(0),
  lastActiveAt: timestamp("lastActiveAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserEngagementScorecard = typeof userEngagementScorecard.$inferSelect;

// Scheduled announcements
export const scheduledAnnouncements = mysqlTable("scheduled_announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  scheduledFor: timestamp("scheduledFor").notNull(),
  expiresAt: timestamp("expiresAt"),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("scheduled"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ScheduledAnnouncement = typeof scheduledAnnouncements.$inferSelect;

// Dashboard widget configuration
export const dashboardWidgetConfig = mysqlTable("dashboard_widget_config", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 255 }).notNull(),
  widgetKey: varchar("widgetKey", { length: 100 }).notNull(),
  position: int("position").notNull().default(0),
  visible: tinyint("visible").notNull().default(1),
  width: varchar("width", { length: 20 }).notNull().default("half"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type DashboardWidgetConfig = typeof dashboardWidgetConfig.$inferSelect;

// Broken link scan results
export const brokenLinkScans = mysqlTable("broken_link_scans", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  documentTitle: varchar("documentTitle", { length: 500 }),
  linkUrl: text("linkUrl").notNull(),
  linkType: varchar("linkType", { length: 50 }).notNull().default("external"),
  statusCode: int("statusCode"),
  errorMessage: varchar("errorMessage", { length: 500 }),
  scannedAt: timestamp("scannedAt").defaultNow().notNull(),
});
export type BrokenLinkScan = typeof brokenLinkScans.$inferSelect;

// Saved search filters
export const savedSearchFilters = mysqlTable("saved_search_filters", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  filterConfig: text("filterConfig").notNull(),
  usageCount: int("usageCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type SavedSearchFilter = typeof savedSearchFilters.$inferSelect;

// Duplicate content detection results
export const duplicateContentScans = mysqlTable("duplicate_content_scans", {
  id: int("id").autoincrement().primaryKey(),
  sourceDocId: int("sourceDocId").notNull(),
  sourceDocTitle: varchar("sourceDocTitle", { length: 500 }),
  targetDocId: int("targetDocId").notNull(),
  targetDocTitle: varchar("targetDocTitle", { length: 500 }),
  similarityScore: float("similarityScore").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  scannedAt: timestamp("scannedAt").defaultNow().notNull(),
});
export type DuplicateContentScan = typeof duplicateContentScans.$inferSelect;

// User document collections
export const userDocCollections = mysqlTable("user_doc_collections", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isPublic: tinyint("isPublic").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UserDocCollection = typeof userDocCollections.$inferSelect;

// Collection items
export const userDocCollectionItems = mysqlTable("user_doc_collection_items", {
  id: int("id").autoincrement().primaryKey(),
  collectionId: int("collectionId").notNull(),
  documentId: int("documentId").notNull(),
  position: int("position").notNull().default(0),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});
export type UserDocCollectionItem = typeof userDocCollectionItems.$inferSelect;

// Performance benchmarks
export const performanceBenchmarks = mysqlTable("performance_benchmarks", {
  id: int("id").autoincrement().primaryKey(),
  metricKey: varchar("metricKey", { length: 100 }).notNull(),
  metricLabel: varchar("metricLabel", { length: 255 }).notNull(),
  baselineValue: float("baselineValue").notNull(),
  currentValue: float("currentValue").notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  trend: varchar("trend", { length: 20 }).notNull().default("flat"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PerformanceBenchmark = typeof performanceBenchmarks.$inferSelect;

// ── Leads / Waitlist ──────────────────────────────────────
export const leads = mysqlTable("leads", {
  id: int("id").primaryKey().autoincrement(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 255 }),
  teamSize: varchar("teamSize", { length: 50 }),
  source: varchar("source", { length: 100 }).default("landing_page"),
  utmSource: varchar("utmSource", { length: 255 }),
  utmMedium: varchar("utmMedium", { length: 255 }),
  utmCampaign: varchar("utmCampaign", { length: 255 }),
  utmContent: varchar("utmContent", { length: 255 }),
  referrer: varchar("referrer", { length: 500 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Lead = typeof leads.$inferSelect;

// Team invite tokens - for multi-user invite system
export const inviteTokens = mysqlTable("invite_tokens", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  invitedBy: int("invitedBy").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  acceptedAt: timestamp("acceptedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type InviteToken = typeof inviteTokens.$inferSelect;

// Trial signups - tracks enterprise trial registrations
export const trials = mysqlTable("trials", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  companyName: varchar("companyName", { length: 255 }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  teamSize: varchar("teamSize", { length: 50 }),
  useCase: text("useCase"),
  // Trial status: active, expired, converted, cancelled
  status: mysqlEnum("status", ["active", "expired", "converted", "cancelled"]).default("active").notNull(),
  // Plan tier they're trialing
  planTier: mysqlEnum("planTier", ["starter", "professional", "enterprise"]).default("professional").notNull(),
  // Trial dates
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  convertedAt: timestamp("convertedAt"),
  // UTM tracking
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  referrer: text("referrer"),
  // Usage tracking
  documentsViewed: int("documentsViewed").default(0),
  searchesPerformed: int("searchesPerformed").default(0),
  featuresUsed: text("featuresUsed"), // JSON array of feature names
  lastActiveAt: timestamp("lastActiveAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Trial = typeof trials.$inferSelect;
export type InsertTrial = typeof trials.$inferInsert;

// Email nurture sequence tracking
export const nurturEmails = mysqlTable("nurture_emails", {
  id: int("id").autoincrement().primaryKey(),
  trialId: int("trialId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  // Sequence step: welcome, day3_tips, day7_value, day12_warning, day14_expired, converted
  sequenceStep: varchar("sequenceStep", { length: 50 }).notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
});
export type NurtureEmail = typeof nurturEmails.$inferSelect;


// ─── Referral Program ────────────────────────────────────────────────────────
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(), // user who referred
  referralCode: varchar("referralCode", { length: 20 }).notNull().unique(),
  referredEmail: varchar("referredEmail", { length: 255 }),
  referredUserId: int("referredUserId"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, signed_up, converted
  creditApplied: int("creditApplied").default(0).notNull(), // 0 or 1
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  convertedAt: timestamp("convertedAt"),
});
export type Referral = typeof referrals.$inferSelect;

// ─── Enterprise Onboarding Wizard State ──────────────────────────────────────
export const onboardingWizardState = mysqlTable("onboarding_wizard_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  currentStep: int("currentStep").default(0).notNull(),
  completedSteps: json("completedSteps").$type<number[]>().default([]).notNull(),
  formData: json("formData").$type<Record<string, string | boolean>>().default({}).notNull(),
  isComplete: int("isComplete").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type OnboardingWizardState = typeof onboardingWizardState.$inferSelect;
export type InsertOnboardingWizardState = typeof onboardingWizardState.$inferInsert;

// ─── AI Model Configuration ──────────────────────────────────────────────────
export const aiConfig = mysqlTable("ai_config", {
  id: int("id").autoincrement().primaryKey(),
  serviceName: varchar("serviceName", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).default("default").notNull(),
  temperature: float("temperature").default(0.7).notNull(),
  maxTokens: int("maxTokens").default(2000).notNull(),
  systemPrompt: text("systemPrompt"),
  isEnabled: int("isEnabled").default(1).notNull(),
  totalCalls: int("totalCalls").default(0).notNull(),
  totalTokensUsed: int("totalTokensUsed").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type AiConfig = typeof aiConfig.$inferSelect;

// ─── API Keys ────────────────────────────────────────────────────────────────
export const apiKeys = mysqlTable("api_keys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  keyHash: varchar("keyHash", { length: 255 }).notNull(),
  keyPrefix: varchar("keyPrefix", { length: 12 }).notNull(),
  scopes: json("scopes").$type<string[]>().default([]).notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  expiresAt: timestamp("expiresAt"),
  isRevoked: int("isRevoked").default(0).notNull(),
  totalRequests: int("totalRequests").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ApiKey = typeof apiKeys.$inferSelect;

// Team Workspace tables
export const teamTasks = mysqlTable("team_tasks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  assigneeId: int("assignee_id"),
  status: varchar("status", { length: 50 }).notNull().default("todo"),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  dueDate: timestamp("due_date"),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type TeamTask = typeof teamTasks.$inferSelect;

export const teamDiscussions = mysqlTable("team_discussions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: int("author_id").notNull(),
  isPinned: int("is_pinned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type TeamDiscussion = typeof teamDiscussions.$inferSelect;

export const teamDiscussionReplies = mysqlTable("team_discussion_replies", {
  id: int("id").autoincrement().primaryKey(),
  discussionId: int("discussion_id").notNull(),
  content: text("content").notNull(),
  authorId: int("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type TeamDiscussionReply = typeof teamDiscussionReplies.$inferSelect;

// Webhook delivery log
export const webhookDeliveries = mysqlTable("webhook_deliveries", {
  id: int("id").autoincrement().primaryKey(),
  webhookId: varchar("webhook_id", { length: 100 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  targetUrl: varchar("target_url", { length: 500 }).notNull(),
  requestPayload: json("request_payload"),
  responseStatus: int("response_status"),
  responseBody: text("response_body"),
  deliveryStatus: varchar("delivery_status", { length: 20 }).notNull().default("pending"),
  retryCount: int("retry_count").notNull().default(0),
  nextRetryAt: timestamp("next_retry_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
export type WebhookDelivery = typeof webhookDeliveries.$inferSelect;

// AI usage metering
export const aiUsageLog = mysqlTable("ai_usage_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  service: varchar("service", { length: 50 }).notNull(),
  tokensInput: int("tokens_input").notNull().default(0),
  tokensOutput: int("tokens_output").notNull().default(0),
  costEstimate: varchar("cost_estimate", { length: 20 }).notNull().default("0.00"),
  model: varchar("model", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type AiUsageLog = typeof aiUsageLog.$inferSelect;

// Custom field definitions
export const customFieldDefinitions = mysqlTable("custom_field_definitions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  label: varchar("label", { length: 200 }).notNull(),
  fieldType: varchar("field_type", { length: 30 }).notNull().default("text"),
  options: json("options"),
  category: varchar("category", { length: 100 }),
  isRequired: int("is_required").notNull().default(0),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type CustomFieldDefinition = typeof customFieldDefinitions.$inferSelect;

export const customFieldValues = mysqlTable("custom_field_values", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("field_id").notNull(),
  documentId: int("document_id").notNull(),
  value: text("value"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type CustomFieldValue = typeof customFieldValues.$inferSelect;

// Document workflow SLA
export const workflowSlaConfig = mysqlTable("workflow_sla_config", {
  id: int("id").autoincrement().primaryKey(),
  stage: varchar("stage", { length: 50 }).notNull(),
  maxHours: int("max_hours").notNull().default(48),
  alertEmail: varchar("alert_email", { length: 255 }),
  isActive: int("is_active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type WorkflowSlaConfig = typeof workflowSlaConfig.$inferSelect;

export const workflowSlaBreaches = mysqlTable("workflow_sla_breaches", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("document_id").notNull(),
  stage: varchar("stage", { length: 50 }).notNull(),
  enteredAt: timestamp("entered_at").notNull(),
  breachedAt: timestamp("breached_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  maxHours: int("max_hours").notNull(),
});
export type WorkflowSlaBreach = typeof workflowSlaBreaches.$inferSelect;

// Daily checklist completions - persists which items were completed per day
export const checklistCompletions = mysqlTable("checklist_completions", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitor_id", { length: 100 }).notNull(),
  persona: varchar("persona", { length: 50 }).notNull(),
  itemId: varchar("item_id", { length: 50 }).notNull(),
  completedDate: varchar("completed_date", { length: 10 }).notNull(), // YYYY-MM-DD
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});
export type ChecklistCompletion = typeof checklistCompletions.$inferSelect;

// Shift handover notes - persists handover notes between shifts
export const shiftHandoverNotes = mysqlTable("shift_handover_notes", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitor_id", { length: 100 }).notNull(),
  persona: varchar("persona", { length: 50 }).notNull(),
  priority: varchar("priority", { length: 20 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  content: text("content").notNull(),
  shiftDate: varchar("shift_date", { length: 10 }).notNull(), // YYYY-MM-DD
  shiftType: varchar("shift_type", { length: 20 }).notNull(), // morning, afternoon, evening
  resolved: int("resolved").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type ShiftHandoverNote = typeof shiftHandoverNotes.$inferSelect;

// Provider partners - luxury riads/hotels we collaborate with
export const providers = mysqlTable("providers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // riad, hotel, villa, guesthouse
  tier: varchar("tier", { length: 20 }).notNull(), // platinum, gold, silver
  location: varchar("location", { length: 255 }),
  contactName: varchar("contact_name", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  roomCount: int("room_count"),
  priceRange: varchar("price_range", { length: 100 }),
  specialties: text("specialties"), // JSON array of specialties
  qualityScore: float("quality_score").default(0),
  responseTimeAvg: int("response_time_avg"), // minutes
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "probation", "suspended", "inactive"]).default("active").notNull(),
  lastAuditDate: timestamp("last_audit_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type Provider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;

// Provider quality logs - track interactions and quality observations
export const providerQualityLogs = mysqlTable("provider_quality_logs", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("provider_id").notNull(),
  visitorId: varchar("visitor_id", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // feedback, issue, praise, audit
  content: text("content").notNull(),
  rating: int("rating"), // 1-5
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type ProviderQualityLog = typeof providerQualityLogs.$inferSelect;


// Guests table - CRM for tracking returning guests
export const guests = mysqlTable("guests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  nationality: varchar("nationality", { length: 100 }),
  language: varchar("language", { length: 50 }),
  vipLevel: mysqlEnum("vip_level", ["standard", "silver", "gold", "platinum"]).default("standard").notNull(),
  preferences: text("preferences"), // JSON string of preferences
  dietaryRestrictions: text("dietary_restrictions"),
  roomPreferences: text("room_preferences"),
  specialOccasions: text("special_occasions"), // birthdays, anniversaries
  totalStays: int("total_stays").default(0).notNull(),
  lastStayDate: timestamp("last_stay_date"),
  preferredProviderId: int("preferred_provider_id"),
  notes: text("notes"),
  persona: varchar("persona", { length: 50 }).default("riad-routes").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
export type Guest = typeof guests.$inferSelect;

// Incidents table - operational incident tracking
export const incidents = mysqlTable("incidents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "investigating", "resolved", "closed"]).default("open").notNull(),
  persona: varchar("persona", { length: 50 }).default("riad-routes").notNull(),
  category: varchar("category", { length: 100 }),
  providerId: int("provider_id"),
  providerName: varchar("provider_name", { length: 255 }),
  assignedTo: varchar("assigned_to", { length: 255 }),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
export type Incident = typeof incidents.$inferSelect;

// Guest feedback table - aggregated guest reviews
export const guestFeedback = mysqlTable("guest_feedback", {
  id: int("id").autoincrement().primaryKey(),
  guestId: int("guest_id"),
  guestName: varchar("guest_name", { length: 255 }).notNull(),
  providerId: int("provider_id"),
  providerName: varchar("provider_name", { length: 255 }),
  rating: int("rating").notNull(), // 1-5
  category: varchar("category", { length: 100 }), // service, cleanliness, location, value, food
  comment: text("comment"),
  source: varchar("source", { length: 100 }), // tripadvisor, google, booking, direct
  stayDate: timestamp("stay_date"),
  persona: varchar("persona", { length: 50 }).default("riad-routes").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type GuestFeedbackEntry = typeof guestFeedback.$inferSelect;
