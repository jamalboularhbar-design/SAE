import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { BRAND, DEMO_WORKSPACES } from "./brand";
import { stripeRouter } from "./stripeRouter";
import {
  getTemplateCheckoutUrls,
  getTemplateClubCheckoutUrl,
  isTemplateStoreLive,
} from "./templateStore";
import { createCloseLead, subscribeToNurtureSequence } from "./closeCrm";
import { leadSubmitLimiter, loginLimiter } from "./rateLimiter";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "./_core/trpc";
import {
  getDocuments, getDocumentBySlug, getDocumentCategories, getRelatedDocuments,
  getDocumentStats, createDocument, updateDocument, deleteDocument,
  rateDocument, getUserRating, incrementViewCount, getPopularDocuments,
  getReadingLists, createReadingList, addToReadingList, removeFromReadingList,
  getReadingListItems, deleteReadingList, bulkImportDocuments, saveSummary,
  logSearchQuery, logSearchClick, getPopularSearches, getSearchAnalyticsSummary,
  addTag, removeTag, getDocumentTags, getAllTags, getDocumentsByTag,
  addComment, getComments, deleteComment,
  saveDocumentVersion, getDocumentVersions, getDocumentVersionContent,
  pinDocument, unpinDocument, getPinnedDocuments,
  batchDeleteDocuments, batchUpdateStatus, batchAddTag,
  getCustomCategories, createCustomCategory, updateCustomCategory, deleteCustomCategory,
  getStaleDocuments, logDownload, getDownloadHistory,
  getActiveAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  logActivity, getActivityLog,
  searchWithRelevance, getViewsOverTime, getTopDocuments, getDownloadTrends, getCategoryDistribution,
  getGlossaryTerms, createGlossaryTerm, updateGlossaryTerm, deleteGlossaryTerm,
  getDocumentDependencies, getDependentDocuments, addDocumentDependency, removeDocumentDependency,
  getReadingGoal, setReadingGoal, recordReadingCompletion, getWeeklyProgress,
  getDocumentTemplates, createDocumentTemplate, getDocumentTemplateById, incrementTemplateUsage, deleteDocumentTemplate,
  logAuditEntry, getAuditTrail, getAnalyticsExportData, getDocumentSummariesForAI,
  getBookmarkNotes, getBookmarkNote, upsertBookmarkNote, deleteBookmarkNote,
  createShareLink, getShareLinkByToken, getShareLinksForDocument, incrementShareLinkAccess, deleteShareLink,
  schedulePublish, getScheduledPublishes, getScheduledPublishForDoc, cancelScheduledPublish, processScheduledPublishes,
  renameTag, mergeTags, deleteTagGlobally, getAllTagsWithCounts,
  importDocumentFromContent, getDocumentsInReview, approveDocument, rejectDocument,
  getInlineComments, addInlineComment, resolveInlineComment, deleteInlineComment,
  getBrandingSettings, upsertBrandingSetting,
  getWebhooks, createWebhook, updateWebhook, deleteWebhook, fireWebhooks,
  trackRecentlyViewed, getRecentlyViewed,
  getDocumentForExport, getAllUsers, updateUserRole, getVisitorAnalytics, getVisitorDocumentAccess,
  archiveDocuments,
  submitFeedback, getFeedbackForDocument, getMyFeedback,
  getCategoryOrdering, saveCategoryOrdering,
  duplicateDocument, getReadingHistory,
  setDocumentVisibility, getPrivateDocuments,
  getCollections, getCollectionById, createCollection, updateCollection, deleteCollection,
  getCollectionItems, addCollectionItem, removeCollectionItem,
  bulkImportFromJSON, restoreDocumentVersion, getReadingHeatmap,
  subscribeToTarget, unsubscribeFromTarget, getUserSubscriptions, notifySubscribers,
  getUserNotifications, markNotificationRead, markAllNotificationsRead, getUnreadNotificationCount,
  saveReadingPosition, getReadingPosition, getAllReadingPositions,
  bulkMoveDocuments, mergeDocuments,
  setCategoryCoverImage, getCategoryCoverImage, getAllCategoryCoverImages,
  saveSearchHistory, getRecentSearches, clearUserSearchHistory,
  getDocumentGraph, getContentCalendarEvents,
  saveAISummary, getAISummary,
  saveTranslation, getTranslation, getTranslationsForDocument,
  getUserPreferences, saveUserPreferences,
  getWordCountAnalytics, getAllDocumentLinks,
  getReadingStreakLeaderboard, updateStreakLeaderboard,
  getDocumentVersionsForDiff,
  getSavedFilters, createSavedFilter, deleteSavedFilter,
  getDocumentQuiz, saveDocumentQuiz,
  getReviewReminders, createReviewReminder, deleteReviewReminder, getOverdueReviews,
  getDocumentAnnotations, createAnnotation, deleteAnnotation, updateAnnotationNote,
  bulkAssignTags, bulkRemoveTags,
  getContentHealthScores,
  getRelatedByTags,
  getWorkflowStatuses, createWorkflowStatus, deleteWorkflowStatus,
  getWorkflowTransitions, setWorkflowTransition, removeWorkflowTransition,
  getDocumentWorkflowStatus, setDocumentWorkflowStatus,
  getAnalyticsForExport,
  getArchivalPolicy, upsertArchivalPolicy, getStaleDocumentsForArchival, archiveDocument, getArchivedDocuments, unarchiveDocument,
  getContentGapSuggestions, saveContentGapSuggestions, updateContentGapStatus,
  getDuplicateContentPairs, saveDuplicatePair, updateDuplicateStatus,
  addActivityFeedEntry, getActivityFeed,
  quickEditDocument,
  generateEmbedCode,
  createDocumentSnapshot, getDocumentSnapshots, getSnapshotById,
  recordReadingCorrelation, getSmartRecommendations,
  saveQuizResult, getUserQuizResults, getDocumentQuizScore,
  getDocumentSeoMeta, upsertDocumentSeoMeta,
  logSystemNotification, getSystemNotificationLog, retrySystemNotification,
  getAdminDashboardStats,
  getDocumentsForZipExport,
  getAllDocumentTitlesAndSlugs,
  getUserPersonalStats,
  getUserPermissions, grantPermission, revokePermission, getAllPermissions,
  getSlaConfig, upsertSlaConfig, getDocsExceedingSla,
  logWebhookEvent, getWebhookEventLogs, retryWebhookEvent,
  createAccessRequest, getAccessRequests, reviewAccessRequest, getUserAccessRequests,
  getDocumentVersionById,
  getDocumentsWithoutSummary,
  getOnboardingProgress, completeOnboardingTask, initOnboardingTasks,
  getCachedCitation, saveCitation,
  getReadingActivityOverTime, getEngagementOverTime, getActivityBreakdown,
  getTopDocsByEngagement, getContentGrowthOverTime, getAnalyticsSummary, getHourlyActivityHeatmap,
  getComparativePeriodAnalytics, getTrendingDocuments, runDocumentQualityAudit, getLatestQualityAudits,
  recordReadingSession, getReadingSessionAnalytics, getDocumentFreshnessReport,
  getEmailDigestConfig, upsertEmailDigestConfig,
  getDocumentMedia, addDocumentMedia, removeDocumentMedia,
  getPublicSiteStats,
  listWorkspaces, createWorkspace, getWorkspaceBySlug, listWorkspaceMembers, addWorkspaceMember, removeWorkspaceMember,
  listReviewSchedules, upsertReviewSchedule, getOverdueScheduledReviews, markReviewComplete,
  logCoAuthorActivity, getCoAuthorActivity, getDocumentContributors,
  createMigrationJob, listMigrationJobs, executeMigrationJob,
  getReadingPathForUser,
  upsertSentimentScore, getSentimentScores, getSentimentForDocument,
  listRetentionPolicies, upsertRetentionPolicy, deleteRetentionPolicy,
  runAccessibilityCheck, getAccessibilityIssues, getAllAccessibilityIssues, resolveAccessibilityIssue,
  listCustomReports, createCustomReport, updateCustomReport, deleteCustomReport, executeCustomReport,
  getPushNotifications, getUnreadPushCount, createPushNotification, markPushNotificationRead, markAllPushRead, deletePushNotification,
  listMarketplaceTemplates, getMarketplaceTemplate, submitMarketplaceTemplate, rateTemplate, getTemplateRatings, incrementMarketplaceTemplateUsage,
  listComplianceReports, generateComplianceReport, getComplianceReport, deleteComplianceReport,
  getDocumentChangeLog, addDocumentChangeLog,
  getUserLandingPreference, setUserLandingPreference,
  createBulkExportJob, getBulkExportJobs, updateBulkExportJob,
  getDocumentCrossReferences, addDocumentCrossReference, updateCrossReferenceStatus, getAllCrossReferences,
  getUserEngagementScorecards, getUserEngagementScorecard, upsertUserEngagementScorecard,
  getScheduledAnnouncements, createScheduledAnnouncement, updateScheduledAnnouncement, deleteScheduledAnnouncement,
  getDashboardWidgetConfig, saveDashboardWidgetConfig,
  rollbackDocumentVersion,
  saveBrokenLinkScanResults, getBrokenLinkScanResults,
  getSavedSearchFilters, createSavedSearchFilter, deleteSavedSearchFilter, incrementSavedFilterUsage,
  getDocumentReadingEstimate,
  saveDuplicateContentResults, getDuplicateContentResults, updateDuplicateScanStatus,
  getUserDocCollections, createUserDocCollection, deleteUserDocCollection, getUserDocCollectionItems, addDocToCollection, removeDocFromCollection,
  getPerformanceBenchmarks, savePerformanceBenchmark,
  getKnowledgeGraphData,
  createLead, getLeads, updateLeadStatus, getLeadStats,
  createInviteToken, getInviteByToken, markInviteAccepted, getTeamInvites, deleteInviteToken, getTeamMembers, updateUserRoleById,
  createTrial, getTrialByEmail, getAllTrials, updateTrialStatus, getTrialStats, recordNurtureEmail, getNurtureEmailsForTrial,
  createReferral, getReferralByCode, getReferralsByUser, markReferralSignedUp, getReferralStats,
  getWizardState, saveWizardState,
  getAllAiConfigs, getAiConfigByService, upsertAiConfig, incrementAiUsage,
  getApiKeysByUser, createApiKey, revokeApiKey, getAllApiKeys,
  getTeamTasks, createTeamTask, updateTeamTask, deleteTeamTask,
  getTeamDiscussions, createTeamDiscussion, getDiscussionReplies, createDiscussionReply,
  logWebhookDelivery, getWebhookDeliveries, updateWebhookDeliveryStatus,
  logAiUsage, getAiUsageByUser, getAiUsageSummary,
  getCustomFieldDefinitions, createCustomField, deleteCustomField, getCustomFieldValues, upsertCustomFieldValue,
  getWorkflowSlaConfigs, upsertWorkflowSlaConfig, getWorkflowSlaBreaches, createSlaBreach, resolveSlaBreach,
  getChecklistCompletions, toggleChecklistItem,
  getShiftHandovers, createShiftHandover, resolveShiftHandover,
  getProviders, getProviderById, createProvider, updateProvider, deleteProvider,
  getProviderQualityLogs, addProviderQualityLog,
  getGuests, getGuestById, createGuest, updateGuest, deleteGuest,
  getIncidents, createIncident, updateIncident, resolveIncident,
  getGuestFeedbackList, createGuestFeedbackEntry,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  documents: router({
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          search: z.string().optional(),
          sort: z.enum(['alpha', 'reading_time', 'newest']).optional().default('alpha'),
          limit: z.number().min(1).max(600).optional().default(50),
          offset: z.number().min(0).optional().default(0),
          status: z.enum(['draft', 'review', 'published', 'all']).optional().default('published'),
          tags: z.array(z.string()).optional(),
          minReadingTime: z.number().optional(),
          maxReadingTime: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        return getDocuments(input);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getDocumentBySlug(input.slug);
      }),

    categories: publicProcedure.query(async () => {
      return getDocumentCategories();
    }),

    related: publicProcedure
      .input(z.object({ slug: z.string(), category: z.string(), limit: z.number().min(1).max(10).optional().default(5) }))
      .query(async ({ input }) => {
        return getRelatedDocuments(input.slug, input.category, input.limit);
      }),

    stats: publicProcedure.query(async () => {
      return getDocumentStats();
    }),

    popular: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(20).optional().default(10) }))
      .query(async ({ input }) => {
        return getPopularDocuments(input.limit);
      }),

    pinned: publicProcedure.query(async () => {
      return getPinnedDocuments();
    }),

    stale: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional().default(20) }))
      .query(async ({ input }) => {
        return getStaleDocuments(input.limit);
      }),

    // View count
    recordView: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        await incrementViewCount(input.slug);
        await logActivity('view', input.slug);
        return { success: true };
      }),

    // Ratings
    rate: publicProcedure
      .input(z.object({ slug: z.string(), visitorId: z.string(), rating: z.enum(['up', 'down']) }))
      .mutation(async ({ input }) => {
        await logActivity('rate', input.slug, input.visitorId, input.rating);
        return rateDocument(input.slug, input.visitorId, input.rating);
      }),

    getUserRating: publicProcedure
      .input(z.object({ slug: z.string(), visitorId: z.string() }))
      .query(async ({ input }) => {
        return getUserRating(input.slug, input.visitorId);
      }),

    // Download tracking
    logDownload: publicProcedure
      .input(z.object({ slug: z.string(), format: z.string(), visitorId: z.string().optional() }))
      .mutation(async ({ input }) => {
        await logDownload(input.slug, input.format, input.visitorId);
        await logActivity('download', input.slug, input.visitorId, input.format);
        return { success: true };
      }),

    // AI Summary
    generateSummary: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        const doc = await getDocumentBySlug(input.slug);
        if (!doc || !doc.content) throw new Error('Document not found');

        if (doc.summary) return { summary: doc.summary };

        const contentPreview = doc.content.substring(0, 4000);
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a concise summarizer. Generate a 2-3 sentence TL;DR summary of the following operational document. Focus on the key purpose, main processes, and critical outcomes. Keep it under 80 words." },
            { role: "user", content: `Document Title: ${doc.title}\nCategory: ${doc.category}\n\nContent:\n${contentPreview}` },
          ],
        });

        const summary = (response.choices?.[0]?.message?.content as string) || 'Summary unavailable.';
        await saveSummary(input.slug, summary);
        return { summary };
      }),

    // Admin CRUD operations
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(500),
        category: z.string().min(1).max(100),
        content: z.string().min(1),
        status: z.enum(['draft', 'review', 'published']).optional().default('published'),
        locale: z.string().max(10).optional().default('en'),
      }))
      .mutation(async ({ input }) => {
        const slug = input.title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
        const filename = `ARG-Builder-${slug}.md`;
        const wordCount = input.content.split(/\s+/).filter(Boolean).length;
        const result = await createDocument({ slug, title: input.title, category: input.category, filename, content: input.content, wordCount, status: input.status, locale: input.locale });

        await notifyOwner({
          title: `New Document Created: ${input.title}`,
          content: `A new document "${input.title}" was created in the "${input.category}" category (${wordCount} words, status: ${input.status}).`,
        });

        await logActivity('create', slug, undefined, `Created: ${input.title}`);
        await logAuditEntry({ documentSlug: slug, action: 'created', field: undefined, oldValue: undefined, newValue: input.title, changedBy: 'admin' });
        await fireWebhooks('document.created', { slug, title: input.title, category: input.category, status: input.status });
        // Notify subscribers of new document in this category
        if (input.status === 'published') {
          await notifySubscribers(slug, input.category, 'created');
        }
        return result;
      }),

    update: adminProcedure
      .input(z.object({
        slug: z.string(),
        title: z.string().min(1).max(500).optional(),
        category: z.string().min(1).max(100).optional(),
        content: z.string().optional(),
        status: z.enum(['draft', 'review', 'published']).optional(),
        pinned: z.number().min(0).max(1).optional(),
        reviewBy: z.string().optional(),
        locale: z.string().max(10).optional(),
        changeNote: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { slug, changeNote, reviewBy, ...data } = input;

        // Save version before updating
        const existing = await getDocumentBySlug(slug);
        if (existing && existing.content && (data.content || data.title)) {
          await saveDocumentVersion(slug, existing.title, existing.content, ctx.user?.name || 'admin', changeNote);
        }

        const updateData: any = { ...data };
        if (reviewBy !== undefined) {
          updateData.reviewBy = reviewBy ? new Date(reviewBy) : null;
        }

        await logActivity('update', slug, undefined, changeNote || `Updated document`);

        // Log audit entries for changed fields
        if (data.title && existing && data.title !== existing.title) {
          await logAuditEntry({ documentSlug: slug, action: 'updated', field: 'title', oldValue: existing.title, newValue: data.title, changedBy: ctx.user?.name || 'admin' });
        }
        if (data.status && existing && data.status !== existing.status) {
          await logAuditEntry({ documentSlug: slug, action: 'status_changed', field: 'status', oldValue: existing.status || 'published', newValue: data.status, changedBy: ctx.user?.name || 'admin' });
        }
        if (data.category && existing && data.category !== existing.category) {
          await logAuditEntry({ documentSlug: slug, action: 'updated', field: 'category', oldValue: existing.category, newValue: data.category, changedBy: ctx.user?.name || 'admin' });
        }
        if (data.content && existing && data.content !== existing.content) {
          await logAuditEntry({ documentSlug: slug, action: 'updated', field: 'content', oldValue: '(previous version)', newValue: '(new version)', changedBy: ctx.user?.name || 'admin' });
        }

        // Notify owner when document moves to review status
        if (data.status === 'review') {
          await notifyOwner({
            title: `Document submitted for review: ${existing?.title || slug}`,
            content: `The document "${existing?.title || slug}" has been moved to review status and requires approval.`,
          });
        }

        const result = await updateDocument(slug, updateData);
        if (data.status === 'published') {
          await fireWebhooks('document.published', { slug, title: data.title || existing?.title });
          await notifySubscribers(slug, existing?.category || '', 'published');
        } else {
          await fireWebhooks('document.updated', { slug, title: data.title || existing?.title, changes: Object.keys(data) });
          await notifySubscribers(slug, existing?.category || '', 'updated');
        }
        return result;
      }),

    delete: adminProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        await logActivity('delete', input.slug, undefined, `Deleted document`);
        await logAuditEntry({ documentSlug: input.slug, action: 'deleted', field: undefined, oldValue: input.slug, newValue: undefined, changedBy: 'admin' });
        await fireWebhooks('document.deleted', { slug: input.slug });
        return deleteDocument(input.slug);
      }),

    // Pinning
    pin: adminProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        await logActivity('pin', input.slug);
        await logAuditEntry({ documentSlug: input.slug, action: 'pinned', field: 'pinned', oldValue: '0', newValue: '1', changedBy: 'admin' });
        return pinDocument(input.slug);
      }),

    unpin: adminProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        await logActivity('unpin', input.slug);
        await logAuditEntry({ documentSlug: input.slug, action: 'unpinned', field: 'pinned', oldValue: '1', newValue: '0', changedBy: 'admin' });
        return unpinDocument(input.slug);
      }),

    // Batch operations
    batchDelete: adminProcedure
      .input(z.object({ slugs: z.array(z.string()).min(1).max(100) }))
      .mutation(async ({ input }) => {
        await logActivity('batch_delete', undefined, undefined, `Deleted ${input.slugs.length} documents`);
        return batchDeleteDocuments(input.slugs);
      }),

    batchUpdateStatus: adminProcedure
      .input(z.object({ slugs: z.array(z.string()).min(1).max(100), status: z.enum(['draft', 'review', 'published']) }))
      .mutation(async ({ input }) => {
        await logActivity('batch_status', undefined, undefined, `Set ${input.slugs.length} docs to ${input.status}`);
        return batchUpdateStatus(input.slugs, input.status);
      }),

    batchAddTag: adminProcedure
      .input(z.object({ slugs: z.array(z.string()).min(1).max(100), tag: z.string().min(1).max(100) }))
      .mutation(async ({ input }) => {
        await logActivity('batch_tag', undefined, undefined, `Added tag "${input.tag}" to ${input.slugs.length} docs`);
        return batchAddTag(input.slugs, input.tag.toLowerCase().trim());
      }),

    bulkImport: adminProcedure
      .input(z.object({
        documents: z.array(z.object({
          title: z.string().min(1),
          category: z.string().min(1),
          content: z.string().min(1),
        })).min(1).max(100),
      }))
      .mutation(async ({ input }) => {
        const results = await bulkImportDocuments(input.documents);
        const successCount = results.filter(r => r.status === 'created').length;

        if (successCount > 0) {
          await notifyOwner({
            title: `Bulk Import: ${successCount} documents added`,
            content: `${successCount} new documents were imported successfully via bulk CSV upload.`,
          });
        }

        return results;
      }),

    // Document versions
    versions: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getDocumentVersions(input.slug);
      }),

    versionContent: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getDocumentVersionContent(input.id);
      }),
  }),

  // Reading Lists
  readingLists: router({
    list: publicProcedure
      .input(z.object({ visitorId: z.string() }))
      .query(async ({ input }) => {
        return getReadingLists(input.visitorId);
      }),

    create: publicProcedure
      .input(z.object({ visitorId: z.string(), name: z.string().min(1).max(200), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        return createReadingList(input.visitorId, input.name, input.description);
      }),

    items: publicProcedure
      .input(z.object({ listId: z.number() }))
      .query(async ({ input }) => {
        return getReadingListItems(input.listId);
      }),

    addItem: publicProcedure
      .input(z.object({ listId: z.number(), documentSlug: z.string() }))
      .mutation(async ({ input }) => {
        return addToReadingList(input.listId, input.documentSlug);
      }),

    removeItem: publicProcedure
      .input(z.object({ listId: z.number(), documentSlug: z.string() }))
      .mutation(async ({ input }) => {
        return removeFromReadingList(input.listId, input.documentSlug);
      }),

    delete: publicProcedure
      .input(z.object({ listId: z.number() }))
      .mutation(async ({ input }) => {
        return deleteReadingList(input.listId);
      }),
  }),

  // Search Analytics
  searchAnalytics: router({
    log: publicProcedure
      .input(z.object({ query: z.string(), resultCount: z.number(), visitorId: z.string().optional() }))
      .mutation(async ({ input }) => {
        await logSearchQuery(input.query, input.resultCount, input.visitorId);
        return { success: true };
      }),

    logClick: publicProcedure
      .input(z.object({ query: z.string(), clickedSlug: z.string(), visitorId: z.string().optional() }))
      .mutation(async ({ input }) => {
        await logSearchClick(input.query, input.clickedSlug, input.visitorId);
        return { success: true };
      }),

    popular: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional().default(20) }))
      .query(async ({ input }) => {
        return getPopularSearches(input.limit);
      }),

    summary: adminProcedure.query(async () => {
      return getSearchAnalyticsSummary();
    }),
  }),

  // Document Tags
  tags: router({
    all: publicProcedure.query(async () => {
      return getAllTags();
    }),

    forDocument: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getDocumentTags(input.slug);
      }),

    documentsByTag: publicProcedure
      .input(z.object({ tag: z.string() }))
      .query(async ({ input }) => {
        return getDocumentsByTag(input.tag);
      }),

    add: publicProcedure
      .input(z.object({ documentSlug: z.string(), tag: z.string().min(1).max(100) }))
      .mutation(async ({ input }) => {
        return addTag(input.documentSlug, input.tag.toLowerCase().trim());
      }),

    remove: publicProcedure
      .input(z.object({ documentSlug: z.string(), tag: z.string() }))
      .mutation(async ({ input }) => {
        return removeTag(input.documentSlug, input.tag);
      }),
  }),

  // Document Comments
  comments: router({
    list: publicProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input }) => {
        return getComments(input.documentSlug);
      }),

    add: publicProcedure
      .input(z.object({ documentSlug: z.string(), visitorId: z.string(), content: z.string().min(1).max(2000) }))
      .mutation(async ({ input }) => {
        await logActivity('comment', input.documentSlug, input.visitorId);
        return addComment(input.documentSlug, input.visitorId, input.content);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number(), visitorId: z.string() }))
      .mutation(async ({ input }) => {
        return deleteComment(input.id, input.visitorId);
      }),
  }),

  // Custom Categories
  customCategories: router({
    list: publicProcedure.query(async () => {
      return getCustomCategories();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createCustomCategory(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateCustomCategory(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteCustomCategory(input.id);
      }),
  }),

  // Announcements
  announcements: router({
    active: publicProcedure.query(async () => {
      return getActiveAnnouncements();
    }),

    all: adminProcedure.query(async () => {
      return getAllAnnouncements();
    }),

    create: adminProcedure
      .input(z.object({
        message: z.string().min(1).max(500),
        type: z.enum(['info', 'warning', 'success']).optional().default('info'),
      }))
      .mutation(async ({ input }) => {
        return createAnnouncement(input.message, input.type);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        message: z.string().optional(),
        type: z.enum(['info', 'warning', 'success']).optional(),
        active: z.number().min(0).max(1).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateAnnouncement(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteAnnouncement(input.id);
      }),
  }),

  // Activity Log
  activity: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(200).optional().default(100) }))
      .query(async ({ input }) => {
        return getActivityLog(input.limit);
      }),

    downloads: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(200).optional().default(50) }))
      .query(async ({ input }) => {
        return getDownloadHistory(input.limit);
      }),
  }),

  // Relevance Search
  relevanceSearch: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().min(1),
        category: z.string().optional(),
        locale: z.string().optional(),
        limit: z.number().min(1).max(50).optional().default(30),
      }))
      .query(async ({ input }) => {
        return searchWithRelevance(input.query, input);
      }),
  }),

  // Analytics Dashboard
  analytics: router({
    viewsOverTime: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional().default(30) }))
      .query(async ({ input }) => {
        return getViewsOverTime(input.days);
      }),

    topDocuments: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional().default(10) }))
      .query(async ({ input }) => {
        return getTopDocuments(input.limit);
      }),

    downloadTrends: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional().default(30) }))
      .query(async ({ input }) => {
        return getDownloadTrends(input.days);
      }),

    categoryDistribution: adminProcedure.query(async () => {
      return getCategoryDistribution();
    }),
  }),

  // Glossary
  glossary: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        return getGlossaryTerms(input.category);
      }),

    create: adminProcedure
      .input(z.object({
        term: z.string().min(1).max(200),
        definition: z.string().min(1),
        category: z.string().optional(),
        relatedTerms: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createGlossaryTerm(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        term: z.string().optional(),
        definition: z.string().optional(),
        category: z.string().optional(),
        relatedTerms: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateGlossaryTerm(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteGlossaryTerm(input.id);
      }),
  }),

  // Document Dependencies
  dependencies: router({
    prerequisites: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getDocumentDependencies(input.slug);
      }),

    dependents: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getDependentDocuments(input.slug);
      }),

    add: adminProcedure
      .input(z.object({ documentSlug: z.string(), prerequisiteSlug: z.string() }))
      .mutation(async ({ input }) => {
        return addDocumentDependency(input.documentSlug, input.prerequisiteSlug);
      }),

    remove: adminProcedure
      .input(z.object({ documentSlug: z.string(), prerequisiteSlug: z.string() }))
      .mutation(async ({ input }) => {
        return removeDocumentDependency(input.documentSlug, input.prerequisiteSlug);
      }),
  }),

  // Reading Goals & Progress
  readingGoals: router({
    get: publicProcedure
      .input(z.object({ visitorId: z.string() }))
      .query(async ({ input }) => {
        return getWeeklyProgress(input.visitorId);
      }),

    setGoal: publicProcedure
      .input(z.object({ visitorId: z.string(), weeklyTarget: z.number().min(1).max(50) }))
      .mutation(async ({ input }) => {
        return setReadingGoal(input.visitorId, input.weeklyTarget);
      }),

    recordCompletion: publicProcedure
      .input(z.object({ visitorId: z.string(), documentSlug: z.string() }))
      .mutation(async ({ input }) => {
        await recordReadingCompletion(input.visitorId, input.documentSlug);
        return { success: true };
      }),
  }),

  // Document Templates Gallery
  templates: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        return getDocumentTemplates(input.category);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getDocumentTemplateById(input.id);
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        category: z.string().min(1).max(100),
        content: z.string().min(1),
        icon: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createDocumentTemplate(input);
      }),

    use: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await incrementTemplateUsage(input.id);
        const template = await getDocumentTemplateById(input.id);
        return template;
      }),

     delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteDocumentTemplate(input.id);
      }),
  }),

  // ─── Audit Trail ─────────────────────────────────────────────────────────
  audit: router({
    log: adminProcedure
      .input(z.object({
        documentSlug: z.string(),
        action: z.string(),
        field: z.string().optional(),
        oldValue: z.string().optional(),
        newValue: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await logAuditEntry({ ...input, changedBy: ctx.user?.name || 'admin' });
        return { success: true };
      }),
    get: adminProcedure
      .input(z.object({ slug: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getAuditTrail(input.slug, input.limit);
      }),
  }),

  // ─── Analytics Export ────────────────────────────────────────────────────
  analyticsExport: router({
    csv: adminProcedure.query(async () => {
      return getAnalyticsExportData();
    }),
  }),

  // ─── AI Related Suggestions ──────────────────────────────────────────────
  aiSuggestions: router({
    related: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const doc = await getDocumentBySlug(input.slug);
        if (!doc) return [];
        const candidates = await getDocumentSummariesForAI(input.slug, 20);
        if (candidates.length === 0) return [];

        const candidateList = candidates.map(c => `- ${c.slug}: ${c.title} (${c.category})${c.summary ? ' - ' + c.summary.substring(0, 100) : ''}`).join('\n');

        try {
          const response = await invokeLLM({
            messages: [
              { role: 'system', content: 'You are a document recommendation engine. Given a source document and a list of candidates, return the top 5 most related document slugs as a JSON array of strings. Only return the JSON array, nothing else.' },
              { role: 'user', content: `Source document: "${doc.title}" (${doc.category})\nSummary: ${doc.summary || doc.content?.substring(0, 200) || ''}\n\nCandidates:\n${candidateList}\n\nReturn top 5 related slugs as JSON array:` },
            ],
          });
          const content = String(response.choices?.[0]?.message?.content || '[]');
          const slugs = JSON.parse(content.replace(/```json?\n?|```/g, '').trim());
          return Array.isArray(slugs) ? slugs.slice(0, 5) : [];
        } catch {
          return [];
        }
      }),
  }),

  // ==================== Batch 11: Bookmark Notes ====================
  bookmarkNotes: router({
    list: publicProcedure
      .input(z.object({ visitorId: z.string() }))
      .query(async ({ input }) => getBookmarkNotes(input.visitorId)),

    get: publicProcedure
      .input(z.object({ visitorId: z.string(), documentSlug: z.string() }))
      .query(async ({ input }) => getBookmarkNote(input.visitorId, input.documentSlug)),

    upsert: publicProcedure
      .input(z.object({ visitorId: z.string(), documentSlug: z.string(), note: z.string().min(1).max(2000) }))
      .mutation(async ({ input }) => upsertBookmarkNote(input.visitorId, input.documentSlug, input.note)),

    delete: publicProcedure
      .input(z.object({ visitorId: z.string(), documentSlug: z.string() }))
      .mutation(async ({ input }) => deleteBookmarkNote(input.visitorId, input.documentSlug)),
  }),

  // ==================== Batch 11: Share Links ====================
  shareLinks: router({
    create: adminProcedure
      .input(z.object({
        documentSlug: z.string(),
        expiresInHours: z.number().min(1).max(720).default(24),
      }))
      .mutation(async ({ input, ctx }) => {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
        const expiresAt = new Date(Date.now() + input.expiresInHours * 60 * 60 * 1000);
        return createShareLink(input.documentSlug, token, expiresAt, ctx.user?.name || 'admin');
      }),

    listForDoc: adminProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input }) => getShareLinksForDocument(input.documentSlug)),

    resolve: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const link = await getShareLinkByToken(input.token);
        if (!link) return { valid: false as const, slug: null, document: null, expiresAt: null };
        if (new Date(link.expiresAt) < new Date()) return { valid: false as const, slug: null, expired: true, document: null, expiresAt: link.expiresAt };
        await incrementShareLinkAccess(input.token);
        // Fetch the document so share page can render it directly (even draft/private)
        const doc = await getDocumentBySlug(link.documentSlug);
        return {
          valid: true as const,
          slug: link.documentSlug,
          expired: false,
          expiresAt: link.expiresAt,
          document: doc ? { title: doc.title, content: doc.content, category: doc.category, status: doc.status, readingTime: Math.ceil((doc.wordCount || 200) / 200) } : null,
        };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => deleteShareLink(input.id)),
  }),

  // ==================== Batch 11: Scheduled Publish ====================
  scheduledPublish: router({
    schedule: adminProcedure
      .input(z.object({
        documentSlug: z.string(),
        publishAt: z.string(), // ISO date string
      }))
      .mutation(async ({ input, ctx }) => {
        const publishDate = new Date(input.publishAt);
        if (publishDate <= new Date()) throw new Error('Publish date must be in the future');
        return schedulePublish(input.documentSlug, publishDate, ctx.user?.name || 'admin');
      }),

    list: adminProcedure
      .query(async () => getScheduledPublishes()),

    getForDoc: adminProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input }) => getScheduledPublishForDoc(input.documentSlug)),

    cancel: adminProcedure
      .input(z.object({ documentSlug: z.string() }))
      .mutation(async ({ input }) => cancelScheduledPublish(input.documentSlug)),

    process: adminProcedure
      .mutation(async () => processScheduledPublishes()),
  }),

  // ==================== Batch 11: Approval Queue ====================
  approvals: router({
    list: adminProcedure
      .query(async () => getDocumentsInReview()),

    approve: adminProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        await approveDocument(input.slug);
        await logAuditEntry({ documentSlug: input.slug, action: 'approved', field: 'status', oldValue: 'review', newValue: 'published', changedBy: 'admin' });
        await logActivity('approve', input.slug, undefined, 'Approved for publishing');
        return { success: true };
      }),

    reject: adminProcedure
      .input(z.object({ slug: z.string(), reason: z.string().optional() }))
      .mutation(async ({ input }) => {
        await rejectDocument(input.slug);
        await logAuditEntry({ documentSlug: input.slug, action: 'rejected', field: 'status', oldValue: 'review', newValue: 'draft', changedBy: 'admin' });
        await logActivity('reject', input.slug, undefined, input.reason || 'Rejected - returned to draft');
        return { success: true };
      }),
  }),

  // ==================== Batch 11: Bulk Tag Management ====================
  tagManagement: router({
    listWithCounts: adminProcedure
      .query(async () => getAllTagsWithCounts()),

    rename: adminProcedure
      .input(z.object({ oldTag: z.string(), newTag: z.string().min(1).max(100) }))
      .mutation(async ({ input }) => {
        const affected = await renameTag(input.oldTag, input.newTag.toLowerCase().trim());
        return { affected };
      }),

    merge: adminProcedure
      .input(z.object({ sourceTag: z.string(), targetTag: z.string() }))
      .mutation(async ({ input }) => {
        const merged = await mergeTags(input.sourceTag, input.targetTag);
        return { merged };
      }),

    deleteGlobally: adminProcedure
      .input(z.object({ tag: z.string() }))
      .mutation(async ({ input }) => {
        const deleted = await deleteTagGlobally(input.tag);
        return { deleted };
      }),
  }),

  // ==================== Batch 11: Import from URL ====================
  importFromUrl: router({
    import: adminProcedure
      .input(z.object({
        url: z.string().url(),
        title: z.string().min(1).max(500),
        category: z.string().min(1).max(100),
        locale: z.string().max(10).optional().default('en'),
      }))
      .mutation(async ({ input }) => {
        // Fetch content from URL
        const response = await fetch(input.url);
        if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status}`);
        const html = await response.text();
        // Simple HTML-to-text extraction (strip tags)
        const content = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        const slug = input.title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
        const result = await importDocumentFromContent(slug, input.title, input.category, content, input.locale);
        await logActivity('import_url', slug, undefined, `Imported from: ${input.url}`);
        return result;
      }),
  }),

  // ==================== Batch 12: Inline Comments ====================
  inlineComments: router({
    list: publicProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input }) => getInlineComments(input.documentSlug)),

    add: publicProcedure
      .input(z.object({
        documentSlug: z.string(),
        visitorId: z.string(),
        highlightText: z.string(),
        comment: z.string(),
        parentId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await addInlineComment(input);
        await fireWebhooks('comment.created', { documentSlug: input.documentSlug, comment: input.comment });
        return result;
      }),

    resolve: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => resolveInlineComment(input.id)),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => deleteInlineComment(input.id)),
  }),

  // ==================== Batch 12: Branding Settings ====================
  branding: router({
    get: publicProcedure.query(async () => getBrandingSettings()),

    update: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input }) => upsertBrandingSetting(input.key, input.value)),
  }),

  // ==================== Batch 12: Webhooks ====================
  webhooks: router({
    list: adminProcedure.query(async () => getWebhooks()),

    create: adminProcedure
      .input(z.object({
        url: z.string().url(),
        events: z.array(z.string()),
        secret: z.string().optional(),
      }))
      .mutation(async ({ input }) => createWebhook({ url: input.url, events: JSON.stringify(input.events), secret: input.secret })),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        url: z.string().url().optional(),
        events: z.array(z.string()).optional(),
        active: z.boolean().optional(),
        secret: z.string().optional(),
      }))
      .mutation(async ({ input }) => updateWebhook(input.id, {
        url: input.url,
        events: input.events ? JSON.stringify(input.events) : undefined,
        active: input.active !== undefined ? (input.active ? 1 : 0) : undefined,
        secret: input.secret,
      })),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => deleteWebhook(input.id)),
  }),

  // ==================== Batch 12: Recently Viewed ====================
  recentlyViewed: router({
    track: publicProcedure
      .input(z.object({ visitorId: z.string(), documentSlug: z.string() }))
      .mutation(async ({ input }) => {
        await trackRecentlyViewed(input.visitorId, input.documentSlug);
        return { success: true };
      }),

    list: publicProcedure
      .input(z.object({ visitorId: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => getRecentlyViewed(input.visitorId, input.limit)),
  }),

  // ==================== Batch 12: Document Export DOCX ====================
  documentExport: router({
    docx: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const doc = await getDocumentForExport(input.slug);
        if (!doc) return { error: 'Document not found' };
        // Return the document data for client-side DOCX generation
        return { title: doc.title, content: doc.content, category: doc.category };
      }),
  }),

  // ==================== Batch 12: Admin User Management ====================
  userManagement: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional(), search: z.string().optional() }))
      .query(async ({ input }) => getAllUsers(input)),

    updateRole: adminProcedure
      .input(z.object({ openId: z.string(), role: z.enum(['user', 'admin']) }))
      .mutation(async ({ input }) => updateUserRole(input.openId, input.role)),

    analytics: adminProcedure
      .query(async () => getVisitorAnalytics()),

    visitorAccess: adminProcedure
      .input(z.object({ visitorId: z.string() }))
      .query(async ({ input }) => getVisitorDocumentAccess(input.visitorId)),

    // Team invite system
    teamMembers: adminProcedure.query(async () => getTeamMembers()),

    invites: adminProcedure.query(async () => getTeamInvites()),

    createInvite: adminProcedure
      .input(z.object({
        email: z.string().email(),
        role: z.enum(['user', 'admin']),
        companyName: z.string().optional(),
        inviteeName: z.string().optional(),
        membershipTier: z.enum(['team', 'founding']).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const crypto = await import('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const userId = (ctx.user as any)?.id || 1;
        await createInviteToken({
          token,
          email: input.email,
          role: input.role,
          invitedBy: userId,
          expiresAt,
          companyName: input.companyName,
          inviteeName: input.inviteeName,
          membershipTier: input.membershipTier ?? 'team',
        });
        const inviteUrl = `${ctx.req.headers.origin || BRAND.activeAppUrl}/invite/${token}`;
        await notifyOwner({ title: 'New Team Invite Sent', content: `Invited ${input.email} as ${input.role}. Link: ${inviteUrl}` });
        return { success: true, token, inviteUrl };
      }),

    /** Morocco founding client: workspace + invite (no Stripe). */
    provisionFoundingClient: adminProcedure
      .input(z.object({
        email: z.string().email(),
        companyName: z.string().min(1),
        inviteeName: z.string().min(1),
        workspaceSlug: z.string().min(1).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const crypto = await import('crypto');
        const slug = (input.workspaceSlug || input.companyName)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 60);
        await createWorkspace({
          name: input.companyName,
          slug,
          description: `Founding client workspace — ${input.companyName}`,
          ownerId: ctx.user.openId,
        });
        const workspace = await getWorkspaceBySlug(slug);
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const userId = (ctx.user as any)?.id || 1;
        await createInviteToken({
          token,
          email: input.email,
          role: 'user',
          invitedBy: userId,
          expiresAt,
          companyName: input.companyName,
          inviteeName: input.inviteeName,
          membershipTier: 'founding',
          workspaceId: workspace?.id,
        });
        const inviteUrl = `${ctx.req.headers.origin || BRAND.activeAppUrl}/invite/${token}`;
        await notifyOwner({
          title: `Founding client provisioned: ${input.companyName}`,
          content: `${input.inviteeName} <${input.email}>\nInvite (30 days): ${inviteUrl}\nPayment: facture/virement — no Stripe required.`,
        });
        return { success: true, inviteUrl, workspaceSlug: slug };
      }),

    revokeInvite: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteInviteToken(input.id);
        return { success: true };
      }),

    changeRole: adminProcedure
      .input(z.object({ userId: z.number(), role: z.enum(['user', 'admin']) }))
      .mutation(async ({ input }) => {
        await updateUserRoleById(input.userId, input.role);
        return { success: true };
      }),
  }),

  // ==================== Batch 12: Bulk Archive/Restore ====================
  archive: router({
    archive: adminProcedure
      .input(z.object({ slugs: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        await archiveDocuments(input.slugs);
        for (const slug of input.slugs) {
          await logAuditEntry({ documentSlug: slug, action: 'archived' });
          await fireWebhooks('document.archived', { slug });
        }
        return { archived: input.slugs.length };
      }),

    restore: adminProcedure
      .input(z.object({ slugs: z.array(z.string()), status: z.enum(['draft', 'review', 'published']).optional() }))
      .mutation(async ({ input }) => {
        const targetStatus = input.status || 'draft';
        await batchUpdateStatus(input.slugs, targetStatus);
        for (const slug of input.slugs) {
          await logAuditEntry({ documentSlug: slug, action: 'restored', field: 'status', newValue: targetStatus });
        }
        return { restored: input.slugs.length };
      }),
  }),

  // ─── Document Feedback ──────────────────────────────────────────────────
  feedback: router({
    submit: publicProcedure
      .input(z.object({ documentSlug: z.string(), visitorId: z.string(), sentiment: z.enum(['positive', 'negative']), comment: z.string().optional() }))
      .mutation(async ({ input }) => submitFeedback(input)),

    get: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getFeedbackForDocument(input.slug)),

    mine: publicProcedure
      .input(z.object({ slug: z.string(), visitorId: z.string() }))
      .query(async ({ input }) => getMyFeedback(input.slug, input.visitorId)),
  }),

  // ─── Category Ordering ─────────────────────────────────────────────────
  categoryOrder: router({
    get: publicProcedure.query(async () => getCategoryOrdering()),

    save: adminProcedure
      .input(z.object({ categories: z.array(z.object({ name: z.string(), sortOrder: z.number() })) }))
      .mutation(async ({ input }) => saveCategoryOrdering(input.categories)),
  }),

  // ─── Document Duplication ──────────────────────────────────────────────
  duplicate: router({
    create: adminProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        const doc = await duplicateDocument(input.slug);
        await logAuditEntry({ documentSlug: doc?.slug || input.slug, action: 'duplicated', field: 'source', newValue: input.slug });
        return doc;
      }),
  }),

  // ─── Reading History ───────────────────────────────────────────────────
  readingHistory: router({
    list: publicProcedure
      .input(z.object({ visitorId: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => getReadingHistory(input.visitorId, input.limit)),
  }),

  // ─── Document Visibility / Access Control ──────────────────────────────
  visibility: router({
    set: adminProcedure
      .input(z.object({ slug: z.string(), visibility: z.enum(['public', 'private']) }))
      .mutation(async ({ input }) => {
        await logAuditEntry({ documentSlug: input.slug, action: 'visibility_changed', field: 'visibility', newValue: input.visibility });
        return setDocumentVisibility(input.slug, input.visibility);
      }),
    private: adminProcedure.query(async () => getPrivateDocuments()),
  }),

  // ─── Document Collections / Playlists ──────────────────────────────────
  collections: router({
    list: publicProcedure
      .input(z.object({ publishedOnly: z.boolean().optional() }).optional())
      .query(async ({ input }) => getCollections({ publishedOnly: input?.publishedOnly })),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const collection = await getCollectionById(input.id);
        if (!collection) return null;
        const items = await getCollectionItems(input.id);
        return { ...collection, items };
      }),
    create: adminProcedure
      .input(z.object({ name: z.string(), description: z.string().optional(), coverColor: z.string().optional() }))
      .mutation(async ({ input, ctx }) => createCollection({ ...input, createdBy: ctx.user.openId })),
    update: adminProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional(), coverColor: z.string().optional(), isPublished: z.number().optional() }))
      .mutation(async ({ input }) => updateCollection(input.id, input)),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => deleteCollection(input.id)),
    addItem: adminProcedure
      .input(z.object({ collectionId: z.number(), documentSlug: z.string() }))
      .mutation(async ({ input }) => addCollectionItem(input.collectionId, input.documentSlug)),
    removeItem: adminProcedure
      .input(z.object({ collectionId: z.number(), documentSlug: z.string() }))
      .mutation(async ({ input }) => removeCollectionItem(input.collectionId, input.documentSlug)),
  }),

  // ─── Bulk Import from JSON ─────────────────────────────────────────────
  importJSON: router({
    import: adminProcedure
      .input(z.object({ documents: z.array(z.object({ title: z.string(), category: z.string(), content: z.string(), status: z.string().optional(), locale: z.string().optional() })) }))
      .mutation(async ({ input }) => bulkImportFromJSON(input.documents)),
  }),

  // ─── Document Version Restore ──────────────────────────────────────────
  versionRestore: router({
    restore: adminProcedure
      .input(z.object({ slug: z.string(), versionId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await logAuditEntry({ documentSlug: input.slug, action: 'version_restored', field: 'versionId', newValue: String(input.versionId), changedBy: ctx.user.openId });
        return restoreDocumentVersion(input.slug, input.versionId, ctx.user.name || ctx.user.openId);
      }),
  }),

  // ─── Reading Heatmap ───────────────────────────────────────────────────
  heatmap: router({
    get: adminProcedure
      .input(z.object({ days: z.number().optional().default(30) }))
      .query(async ({ input }) => getReadingHeatmap(input.days)),
  }),

  // ─── Batch 15: Subscriptions & Notifications ──────────────────────────
  subscriptions: router({
    subscribe: protectedProcedure
      .input(z.object({ targetType: z.enum(['document', 'category']), targetValue: z.string() }))
      .mutation(async ({ input, ctx }) => subscribeToTarget(ctx.user.openId, input.targetType, input.targetValue)),
    unsubscribe: protectedProcedure
      .input(z.object({ targetType: z.enum(['document', 'category']), targetValue: z.string() }))
      .mutation(async ({ input, ctx }) => unsubscribeFromTarget(ctx.user.openId, input.targetType, input.targetValue)),
    list: protectedProcedure.query(async ({ ctx }) => getUserSubscriptions(ctx.user.openId)),
    notifications: protectedProcedure
      .input(z.object({ limit: z.number().optional().default(20) }))
      .query(async ({ input, ctx }) => getUserNotifications(ctx.user.openId, input.limit)),
    unreadCount: protectedProcedure.query(async ({ ctx }) => getUnreadNotificationCount(ctx.user.openId)),
    markRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => markNotificationRead(input.id, ctx.user.openId)),
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => markAllNotificationsRead(ctx.user.openId)),
  }),

  // ─── Batch 15: Reading Position (server-side) ─────────────────────────
  readingPosition: router({
    save: protectedProcedure
      .input(z.object({ documentSlug: z.string(), scrollPercent: z.number().min(0).max(100) }))
      .mutation(async ({ input, ctx }) => saveReadingPosition(ctx.user.openId, input.documentSlug, input.scrollPercent)),
    get: protectedProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input, ctx }) => getReadingPosition(ctx.user.openId, input.documentSlug)),
    all: protectedProcedure.query(async ({ ctx }) => getAllReadingPositions(ctx.user.openId)),
  }),

  // ─── Batch 15: Bulk Move Documents ─────────────────────────────────────
  bulkMove: router({
    move: adminProcedure
      .input(z.object({ slugs: z.array(z.string()), newCategory: z.string() }))
      .mutation(async ({ input }) => bulkMoveDocuments(input.slugs, input.newCategory)),
  }),

  // ─── Batch 15: Document Merge ──────────────────────────────────────────
  merge: router({
    merge: adminProcedure
      .input(z.object({ sourceSlug: z.string(), targetSlug: z.string() }))
      .mutation(async ({ input }) => mergeDocuments(input.sourceSlug, input.targetSlug)),
  }),

  // ─── Batch 15: Category Cover Images ───────────────────────────────────
  categoryCover: router({
    set: adminProcedure
      .input(z.object({ categoryName: z.string(), imageUrl: z.string() }))
      .mutation(async ({ input }) => setCategoryCoverImage(input.categoryName, input.imageUrl)),
    get: publicProcedure
      .input(z.object({ categoryName: z.string() }))
      .query(async ({ input }) => getCategoryCoverImage(input.categoryName)),
    all: publicProcedure.query(async () => getAllCategoryCoverImages()),
  }),

  // ─── Batch 15: Search History ──────────────────────────────────────────
  searchHistory: router({
    save: protectedProcedure
      .input(z.object({ query: z.string(), resultCount: z.number() }))
      .mutation(async ({ input, ctx }) => saveSearchHistory(ctx.user.openId, input.query, input.resultCount)),
    recent: protectedProcedure.query(async ({ ctx }) => getRecentSearches(ctx.user.openId)),
    clear: protectedProcedure.mutation(async ({ ctx }) => clearUserSearchHistory(ctx.user.openId)),
  }),

  // ─── Batch 15: Document Graph ──────────────────────────────────────────
  documentGraph: router({
    get: publicProcedure.query(async () => getKnowledgeGraphData()),
  }),

  // ─── Batch 15: Content Calendar ────────────────────────────────────────
  contentCalendar: router({
    events: adminProcedure
      .input(z.object({ startDate: z.string(), endDate: z.string() }))
      .query(async ({ input }) => getContentCalendarEvents(input.startDate, input.endDate)),
  }),

  // ─── Batch 16: AI Summarization ──────────────────────────────────────────
  aiSummary: router({
    generate: protectedProcedure
      .input(z.object({ slug: z.string(), language: z.string().default('en') }))
      .mutation(async ({ input }) => {
        const doc = await getDocumentBySlug(input.slug);
        if (!doc || !doc.content) return null;
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a technical writer. Generate a concise executive summary (3-5 sentences) of the following document. Focus on key points, actionable insights, and main takeaways.' },
            { role: 'user', content: `Title: ${doc.title}\n\nContent:\n${doc.content.slice(0, 8000)}` },
          ],
        });
        const summary = (response.choices?.[0]?.message?.content as string) || 'Unable to generate summary.';
        await saveAISummary(input.slug, summary, input.language);
        return { summary };
      }),
    get: publicProcedure
      .input(z.object({ slug: z.string(), language: z.string().default('en') }))
      .query(async ({ input }) => getAISummary(input.slug, input.language)),
  }),

  // ─── Batch 16: Document Translation ──────────────────────────────────────
  translation: router({
    generate: protectedProcedure
      .input(z.object({ slug: z.string(), language: z.string() }))
      .mutation(async ({ input }) => {
        const doc = await getDocumentBySlug(input.slug);
        if (!doc || !doc.content) return null;
        const langNames: Record<string, string> = { es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', ja: 'Japanese', ko: 'Korean', zh: 'Chinese', ar: 'Arabic', ru: 'Russian', nl: 'Dutch', hi: 'Hindi' };
        const targetLang = langNames[input.language] || input.language;
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: `You are a professional translator. Translate the following document title and content to ${targetLang}. Maintain all markdown formatting. Return JSON with keys "title" and "content".` },
            { role: 'user', content: `Title: ${doc.title}\n\nContent:\n${doc.content.slice(0, 10000)}` },
          ],
          response_format: { type: 'json_schema', json_schema: { name: 'translation', strict: true, schema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' } }, required: ['title', 'content'], additionalProperties: false } } },
        });
        const parsed = JSON.parse((response.choices?.[0]?.message?.content as string) || '{}');
        if (parsed.title && parsed.content) {
          await saveTranslation(input.slug, input.language, parsed.title, parsed.content);
          return { title: parsed.title, content: parsed.content };
        }
        return null;
      }),
    get: publicProcedure
      .input(z.object({ slug: z.string(), language: z.string() }))
      .query(async ({ input }) => getTranslation(input.slug, input.language)),
    list: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getTranslationsForDocument(input.slug)),
  }),

  // ─── Batch 16: User Preferences ──────────────────────────────────────────
  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => getUserPreferences(ctx.user.openId)),
    save: protectedProcedure
      .input(z.object({
        notificationFrequency: z.enum(['realtime', 'daily', 'weekly', 'off']).optional(),
        defaultSort: z.string().optional(),
        readingSpeedWpm: z.number().min(50).max(1000).optional(),
        preferredTheme: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => saveUserPreferences(ctx.user.openId, input)),
  }),

  // ─── Batch 16: Word Count Analytics ──────────────────────────────────────
  wordCountAnalytics: router({
    get: adminProcedure.query(async () => getWordCountAnalytics()),
  }),

  // ─── Batch 16: Broken Links Checker ──────────────────────────────────────
  brokenLinks: router({
    check: adminProcedure.query(async () => {
      const allDocs = await getAllDocumentLinks();
      const slugSet = new Set(allDocs.map(d => d.slug));
      const broken: { sourceSlug: string; sourceTitle: string; brokenLink: string; linkText: string }[] = [];
      for (const doc of allDocs) {
        if (!doc.content) continue;
        const linkRegex = /\[([^\]]+)\]\(\/docs\/([^)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(doc.content)) !== null) {
          const targetSlug = match[2];
          if (!slugSet.has(targetSlug)) {
            broken.push({ sourceSlug: doc.slug, sourceTitle: doc.title || doc.slug, brokenLink: `/docs/${targetSlug}`, linkText: match[1] });
          }
        }
      }
      return broken;
    }),
  }),

  // ─── Batch 16: Reading Streak Leaderboard ────────────────────────────────
  streakLeaderboard: router({
    get: publicProcedure.query(async () => getReadingStreakLeaderboard()),
    recordRead: protectedProcedure
      .input(z.object({ documentSlug: z.string() }))
      .mutation(async ({ input, ctx }) => {
        // Simple streak logic: increment streak if reading today
        const existing = (await getReadingStreakLeaderboard(100)).find(e => e.userOpenId === ctx.user.openId);
        const current = (existing?.currentStreak || 0) + 1;
        const longest = Math.max(current, existing?.longestStreak || 0);
        const total = (existing?.totalDocsRead || 0) + 1;
        await updateStreakLeaderboard(ctx.user.openId, ctx.user.name || 'Anonymous', current, longest, total);
        return { currentStreak: current, longestStreak: longest, totalDocsRead: total };
      }),
  }),

  // ─── Batch 16: Document Changelog Diff ───────────────────────────────────
  changelogDiff: router({
    get: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getDocumentVersionsForDiff(input.slug)),
  }),

  // ==================== Batch 17 ====================

  // ─── Saved Filters ───────────────────────────────────────────────────────
  savedFilters: router({
    list: protectedProcedure.query(async ({ ctx }) => getSavedFilters(ctx.user.openId)),
    create: protectedProcedure
      .input(z.object({ name: z.string(), filterConfig: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await createSavedFilter(ctx.user.openId, input.name, input.filterConfig);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteSavedFilter(input.id, ctx.user.openId);
        return { success: true };
      }),
  }),

  // ─── Document Quiz Generator ───────────────────────────────────────────
  quiz: router({
    get: publicProcedure
      .input(z.object({ documentId: z.number() }))
      .query(async ({ input }) => getDocumentQuiz(input.documentId)),
    generate: protectedProcedure
      .input(z.object({ documentId: z.number(), content: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a quiz generator. Generate exactly 5 multiple-choice comprehension questions based on the document content. Return valid JSON array of objects with fields: question (string), options (array of 4 strings), correctIndex (0-3 number).' },
            { role: 'user', content: `Generate 5 quiz questions for this document:\n\n${input.content.slice(0, 4000)}` },
          ],
          response_format: { type: 'json_schema', json_schema: { name: 'quiz', strict: true, schema: { type: 'object', properties: { questions: { type: 'array', items: { type: 'object', properties: { question: { type: 'string' }, options: { type: 'array', items: { type: 'string' } }, correctIndex: { type: 'integer' } }, required: ['question', 'options', 'correctIndex'], additionalProperties: false } } }, required: ['questions'], additionalProperties: false } } },
        });
        const content = response.choices?.[0]?.message?.content as string || '{"questions":[]}';
        const parsed = JSON.parse(content);
        const questions = JSON.stringify(parsed.questions || []);
        await saveDocumentQuiz(input.documentId, questions);
        return { questions: parsed.questions || [] };
      }),
  }),

  // ─── Review Reminders ───────────────────────────────────────────────────
  reviewReminders: router({
    list: adminProcedure.query(async () => getReviewReminders()),
    overdue: adminProcedure.query(async () => getOverdueReviews()),
    create: adminProcedure
      .input(z.object({ documentId: z.number(), reviewDate: z.string(), frequency: z.enum(['once', 'weekly', 'monthly', 'quarterly']) }))
      .mutation(async ({ input }) => {
        await createReviewReminder(input.documentId, new Date(input.reviewDate), input.frequency);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteReviewReminder(input.id);
        return { success: true };
      }),
  }),

  // ─── Document Annotations ───────────────────────────────────────────────
  annotations: router({
    list: protectedProcedure
      .input(z.object({ documentId: z.number() }))
      .query(async ({ ctx, input }) => getDocumentAnnotations(input.documentId, ctx.user.openId)),
    create: protectedProcedure
      .input(z.object({ documentId: z.number(), highlightText: z.string(), note: z.string().optional(), color: z.string().default('yellow'), startOffset: z.number(), endOffset: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await createAnnotation({ ...input, userOpenId: ctx.user.openId });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteAnnotation(input.id, ctx.user.openId);
        return { success: true };
      }),
    updateNote: protectedProcedure
      .input(z.object({ id: z.number(), note: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await updateAnnotationNote(input.id, ctx.user.openId, input.note);
        return { success: true };
      }),
  }),

  // ─── Bulk Tag Assignment ────────────────────────────────────────────────
  bulkTags: router({
    assign: adminProcedure
      .input(z.object({ documentSlugs: z.array(z.string()), tags: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        await bulkAssignTags(input.documentSlugs, input.tags);
        return { success: true };
      }),
    remove: adminProcedure
      .input(z.object({ documentSlugs: z.array(z.string()), tags: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        await bulkRemoveTags(input.documentSlugs, input.tags);
        return { success: true };
      }),
  }),

  // ─── Content Health Score ───────────────────────────────────────────────
  contentHealth: router({
    scores: adminProcedure.query(async () => getContentHealthScores()),
  }),

  // ─── Related by Tags ───────────────────────────────────────────────────
  relatedByTags: router({
    get: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getRelatedByTags(input.slug)),
  }),

  // ============ BATCH 18 PROCEDURES ============

  // ─── Custom Workflow Statuses ──────────────────────────────────────────
  workflow: router({
    statuses: adminProcedure.query(async () => getWorkflowStatuses()),
    createStatus: adminProcedure
      .input(z.object({ name: z.string(), color: z.string().optional(), sortOrder: z.number().optional() }))
      .mutation(async ({ input }) => { await createWorkflowStatus({ name: input.name, color: input.color || '#6b7280', sortOrder: input.sortOrder }); return { success: true }; }),
    deleteStatus: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => { await deleteWorkflowStatus(input.id); return { success: true }; }),
    transitions: adminProcedure.query(async () => getWorkflowTransitions()),
    addTransition: adminProcedure
      .input(z.object({ fromId: z.number(), toId: z.number() }))
      .mutation(async ({ input }) => { await setWorkflowTransition(input.fromId, input.toId); return { success: true }; }),
    removeTransition: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => { await removeWorkflowTransition(input.id); return { success: true }; }),
    getDocStatus: publicProcedure
      .input(z.object({ documentId: z.number() }))
      .query(async ({ input }) => getDocumentWorkflowStatus(input.documentId)),
    setDocStatus: adminProcedure
      .input(z.object({ documentId: z.number(), statusId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await setDocumentWorkflowStatus(input.documentId, input.statusId, ctx.user.openId);
        return { success: true };
      }),
  }),

  // ─── Analytics CSV Export (extended) ──────────────────────────────────
  analyticsExportFull: router({
    csv: adminProcedure.query(async () => getAnalyticsForExport()),
  }),

  // ─── Archival Policy ──────────────────────────────────────────────────
  archival: router({
    policy: adminProcedure.query(async () => getArchivalPolicy()),
    updatePolicy: adminProcedure
      .input(z.object({ daysWithoutViews: z.number().min(1), enabled: z.boolean() }))
      .mutation(async ({ input }) => { await upsertArchivalPolicy(input.daysWithoutViews, input.enabled); return { success: true }; }),
    staleDocs: adminProcedure
      .input(z.object({ days: z.number().min(1) }))
      .query(async ({ input }) => getStaleDocumentsForArchival(input.days)),
    archive: adminProcedure
      .input(z.object({ documentId: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input }) => { await archiveDocument(input.documentId, input.reason || 'manual'); return { success: true }; }),
    archived: adminProcedure.query(async () => getArchivedDocuments()),
    unarchive: adminProcedure
      .input(z.object({ archiveId: z.number() }))
      .mutation(async ({ input }) => { await unarchiveDocument(input.archiveId); return { success: true }; }),
  }),

  // ─── Quick Edit (inline) ──────────────────────────────────────────────
  quickEdit: router({
    update: adminProcedure
      .input(z.object({ documentId: z.number(), title: z.string().optional(), content: z.string().optional() }))
      .mutation(async ({ input }) => {
        await quickEditDocument(input.documentId, { title: input.title, content: input.content });
        return { success: true };
      }),
  }),

  // ─── Content Gap Analysis ─────────────────────────────────────────────
  contentGap: router({
    suggestions: adminProcedure.query(async () => getContentGapSuggestions()),
    analyze: adminProcedure.mutation(async () => {
      const categories = await getDocumentCategories();
      const docs = await getDocuments({ limit: 500, offset: 0 });
      const catSummary = categories.map(c => `${c.category} (${c.count} docs)`).join(', ');
      const docTitles = docs.documents.map(d => `[${d.category}] ${d.title}`).join('\n');
      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'You are a content strategist. Analyze the existing document categories and titles, then suggest 5-10 missing topics that would fill gaps in the knowledge base. Return JSON array with objects having: category, suggestedTitle, suggestedDescription.' },
          { role: 'user', content: `Categories: ${catSummary}\n\nExisting documents:\n${docTitles}\n\nSuggest missing topics as JSON array.` },
        ],
        response_format: { type: 'json_schema', json_schema: { name: 'content_gaps', strict: true, schema: { type: 'object', properties: { suggestions: { type: 'array', items: { type: 'object', properties: { category: { type: 'string' }, suggestedTitle: { type: 'string' }, suggestedDescription: { type: 'string' } }, required: ['category', 'suggestedTitle', 'suggestedDescription'], additionalProperties: false } } }, required: ['suggestions'], additionalProperties: false } } },
      });
      const parsed = JSON.parse(response.choices[0].message.content as string);
      if (parsed.suggestions?.length) await saveContentGapSuggestions(parsed.suggestions);
      return { count: parsed.suggestions?.length || 0 };
    }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(['accepted', 'dismissed']) }))
      .mutation(async ({ input }) => { await updateContentGapStatus(input.id, input.status); return { success: true }; }),
  }),

  // ─── Duplicate Content Detection ──────────────────────────────────────
  duplicates: router({
    pairs: adminProcedure.query(async () => getDuplicateContentPairs()),
    scan: adminProcedure.mutation(async () => {
      const docs = await getDocuments({ limit: 200, offset: 0 });
      const allDocs: { id: number; content: string }[] = [];
      for (const d of docs.documents) {
        const full = await getDocumentBySlug(d.slug);
        if (full?.content && full.content.length > 100) allDocs.push({ id: full.id, content: full.content });
      }
      let found = 0;
      for (let i = 0; i < allDocs.length && i < 100; i++) {
        for (let j = i + 1; j < allDocs.length && j < 100; j++) {
          const a = allDocs[i].content.toLowerCase().split(/\s+/);
          const b = allDocs[j].content.toLowerCase().split(/\s+/);
          const setA = new Set<string>(a);
          const setB = new Set<string>(b);
          const intersection = Array.from(setA).filter(w => setB.has(w)).length;
          const union = new Set<string>([...Array.from(setA), ...Array.from(setB)]).size;
          const similarity = union > 0 ? Math.round((intersection / union) * 100) : 0;
          if (similarity > 60) {
            await saveDuplicatePair(allDocs[i].id, allDocs[j].id, similarity);
            found++;
          }
        }
      }
      return { found };
    }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(['resolved', 'ignored']) }))
      .mutation(async ({ input }) => { await updateDuplicateStatus(input.id, input.status); return { success: true }; }),
  }),

  // ─── Activity Feed ────────────────────────────────────────────────────
  activityFeed: router({
    get: protectedProcedure.query(async ({ ctx }) => getActivityFeed(ctx.user.openId)),
    add: protectedProcedure
      .input(z.object({ action: z.string(), documentId: z.number().optional(), documentTitle: z.string().optional(), documentSlug: z.string().optional(), category: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        await addActivityFeedEntry({ userOpenId: ctx.user.openId, ...input });
        return { success: true };
      }),
  }),

  // ─── Document Embed Code ──────────────────────────────────────────────
  embed: router({
    generate: publicProcedure
      .input(z.object({ slug: z.string(), baseUrl: z.string() }))
      .query(async ({ input }) => generateEmbedCode(input.slug, input.baseUrl)),
  }),

  // ─── Multi-Document PDF Export ────────────────────────────────────────
  multiPdfExport: router({
    getDocContents: publicProcedure
      .input(z.object({ slugs: z.array(z.string()) }))
      .query(async ({ input }) => {
        const results = [];
        for (const slug of input.slugs) {
          const doc = await getDocumentBySlug(slug);
          if (doc) results.push({ title: doc.title, content: doc.content || '', category: doc.category });
        }
        return results;
      }),
  }),

  // ─── Section Reading Times ────────────────────────────────────────────
  sectionReadingTimes: router({
    get: publicProcedure
      .input(z.object({ slug: z.string(), wpm: z.number().optional() }))
      .query(async ({ input }) => {
        const doc = await getDocumentBySlug(input.slug);
        if (!doc || !doc.content) return [];
        const wpm = input.wpm || 200;
        const lines = doc.content.split('\n');
        const sections: { heading: string; level: number; wordCount: number; readingTime: string }[] = [];
        let currentHeading = '';
        let currentLevel = 0;
        let currentWords = 0;
        for (const line of lines) {
          const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
          if (headingMatch) {
            if (currentHeading) {
              const mins = Math.ceil(currentWords / wpm);
              sections.push({ heading: currentHeading, level: currentLevel, wordCount: currentWords, readingTime: mins < 1 ? '<1 min' : `${mins} min` });
            }
            currentHeading = headingMatch[2];
            currentLevel = headingMatch[1].length;
            currentWords = 0;
          } else {
            currentWords += line.split(/\s+/).filter(Boolean).length;
          }
        }
        if (currentHeading) {
          const mins = Math.ceil(currentWords / wpm);
          sections.push({ heading: currentHeading, level: currentLevel, wordCount: currentWords, readingTime: mins < 1 ? '<1 min' : `${mins} min` });
        }
        return sections;
      }),
  }),

  // ─── Batch 19 ──────────────────────────────────────────────────────

  snapshots: router({
    list: publicProcedure.input(z.object({ documentId: z.number() })).query(({ input }) => getDocumentSnapshots(input.documentId)),
    get: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getSnapshotById(input.id)),
    create: adminProcedure.input(z.object({ documentId: z.number(), name: z.string(), title: z.string(), content: z.string() })).mutation(({ input, ctx }) =>
      createDocumentSnapshot({ ...input, createdBy: ctx.user.openId })),
  }),

  recommendations: router({
    get: publicProcedure.input(z.object({ documentId: z.number(), limit: z.number().optional() })).query(({ input }) =>
      getSmartRecommendations(input.documentId, input.limit)),
    record: protectedProcedure.input(z.object({ docIdA: z.number(), docIdB: z.number() })).mutation(({ input }) =>
      recordReadingCorrelation(input.docIdA, input.docIdB)),
  }),

  quizResults: router({
    save: protectedProcedure.input(z.object({ documentId: z.number(), totalQuestions: z.number(), correctAnswers: z.number(), score: z.number() })).mutation(({ input, ctx }) =>
      saveQuizResult({ ...input, userOpenId: ctx.user.openId })),
    myResults: protectedProcedure.query(({ ctx }) => getUserQuizResults(ctx.user.openId)),
    forDocument: protectedProcedure.input(z.object({ documentId: z.number() })).query(({ input, ctx }) =>
      getDocumentQuizScore(ctx.user.openId, input.documentId)),
  }),

  seoMeta: router({
    get: publicProcedure.input(z.object({ documentId: z.number() })).query(({ input }) => getDocumentSeoMeta(input.documentId)),
    upsert: adminProcedure.input(z.object({
      documentId: z.number(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogTitle: z.string().optional(),
      ogDescription: z.string().optional(),
      ogImage: z.string().optional(),
    })).mutation(({ input }) => {
      const { documentId, ...data } = input;
      return upsertDocumentSeoMeta(documentId, data);
    }),
  }),

  notificationLog: router({
    list: adminProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(({ input }) =>
      getSystemNotificationLog(input?.limit)),
    retry: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => retrySystemNotification(input.id)),
    log: adminProcedure.input(z.object({ recipientOpenId: z.string().optional(), title: z.string(), content: z.string().optional(), channel: z.string().optional() })).mutation(({ input }) =>
      logSystemNotification(input)),
  }),

  adminDashboard: router({
    stats: adminProcedure.query(() => getAdminDashboardStats()),
  }),

  zipExport: router({
    getDocContents: publicProcedure.input(z.object({ slugs: z.array(z.string()) })).query(({ input }) =>
      getDocumentsForZipExport(input.slugs)),
  }),

  crossReferences: router({
    allTitles: publicProcedure.query(() => getAllDocumentTitlesAndSlugs()),
    forDocument: publicProcedure.input(z.object({ docId: z.number() })).query(async ({ input }) => getDocumentCrossReferences(input.docId)),
    all: adminProcedure.query(async () => getAllCrossReferences()),
    add: adminProcedure.input(z.object({ sourceDocId: z.number(), targetDocId: z.number(), relevanceScore: z.number(), reason: z.string().optional() })).mutation(async ({ input }) => addDocumentCrossReference(input.sourceDocId, input.targetDocId, input.relevanceScore, input.reason)),
    updateStatus: adminProcedure.input(z.object({ id: z.number(), status: z.string() })).mutation(async ({ input }) => updateCrossReferenceStatus(input.id, input.status)),
  }),

  userDashboard: router({
    stats: protectedProcedure.query(({ ctx }) => getUserPersonalStats(ctx.user.openId)),
  }),

  // ── Batch 20 ──

  adminPermissions: router({
    list: adminProcedure.query(() => getAllPermissions()),
    userPerms: adminProcedure.input(z.object({ userOpenId: z.string() })).query(({ input }) => getUserPermissions(input.userOpenId)),
    grant: adminProcedure.input(z.object({ userOpenId: z.string(), permission: z.string() })).mutation(({ input, ctx }) => grantPermission(input.userOpenId, input.permission, ctx.user.openId)),
    revoke: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => revokePermission(input.id)),
  }),

  approvalSla: router({
    getConfig: adminProcedure.query(() => getSlaConfig()),
    updateConfig: adminProcedure.input(z.object({ maxHoursInReview: z.number(), alertEnabled: z.boolean() })).mutation(({ input }) => upsertSlaConfig(input.maxHoursInReview, input.alertEnabled)),
    getOverdue: adminProcedure.query(async () => {
      const config = await getSlaConfig();
      if (!config) return [];
      return getDocsExceedingSla(config.maxHoursInReview);
    }),
  }),

  webhookEvents: router({
    list: adminProcedure.input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional()).query(({ input }) => getWebhookEventLogs(input?.limit, input?.offset)),
    retry: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const event = await retryWebhookEvent(input.id);
      return { success: !!event, event };
    }),
  }),

  accessRequests: router({
    create: protectedProcedure.input(z.object({ documentId: z.number(), reason: z.string().optional() })).mutation(({ input, ctx }) => createAccessRequest(input.documentId, ctx.user.openId, ctx.user.name || null, input.reason || null)),
    listAll: adminProcedure.input(z.object({ status: z.string().optional() }).optional()).query(({ input }) => getAccessRequests(input?.status)),
    review: adminProcedure.input(z.object({ id: z.number(), status: z.enum(['approved', 'denied']) })).mutation(({ input, ctx }) => reviewAccessRequest(input.id, input.status, ctx.user.openId)),
    myRequests: protectedProcedure.query(({ ctx }) => getUserAccessRequests(ctx.user.openId)),
  }),

  versionCompare: router({
    getVersion: publicProcedure.input(z.object({ versionId: z.number() })).query(({ input }) => getDocumentVersionById(input.versionId)),
  }),

  batchSummarize: router({
    getUnsummarized: adminProcedure.input(z.object({ limit: z.number().default(20) }).optional()).query(({ input }) => getDocumentsWithoutSummary(input?.limit)),
    summarize: adminProcedure.input(z.object({ slug: z.string(), title: z.string(), content: z.string() })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'You are a technical writer. Generate a concise executive summary (2-3 sentences) of the following document.' },
          { role: 'user', content: `Title: ${input.title}\n\nContent:\n${input.content?.substring(0, 4000) || ''}` },
        ],
      });
      const summary = (response.choices?.[0]?.message?.content as string) || 'Summary generation failed.';
      await saveAISummary(input.slug, summary);
      return { slug: input.slug, summary };
    }),
  }),

  onboarding: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      await initOnboardingTasks(ctx.user.openId);
      return getOnboardingProgress(ctx.user.openId);
    }),
    complete: protectedProcedure.input(z.object({ taskKey: z.string() })).mutation(({ input, ctx }) => completeOnboardingTask(ctx.user.openId, input.taskKey)),
  }),

  systemHealth: router({
    status: adminProcedure.query(async () => {
      const uptime = process.uptime();
      const memUsage = process.memoryUsage();
      return {
        uptime: Math.floor(uptime),
        memoryUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        memoryTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
        nodeVersion: process.version,
        platform: process.platform,
        dbConnected: true,
        timestamp: Date.now(),
      };
    }),
  }),

  citations: router({
    get: publicProcedure.input(z.object({ documentId: z.number(), style: z.string() })).query(({ input }) => getCachedCitation(input.documentId, input.style)),
    generate: publicProcedure.input(z.object({ documentId: z.number(), style: z.string(), title: z.string(), author: z.string().optional(), date: z.string().optional(), url: z.string().optional() })).mutation(async ({ input }) => {
      const cached = await getCachedCitation(input.documentId, input.style);
      if (cached) return cached;
      const year = input.date ? new Date(input.date).getFullYear() : new Date().getFullYear();
      const author = input.author || 'NexusAI Playbooks';
      let citation = '';
      if (input.style === 'apa') {
        citation = `${author}. (${year}). ${input.title}. NexusAI Playbooks.${input.url ? ` Retrieved from ${input.url}` : ''}`;
      } else if (input.style === 'mla') {
        citation = `${author}. "${input.title}." NexusAI Playbooks, ${year}.${input.url ? ` ${input.url}.` : ''}`;
      } else if (input.style === 'chicago') {
        citation = `${author}. "${input.title}." NexusAI Playbooks. ${year}.${input.url ? ` ${input.url}.` : ''}`;
      }
      await saveCitation(input.documentId, input.style, citation);
      return { id: 0, documentId: input.documentId, style: input.style, citation, createdAt: new Date() };
    }),
  }),

  // ===== BATCH 21 FEATURES =====
  batch21: router({
    // Feature 1: Comparative period analytics
    comparativePeriod: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional().default(30) }))
      .query(async ({ input }) => {
        return getComparativePeriodAnalytics(input.days);
      }),

    // Feature 4: Trending documents
    trending: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional().default(10) }))
      .query(async ({ input }) => {
        const result = await getTrendingDocuments(input.limit);
        return (result as any)?.[0] || [];
      }),

    // Feature 5: Quality audit
    runQualityAudit: adminProcedure.mutation(async () => {
      return runDocumentQualityAudit();
    }),
    qualityAudits: adminProcedure.query(async () => {
      return getLatestQualityAudits();
    }),

    // Feature 6: Reading sessions
    recordSession: publicProcedure
      .input(z.object({
        visitorId: z.string(),
        documentSlug: z.string(),
        durationSeconds: z.number().min(0),
        scrollDepthPercent: z.number().min(0).max(100),
        completed: z.number().min(0).max(1),
      }))
      .mutation(async ({ input }) => {
        await recordReadingSession(input);
        return { success: true };
      }),
    sessionAnalytics: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional().default(30) }))
      .query(async ({ input }) => {
        return getReadingSessionAnalytics(input.days);
      }),

    // Feature 7: Document freshness
    freshnessReport: adminProcedure.query(async () => {
      return getDocumentFreshnessReport();
    }),

    // Feature 8: Email digest config
    emailDigest: adminProcedure.query(async ({ ctx }) => {
      return getEmailDigestConfig(ctx.user.openId);
    }),
    updateEmailDigest: adminProcedure
      .input(z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'disabled']),
        includeMetrics: z.number().min(0).max(1),
        includeTopDocs: z.number().min(0).max(1),
        includeNewDocs: z.number().min(0).max(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await upsertEmailDigestConfig({ ownerId: ctx.user.openId, ...input });
        return { success: true };
      }),

    // Feature 9: Document media
    getMedia: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getDocumentMedia(input.slug);
      }),
    addMedia: adminProcedure
      .input(z.object({
        documentSlug: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await addDocumentMedia(input);
        return { success: true };
      }),
    removeMedia: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await removeDocumentMedia(input.id);
        return { success: true };
      }),

    // Feature 10: Public site stats
    publicStats: publicProcedure.query(async () => {
      return getPublicSiteStats();
    }),
  }),

  // ===== ADVANCED ANALYTICS =====
  advancedAnalytics: router({
    summary: adminProcedure.query(async () => {
      return getAnalyticsSummary();
    }),

    readingActivity: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional().default(30) }))
      .query(async ({ input }) => {
        return getReadingActivityOverTime(input.days);
      }),

    engagement: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional().default(30) }))
      .query(async ({ input }) => {
        return getEngagementOverTime(input.days);
      }),

    activityBreakdown: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional().default(30) }))
      .query(async ({ input }) => {
        return getActivityBreakdown(input.days);
      }),

    topByEngagement: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional().default(10) }))
      .query(async ({ input }) => {
        return getTopDocsByEngagement(input.limit);
      }),

    contentGrowth: adminProcedure
      .input(z.object({ days: z.number().min(1).max(180).optional().default(90) }))
      .query(async ({ input }) => {
        return getContentGrowthOverTime(input.days);
      }),

    hourlyHeatmap: adminProcedure
      .input(z.object({ days: z.number().min(1).max(90).optional().default(30) }))
      .query(async ({ input }) => {
        return getHourlyActivityHeatmap(input.days);
      }),
  }),

  // ===== Batch 22: Multi-tenant workspaces =====
  workspaces: router({
    list: adminProcedure.query(async () => listWorkspaces()),
    create: adminProcedure
      .input(z.object({ name: z.string().min(1), slug: z.string().min(1), description: z.string().optional() }))
      .mutation(async ({ ctx, input }) => createWorkspace({ ...input, ownerId: ctx.user.openId })),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getWorkspaceBySlug(input.slug)),
    members: adminProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => listWorkspaceMembers(input.workspaceId)),
    addMember: adminProcedure
      .input(z.object({ workspaceId: z.number(), userId: z.string(), role: z.string().optional() }))
      .mutation(async ({ input }) => addWorkspaceMember(input)),
    removeMember: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => removeWorkspaceMember(input.id)),
  }),

  // ===== Batch 22: Automated review scheduling =====
  reviewScheduling: router({
    list: adminProcedure.query(async () => listReviewSchedules()),
    upsert: adminProcedure
      .input(z.object({ documentSlug: z.string(), intervalDays: z.number().min(1), assigneeId: z.string().optional(), escalationDays: z.number().optional() }))
      .mutation(async ({ input }) => upsertReviewSchedule(input)),
    overdue: adminProcedure.query(async () => getOverdueScheduledReviews()),
    markComplete: adminProcedure
      .input(z.object({ documentSlug: z.string() }))
      .mutation(async ({ input }) => markReviewComplete(input.documentSlug)),
  }),

  // ===== Batch 22: Co-authoring activity =====
  coAuthoring: router({
    log: protectedProcedure
      .input(z.object({ documentSlug: z.string(), actionType: z.string(), fieldChanged: z.string().optional(), summary: z.string().optional() }))
      .mutation(async ({ ctx, input }) => logCoAuthorActivity({ ...input, userId: ctx.user.openId, userName: ctx.user.name || undefined })),
    activity: publicProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input }) => getCoAuthorActivity(input.documentSlug)),
    contributors: publicProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input }) => getDocumentContributors(input.documentSlug)),
  }),

  // ===== Batch 22: Content migration =====
  migration: router({
    list: adminProcedure.query(async () => listMigrationJobs()),
    create: adminProcedure
      .input(z.object({ name: z.string(), operationType: z.string(), filterCriteria: z.string(), targetValue: z.string() }))
      .mutation(async ({ ctx, input }) => createMigrationJob({ ...input, createdBy: ctx.user.openId })),
    execute: adminProcedure
      .input(z.object({ jobId: z.number() }))
      .mutation(async ({ input }) => executeMigrationJob(input.jobId)),
  }),

  // ===== Batch 22: Reading path recommendations =====
  readingPath: router({
    recommended: protectedProcedure.query(async ({ ctx }) => getReadingPathForUser(ctx.user.openId)),
  }),

  // ===== Batch 22: Sentiment analysis =====
  sentiment: router({
    analyze: adminProcedure
      .input(z.object({ documentSlug: z.string() }))
      .mutation(async ({ input }) => {
        // Get feedback for the document and compute sentiment
        const feedbackData = await getFeedbackForDocument(input.documentSlug);
        const commentsData = await getComments(input.documentSlug);
        let positive = feedbackData.positive || 0;
        let negative = feedbackData.negative || 0;
        let neutral = (feedbackData.comments || commentsData || []).length;
        const total = positive + negative + neutral || 1;
        const score = (positive - negative) / total;
        return upsertSentimentScore({ documentSlug: input.documentSlug, overallScore: score, positiveCount: positive, negativeCount: negative, neutralCount: neutral });
      }),
    dashboard: adminProcedure.query(async () => getSentimentScores()),
    forDocument: publicProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input }) => getSentimentForDocument(input.documentSlug)),
  }),

  // ===== Batch 22: Data retention policies =====
  retention: router({
    list: adminProcedure.query(async () => listRetentionPolicies()),
    upsert: adminProcedure
      .input(z.object({ category: z.string(), retentionDays: z.number().min(1), action: z.string() }))
      .mutation(async ({ input }) => upsertRetentionPolicy(input)),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => deleteRetentionPolicy(input.id)),
  }),

  // ===== Batch 22: Accessibility checker =====
  accessibility: router({
    check: adminProcedure
      .input(z.object({ documentSlug: z.string() }))
      .mutation(async ({ input }) => {
        const doc = await getDocumentBySlug(input.documentSlug);
        if (!doc) return { issueCount: 0, issues: [] };
        return runAccessibilityCheck(input.documentSlug, doc.content || "");
      }),
    issues: adminProcedure
      .input(z.object({ documentSlug: z.string() }))
      .query(async ({ input }) => getAccessibilityIssues(input.documentSlug)),
    allIssues: adminProcedure.query(async () => getAllAccessibilityIssues()),
    resolve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => resolveAccessibilityIssue(input.id)),
  }),

  // ===== Batch 22: Custom report builder =====
  customReports: router({
    list: adminProcedure.query(async ({ ctx }) => listCustomReports(ctx.user.openId)),
    create: adminProcedure
      .input(z.object({ name: z.string(), description: z.string().optional(), config: z.string() }))
      .mutation(async ({ ctx, input }) => createCustomReport({ ...input, createdBy: ctx.user.openId })),
    update: adminProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional(), config: z.string().optional() }))
      .mutation(async ({ input }) => updateCustomReport(input.id, input)),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => deleteCustomReport(input.id)),
    execute: adminProcedure
      .input(z.object({ config: z.string() }))
      .mutation(async ({ input }) => executeCustomReport(input.config)),
  }),

  // ===== Batch 22: API Playground (uses existing procedures) =====
  apiPlayground: router({
    listEndpoints: adminProcedure.query(async () => {
      return [
        { name: "documents.list", method: "GET", description: "List all documents with filters", params: "category, search, status, limit, offset" },
        { name: "documents.getBySlug", method: "GET", description: "Get document by slug", params: "slug" },
        { name: "documents.search", method: "GET", description: "Full-text search with relevance", params: "query, category, tags" },
        { name: "analytics.summary", method: "GET", description: "Analytics summary stats", params: "days" },
        { name: "tags.all", method: "GET", description: "List all tags with counts", params: "none" },
        { name: "glossary.list", method: "GET", description: "List glossary terms", params: "none" },
        { name: "workspaces.list", method: "GET", description: "List workspaces", params: "none" },
        { name: "sentiment.dashboard", method: "GET", description: "Sentiment scores for all docs", params: "none" },
      ];
    }),
    testEndpoint: adminProcedure
      .input(z.object({ endpoint: z.string(), params: z.string().optional() }))
      .mutation(async ({ input }) => {
        const start = Date.now();
        let result: any = null;
        try {
          switch (input.endpoint) {
            case "documents.list": result = await getDocuments({ limit: 10, offset: 0 }); break;
            case "analytics.summary": result = await getAnalyticsSummary(); break;
            case "tags.all": result = await getAllTagsWithCounts(); break;
            case "glossary.list": result = await getGlossaryTerms(); break;
            case "workspaces.list": result = await listWorkspaces(); break;
            case "sentiment.dashboard": result = await getSentimentScores(); break;
            default: result = { error: "Unknown endpoint" };
          }
        } catch (e: any) {
          result = { error: e.message };
        }
        return { result, responseTime: Date.now() - start };
      }),
  }),

  // ===== Batch 23: Push Notifications =====
  pushNotifications: router({
    list: protectedProcedure.query(async ({ ctx }) => getPushNotifications(ctx.user.openId)),
    unreadCount: protectedProcedure.query(async ({ ctx }) => getUnreadPushCount(ctx.user.openId)),
    create: adminProcedure.input(z.object({ userId: z.string(), type: z.string(), title: z.string(), message: z.string().optional(), link: z.string().optional() })).mutation(async ({ input }) => createPushNotification(input)),
    markRead: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => markPushNotificationRead(input.id)),
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => markAllPushRead(ctx.user.openId)),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => deletePushNotification(input.id)),
  }),

  // ===== Batch 23: Template Marketplace =====
  templateMarketplace: router({
    list: publicProcedure.input(z.object({ category: z.string().optional() }).optional()).query(async ({ input }) => listMarketplaceTemplates(input?.category)),
    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => getMarketplaceTemplate(input.id)),
    submit: protectedProcedure.input(z.object({ name: z.string(), description: z.string().optional(), content: z.string(), category: z.string().optional(), workspaceId: z.number().optional() })).mutation(async ({ ctx, input }) => submitMarketplaceTemplate({ ...input, authorId: ctx.user.openId, authorName: ctx.user.name || undefined })),
    rate: protectedProcedure.input(z.object({ templateId: z.number(), rating: z.number().min(1).max(5), review: z.string().optional() })).mutation(async ({ ctx, input }) => rateTemplate({ ...input, userId: ctx.user.openId })),
    ratings: publicProcedure.input(z.object({ templateId: z.number() })).query(async ({ input }) => getTemplateRatings(input.templateId)),
    use: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => incrementMarketplaceTemplateUsage(input.id)),
  }),

  /** Phase 1 — Gumroad checkout URLs (env-configured) */
  templateStore: router({
    checkout: publicProcedure.query(() => ({
      live: isTemplateStoreLive(),
      bundles: getTemplateCheckoutUrls(),
      templateClub: getTemplateClubCheckoutUrl(),
    })),
  }),

  // ===== Batch 23: Audit Compliance Reports =====
  complianceReports: router({
    list: adminProcedure.query(async () => listComplianceReports()),
    generate: adminProcedure.input(z.object({ title: z.string(), dateFrom: z.string(), dateTo: z.string() })).mutation(async ({ ctx, input }) => generateComplianceReport({ title: input.title, dateFrom: new Date(input.dateFrom), dateTo: new Date(input.dateTo), generatedBy: ctx.user.openId })),
    get: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => getComplianceReport(input.id)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => deleteComplianceReport(input.id)),
   }),
  // ===== Batch 24 =====
  changeLog: router({
    list: adminProcedure.input(z.object({ documentId: z.number().optional(), changeType: z.string().optional(), changedBy: z.string().optional(), days: z.number().optional() }).optional()).query(async ({ input }) => getDocumentChangeLog(input || {})),
    add: adminProcedure.input(z.object({ documentId: z.number(), documentTitle: z.string().optional(), changeType: z.string(), changeDescription: z.string().optional(), changedBy: z.string(), changedByName: z.string().optional(), metadata: z.string().optional() })).mutation(async ({ input }) => addDocumentChangeLog(input)),
  }),
  landingPreference: router({
    get: protectedProcedure.query(async ({ ctx }) => getUserLandingPreference(ctx.user.openId)),
    set: protectedProcedure.input(z.object({ landingPage: z.string() })).mutation(async ({ ctx, input }) => setUserLandingPreference(ctx.user.openId, input.landingPage)),
  }),
  bulkExport: router({
    create: adminProcedure.input(z.object({ format: z.string(), documentIds: z.array(z.number()) })).mutation(async ({ ctx, input }) => createBulkExportJob(ctx.user.openId, input.format, input.documentIds)),
    list: adminProcedure.query(async ({ ctx }) => getBulkExportJobs(ctx.user.openId)),
    update: adminProcedure.input(z.object({ id: z.number(), status: z.string().optional(), fileUrl: z.string().optional(), processedDocs: z.number().optional() })).mutation(async ({ input }) => updateBulkExportJob(input.id, input)),
  }),
  engagementScorecard: router({
    list: adminProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => getUserEngagementScorecards(input?.limit)),
    get: protectedProcedure.query(async ({ ctx }) => getUserEngagementScorecard(ctx.user.openId)),
    upsert: adminProcedure.input(z.object({ userOpenId: z.string(), userName: z.string().optional(), docsRead: z.number().optional(), quizzesTaken: z.number().optional(), commentsMade: z.number().optional(), streakDays: z.number().optional(), bookmarkCount: z.number().optional(), totalTimeMinutes: z.number().optional(), engagementScore: z.number().optional() })).mutation(async ({ input }) => upsertUserEngagementScorecard(input.userOpenId, input)),
  }),
  scheduledAnnouncements: router({
    list: adminProcedure.input(z.object({ status: z.string().optional() }).optional()).query(async ({ input }) => getScheduledAnnouncements(input?.status)),
    create: adminProcedure.input(z.object({ title: z.string(), content: z.string(), type: z.string(), scheduledFor: z.string(), expiresAt: z.string().optional() })).mutation(async ({ ctx, input }) => createScheduledAnnouncement({ ...input, scheduledFor: new Date(input.scheduledFor), expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined, createdBy: ctx.user.openId })),
    update: adminProcedure.input(z.object({ id: z.number(), title: z.string().optional(), content: z.string().optional(), type: z.string().optional(), scheduledFor: z.string().optional(), expiresAt: z.string().optional(), status: z.string().optional() })).mutation(async ({ input }) => {
      const updates: any = { ...input };
      delete updates.id;
      if (updates.scheduledFor) updates.scheduledFor = new Date(updates.scheduledFor);
      if (updates.expiresAt) updates.expiresAt = new Date(updates.expiresAt);
      return updateScheduledAnnouncement(input.id, updates);
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => deleteScheduledAnnouncement(input.id)),
  }),

  // Batch 25: Dashboard Widget Config
  dashboardWidgets: router({
    get: protectedProcedure.query(async ({ ctx }) => getDashboardWidgetConfig(ctx.user.openId)),
    save: protectedProcedure.input(z.object({
      widgets: z.array(z.object({ widgetKey: z.string(), position: z.number(), visible: z.number(), width: z.string() })),
    })).mutation(async ({ ctx, input }) => saveDashboardWidgetConfig(ctx.user.openId, input.widgets)),
  }),

  // Batch 25: Document Version Rollback
  versionRollback: router({
    rollback: adminProcedure.input(z.object({ slug: z.string(), versionId: z.number() })).mutation(async ({ ctx, input }) => rollbackDocumentVersion(input.slug, input.versionId, ctx.user.name || ctx.user.openId)),
  }),

  // Batch 25: Broken Link Scanner (external links)
  brokenLinkScanner: router({
    scan: adminProcedure.mutation(async () => {
      const { documents: docs } = await getDocuments({ status: 'all', limit: 1000 });
      const results: { documentId: number; documentTitle?: string; linkUrl: string; linkType: string; statusCode?: number; errorMessage?: string }[] = [];
      for (const doc of docs) {
        const urlRegex = /https?:\/\/[^\s)"'<>]+/g;
        const content = (doc as any).content || '';
        const urls = content.match(urlRegex) || [];
        for (const url of urls.slice(0, 10)) {
          try {
            const resp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
            if (!resp.ok) results.push({ documentId: doc.id, documentTitle: doc.title, linkUrl: url, linkType: 'external', statusCode: resp.status });
          } catch (e: any) {
            results.push({ documentId: doc.id, documentTitle: doc.title, linkUrl: url, linkType: 'external', errorMessage: e.message?.slice(0, 200) });
          }
        }
      }
      return saveBrokenLinkScanResults(results);
    }),
    list: adminProcedure.input(z.object({ linkType: z.string().optional(), limit: z.number().optional() }).optional()).query(async ({ input }) => getBrokenLinkScanResults(input ?? undefined)),
  }),

  // Batch 25: Saved Search Filters
  savedFiltersUser: router({
    list: protectedProcedure.query(async ({ ctx }) => getSavedSearchFilters(ctx.user.openId)),
    create: protectedProcedure.input(z.object({ name: z.string(), filterConfig: z.string() })).mutation(async ({ ctx, input }) => createSavedSearchFilter({ ...input, userOpenId: ctx.user.openId })),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => deleteSavedSearchFilter(input.id, ctx.user.openId)),
    use: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => incrementSavedFilterUsage(input.id)),
  }),

  // Batch 25: Reading Time Estimator
  readingEstimate: router({
    get: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => getDocumentReadingEstimate(input.slug)),
  }),

  // Batch 25: Duplicate Content Detector
  duplicateDetector: router({
    scan: adminProcedure.mutation(async () => {
      const { documents: docs } = await getDocuments({ status: 'all', limit: 500 });
      const results: { sourceDocId: number; sourceDocTitle?: string; targetDocId: number; targetDocTitle?: string; similarityScore: number }[] = [];
      for (let i = 0; i < docs.length; i++) {
        for (let j = i + 1; j < docs.length; j++) {
          const a = docs[i], b = docs[j];
          if (a.category === b.category && a.title && b.title) {
            const wordsA = new Set(a.title.toLowerCase().split(/\s+/));
            const wordsB = new Set(b.title.toLowerCase().split(/\s+/));
            const intersection = Array.from(wordsA).filter(w => wordsB.has(w)).length;
            const union = new Set(Array.from(wordsA).concat(Array.from(wordsB))).size;
            const score = union > 0 ? intersection / union : 0;
            if (score > 0.3) results.push({ sourceDocId: a.id, sourceDocTitle: a.title, targetDocId: b.id, targetDocTitle: b.title, similarityScore: Math.round(score * 100) / 100 });
          }
        }
      }
      return saveDuplicateContentResults(results);
    }),
    list: adminProcedure.input(z.object({ minScore: z.number().optional(), status: z.string().optional() }).optional()).query(async ({ input }) => getDuplicateContentResults(input ?? undefined)),
    updateStatus: adminProcedure.input(z.object({ id: z.number(), status: z.string() })).mutation(async ({ input }) => updateDuplicateScanStatus(input.id, input.status)),
  }),

  // Batch 25: User Document Collections
  userCollections: router({
    list: protectedProcedure.query(async ({ ctx }) => getUserDocCollections(ctx.user.openId)),
    create: protectedProcedure.input(z.object({ name: z.string(), description: z.string().optional(), isPublic: z.number().optional() })).mutation(async ({ ctx, input }) => createUserDocCollection({ ...input, userOpenId: ctx.user.openId })),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => deleteUserDocCollection(input.id, ctx.user.openId)),
    items: protectedProcedure.input(z.object({ collectionId: z.number() })).query(async ({ input }) => getUserDocCollectionItems(input.collectionId)),
    addDoc: protectedProcedure.input(z.object({ collectionId: z.number(), documentId: z.number() })).mutation(async ({ input }) => addDocToCollection(input.collectionId, input.documentId)),
    removeDoc: protectedProcedure.input(z.object({ collectionId: z.number(), documentId: z.number() })).mutation(async ({ input }) => removeDocFromCollection(input.collectionId, input.documentId)),
  }),

  // Batch 25: Performance Benchmarks
  benchmarks: router({
    list: adminProcedure.query(async () => getPerformanceBenchmarks()),
    save: adminProcedure.input(z.object({
      metricKey: z.string(), metricLabel: z.string(), baselineValue: z.number(), currentValue: z.number(),
      periodStart: z.string(), periodEnd: z.string(), trend: z.string(),
    })).mutation(async ({ input }) => savePerformanceBenchmark({ ...input, periodStart: new Date(input.periodStart), periodEnd: new Date(input.periodEnd) })),
  }),

  // Batch 25: Knowledge Graph
  knowledgeGraph: router({
    data: adminProcedure.query(async () => getKnowledgeGraphData()),
  }),
  // Lead capture (public endpoint for landing page)
  leads: router({
    submit: publicProcedure.input(z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      company: z.string().optional(),
      jobTitle: z.string().optional(),
      teamSize: z.string().optional(),
      source: z.string().optional(),
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmContent: z.string().optional(),
      referrer: z.string().optional(),
      message: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      // Rate limit: 3 submissions per IP per hour
      const ip = (ctx.req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || ctx.req.ip || 'unknown';
      const { allowed, resetMs } = leadSubmitLimiter.check(ip);
      if (!allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `Too many submissions. Please try again in ${Math.ceil(resetMs / 60000)} minutes.`,
        });
      }

      const id = await createLead(input);

      // Push to Close CRM and subscribe to nurture sequence (non-blocking)
      createCloseLead(input).then((leadId) => {
        if (leadId) {
          // Fetch the contact ID from the newly created lead, then subscribe
          const apiKey = process.env.CLOSE_CRM_API_KEY;
          if (apiKey) {
            const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
            fetch(`https://api.close.com/api/v1/lead/${leadId}/`, {
              headers: { Authorization: authHeader },
            })
              .then((res) => res.json())
              .then((lead: any) => {
                const contactId = lead?.contacts?.[0]?.id;
                if (contactId) {
                  subscribeToNurtureSequence(contactId, input.email).catch((err) =>
                    console.error("[Close CRM] Sequence subscription failed:", err)
                  );
                }
              })
              .catch((err) => console.error("[Close CRM] Failed to fetch lead for sequence:", err));
          }
        }
      }).catch((err) =>
        console.error("[Close CRM] Background lead creation failed:", err)
      );

      // Notify owner about new lead (non-blocking)
      notifyOwner({
        title: `New Lead: ${input.fullName}`,
        content: `Name: ${input.fullName}\nEmail: ${input.email}\nCompany: ${input.company || 'N/A'}\nJob Title: ${input.jobTitle || 'N/A'}\nTeam Size: ${input.teamSize || 'N/A'}\nMessage: ${input.message || 'None'}\nSource: ${input.source || 'direct'}`,
      }).catch((err) =>
        console.error("[Notification] Failed to notify owner of new lead:", err)
      );

      // Fire conversion event webhook for demo requests
      if (input.source === 'demo_request_form') {
        import('./webhookNotifications').then(({ notifyConversionEvent }) => {
          notifyConversionEvent({
            event: 'demo_requested',
            email: input.email,
            name: input.fullName,
            company: input.company || undefined,
            details: input.message || undefined,
          }).catch(() => {});
        }).catch(() => {});
      }

      return { success: true, id };
    }),
    list: adminProcedure.input(z.object({ status: z.string().optional() }).optional()).query(async ({ input }) => getLeads(input?.status)),
    stats: adminProcedure.query(async () => getLeadStats()),
    updateStatus: adminProcedure.input(z.object({ id: z.number(), status: z.string() })).mutation(async ({ input }) => {
      await updateLeadStatus(input.id, input.status);
      return { success: true };
    }),
    scores: adminProcedure.query(async () => {
      const { scoreLeadFromRecord } = await import('./leadScoring');
      const allLeads = await getLeads();
      return allLeads.map((l: any) => ({
        id: l.id,
        fullName: l.fullName,
        email: l.email,
        company: l.company,
        source: l.source,
        ...scoreLeadFromRecord(l),
      }));
    }),
    exportCsv: adminProcedure.query(async () => {
      const allLeads = await getLeads();
      const headers = ['ID', 'Full Name', 'Email', 'Company', 'Job Title', 'Team Size', 'Source', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'Referrer', 'Status', 'Message', 'Created At'];
      const rows = allLeads.map((l: any) => [
        l.id, l.fullName, l.email, l.company || '', l.jobTitle || '', l.teamSize || '',
        l.source || '', l.utmSource || '', l.utmMedium || '', l.utmCampaign || '',
        l.utmContent || '', l.referrer || '', l.status, l.message || '',
        l.createdAt ? new Date(l.createdAt).toISOString() : '',
      ]);
      const csvContent = [headers, ...rows].map(row => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      return { csv: csvContent, count: allLeads.length };
    }),
  }),

  // Stripe billing
  stripe: stripeRouter,

  // Trial system
  trials: router({
    startTrial: publicProcedure.input(z.object({
      email: z.string().email(),
      fullName: z.string().min(1),
      companyName: z.string().optional(),
      teamSize: z.string().optional(),
      useCase: z.string().optional(),
      planTier: z.enum(['starter', 'professional', 'enterprise']).optional(),
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      referrer: z.string().optional(),
    })).mutation(async ({ input }) => {
      const existing = await getTrialByEmail(input.email);
      if (existing && existing.status === 'active') {
        return { success: false, error: 'An active trial already exists for this email', trial: existing };
      }
      const trial = await createTrial(input);
      if (trial) {
        await recordNurtureEmail(trial.id, trial.email, 'welcome');
      }
      try {
        await createLead({
          email: input.email,
          fullName: input.fullName,
          company: input.companyName || undefined,
          teamSize: input.teamSize || undefined,
          source: 'trial_signup',
        });
      } catch {}
      // Notify owner of new trial
      try {
        const { notifyConversionEvent } = await import('./webhookNotifications');
        await notifyConversionEvent({
          event: 'trial_started',
          email: input.email,
          name: input.fullName,
          company: input.companyName || undefined,
          details: input.planTier ? `Plan: ${input.planTier}` : undefined,
        });
      } catch {}
      return { success: true, trial };
    }),

    checkStatus: publicProcedure.input(z.object({
      email: z.string().email(),
    })).query(async ({ input }) => {
      const trial = await getTrialByEmail(input.email);
      if (!trial) return { exists: false, trial: null };
      if (trial.status === 'active' && new Date(trial.expiresAt) < new Date()) {
        await updateTrialStatus(trial.id, 'expired');
        return { exists: true, trial: { ...trial, status: 'expired' as const } };
      }
      return { exists: true, trial };
    }),

    list: adminProcedure.input(z.object({
      status: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional()).query(async ({ input }) => {
      return getAllTrials(input || {});
    }),

    stats: adminProcedure.query(async () => {
      return getTrialStats();
    }),

    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(['active', 'expired', 'converted', 'cancelled']),
    })).mutation(async ({ input }) => {
      await updateTrialStatus(input.id, input.status);
      return { success: true };
    }),

    nurtureHistory: adminProcedure.input(z.object({
      trialId: z.number(),
    })).query(async ({ input }) => {
      return getNurtureEmailsForTrial(input.trialId);
    }),

    nurtureSequenceConfig: adminProcedure.query(async () => {
      const { getNurtureSequenceConfig } = await import('./nurtureSequence');
      return getNurtureSequenceConfig();
    }),

    processNurture: adminProcedure.mutation(async () => {
      const { processNurtureEmails } = await import('./nurtureSequence');
      return processNurtureEmails();
    }),
  }),

  // ─── Referral Program ─────────────────────────────────────────────────────
  referrals: router({
    getMyCode: protectedProcedure.query(async ({ ctx }) => {
      const existing = await getReferralsByUser(ctx.user.id);
      if (existing.length > 0) {
        return { code: existing[0].referralCode };
      }
      // Generate a unique code
      const code = `ARG-${ctx.user.id.toString(36).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
      await createReferral(ctx.user.id, code);
      return { code };
    }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
      return getReferralStats(ctx.user.id);
    }),

    getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
      return getReferralsByUser(ctx.user.id);
    }),

    validateCode: publicProcedure.input(z.object({ code: z.string() })).query(async ({ input }) => {
      const ref = await getReferralByCode(input.code);
      return { valid: !!ref, referrerName: ref ? 'NexusAI Playbooks User' : null };
    }),

    trackSignup: publicProcedure.input(z.object({ code: z.string(), email: z.string() })).mutation(async ({ input }) => {
      await markReferralSignedUp(input.code, input.email);
      return { success: true };
    }),
  }),

  // ─── Enterprise Onboarding Wizard (Persistent State) ───────────────────────────
  onboardingWizard: router({
    getState: protectedProcedure.query(async ({ ctx }) => {
      const state = await getWizardState(ctx.user.id);
      if (!state) return { currentStep: 0, completedSteps: [] as number[], formData: {} as Record<string, string | boolean>, isComplete: false };
      return {
        currentStep: state.currentStep,
        completedSteps: state.completedSteps as number[],
        formData: state.formData as Record<string, string | boolean>,
        isComplete: state.isComplete === 1,
      };
    }),

    saveState: protectedProcedure.input(z.object({
      currentStep: z.number(),
      completedSteps: z.array(z.number()),
      formData: z.record(z.string(), z.union([z.string(), z.boolean()])),
      isComplete: z.boolean().optional(),
    })).mutation(async ({ ctx, input }) => {
      await saveWizardState(ctx.user.id, {
        currentStep: input.currentStep,
        completedSteps: input.completedSteps,
        formData: input.formData as Record<string, string | boolean>,
        isComplete: input.isComplete,
      });
      return { success: true };
    }),
    resetState: adminProcedure.mutation(async ({ ctx }) => {
      await saveWizardState(ctx.user.id, {
        currentStep: 0,
        completedSteps: [],
        formData: {},
        isComplete: false,
      });
      return { success: true };
    }),
    sendInvites: adminProcedure.input(z.object({
      emails: z.array(z.string().email()),
      role: z.enum(['user', 'admin']),
    })).mutation(async ({ ctx, input }) => {
      const crypto = await import('crypto');
      const results: { email: string; token: string; inviteUrl: string }[] = [];
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const userId = ctx.user.id;
      for (const email of input.emails) {
        const token = crypto.randomBytes(32).toString('hex');
        await createInviteToken({ token, email, role: input.role, invitedBy: userId, expiresAt });
        const inviteUrl = `${ctx.req.headers.origin || BRAND.activeAppUrl}/invite/${token}`;
        results.push({ email, token, inviteUrl });
      }
      if (results.length > 0) {
        await notifyOwner({ title: 'Wizard: Team Invites Sent', content: `Invited ${results.length} users as ${input.role}: ${results.map(r => r.email).join(', ')}` });
      }
      return { success: true, invited: results.length };
    }),
  }),

  // ===== AI-Empowered Services =====
  ai: router({
    summarize: protectedProcedure
      .input(z.object({ text: z.string().min(10).max(50000), format: z.enum(['executive', 'bullets', 'actions']).optional().default('executive') }))
      .mutation(async ({ input }) => {
        const formatInstructions: Record<string, string> = {
          executive: 'Generate a concise executive summary in 3-4 sentences. Focus on key decisions, outcomes, and strategic implications.',
          bullets: 'Extract the 5-7 most important points as bullet items. Each bullet should be one clear sentence.',
          actions: 'Extract all action items, deadlines, and responsible parties. Format as a numbered list with owner and due date if mentioned.',
        };
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: `You are an expert document analyst. ${formatInstructions[input.format]}` },
            { role: 'user', content: input.text.substring(0, 12000) },
          ],
        });
        return { summary: (response.choices?.[0]?.message?.content as string) || 'Unable to generate summary.' };
      }),

    recommendations: protectedProcedure
      .input(z.object({ currentDocSlug: z.string().optional(), userInterests: z.array(z.string()).optional() }))
      .query(async ({ input }) => {
        const result = await getDocuments({ limit: 50, offset: 0, status: 'published' });
        const published = result.documents;
        const context = input.currentDocSlug
          ? `User is currently reading document with slug: ${input.currentDocSlug}`
          : input.userInterests?.length
            ? `User interests: ${input.userInterests.join(', ')}`
            : 'Recommend popular and recently updated documents';
        const docList = published.map((d: any) => `- ${d.title} [${d.category}] (${d.slug})`).join('\n');
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a content recommendation engine. Given the user context and available documents, recommend 5 most relevant documents. Return ONLY a JSON array of objects with fields: slug, reason (one sentence why recommended). No markdown formatting.' },
            { role: 'user', content: `${context}\n\nAvailable documents:\n${docList}` },
          ],
        });
        try {
          const content = (response.choices?.[0]?.message?.content as string) || '[]';
          const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          return { recommendations: JSON.parse(cleaned) as { slug: string; reason: string }[] };
        } catch {
          return { recommendations: published.slice(0, 5).map((d: any) => ({ slug: d.slug, reason: 'Popular document' })) };
        }
      }),

    write: protectedProcedure
      .input(z.object({
        prompt: z.string().min(5).max(5000),
        mode: z.enum(['draft', 'rewrite', 'expand', 'translate', 'simplify']),
        context: z.string().max(10000).optional(),
        targetLanguage: z.string().max(20).optional(),
      }))
      .mutation(async ({ input }) => {
        const modeInstructions: Record<string, string> = {
          draft: 'Generate a well-structured first draft based on the prompt. Use clear headings, professional tone, and actionable content.',
          rewrite: 'Rewrite the provided text to improve clarity, professionalism, and flow while preserving the original meaning.',
          expand: 'Expand the provided outline or brief into a detailed, comprehensive document with examples and explanations.',
          translate: `Translate the following text to ${input.targetLanguage || 'French'}. Maintain professional tone and formatting.`,
          simplify: 'Simplify the following text for a general audience. Remove jargon, use shorter sentences, and explain complex concepts.',
        };
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: `You are an expert content writer. ${modeInstructions[input.mode]}` },
            { role: 'user', content: input.context ? `Context:\n${input.context}\n\nRequest: ${input.prompt}` : input.prompt },
          ],
        });
        return { content: (response.choices?.[0]?.message?.content as string) || 'Unable to generate content.' };
      }),

    predictLeadScore: protectedProcedure
      .input(z.object({ leadData: z.object({ name: z.string(), email: z.string(), company: z.string().optional(), source: z.string().optional(), interactions: z.number().optional() }) }))
      .mutation(async ({ input }) => {
        const leadInfo = input.leadData;
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a lead scoring AI. Analyze the lead data and predict conversion probability. Return ONLY valid JSON with fields: score (0-100), probability (percentage string), factors (array of 3-5 scoring factors with name and impact: positive/negative/neutral), recommendation (one sentence next action). No markdown.' },
            { role: 'user', content: `Lead: ${leadInfo.name}\nEmail: ${leadInfo.email}\nCompany: ${leadInfo.company || 'Unknown'}\nSource: ${leadInfo.source || 'Direct'}\nInteractions: ${leadInfo.interactions || 0}` },
          ],
        });
        try {
          const content = (response.choices?.[0]?.message?.content as string) || '{}';
          const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned) as { score: number; probability: string; factors: { name: string; impact: string }[]; recommendation: string };
        } catch {
          return { score: 50, probability: '50%', factors: [{ name: 'Insufficient data', impact: 'neutral' }], recommendation: 'Gather more lead information.' };
        }
      }),

    semanticSearch: protectedProcedure
      .input(z.object({ query: z.string().min(2).max(500) }))
      .mutation(async ({ input }) => {
        const result = await getDocuments({ limit: 80, offset: 0, status: 'published' });
        const docSummaries = result.documents.map((d: any) => `[${d.slug}] ${d.title} - ${d.category}`).join('\n');
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a semantic search engine. Given a natural language query and document list, find the most relevant documents. Return ONLY valid JSON array of objects with: slug, title, relevance (0-100), explanation (one sentence why relevant). Max 8 results, sorted by relevance. No markdown.' },
            { role: 'user', content: `Query: "${input.query}"\n\nDocuments:\n${docSummaries}` },
          ],
        });
        try {
          const content = (response.choices?.[0]?.message?.content as string) || '[]';
          const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          return { results: JSON.parse(cleaned) as { slug: string; title: string; relevance: number; explanation: string }[], intent: input.query };
        } catch {
          return { results: [], intent: input.query };
        }
      }),

    autoTag: protectedProcedure
      .input(z.object({ text: z.string().min(10).max(20000), existingTags: z.array(z.string()).optional() }))
      .mutation(async ({ input }) => {
        const tagContext = input.existingTags?.length ? `\nExisting tag vocabulary: ${input.existingTags.join(', ')}` : '';
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: `You are a content classification AI. Analyze the text and suggest relevant tags/categories. Return ONLY valid JSON with fields: tags (array of objects with name and confidence 0-100), primaryCategory (string), suggestedTitle (string if not obvious). Prefer existing tags when relevant.${tagContext} No markdown.` },
            { role: 'user', content: input.text.substring(0, 8000) },
          ],
        });
        try {
          const content = (response.choices?.[0]?.message?.content as string) || '{}';
          const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned) as { tags: { name: string; confidence: number }[]; primaryCategory: string; suggestedTitle?: string };
        } catch {
          return { tags: [{ name: 'uncategorized', confidence: 50 }], primaryCategory: 'General' };
        }
      }),

    meetingNotes: protectedProcedure
      .input(z.object({ transcript: z.string().min(20).max(50000), meetingTitle: z.string().optional() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a meeting notes AI. Analyze the transcript and extract structured notes. Return ONLY valid JSON with: summary (2-3 sentences), attendees (array of names mentioned), decisions (array of strings), actionItems (array of objects with task, owner, deadline if mentioned), keyTopics (array of strings), followUps (array of strings). No markdown.' },
            { role: 'user', content: `${input.meetingTitle ? `Meeting: ${input.meetingTitle}\n\n` : ''}Transcript:\n${input.transcript.substring(0, 15000)}` },
          ],
        });
        try {
          const content = (response.choices?.[0]?.message?.content as string) || '{}';
          const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned) as { summary: string; attendees: string[]; decisions: string[]; actionItems: { task: string; owner?: string; deadline?: string }[]; keyTopics: string[]; followUps: string[] };
        } catch {
          return { summary: 'Unable to parse transcript.', attendees: [], decisions: [], actionItems: [], keyTopics: [], followUps: [] };
        }
      }),

    generateWorkflow: protectedProcedure
      .input(z.object({ description: z.string().min(10).max(2000) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a workflow automation architect. Convert the plain English description into a structured workflow. Return ONLY valid JSON with: name (workflow name), trigger (what starts it), steps (array of objects with id, action, description, condition if conditional), estimatedTime (string), complexity (low/medium/high). No markdown.' },
            { role: 'user', content: input.description },
          ],
        });
        try {
          const content = (response.choices?.[0]?.message?.content as string) || '{}';
          const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned) as { name: string; trigger: string; steps: { id: number; action: string; description: string; condition?: string }[]; estimatedTime: string; complexity: string };
        } catch {
          return { name: 'Custom Workflow', trigger: 'Manual', steps: [{ id: 1, action: 'Review', description: input.description }], estimatedTime: 'Unknown', complexity: 'medium' };
        }
      }),

    analyzeSentiment: protectedProcedure
      .input(z.object({ texts: z.array(z.string().max(2000)).min(1).max(20) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'You are a sentiment analysis AI. Analyze each text for sentiment. Return ONLY valid JSON with: results (array of objects with text (first 50 chars), sentiment (positive/negative/neutral/mixed), confidence (0-100), keywords (array of emotion words)), overall (object with positive/negative/neutral counts, averageConfidence). No markdown.' },
            { role: 'user', content: `Analyze sentiment for these ${input.texts.length} texts:\n${input.texts.map((t, i) => `${i + 1}. ${t}`).join('\n')}` },
          ],
        });
        try {
          const content = (response.choices?.[0]?.message?.content as string) || '{}';
          const cleaned = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned) as { results: { text: string; sentiment: string; confidence: number; keywords: string[] }[]; overall: { positive: number; negative: number; neutral: number; averageConfidence: number } };
        } catch {
          return { results: input.texts.map(t => ({ text: t.substring(0, 50), sentiment: 'neutral', confidence: 50, keywords: [] as string[] })), overall: { positive: 0, negative: 0, neutral: input.texts.length, averageConfidence: 50 } };
        }
      }),
    chat: protectedProcedure
      .input(z.object({ messages: z.array(z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string() })) }))
      .mutation(async ({ input }) => {
        const systemMessage = { role: 'system' as const, content: `You are the ${BRAND.productName} AI Assistant. You have deep knowledge of operational reference guides, business processes, luxury travel concierge services (${DEMO_WORKSPACES.travel.name}), and creative studio operations (${DEMO_WORKSPACES.creative.name}). Help users find information, summarize documents, draft content, and improve workflows. Be concise, professional, and actionable.` };
        const response = await invokeLLM({ messages: [systemMessage, ...input.messages] });
        const content = (response.choices?.[0]?.message?.content as string) || 'I apologize, I could not generate a response.';
        return { content };
      }),
  }),
  aiConfigManager: router({
    getAll: protectedProcedure.query(async () => {
      return getAllAiConfigs();
    }),
    getByService: protectedProcedure
      .input(z.object({ serviceName: z.string() }))
      .query(async ({ input }) => {
        return getAiConfigByService(input.serviceName);
      }),
    update: protectedProcedure
      .input(z.object({
        serviceName: z.string(),
        model: z.string().optional(),
        temperature: z.number().min(0).max(2).optional(),
        maxTokens: z.number().min(100).max(8000).optional(),
        systemPrompt: z.string().nullable().optional(),
        isEnabled: z.number().min(0).max(1).optional(),
      }))
      .mutation(async ({ input }) => {
        return upsertAiConfig(input);
      }),
  }),
  apiKeyManager: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getApiKeysByUser(ctx.user.id);
    }),
    listAll: protectedProcedure.query(async () => {
      return getAllApiKeys();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(200),
        scopes: z.array(z.string()).default([]),
        expiresInDays: z.number().min(1).max(365).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const crypto = await import('crypto');
        const rawKey = `arg_${crypto.randomBytes(24).toString('hex')}`;
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
        const keyPrefix = rawKey.substring(0, 10);
        const expiresAt = input.expiresInDays ? new Date(Date.now() + input.expiresInDays * 86400000) : null;
        const id = await createApiKey({ userId: ctx.user.id, name: input.name, keyHash, keyPrefix, scopes: input.scopes, expiresAt });
        return { id, key: rawKey, prefix: keyPrefix };
      }),
    revoke: protectedProcedure
      .input(z.object({ keyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await revokeApiKey(input.keyId, ctx.user.id);
        return { success: true };
      }),
  }),

  // ─── Team Workspace ─────────────────────────────────────────────────────
  teamWorkspace: router({
    getTasks: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getTeamTasks(input || undefined);
      }),
    createTask: protectedProcedure
      .input(z.object({ title: z.string(), description: z.string().optional(), assigneeId: z.number().optional(), priority: z.string().optional(), dueDate: z.date().optional() }))
      .mutation(async ({ ctx, input }) => {
        const id = await createTeamTask({ ...input, createdBy: ctx.user.id });
        return { id };
      }),
    updateTask: protectedProcedure
      .input(z.object({ id: z.number(), title: z.string().optional(), description: z.string().optional(), status: z.string().optional(), priority: z.string().optional(), assigneeId: z.number().optional(), dueDate: z.date().nullable().optional() }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateTeamTask(id, data);
        return { success: true };
      }),
    deleteTask: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteTeamTask(input.id);
        return { success: true };
      }),
    getDiscussions: protectedProcedure.query(async () => {
      return getTeamDiscussions();
    }),
    createDiscussion: protectedProcedure
      .input(z.object({ title: z.string(), content: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const id = await createTeamDiscussion({ ...input, authorId: ctx.user.id });
        return { id };
      }),
    getReplies: protectedProcedure
      .input(z.object({ discussionId: z.number() }))
      .query(async ({ input }) => {
        return getDiscussionReplies(input.discussionId);
      }),
    createReply: protectedProcedure
      .input(z.object({ discussionId: z.number(), content: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await createDiscussionReply({ ...input, authorId: ctx.user.id });
        return { success: true };
      }),
  }),

  // ─── Webhook Deliveries ─────────────────────────────────────────────────
  webhookDelivery: router({
    log: protectedProcedure
      .input(z.object({ webhookId: z.string(), eventType: z.string(), targetUrl: z.string(), requestPayload: z.any().optional(), responseStatus: z.number().optional(), responseBody: z.string().optional(), deliveryStatus: z.string() }))
      .mutation(async ({ input }) => {
        await logWebhookDelivery(input);
        return { success: true };
      }),
    list: protectedProcedure
      .input(z.object({ webhookId: z.string().optional(), limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getWebhookDeliveries(input || undefined);
      }),
    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), deliveryStatus: z.string(), responseStatus: z.number().optional(), responseBody: z.string().optional(), retryCount: z.number().optional() }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateWebhookDeliveryStatus(id, data);
        return { success: true };
      }),
  }),

  // ─── AI Usage Metering ──────────────────────────────────────────────────
  aiUsageMetering: router({
    log: protectedProcedure
      .input(z.object({ service: z.string(), tokensInput: z.number(), tokensOutput: z.number(), costEstimate: z.string(), model: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        await logAiUsage({ ...input, userId: ctx.user.id });
        return { success: true };
      }),
    myUsage: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return getAiUsageByUser(ctx.user.id, input || undefined);
      }),
    summary: adminProcedure.query(async () => {
      return getAiUsageSummary();
    }),
  }),

  // ─── Custom Fields ─────────────────────────────────────────────────────
  customFields: router({
    getDefinitions: protectedProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getCustomFieldDefinitions(input?.category);
      }),
    createField: adminProcedure
      .input(z.object({ name: z.string(), label: z.string(), fieldType: z.string(), options: z.any().optional(), category: z.string().optional(), isRequired: z.number().optional(), sortOrder: z.number().optional() }))
      .mutation(async ({ input }) => {
        const id = await createCustomField(input);
        return { id };
      }),
    deleteField: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteCustomField(input.id);
        return { success: true };
      }),
    getValues: protectedProcedure
      .input(z.object({ documentId: z.number() }))
      .query(async ({ input }) => {
        return getCustomFieldValues(input.documentId);
      }),
    setValue: protectedProcedure
      .input(z.object({ fieldId: z.number(), documentId: z.number(), value: z.string() }))
      .mutation(async ({ input }) => {
        await upsertCustomFieldValue(input);
        return { success: true };
      }),
  }),

  // ─── Workflow SLA ──────────────────────────────────────────────────────
  workflowSla: router({
    getConfigs: adminProcedure.query(async () => {
      return getWorkflowSlaConfigs();
    }),
    upsertConfig: adminProcedure
      .input(z.object({ stage: z.string(), maxHours: z.number(), alertEmail: z.string().optional(), isActive: z.number().optional() }))
      .mutation(async ({ input }) => {
        await upsertWorkflowSlaConfig(input);
        return { success: true };
      }),
    getBreaches: adminProcedure
      .input(z.object({ resolved: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        return getWorkflowSlaBreaches(input || undefined);
      }),
    createBreach: adminProcedure
      .input(z.object({ documentId: z.number(), stage: z.string(), enteredAt: z.date(), maxHours: z.number() }))
      .mutation(async ({ input }) => {
        await createSlaBreach(input);
        return { success: true };
      }),
    resolveBreach: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await resolveSlaBreach(input.id);
        return { success: true };
      }),
  }),
  // ========== Operational Tools (Batch 18) ==========
  checklist: router({
    getCompletions: publicProcedure
      .input(z.object({ visitorId: z.string(), persona: z.string(), date: z.string() }))
      .query(async ({ input }) => {
        return getChecklistCompletions(input.visitorId, input.persona, input.date);
      }),
    toggle: publicProcedure
      .input(z.object({ visitorId: z.string(), persona: z.string(), itemId: z.string(), date: z.string() }))
      .mutation(async ({ input }) => {
        return toggleChecklistItem(input.visitorId, input.persona, input.itemId, input.date);
      }),
  }),
  handover: router({
    list: publicProcedure
      .input(z.object({ persona: z.string(), date: z.string().optional() }))
      .query(async ({ input }) => {
        return getShiftHandovers(input.persona, input.date);
      }),
    create: publicProcedure
      .input(z.object({ visitorId: z.string(), persona: z.string(), priority: z.string(), category: z.string(), content: z.string(), shiftDate: z.string(), shiftType: z.string() }))
      .mutation(async ({ input }) => {
        return createShiftHandover(input);
      }),
    resolve: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return resolveShiftHandover(input.id);
      }),
  }),
  providerPartners: router({
    list: publicProcedure
      .input(z.object({ status: z.string().optional() }))
      .query(async ({ input }) => {
        return getProviders(input.status);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProviderById(input.id);
      }),
    create: adminProcedure
      .input(z.object({ name: z.string(), type: z.string(), tier: z.string(), location: z.string().optional(), contactName: z.string().optional(), contactPhone: z.string().optional(), contactEmail: z.string().optional(), roomCount: z.number().optional(), priceRange: z.string().optional(), specialties: z.string().optional(), notes: z.string().optional() }))
      .mutation(async ({ input }) => {
        return createProvider(input);
      }),
    update: adminProcedure
      .input(z.object({ id: z.number(), data: z.object({ name: z.string().optional(), type: z.string().optional(), tier: z.string().optional(), location: z.string().optional(), contactName: z.string().optional(), contactPhone: z.string().optional(), contactEmail: z.string().optional(), roomCount: z.number().optional(), priceRange: z.string().optional(), specialties: z.string().optional(), qualityScore: z.number().optional(), responseTimeAvg: z.number().optional(), notes: z.string().optional(), status: z.string().optional() }) }))
      .mutation(async ({ input }) => {
        return updateProvider(input.id, input.data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteProvider(input.id);
      }),
    qualityLogs: publicProcedure
      .input(z.object({ providerId: z.number() }))
      .query(async ({ input }) => {
        return getProviderQualityLogs(input.providerId);
      }),
    addQualityLog: publicProcedure
      .input(z.object({ providerId: z.number(), visitorId: z.string(), type: z.string(), content: z.string(), rating: z.number().optional() }))
      .mutation(async ({ input }) => {
        return addProviderQualityLog(input);
      }),
  }),
  // ========== Guest CRM (Batch 20) ==========
  guestCrm: router({
    list: publicProcedure
      .input(z.object({ persona: z.string().default('riad-routes') }))
      .query(async ({ input }) => {
        return getGuests(input.persona);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getGuestById(input.id);
      }),
    create: publicProcedure
      .input(z.object({ name: z.string(), email: z.string().optional(), phone: z.string().optional(), nationality: z.string().optional(), language: z.string().optional(), vipLevel: z.string().optional(), preferences: z.string().optional(), dietaryRestrictions: z.string().optional(), roomPreferences: z.string().optional(), specialOccasions: z.string().optional(), preferredProviderId: z.number().optional(), notes: z.string().optional(), persona: z.string().default('riad-routes') }))
      .mutation(async ({ input }) => {
        return createGuest(input);
      }),
    update: publicProcedure
      .input(z.object({ id: z.number(), data: z.object({ name: z.string().optional(), email: z.string().optional(), phone: z.string().optional(), nationality: z.string().optional(), language: z.string().optional(), vipLevel: z.string().optional(), preferences: z.string().optional(), dietaryRestrictions: z.string().optional(), roomPreferences: z.string().optional(), specialOccasions: z.string().optional(), totalStays: z.number().optional(), preferredProviderId: z.number().optional(), notes: z.string().optional() }) }))
      .mutation(async ({ input }) => {
        return updateGuest(input.id, input.data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteGuest(input.id);
      }),
  }),
  // ========== Incident Log (Batch 20) ==========
  incidents: router({
    list: publicProcedure
      .input(z.object({ persona: z.string().optional() }))
      .query(async ({ input }) => {
        return getIncidents(input.persona);
      }),
    create: publicProcedure
      .input(z.object({ title: z.string(), description: z.string(), severity: z.string().optional(), persona: z.string().default('riad-routes'), category: z.string().optional(), providerId: z.number().optional(), providerName: z.string().optional(), assignedTo: z.string().optional() }))
      .mutation(async ({ input }) => {
        return createIncident(input);
      }),
    update: publicProcedure
      .input(z.object({ id: z.number(), data: z.object({ title: z.string().optional(), description: z.string().optional(), severity: z.string().optional(), status: z.string().optional(), category: z.string().optional(), assignedTo: z.string().optional(), resolution: z.string().optional() }) }))
      .mutation(async ({ input }) => {
        return updateIncident(input.id, input.data);
      }),
    resolve: publicProcedure
      .input(z.object({ id: z.number(), resolution: z.string() }))
      .mutation(async ({ input }) => {
        return resolveIncident(input.id, input.resolution);
      }),
  }),
  // ========== Guest Feedback (Batch 20) ==========
  guestFeedback: router({
    list: publicProcedure
      .input(z.object({ persona: z.string().optional() }))
      .query(async ({ input }) => {
        return getGuestFeedbackList(input.persona);
      }),
    create: publicProcedure
      .input(z.object({ guestId: z.number().optional(), guestName: z.string(), providerId: z.number().optional(), providerName: z.string().optional(), rating: z.number(), category: z.string().optional(), comment: z.string().optional(), source: z.string().optional(), stayDate: z.date().optional(), persona: z.string().default('riad-routes') }))
      .mutation(async ({ input }) => {
        return createGuestFeedbackEntry(input);
      }),
  }),
});
export type AppRouter = typeof appRouter;
