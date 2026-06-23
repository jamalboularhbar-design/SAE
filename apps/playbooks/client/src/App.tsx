import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import InviteAcceptPage from "@/pages/InviteAcceptPage";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DocumentDetail from "./pages/DocumentDetail";
import AdminEditor from "./pages/AdminEditor";
import CategoryPage from "./pages/CategoryPage";
import CompareDocuments from "./pages/CompareDocuments";
import ReadingListsPage from "./pages/ReadingListsPage";
import TOCPage from "./pages/TOCPage";
import BulkImportPage from "./pages/BulkImportPage";
import DocumentTemplates from "./pages/DocumentTemplates";
import SearchAnalytics from "./pages/SearchAnalytics";
import TagsExplorer from "./pages/TagsExplorer";
import SearchResultsPage from "./pages/SearchResultsPage";
import EmbedDocument from "./pages/EmbedDocument";
import AdminActivityPage from "./pages/AdminActivityPage";
import AdminAnnouncementsPage from "./pages/AdminAnnouncementsPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminStaleDocsPage from "./pages/AdminStaleDocsPage";
import KeyboardShortcutsModal from "./components/KeyboardShortcutsModal";
import AnnouncementBanner from "./components/AnnouncementBanner";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import GlossaryPage from "./pages/GlossaryPage";
import TemplatesGalleryPage from "./pages/TemplatesGalleryPage";
import ReadingGoalsPage from "./pages/ReadingGoalsPage";
import ApiDocsPage from "./pages/ApiDocsPage";
import AdminKanbanPage from "./pages/AdminKanbanPage";
import AdminAuditTrailPage from "./pages/AdminAuditTrailPage";
import AdminApprovalsPage from "./pages/AdminApprovalsPage";
import AdminTagsPage from "./pages/AdminTagsPage";
import AdminImportUrlPage from "./pages/AdminImportUrlPage";
import AdminScheduledPage from "./pages/AdminScheduledPage";
import BookmarksPage from "./pages/BookmarksPage";
import ShareLinkPage from "./pages/ShareLinkPage";
import OnboardingTour from "./components/OnboardingTour";
import AdminBrandingPage from "./pages/AdminBrandingPage";
import AdminWebhooksPage from "./pages/AdminWebhooksPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminVisitorAnalyticsPage from "./pages/AdminVisitorAnalyticsPage";
import AdminArchivePage from "./pages/AdminArchivePage";
import AdminCategoryOrderPage from "./pages/AdminCategoryOrderPage";
import ReadingHistoryPage from "./pages/ReadingHistoryPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import AdminDuplicatePage from "./pages/AdminDuplicatePage";
import AdminBulkExportPage from "./pages/AdminBulkExportPage";
import CollectionsPage from "./pages/CollectionsPage";
import AdminImportJsonPage from "./pages/AdminImportJsonPage";
import AdminVisibilityPage from "./pages/AdminVisibilityPage";
import AdminHeatmapPage from "./pages/AdminHeatmapPage";
import BreadcrumbTrail from "./components/BreadcrumbTrail";
import ScrollToTop from "./components/ScrollToTop";
import MobileBottomNav from "./components/MobileBottomNav";
import NotificationsPage from "./pages/NotificationsPage";
import DocumentGraphPage from "./pages/DocumentGraphPage";
import AdminContentCalendarPage from "./pages/AdminContentCalendarPage";
import AdminBulkMovePage from "./pages/AdminBulkMovePage";
import AdminMergePage from "./pages/AdminMergePage";
import AdminCategoryCoversPage from "./pages/AdminCategoryCoversPage";
import PreferencesPage from "./pages/PreferencesPage";
import AdminWordCountPage from "./pages/AdminWordCountPage";
import AdminBrokenLinksPage from "./pages/AdminBrokenLinksPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import DiffViewerPage from "./pages/DiffViewerPage";
import AdminReviewRemindersPage from "./pages/AdminReviewRemindersPage";
import AdminBulkTagsPage from "./pages/AdminBulkTagsPage";
import AdminContentHealthPage from "./pages/AdminContentHealthPage";
import AdminWorkflowPage from "./pages/AdminWorkflowPage";
import AdminAnalyticsExportPage from "./pages/AdminAnalyticsExportPage";
import AdminArchivalPage from "./pages/AdminArchivalPage";
import AdminContentGapPage from "./pages/AdminContentGapPage";
import AdminDuplicatesPage from "./pages/AdminDuplicatesPage";
import MultiPdfExportPage from "./pages/MultiPdfExportPage";
import AdminUnifiedDashboardPage from "./pages/AdminUnifiedDashboardPage";
import AdminSeoPage from "./pages/AdminSeoPage";
import AdminNotificationCenterPage from "./pages/AdminNotificationCenterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import ZipExportPage from "./pages/ZipExportPage";
import AdminRoleDelegationPage from "./pages/AdminRoleDelegationPage";
import AdminSlaPage from "./pages/AdminSlaPage";
import AdminWebhookEventsPage from "./pages/AdminWebhookEventsPage";
import AdminAccessRequestsPage from "./pages/AdminAccessRequestsPage";
import AdminBatchSummarizePage from "./pages/AdminBatchSummarizePage";
import AdminSystemHealthPage from "./pages/AdminSystemHealthPage";
import VersionComparisonPage from "./pages/VersionComparisonPage";
import AdminAdvancedAnalyticsPage from "./pages/AdminAdvancedAnalyticsPage";
import AdminComparativeAnalyticsPage from "./pages/AdminComparativeAnalyticsPage";
import AdminQualityAuditPage from "./pages/AdminQualityAuditPage";
import AdminSessionAnalyticsPage from "./pages/AdminSessionAnalyticsPage";
import AdminFreshnessReportPage from "./pages/AdminFreshnessReportPage";
import AdminEmailDigestPage from "./pages/AdminEmailDigestPage";
import PublicStatsPage from "./pages/PublicStatsPage";
import AdminWorkspacesPage from "./pages/AdminWorkspacesPage";
import AdminReviewSchedulingPage from "./pages/AdminReviewSchedulingPage";
import AdminApiPlaygroundPage from "./pages/AdminApiPlaygroundPage";
import AdminContentMigrationPage from "./pages/AdminContentMigrationPage";
import AdminSentimentDashboardPage from "./pages/AdminSentimentDashboardPage";
import AdminRetentionPoliciesPage from "./pages/AdminRetentionPoliciesPage";
import AdminAccessibilityCheckerPage from "./pages/AdminAccessibilityCheckerPage";
import AdminCustomReportsPage from "./pages/AdminCustomReportsPage";
import ReadingPathPage from "./pages/ReadingPathPage";
import NotificationCenterPage from "./pages/NotificationCenterPage";
import TemplateMarketplacePage from "./pages/TemplateMarketplacePage";
import AdminComplianceReportPage from "./pages/AdminComplianceReportPage";
import AdminChangeLogPage from "./pages/AdminChangeLogPage";
import LandingPreferencePage from "./pages/LandingPreferencePage";
import AdminCrossReferencesPage from "./pages/AdminCrossReferencesPage";
import AdminEngagementScorecardsPage from "./pages/AdminEngagementScorecardsPage";
import AdminAnnouncementSchedulerPage from "./pages/AdminAnnouncementSchedulerPage";
import UserEngagementScorePage from "./pages/UserEngagementScorePage";
import AdminDashboardWidgetConfigPage from "./pages/AdminDashboardWidgetConfigPage";
import AdminBrokenLinkScannerPage from "./pages/AdminBrokenLinkScannerPage";
import AdminDuplicateDetectorPage from "./pages/AdminDuplicateDetectorPage";
import AdminKnowledgeGraphPage from "./pages/AdminKnowledgeGraphPage";
import AdminPerformanceBenchmarksPage from "./pages/AdminPerformanceBenchmarksPage";
import UserCollectionsPage from "./pages/UserCollectionsPage";
import LandingPage from "./pages/LandingPage";
import TemplatesBundlesPage from "./pages/TemplatesBundlesPage";
import AdminLeadsPage from "./pages/AdminLeadsPage";
import ROICalculatorPage from "./pages/ROICalculatorPage";
import BillingPage from "./pages/BillingPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminTeamPage from "./pages/AdminTeamPage";
import AdminQuickActionToolbar from "./components/AdminQuickActionToolbar";
import PricingPage from "./pages/PricingPage";
import StartTrialPage from "./pages/StartTrialPage";
import AdminTrialDashboardPage from "./pages/AdminTrialDashboardPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import ReferralPage from "./pages/ReferralPage";
import ChangelogPage from "./pages/ChangelogPage";
import AdminEmailTemplatesPage from "./pages/AdminEmailTemplatesPage";
import RequestDemoPage from "./pages/RequestDemoPage";
import AdminGrowthDashboardPage from "./pages/AdminGrowthDashboardPage";
import AdminBattleCardsPage from "./pages/AdminBattleCardsPage";
import SuccessMetricsPage from "./pages/SuccessMetricsPage";
import ResourcesPage from "./pages/ResourcesPage";
import AdminLeadScoresPage from "./pages/AdminLeadScoresPage";
import FAQPage from "./pages/FAQPage";
import AdminPerformanceDashboardPage from "./pages/AdminPerformanceDashboardPage";
import AdminSSOPage from "./pages/AdminSSOPage";
import StatusPage from "./pages/StatusPage";
import AdminDomainsPage from "./pages/AdminDomainsPage";
import AdminCompliancePage from "./pages/AdminCompliancePage";
import AdminPermissionsPage from "./pages/AdminPermissionsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import AdminOnboardingWizardPage from "./pages/AdminOnboardingWizardPage";
import WizardRedirectGuard from "./components/WizardRedirectGuard";
import AdminHomeKPIPage from "./pages/AdminHomeKPIPage";
import AdminDocApprovalPage from "./pages/AdminDocApprovalPage";
import AdminBulkUserImportPage from "./pages/AdminBulkUserImportPage";
import AdminScheduledReportsPage from "./pages/AdminScheduledReportsPage";
import AdminRateLimitingPage from "./pages/AdminRateLimitingPage";
import AdminWebhookBuilderPage from "./pages/AdminWebhookBuilderPage";
import AdminHealthMonitorPage from "./pages/AdminHealthMonitorPage";
import AISummarizerPage from "./pages/AISummarizerPage";
import AIWriterPage from "./pages/AIWriterPage";
import AIRecommendationsPage from "./pages/AIRecommendationsPage";
import AILeadScoringPage from "./pages/AILeadScoringPage";
import AISemanticSearchPage from "./pages/AISemanticSearchPage";
import AIAutoTagPage from "./pages/AIAutoTagPage";
import AIMeetingNotesPage from "./pages/AIMeetingNotesPage";
import AIWorkflowPage from "./pages/AIWorkflowPage";
import AISentimentPage from "./pages/AISentimentPage";
import AIConfigPage from "./pages/AIConfigPage";
import AIHubPage from "./pages/AIHubPage";
import AIChatPage from "./pages/AIChatPage";
import ClientPortalPage from "./pages/ClientPortalPage";
import TeamWorkspacePage from "./pages/TeamWorkspacePage";
import AITemplatesPage from "./pages/AITemplatesPage";
import UsageBillingPage from "./pages/UsageBillingPage";
import ApiKeyManagementPage from "./pages/ApiKeyManagementPage";
import NotificationPrefsPage from "./pages/NotificationPrefsPage";
import AdminCommandCenterPage from "./pages/AdminCommandCenterPage";
import GlobalCommandPalette from "./components/GlobalCommandPalette";
import DocumentVersionRestorePage from "./pages/DocumentVersionRestorePage";
import ExportCenterPage from "./pages/ExportCenterPage";
import AdminImpersonationPage from "./pages/AdminImpersonationPage";
import CustomFieldsPage from "./pages/CustomFieldsPage";
import WorkflowSlaPage from "./pages/WorkflowSlaPage";
import PlatformChangelogPage from "./pages/PlatformChangelogPage";
import PersonaDocsBrowserPage from "./pages/PersonaDocsBrowserPage";
import DailyChecklistPage from "./pages/DailyChecklistPage";
import ShiftHandoverPage from "./pages/ShiftHandoverPage";
import EscalationMatrixPage from "./pages/EscalationMatrixPage";
import SeasonalCalendarPage from "./pages/SeasonalCalendarPage";
import OperationalKPIPage from "./pages/OperationalKPIPage";
import ProviderDirectoryPage from "./pages/ProviderDirectoryPage";
import ProviderQualityPage from "./pages/ProviderQualityPage";
import GuestAnticipationPage from "./pages/GuestAnticipationPage";
import ProviderSLAPage from "./pages/ProviderSLAPage";
import ProviderCommissionsPage from "./pages/ProviderCommissionsPage";
import ProviderOnboardingPage from "./pages/ProviderOnboardingPage";
import WhatsAppTemplatesPage from "./pages/WhatsAppTemplatesPage";
import ProviderComparePage from "./pages/ProviderComparePage";
import GuestMatchingPage from "./pages/GuestMatchingPage";
import PreArrivalChecklistPage from "./pages/PreArrivalChecklistPage";
import RevenueAnalyticsPage from "./pages/RevenueAnalyticsPage";
import IncidentLogPage from "./pages/IncidentLogPage";
import TeamDirectoryPage from "./pages/TeamDirectoryPage";
import GuestCrmPage from "./pages/GuestCrmPage";
import GuestFeedbackPage from "./pages/GuestFeedbackPage";
import BookingPipelinePage from "./pages/BookingPipelinePage";
import PricingMatrixPage from "./pages/PricingMatrixPage";
import OpsDashboardPage from "./pages/OpsDashboardPage";
import IncidentLogDbPage from "./pages/IncidentLogDbPage";
import ProviderCommHubPage from "./pages/ProviderCommHubPage";
import QualityAuditPage from "./pages/QualityAuditPage";
import GuestPreferenceInferencePage from "./pages/GuestPreferenceInferencePage";
import ProviderScoreboardPage from "./pages/ProviderScoreboardPage";
import AlertSystemPage from "./pages/AlertSystemPage";
import GuestLifecycleTimelinePage from "./pages/GuestLifecycleTimelinePage";
import ProviderRecommendationPage from "./pages/ProviderRecommendationPage";
import PricingOptimizerPage from "./pages/PricingOptimizerPage";
import RevenueForecastPage from "./pages/RevenueForecastPage";
import CompetitorIntelPage from "./pages/CompetitorIntelPage";
import OperationalInsightsPage from "./pages/OperationalInsightsPage";

function Router() {
  const [location] = useLocation();

  // Nexus OS is a separate Express mount at /os — never handle it inside the Playbooks SPA.
  useEffect(() => {
    if (location === "/os" || location.startsWith("/os/")) {
      window.location.replace(location === "/os" ? "/os/" : location);
    }
  }, [location]);

  return (
    <Switch>
      <Route path={"/login"} component={LoginPage} />
      <Route path={"/invite/:token"} component={InviteAcceptPage} />
      <Route path={"/"} component={Home} />
      <Route path={"/docs/:slug"} component={DocumentDetail} />
      <Route path={"/category/:category"} component={CategoryPage} />
      <Route path={"/compare"} component={CompareDocuments} />
      <Route path={"/toc"} component={TOCPage} />
      <Route path={"/lists"} component={ReadingListsPage} />
      <Route path={"/templates"} component={DocumentTemplates} />
      <Route path={"/tags"} component={TagsExplorer} />
      <Route path={"/search"} component={SearchResultsPage} />
      <Route path={"/embed/:slug"} component={EmbedDocument} />
      <Route path={"/admin/editor"} component={AdminEditor} />
      <Route path={"/admin/import"} component={BulkImportPage} />
      <Route path={"/admin/analytics"} component={SearchAnalytics} />
      <Route path={"/admin/activity"} component={AdminActivityPage} />
      <Route path={"/admin/announcements"} component={AdminAnnouncementsPage} />
      <Route path={"/admin/categories"} component={AdminCategoriesPage} />
      <Route path={"/admin/stale"} component={AdminStaleDocsPage} />
      <Route path={"/admin/dashboard"} component={AdminDashboardPage} />
      <Route path={"/glossary"} component={GlossaryPage} />
      <Route path={"/templates/gallery"} component={TemplatesGalleryPage} />
      <Route path={"/reading-goals"} component={ReadingGoalsPage} />
      <Route path={"/api/docs"} component={ApiDocsPage} />
      <Route path={"/admin/kanban"} component={AdminKanbanPage} />
      <Route path={"/admin/audit"} component={AdminAuditTrailPage} />
      <Route path={"/admin/approvals"} component={AdminApprovalsPage} />
      <Route path={"/admin/tags"} component={AdminTagsPage} />
      <Route path={"/admin/import-url"} component={AdminImportUrlPage} />
      <Route path={"/admin/scheduled"} component={AdminScheduledPage} />
      <Route path={"/bookmarks"} component={BookmarksPage} />
      <Route path={"/share/:token"} component={ShareLinkPage} />
      <Route path={"/admin/branding"} component={AdminBrandingPage} />
      <Route path={"/admin/sso"} component={AdminSSOPage} />
      <Route path={"/status"} component={StatusPage} />
      <Route path={"/admin/domains"} component={AdminDomainsPage} />
      <Route path={"/admin/compliance"} component={AdminCompliancePage} />
      <Route path={"/admin/permissions"} component={AdminPermissionsPage} />
      <Route path={"/integrations"} component={IntegrationsPage} />
      <Route path={"/admin/onboarding-wizard"} component={AdminOnboardingWizardPage} />
      <Route path={"/admin/webhooks"} component={AdminWebhooksPage} />
      <Route path={"/admin/users"} component={AdminUsersPage} />
      <Route path={"/admin/visitors"} component={AdminVisitorAnalyticsPage} />
      <Route path={"/admin/archive"} component={AdminArchivePage} />
      <Route path={"/admin/category-order"} component={AdminCategoryOrderPage} />
      <Route path={"/admin/feedback"} component={AdminFeedbackPage} />
      <Route path={"/admin/duplicate"} component={AdminDuplicatePage} />
      <Route path={"/admin/bulk-export"} component={AdminBulkExportPage} />
      <Route path={"/reading-history"} component={ReadingHistoryPage} />
      <Route path={"/history"} component={ReadingHistoryPage} />
      <Route path={"/collections"} component={CollectionsPage} />
      <Route path={"/admin/import-json"} component={AdminImportJsonPage} />
      <Route path={"/admin/visibility"} component={AdminVisibilityPage} />
      <Route path={"/admin/heatmap"} component={AdminHeatmapPage} />
      <Route path={"/notifications"} component={NotificationsPage} />
      <Route path={"/graph"} component={DocumentGraphPage} />
      <Route path={"/admin/calendar"} component={AdminContentCalendarPage} />
      <Route path={"/admin/bulk-move"} component={AdminBulkMovePage} />
      <Route path={"/admin/merge"} component={AdminMergePage} />
      <Route path={"/admin/category-covers"} component={AdminCategoryCoversPage} />
      <Route path={"/preferences"} component={PreferencesPage} />
      <Route path={"/admin/word-count"} component={AdminWordCountPage} />
      <Route path={"/admin/broken-links"} component={AdminBrokenLinksPage} />
      <Route path={"/leaderboard"} component={LeaderboardPage} />
      <Route path={"/diff/:slug"} component={DiffViewerPage} />
      <Route path={"/admin/review-reminders"} component={AdminReviewRemindersPage} />
      <Route path={"/admin/bulk-tags"} component={AdminBulkTagsPage} />
      <Route path={"/admin/content-health"} component={AdminContentHealthPage} />
      <Route path={"/admin/workflow"} component={AdminWorkflowPage} />
      <Route path={"/admin/analytics-export"} component={AdminAnalyticsExportPage} />
      <Route path={"/admin/archival"} component={AdminArchivalPage} />
      <Route path={"/admin/content-gap"} component={AdminContentGapPage} />
      <Route path={"/admin/duplicates"} component={AdminDuplicatesPage} />
      <Route path={"/export"} component={MultiPdfExportPage} />
      <Route path={"/admin/unified"} component={AdminUnifiedDashboardPage} />
      <Route path={"/admin/seo"} component={AdminSeoPage} />
      <Route path={"/admin/notification-center"} component={AdminNotificationCenterPage} />
      <Route path={"/my-dashboard"} component={UserDashboardPage} />
      <Route path={"/bulk-export"} component={ZipExportPage} />
      <Route path={"/admin/role-delegation"} component={AdminRoleDelegationPage} />
      <Route path={"/admin/sla"} component={AdminSlaPage} />
      <Route path={"/admin/webhook-events"} component={AdminWebhookEventsPage} />
      <Route path={"/admin/access-requests"} component={AdminAccessRequestsPage} />
      <Route path={"/admin/batch-summarize"} component={AdminBatchSummarizePage} />
      <Route path={"/admin/system-health"} component={AdminSystemHealthPage} />
      <Route path={"/doc/:slug/compare"} component={VersionComparisonPage} />
      <Route path={"/admin/advanced-analytics"} component={AdminAdvancedAnalyticsPage} />
      <Route path={"/admin/comparative-analytics"} component={AdminComparativeAnalyticsPage} />
      <Route path={"/admin/quality-audit"} component={AdminQualityAuditPage} />
      <Route path={"/admin/session-analytics"} component={AdminSessionAnalyticsPage} />
      <Route path={"/admin/freshness"} component={AdminFreshnessReportPage} />
      <Route path={"/admin/email-digest"} component={AdminEmailDigestPage} />
      <Route path={"/stats"} component={PublicStatsPage} />
      <Route path={"/admin/workspaces"} component={AdminWorkspacesPage} />
      <Route path={"/admin/review-scheduling"} component={AdminReviewSchedulingPage} />
      <Route path={"/admin/api-playground"} component={AdminApiPlaygroundPage} />
      <Route path={"/admin/content-migration"} component={AdminContentMigrationPage} />
      <Route path={"/admin/sentiment"} component={AdminSentimentDashboardPage} />
      <Route path={"/admin/retention"} component={AdminRetentionPoliciesPage} />
      <Route path={"/admin/accessibility"} component={AdminAccessibilityCheckerPage} />
      <Route path={"/admin/custom-reports"} component={AdminCustomReportsPage} />
      <Route path={"/reading-path"} component={ReadingPathPage} />
      <Route path={"/notifications"} component={NotificationCenterPage} />
      <Route path={"/templates/marketplace"} component={TemplateMarketplacePage} />
      <Route path={"/admin/compliance-reports"} component={AdminComplianceReportPage} />
      <Route path={"/admin/change-log"} component={AdminChangeLogPage} />
      <Route path={"/landing-preference"} component={LandingPreferencePage} />
      <Route path={"/admin/cross-references"} component={AdminCrossReferencesPage} />
      <Route path={"/admin/engagement-scorecards"} component={AdminEngagementScorecardsPage} />
      <Route path={"/admin/announcement-scheduler"} component={AdminAnnouncementSchedulerPage} />
      <Route path={"/my-engagement"} component={UserEngagementScorePage} />
      <Route path={"/admin/widget-config"} component={AdminDashboardWidgetConfigPage} />
      <Route path={"/admin/broken-link-scanner"} component={AdminBrokenLinkScannerPage} />
      <Route path={"/admin/duplicate-detector"} component={AdminDuplicateDetectorPage} />
      <Route path={"/admin/knowledge-graph"} component={AdminKnowledgeGraphPage} />
      <Route path={"/admin/benchmarks"} component={AdminPerformanceBenchmarksPage} />
      <Route path={"/my-collections"} component={UserCollectionsPage} />
      <Route path="/product" component={LandingPage} />
      <Route path="/product/templates" component={TemplatesBundlesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/start-trial" component={StartTrialPage} />
      <Route path="/admin/leads" component={AdminLeadsPage} />
      <Route path="/roi" component={ROICalculatorPage} />
      <Route path="/billing" component={BillingPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/admin/trials" component={AdminTrialDashboardPage} />
      <Route path="/case-studies" component={CaseStudiesPage} />
      <Route path="/referral" component={ReferralPage} />
      <Route path="/changelog" component={ChangelogPage} />
      <Route path="/admin/email-templates" component={AdminEmailTemplatesPage} />
      <Route path="/request-demo" component={RequestDemoPage} />
      <Route path="/admin/growth" component={AdminGrowthDashboardPage} />
      <Route path="/admin/battle-cards" component={AdminBattleCardsPage} />
      <Route path="/success-metrics" component={SuccessMetricsPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/admin/performance" component={AdminPerformanceDashboardPage} />
      <Route path="/admin/lead-scores" component={AdminLeadScoresPage} />
      <Route path="/admin/team" component={AdminTeamPage} />
      <Route path="/admin/home" component={AdminHomeKPIPage} />
      <Route path="/admin/doc-approvals" component={AdminDocApprovalPage} />
      <Route path="/admin/bulk-user-import" component={AdminBulkUserImportPage} />
      <Route path="/admin/reports/scheduled" component={AdminScheduledReportsPage} />
      <Route path="/admin/rate-limits" component={AdminRateLimitingPage} />
      <Route path="/admin/webhooks/builder" component={AdminWebhookBuilderPage} />
      <Route path="/admin/health" component={AdminHealthMonitorPage} />
      <Route path="/ai/summarize" component={AISummarizerPage} />
      <Route path="/ai/writer" component={AIWriterPage} />
      <Route path="/ai/recommendations" component={AIRecommendationsPage} />
      <Route path="/ai/lead-scoring" component={AILeadScoringPage} />
      <Route path="/ai/search" component={AISemanticSearchPage} />
      <Route path="/ai/auto-tag" component={AIAutoTagPage} />
      <Route path="/ai/meeting-notes" component={AIMeetingNotesPage} />
      <Route path="/ai/workflows" component={AIWorkflowPage} />
      <Route path="/ai/sentiment" component={AISentimentPage} />
      <Route path="/admin/ai-config" component={AIConfigPage} />
      <Route path="/ai" component={AIHubPage} />
      <Route path="/ai/chat" component={AIChatPage} />
      <Route path="/ai/templates" component={AITemplatesPage} />
      <Route path="/portal" component={ClientPortalPage} />
      <Route path="/team" component={TeamWorkspacePage} />
      <Route path="/settings/usage" component={UsageBillingPage} />
      <Route path="/settings/api-keys" component={ApiKeyManagementPage} />
      <Route path="/settings/notifications" component={NotificationPrefsPage} />
      <Route path="/admin/command-center" component={AdminCommandCenterPage} />
      <Route path="/admin/version-restore" component={DocumentVersionRestorePage} />
      <Route path="/admin/export-center" component={ExportCenterPage} />
      <Route path="/admin/impersonation" component={AdminImpersonationPage} />
      <Route path="/admin/custom-fields" component={CustomFieldsPage} />
      <Route path="/admin/workflow-sla" component={WorkflowSlaPage} />
      <Route path="/platform/changelog" component={PlatformChangelogPage} />
      <Route path="/persona/:persona" component={PersonaDocsBrowserPage} />
      <Route path="/daily-checklist" component={DailyChecklistPage} />
      <Route path="/shift-handover" component={ShiftHandoverPage} />
      <Route path="/escalation-matrix" component={EscalationMatrixPage} />
      <Route path="/seasonal-calendar" component={SeasonalCalendarPage} />
      <Route path="/operational-kpis" component={OperationalKPIPage} />
      <Route path="/provider-directory" component={ProviderDirectoryPage} />
      <Route path="/provider-quality/:id" component={ProviderQualityPage} />
      <Route path="/guest-anticipation" component={GuestAnticipationPage} />
      <Route path="/provider-sla" component={ProviderSLAPage} />
      <Route path="/provider-commissions" component={ProviderCommissionsPage} />
      <Route path="/provider-onboarding" component={ProviderOnboardingPage} />
      <Route path="/whatsapp-templates" component={WhatsAppTemplatesPage} />
      <Route path="/provider-compare" component={ProviderComparePage} />
      <Route path="/guest-matching" component={GuestMatchingPage} />
      <Route path="/pre-arrival-checklist" component={PreArrivalChecklistPage} />
      <Route path="/revenue-analytics" component={RevenueAnalyticsPage} />
      <Route path="/incident-log" component={IncidentLogPage} />
      <Route path="/team-directory" component={TeamDirectoryPage} />
      <Route path="/guest-crm" component={GuestCrmPage} />
      <Route path="/guest-feedback" component={GuestFeedbackPage} />
      <Route path="/booking-pipeline" component={BookingPipelinePage} />
      <Route path="/pricing-matrix" component={PricingMatrixPage} />
      <Route path="/ops-dashboard" component={OpsDashboardPage} />
      <Route path="/incidents" component={IncidentLogDbPage} />
      <Route path="/provider-comm-hub" component={ProviderCommHubPage} />
      <Route path="/quality-audit" component={QualityAuditPage} />
      <Route path="/guest-preference-inference" component={GuestPreferenceInferencePage} />
      <Route path="/provider-scoreboard" component={ProviderScoreboardPage} />
      <Route path="/alert-system" component={AlertSystemPage} />
      <Route path="/guest-lifecycle" component={GuestLifecycleTimelinePage} />
      <Route path="/provider-recommendations" component={ProviderRecommendationPage} />
      <Route path="/pricing-optimizer" component={PricingOptimizerPage} />
      <Route path="/revenue-forecast" component={RevenueForecastPage} />
      <Route path="/competitor-intel" component={CompetitorIntelPage} />
      <Route path="/operational-insights" component={OperationalInsightsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable={true}
      >
        <TooltipProvider>
          <Toaster />
          <KeyboardShortcutsModal />
          {/* Skip to content link for keyboard/screen reader users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none"
          >
            Skip to main content
          </a>
          {/* Site-wide announcement banner */}
          <AnnouncementBanner />
          <OnboardingTour />
          <BreadcrumbTrail />
          <main id="main-content" role="main">
            <Router />
          </main>
          <ScrollToTop />
          <MobileBottomNav />
          <AdminQuickActionToolbar />
          <WizardRedirectGuard />
          <GlobalCommandPalette />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
