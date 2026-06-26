# Project TODO

- [x] Basic homepage layout with dual persona system
- [x] Navigation menu with search and command palette
- [x] Premium dark theme with gold accents (Playfair Display + Inter)
- [x] Dual persona tabs (Luxury Travel Concierge + ArtKech Studio)
- [x] Process timeline component (7-stage workflows)
- [x] General capabilities section
- [x] Operational guidelines section
- [x] Document Library component with search and category filtering
- [x] Generate 515 ARG-Builder operational documents
- [x] Static document catalog (documentCatalog.ts)
- [x] Upgrade to full-stack (tRPC + Express + MySQL/Drizzle ORM + Manus Auth)
- [x] Resolve Home.tsx merge conflict (keep existing UI)
- [x] Create documents table in database schema
- [x] Push database schema migration
- [x] Seed all 515 documents into database
- [x] Create tRPC API endpoints for documents (list, search, filter by category)
- [x] Update frontend DocumentLibrary to fetch from API instead of static catalog
- [x] Case-insensitive search (LOWER() for utf8mb4_bin collation)
- [x] Write vitest tests for document API endpoints
- [x] Save checkpoint
- [x] Fix DocumentLibrary to fetch full 515-document dataset (limit: 600)
- [x] Add error state for failed queries in DocumentLibrary
- [x] Generate 10 new follow-up documents (Round 53): Privacy/Consent, Data Residency, Community-Led Growth, Ops Dashboard BI, CS Capacity Planning, FinOps Governance, Feature Deprecation, Deal Desk, Knowledge Transfer, Competitive Battlecards
- [x] Seed 10 new documents into database (total: 525)
- [x] Document detail page (/docs/:slug) with full markdown rendering
- [x] Document export (copy markdown to clipboard, download as .md file)
- [x] Improved search UX with debounce (300ms delay)
- [x] Reading time display and word count badges on documents
- [x] Favorites/bookmarks system using localStorage
- [x] Recently viewed documents tracking
- [x] Keyboard navigation enhancements (Escape to go back, Ctrl+P to print)
- [x] Category icons and visual improvements
- [x] Print-friendly document view (CSS @media print)
- [x] Document table of contents sidebar on detail page
- [x] Full-text content search (search within document body, not just titles)
- [x] Related documents section at bottom of detail page (same category)
- [x] Breadcrumb navigation on detail page (Home > Category > Document)
- [x] Document statistics dashboard (total docs, categories, word count, avg reading time)
- [x] Bulk export (download all documents in a category as index)
- [x] Tag-based filtering (category filter pills with icons)
- [x] Scroll-to-top button on long pages
- [x] Dark/light theme toggle in header
- [x] Responsive mobile improvements (collapsible TOC, touch-friendly buttons)
- [x] Loading skeleton states (shimmer placeholders instead of spinner)
- [x] Fix nested button error (BulkExport button inside category expand button)
- [x] Reading progress indicator bar at top of document detail page
- [x] Back-to-position: remember scroll position when navigating from library to detail
- [x] Document sorting options (alphabetical, reading time, newest)
- [x] Category description tooltips on hover
- [x] Keyboard shortcuts help modal (? key to open)
- [x] Copy-link-to-section (click heading anchor icon to copy URL with hash)
- [x] Document last-updated date display
- [x] Search result snippets showing matched content excerpt
- [x] Pagination controls (page numbers instead of just Load More)
- [x] Smooth animated transitions between pages (hash-based scroll)
- [x] Responsive: Fix hero section text sizing and spacing on mobile/tablet
- [x] Responsive: Fix persona tabs and process timeline for small screens
- [x] Responsive: Fix document stats grid for mobile (2-col on phone, 4-col on tablet)
- [x] Responsive: Fix category filter pills overflow/scrolling on mobile
- [x] Responsive: Fix document grid cards for phone screens (single column)
- [x] Responsive: Fix Document Detail TOC and content layout on tablet/phone
- [x] Responsive: Fix Header navigation and theme toggle for mobile
- [x] Responsive: Fix pagination controls touch targets and spacing on mobile
- [x] Responsive: Fix Recently Viewed and Favorites sections for small screens
- [x] Responsive: Add proper viewport meta and touch-friendly tap targets throughout
- [x] Admin document editor (create/edit/delete documents in browser) at /admin/editor
- [x] FULLTEXT index on content column (skipped - TiDB doesn't support FULLTEXT, using LIKE with LOWER() instead)
- [x] Document sharing via URL (Share button with Twitter, LinkedIn, Email, Copy link)
- [x] Reading progress persistence (auto-saves scroll position per document)
- [x] Multi-document comparison view (side-by-side) at /compare
- [x] Document changelog/version history tracking (updatedAt displayed in detail view)
- [x] Category landing pages with overview and stats at /category/:name
- [x] Search suggestions/autocomplete dropdown component
- [x] Admin document editor (create/edit/delete) at /admin/editor
- [x] Compare button + Admin link in header navigation
- [x] View All link in expanded categories to navigate to category page
- [x] Document ratings system (thumbs up/down per document, stored in DB)
- [x] Document view count tracking (increment on detail page visit)
- [x] Reading lists/collections (users can create named lists and add docs) at /lists
- [x] Bulk import via CSV upload (admin feature) at /admin/import
- [x] Document templates (5 pre-built templates) at /templates
- [x] Table of Contents index page at /toc showing all documents organized hierarchically
- [x] Inter-document linking (related docs by category + category landing pages)
- [x] Quick actions floating toolbar on document detail (print, share, favorite, add-to-list)
- [x] AI-powered document summarization (generate TL;DR via LLM on demand)
- [x] Popular/trending documents section based on view counts and ratings
- [x] Search analytics tracking (log queries, admin dashboard at /admin/analytics)
- [x] Document tagging system (multi-tag per document, tags explorer at /tags)
- [x] PDF export (browser print-to-PDF with print-friendly CSS already implemented)
- [x] Reading streaks (track daily reading activity with localStorage, shown on home page)
- [x] Smart suggestions (recommend docs based on reading history, shown on home page)
- [x] Document comments/notes (visitor-scoped annotations per document)
- [x] Accessibility: ARIA labels, keyboard nav, focus management, proper roles throughout
- [x] Performance: pagination, debounced search, skeleton loading states
- [x] Notification to owner when new documents are created via admin (notifyOwner in admin create)
- [x] Content versioning (version history component on detail page)
- [x] Dedicated search results page (/search?q=...) with faceted filtering by category, tags, and reading time
- [x] Document workflow states (draft/review/published) with status column in schema and admin controls
- [x] Batch multi-select operations in document library (bulk delete, bulk tag, bulk export selected)
- [x] Document pinning/featured docs (admin can pin documents to top of library and home page)
- [x] User-defined custom categories (admin can create/rename/delete categories beyond the seeded 14)
- [x] Document expiry/review reminders (reviewBy date field, admin dashboard showing stale docs)
- [x] Embeddable document widget (standalone /embed/:slug route with minimal chrome for iframe use)
- [x] Document download history log (track who downloaded what, admin viewable)
- [x] Admin user activity page (/admin/activity) showing recent actions (views, ratings, comments, downloads)
- [x] Site-wide announcement banner (admin-configurable dismissible banner at top of all pages)
- [x] Role-based access control (restrict admin routes server-side, only owner can manage docs/announcements/categories)
- [x] Full-text search with relevance scoring (weighted ranking: title matches > tag matches > body content)
- [x] Document analytics dashboard (/admin/dashboard) with charts (views over time, top docs, download trends)
- [x] Multi-language/i18n support (language selector, store document locale, filter by language)
- [x] Document templates gallery (/templates/gallery) with preview, clone-to-new-doc, and category-specific templates
- [x] Glossary/definitions system (/glossary) with term definitions, auto-linking terms in documents
- [x] Document dependencies/prerequisites (link docs as prerequisites, show dependency tree on detail page)
- [x] Reading goals and progress tracking (set weekly reading goals, track completion %, gamification badges)
- [x] Document approval workflow notifications (notify owner when doc moves to review, approval actions)
- [x] Public REST API documentation endpoint (/api/docs) with OpenAPI-style reference for external integrations
- [x] Rename all "Atlas Elite" references to "Riad & Routes" (riadandroutes.com) throughout the application
- [x] Auto-link glossary terms in document content (highlight defined terms inline with hover tooltips showing definitions)
- [x] Admin dependency management UI (link/unlink prerequisite documents from the editor with search-select interface)
- [x] Export analytics as CSV (download button on analytics dashboard for views, downloads, top-docs data)
- [x] Document comparison/diff view (side-by-side comparison of two document versions with highlighted changes)
- [x] Bulk document status workflow (visual Kanban-style board for moving docs between draft/review/published)
- [x] Keyboard shortcuts help modal (? key opens overlay showing all available shortcuts)
- [x] Document reading progress bar (sticky progress indicator at top of document detail page based on scroll position)
- [x] Admin document audit trail (detailed changelog per document showing who changed what and when)
- [x] Related documents AI suggestions (use LLM to suggest related docs based on content similarity)
- [x] Table of contents sidebar for long documents (auto-generated from markdown headings, sticky on scroll)
- [x] Dark/light mode toggle per user with localStorage persistence and smooth transition animation
- [x] Document approval queue page (/admin/approvals) with one-click approve/reject buttons for review-status docs
- [x] Scheduled content publishing (admin sets future publish date, draft docs auto-transition to published)
- [x] Document bookmarks with notes (users can add personal notes to their bookmarks, viewable in /bookmarks)
- [x] Full-screen distraction-free reading mode (toggle button on document detail, hides header/sidebar/chrome)
- [x] Document print layout improvements (custom print stylesheet with branded header/footer, page breaks)
- [x] Admin bulk tag editor page (/admin/tags) with rename, merge, and delete operations across all documents
- [x] Document sharing with expiring links (generate time-limited share URLs for private/draft documents)
- [x] Onboarding tour for first-time visitors (step-by-step tooltip walkthrough of key features)
- [x] Admin document import from URL (paste a URL, auto-fetch content and create document from it)
- [x] Custom branding settings page (/admin/branding) to configure site title, accent color, and tagline from UI
- [x] Document access analytics per visitor (track who reads what, surface "most engaged readers" leaderboard)
- [x] Inline document commenting (highlight text and add contextual comments, threaded replies)
- [x] Document export to DOCX format (server-side conversion from markdown to .docx download)
- [x] Bulk document archive/restore (soft-delete with archive status, admin can restore archived docs)
- [x] Document reading time estimator settings (admin configurable words-per-minute rate)
- [x] Recently viewed documents sidebar widget (show last 5 docs visited by current visitor)
- [x] Admin user management page (/admin/users) showing all visitors, their activity stats, and role management
- [x] Document content templates with variables (placeholders like {{client_name}} auto-filled on view)
- [x] Webhook integration for document events (fire HTTP POST on create/update/delete/publish to configurable URL)
- [x] Document quick-copy code blocks (one-click copy button on all code fences in rendered markdown)
- [x] Collapsible admin navigation menu (group admin links into a dropdown/accordion to reduce header clutter)
- [x] Document word cloud visualization (show most frequent terms per category on category landing pages)
- [x] Bulk document status filter on library page (filter by draft/review/published status for admin users)
- [x] Document reading history page (/history) showing chronological list of all documents the visitor has read
- [x] Admin document duplication (one-click clone existing document with "Copy of..." prefix)
- [x] Sticky header with scroll-aware show/hide behavior (header hides on scroll down, reappears on scroll up)
- [x] Document feedback form (simple thumbs up/down + optional text feedback at bottom of each document)
- [x] Category reordering (admin can drag-sort categories to control display order on home page)
- [x] Global search keyboard shortcut enhancement (/ key focuses search input from anywhere on the site)
- [x] Custom 404 page with search suggestions (replace generic NotFound with document search and popular docs)
- [x] Document access control per-document (public/private visibility field, private docs only visible to admin)
- [x] Document QR code generator (generate QR code for any document URL for easy mobile sharing)
- [x] Reading time heatmap (visualize when during the day/week users read most, shown on analytics dashboard)
- [x] Document collections/playlists (curated reading lists that admins can publish as guided learning paths)
- [x] Breadcrumb trail persistence (show user's navigation path as clickable breadcrumbs across pages)
- [x] Admin bulk import from JSON (upload JSON array of documents with title/content/category fields)
- [x] Document version restore (revert document to a previous version from the audit trail)
- [x] Table of contents progress indicator (highlight current section in TOC sidebar as user scrolls)
- [x] Mobile bottom navigation bar (fixed bottom nav with Home/Search/Bookmarks/History for mobile users)
- [x] Document change subscriptions (users subscribe to docs/categories, see notification badge for updates)
- [x] Related documents graph visualization (interactive node graph showing document relationships)
- [x] Admin content calendar view (calendar UI showing scheduled publishes, recent edits, and upcoming reviews)
- [x] Document reading progress persistence per-user (server-side progress tracking, resume where you left off)
- [x] Bulk document move between categories (admin selects multiple docs and moves to a different category)
- [x] Document excerpt/preview cards on hover (tooltip preview of first 200 chars when hovering doc links)
- [x] Admin document merge tool (combine two documents into one, preserving both contents)
- [x] Category cover images (admin can set a banner/cover image per category shown on category pages)
- [x] Document footnotes support (render markdown footnotes with clickable references and back-links)
- [x] Site-wide search history (show recent searches in search dropdown for quick re-access)
- [x] AI-powered document summarization on demand (Generate Summary button using LLM to create executive summary)
- [x] Multi-language document translation (Translate button creates localized versions via LLM)
- [x] Document pinning to homepage (admin pins important docs that appear in a featured section at top)
- [x] Admin document word count analytics (chart showing word count distribution across categories)
- [x] User preferences page (settings for notification frequency, theme, default sort, reading speed WPM)
- [x] Document changelog diff viewer (side-by-side diff of content changes between versions)
- [x] Keyboard navigation mode (vim-style j/k navigation through document lists)
- [x] Admin broken links checker (scan all documents for broken internal links and report them)
- [x] Document reading streak leaderboard (show top readers by streak length, gamification)
- [x] Contextual help tooltips (? icon on complex features showing explanation popover)
- [x] Progressive Web App (PWA) manifest and offline caching (installable on mobile, basic offline shell)
- [x] Document templates marketplace (browse/import shared templates from a public gallery page)
- [x] Admin bulk tag assignment (select multiple docs and assign/remove tags in one action)
- [x] Document reading quiz generator (AI generates 3-5 comprehension questions per document)
- [x] Saved filters/views (users save custom filter combinations and recall them by name)
- [x] Admin content health score (composite score per doc based on freshness, word count, links, feedback)
- [x] Document text-to-speech player (browser-based TTS with play/pause controls on document pages)
- [x] Related documents by tag similarity (recommend docs sharing the most tags, shown on detail page)
- [x] Admin scheduled review reminders (set recurring review dates, show overdue docs on dashboard)
- [x] Document annotation highlights (users highlight text passages and save with color-coded notes)
- [x] Custom document workflows (admin-defined status pipelines beyond draft/review/published with configurable transitions)
- [x] Document access analytics CSV export (download reading patterns from visitor analytics as CSV)
- [x] Admin document archival policy (auto-archive docs older than N days with no views, configurable threshold)
- [x] Document quick-edit inline (click-to-edit title and content directly on the detail page without navigating to editor)
- [x] Multi-document PDF export (select multiple docs and download as a single combined PDF)
- [x] Admin content gap analysis (AI identifies missing topics by analyzing existing categories and suggesting new docs)
- [x] Document reading time estimates by section (show per-heading reading times in the TOC sidebar)
- [x] User activity feed on homepage (personalized feed showing recent changes to subscribed docs/categories)
- [x] Admin duplicate content detector (scan docs for similar content and flag potential duplicates)
- [x] Document embed code generator (generate iframe/script embed snippets for external websites)
- [x] Admin unified dashboard homepage (consolidated admin overview with quick-access cards, health metrics, recent activity)
- [x] Document versioned snapshots (named immutable copies at a point in time, like Git tags, for compliance/audit)
- [x] Smart document recommendations engine (ML-style collaborative filtering: "users who read X also read Y")
- [x] Admin document import from Notion/Markdown URL (paste URL, auto-fetch and parse into new document)
- [x] Document reading comprehension score (track quiz results per user, show mastery percentage on doc cards)
- [x] Bulk document export as ZIP (select multiple docs, download as organized ZIP with folder-per-category)
- [x] Admin SEO metadata editor (edit meta title, description, and OG tags per document for better sharing)
- [x] Document cross-references inline (auto-detect mentions of other doc titles in content and hyperlink them)
- [x] User dashboard with personal stats (total docs read, streak, quiz scores, bookmarks, reading goals in one view)
- [x] Admin notification center (centralized log of all system notifications sent, with delivery status and retry)
- [x] Admin role delegation (granular permissions: content-editor vs full-admin, assignable by owner)
- [x] Document approval SLA tracking (time-based alerts when docs sit in review beyond configurable threshold)
- [x] Webhook event log viewer (admin page showing recent webhook deliveries with payloads, status codes, retry)
- [x] Document access request workflow (non-admin users can request access to private docs, admin approves/denies)
- [x] Admin content scheduling calendar improvements (drag-to-reschedule, color-coded by workflow status)
- [x] Document version comparison selector (pick any two versions from history and compare side-by-side)
- [x] Batch document AI summarization (admin selects multiple docs and generates summaries for all at once)
- [x] User onboarding checklist (personalized checklist: read 5 docs, complete a quiz, bookmark a doc, etc.)
- [x] Admin system health monitor (server uptime, DB connection status, storage usage, API response times)
- [x] Document citation generator (auto-generate APA/MLA/Chicago citation for any document with copy button)
- [x] Advanced analytics: time-series chart for document views over time (daily/weekly/monthly)
- [x] Advanced analytics: reading trends chart (documents read per day, active readers over time)
- [x] Advanced analytics: top documents bar chart (most viewed, most downloaded, highest rated)
- [x] Advanced analytics: download activity trend line chart
- [x] Advanced analytics: category distribution pie/doughnut chart
- [x] Advanced analytics: backend tRPC procedures for aggregated time-series data
- [x] Comparative period analytics (compare current vs previous period with percentage change indicators)
- [x] PDF analytics report export (download formatted PDF report of all analytics charts and summary stats)
- [x] Real-time activity feed widget on admin dashboard (live-updating stream of recent user actions)
- [x] Document popularity trending algorithm (weighted recency scoring: recent views count more than old ones)
- [x] Admin bulk document quality audit (scan all docs for missing fields, short content, broken links, no tags)
- [x] User reading session analytics (track time spent per document, average session duration, bounce rate)
- [x] Document content freshness indicator (visual badge showing how recently content was updated: fresh/aging/stale)
- [x] Admin email digest configuration (configure daily/weekly email summaries of key metrics to owner)
- [x] Document related media attachments (link images/files to documents, display in a media gallery section)
- [x] Global site statistics public page (/stats) showing total docs, categories, total reads, and growth chart
- [x] Multi-tenant workspace support (teams/departments with isolated document collections and cross-team shared search)
- [x] Automated content review scheduling (recurring review cycles per document with auto-assignment and escalation alerts)
- [x] Admin API playground page (live tRPC endpoint explorer with authenticated requests, input builder, response viewer)
- [x] Document co-authoring activity log (track multiple editors per document with contribution stats and edit timeline)
- [x] Admin content migration tool (bulk re-categorize, re-tag, and re-assign documents with preview before applying)
- [x] User reading path recommendations (guided learning paths auto-generated from dependency trees and reading history)
- [x] Document sentiment analysis dashboard (AI-powered sentiment scoring of feedback and comments per document)
- [x] Admin data retention policy manager (configure retention rules per category with auto-purge scheduling)
- [x] Document accessibility checker (scan content for accessibility issues: alt text, heading hierarchy, contrast)
- [x] Admin custom report builder (drag-and-drop report designer combining any metrics into exportable custom reports)
- [x] Real-time push notification center (WebSocket-based live notifications for review assignments, SLA breaches, workspace invites)
- [x] Document template marketplace (users submit, rate, and share templates across workspaces with usage analytics)
- [x] Admin audit compliance report (downloadable PDF report of access requests, retention executions, accessibility scans for date range)
- [x] Fix: SQL GROUP BY error on download_history DATE(createdAt) in advanced analytics
- [x] Fix: SQL GROUP BY error on activity_log DATE(createdAt) in advanced analytics
- [x] Fix: Audit and rewrite all remaining Drizzle GROUP BY DATE() queries to use db.execute raw SQL (4 remaining)
- [x] React error boundaries around admin dashboard analytics widgets (prevent one failing query from blanking the page)
- [x] Loading skeleton shimmer placeholders for analytics charts and dashboard stat cards
- [x] Admin document change log timeline (visual timeline of all changes across all documents with filters by author/date/type)
- [x] User preference for default landing page (choose home, dashboard, or specific category as default after login)
- [x] Admin bulk export tool (export selected documents as ZIP with Markdown/HTML/PDF format options)
- [x] Document cross-reference linker (auto-detect and suggest links between related documents based on content similarity)
- [x] Admin user engagement scorecard (per-user metrics: docs read, quizzes taken, comments made, streak days)
- [x] Document print-optimized view (clean print stylesheet with proper page breaks, headers, footers for physical copies)
- [x] Admin announcement scheduling (schedule announcements for future publish with preview and auto-expire)
- [x] Admin dashboard widget customization (drag-and-drop rearrange, show/hide, resize widgets for personalized admin view)
- [x] Document version rollback (restore any previous version with confirmation dialog and automatic changelog entry)
- [x] Automated broken link checker (scan all document content for broken internal cross-references and external URLs)
- [x] Admin knowledge graph visualization (interactive node-link diagram showing document relationships and cross-references)
- [x] User saved search filters (save and name frequently used search filter combinations for one-click reuse)
- [x] Document reading time estimator (auto-calculate and display estimated reading time based on word count and complexity)
- [x] Admin duplicate content detector (AI-powered scan to find near-duplicate documents and suggest merges)
- [x] User document collections (create named collections/playlists of documents for organized reference)
- [x] Admin performance benchmark page (compare current period metrics against historical baselines with trend arrows)
- [x] Document quick-action toolbar (floating toolbar on document detail with bookmark, share, print, cite, rate shortcuts)
- [x] Fix AdminEditor "Rendered more hooks than during the previous render" error (hooks called conditionally)
- [x] Wire SavedSearchFilters component into SearchResultsPage for one-click filter reuse
- [x] Add "Add to Collection" button on DocumentDetail page for quick collection management
- [x] Integrate ReadingTimeEstimate component into DocumentDetail page near document title
- [x] Fix tRPC "Unexpected token '<', <!doctype" error (Vite catch-all serving HTML for API routes during HMR restarts)
- [x] ARG-Builder product landing page with hero, features, pricing, and lead capture form (/product)
- [x] Leads database table and tRPC endpoints (submit, list, updateStatus)
- [x] Admin Lead Management page (/admin/leads) with status pipeline
- [x] ROI Calculator page — interactive savings estimator where prospects input team size and see projected savings
- [x] LinkedIn content calendar — 12 posts (3/week for 4 weeks pre-launch) about operational knowledge pain points
- [x] Ops leader dinner invitations — personalized invites for NY (June 17) and SF (June 25) dinners
- [x] One-page product overview PDF — leave-behind for in-person meetings summarizing the pitch deck
- [x] State of Operational Knowledge lead magnet report — downloadable PDF with industry stats, gated behind email
- [x] Demo video placeholder section on landing page hero
- [x] Email automation setup guide — connect leads table to nurture campaign
- [x] Product Hunt "Coming Soon" preparation guide
- [x] Stripe integration for self-serve Starter tier payments
- [x] Product Hunt launch day checklist
- [x] Wire Stripe integration for self-serve Starter tier payments
- [x] Upgrade demo video placeholder with animated product walkthrough
- [x] Add domain setup guidance page and ARG-Builder branding updates
- [x] Build complete ARG-Builder management system in Notion
- [x] Check argbuilder.io domain availability (taken by existing company — pivoted to ARG Builder)
- [x] Rebrand landing page from ARG-Builder to ARG Builder (parent AI company vision)
- [x] Set up argbuilder.io custom domain for the Manus-hosted app (guidance provided — user action in Settings → Domains)
- [x] Prepare LinkedIn posts for immediate publishing (Week 1: 3 posts) under ARG Builder brand
- [x] Research and populate cold outreach target list with real mid-market companies for NY/SF
- [x] Update Notion management system with ARG Builder branding

## Rebrand: ARG-Builder → ARG Builder

- [x] Rewrite LandingPage.tsx with ARG Builder parent company branding (6 verticals, platform vision)
- [x] Replace all ARG-Builder references in ROICalculatorPage.tsx with ARG Builder
- [x] Replace ARG-Builder reference in AdminLeadsPage.tsx
- [x] Update client/index.html title from "Agent Reference Guide" to "ARG Builder"
- [x] Update theme-color meta tag to teal (#14b8a6)
- [x] Replace all "Agent Reference Guide" text across OnboardingTour, ExportDocx, exportPdf, EmbedDocument, AdminBrandingPage, PublicStatsPage, routers.ts, pdfExport.ts, Home.tsx
- [x] TypeScript check: 0 errors
- [x] All 299 tests passing

## Stripe Integration

- [x] Add Stripe feature via webdev_add_feature
- [x] Define products and prices in server/products.ts (Starter/Professional/Enterprise tiers)
- [x] Add stripe_customer_id and stripe_subscription_id to users table
- [x] Create checkout session tRPC endpoint
- [x] Create Stripe webhook handler at /api/stripe/webhook
- [x] Create payment/subscription status tRPC endpoints
- [x] Build pricing page UI with checkout buttons on /product landing page
- [x] Build payment success/cancel pages (billing page with success state)
- [x] Build subscription management page (/billing)
- [x] Write vitest tests for Stripe endpoints (8 tests passing)
- [x] Save checkpoint

## Pricing Alignment (Hybrid Model)

- [x] Update server/products.ts with hybrid pricing ($299 flat Starter, $15/seat Pro, Custom Enterprise)
- [x] Update LandingPage.tsx pricing section to match new model
- [x] Update ROI calculator pricing assumption ($15/user/month)
- [x] Update launch collateral (GTM-Strategy.md, One-Pager, Pitch Deck, Stripe Guide, all launch-package files)
- [x] Run TypeScript check and tests (307 passing, 0 errors)
- [x] Save checkpoint

## Weekly Metrics Review (Automated)

- [x] Create /api/scheduled/weekly-review endpoint handler
- [x] Mount handler in server/_core/index.ts
- [x] TypeScript check passes (0 errors)
- [x] Deploy and create Heartbeat cron (Monday 9 AM ET / 14:00 UTC) — task_uid: m7bzHKwtDp4TDyqpaF7g36

## SEO Fixes (Landing Page /)

- [x] Add meta description (50-160 chars) via useEffect
- [x] Add meta keywords via useEffect
- [x] Fix title length (30-60 chars) via document.title in useEffect
- [x] Add keyword-rich H2 heading ("AI-Powered Operational Reference Guide")

### SEO & Branding Follow-ups
- [x] Fix Open Graph meta tags (og:url, og:title, og:description, og:image) for social sharing
- [x] Fix Twitter Card meta tags for proper link previews
- [x] Create sitemap.xml with all document URLs (dynamic endpoint at /sitemap.xml)
- [x] Create robots.txt with sitemap reference
- [x] Add JSON-LD structured data (SoftwareApplication schema)
- [x] Fix header branding ("Agent Guide" → "ARG Builder")
- [x] Fix LoginPage branding ("Agent Reference Guide" → "ARG Builder")
- [x] Add SEO meta tags to LandingPage (/product)
- [x] Save checkpoint

## Follow-up Actions (May 19, 2026)
- [x] Create OG social sharing image (1200x630px) and add to meta tags
- [x] Fix sitemap accessibility for Google Search Console (robots.txt issue is platform-level on .manus.space; custom domain serves correct file)
- [x] Reminder: Stripe API keys needed in Settings → Payment (user action required — communicated to user)
- [x] Add analytics tracking (privacy-friendly) — Umami already integrated via VITE_ANALYTICS env vars
- [x] Create Loom demo recording script (docs/loom-demo-script.md)
- [x] Product Hunt launch preparation (docs/product-hunt-launch-guide.md)
- [x] Verify root domain DNS A records propagation (confirmed Cloudflare setup)
- [x] Add hreflang tags for future multi-language support (xhtml:link in sitemap)
- [x] Email capture automation guide (docs/email-capture-crm-guide.md)
- [x] Run Lighthouse audit and fix accessibility issues (labels, aria-labels added)

## Close CRM Integration
- [x] Add CLOSE_CRM_API_KEY secret
- [x] Implement Close CRM lead creation on demo form submission
- [x] Write test for Close CRM integration (4 tests passing, lead created: lead_UDEsBPKx600qU0NF9b1JZeBLxzvVkG4m4K3nw197VZe)
- [x] Save checkpoint

## Demo Request Form UX
- [x] Add loading state (spinner + disabled button) during form submission
- [x] Add clear success message after successful submission
- [x] Reset form fields after success

## Login Fix & Form Improvements
- [x] Diagnose and fix the login issue (ADMIN_PASSWORD env var was not loading; fixed by setting correct secrets)
- [x] Add inline field-level validation to demo request form (name required, email format, work email check)
- [x] Add confirmation email for demo request submissions (owner notification on new lead via notifyOwner)

## Security & UX Improvements (May 19 batch 2)
- [x] Add server-side rate limiting to demo form (3 requests per IP per hour)
- [x] Add rate limiting to login (5 attempts per IP per 15 minutes)
- [x] Add rate limiting to password reset (3 requests per IP per hour)
- [x] Implement forgot password / password reset flow with secure token + owner notification
- [x] Add configurable session timeout with "Remember me" option (24h default / 1 year with remember me)
- [x] Add password change endpoint (/api/auth/change-password)

## Admin Features & Security (May 19 batch 3)
- [x] Build Change Password UI page in admin settings (/admin/settings)
- [x] Build leads dashboard widget on admin home page (total, this week, conversion, by status, recent leads)
- [x] Implement audit logging for login events (login_success, login_failed with IP, email, userAgent, timestamp)
- [x] Add Account Settings to admin nav dropdown

## Document Graph & Follow-ups (May 19 batch 4)
- [x] Auto-generate cross-references (1,415 connections: 206 title mentions, 273 keyword overlaps, 936 category neighbors across 525 docs)
- [x] Add login history tab to Account Settings page (shows last 100 login success/failure events with IP, email, UA)
- [x] Create weekly leads digest handler (POST /api/scheduled/leads-digest) — deploy needed before creating cron

## Follow-ups (May 19 batch 5)
- [x] Add "Report Suspicious Activity" button to Login History tab (notifies admin with event details via notifyOwner)
- [x] Activate weekly leads digest cron via Heartbeat (Monday 8 AM ET / 12:00 UTC, task_uid: 72jFQVa2jCSymPJkderDyB)
- [x] Build Close CRM automated email sequence (seq_35QZqN40zFJfzmG5AunVU8: Welcome → Value Prop → CTA over 5 days)
- [x] Auto-subscribe new leads to nurture sequence on form submission

## Follow-ups (May 19 batch 6)
- [x] Test full lead-to-email flow (verified: lead created in Close, sequence subscription active, status: active)
- [x] Add Cal.com scheduling link to /product page (appears in demo success state: "Book a 15-min demo directly")
- [x] Add contact sales chat widget (custom floating chat bubble on /product, feeds into leads pipeline)
- [x] Add lead source tracking field (utmSource, utmMedium, utmCampaign, utmContent, referrer columns + frontend capture)
- [x] Add CSV export for leads in admin dashboard (Export CSV button on /admin/leads page)
- [x] Improve document graph with search/filter controls (search input, category dropdown, reset filters, match highlighting)
- [x] Add quick-action toolbar for admin (floating FAB with 8 shortcuts: New Doc, View Leads, Export CSV, Analytics, Knowledge Graph, Announcements, All Documents, Settings)
- [x] Add multi-user invite system with viewer/editor/admin roles (/admin/team page with invite generation, role management, pending/accepted tracking)
- [x] Add TOTP/2FA for admin login (setup via QR code, verify step in login flow, recovery codes, enable/disable in /admin/settings)
- [x] Add dark/light theme toggle persistence (localStorage) — already implemented in ThemeContext with preferred_theme key + legacy fallback

## Batch 7: Marketing & Sales Conversion (Enterprise Trials)
- [x] Build free trial signup system (14-day trial, time-limited access, auto-expiry, trial status tracking, admin management)
- [x] Create enterprise pricing page with 3-tier comparison (Starter/Professional/Enterprise) and annual discount + trial signup form
- [x] Add social proof section (client logos, testimonials, key metrics, integrated into /product landing page)
- [x] Build conversion-optimized hero/landing section with strong CTAs ("Start Free Trial", "Book Demo", trust signals)
- [x] Add email nurture sequence triggers (welcome, day-3 tips, day-7 value, day-12 warning, day-14 expired + admin process button)
- [x] Create ROI calculator tool (already built at /roi with team size, salary, hours searching, tool cost inputs + PDF export + lead capture)
- [x] Add trial dashboard with usage stats, conversion funnel, status management, and nurture trigger at /admin/trials
- [x] Build case study / use case pages (travel ops, creative studio, enterprise SaaS compliance) at /case-studies
- [x] Add exit-intent modal (20% off offer on mouse leave) + trial expiry banner (countdown for last 3 days)
- [x] Add comparison section (ARG Builder vs Notion/Confluence/Guru) with 12-feature matrix on /product page

## Batch 8: Growth Engine & Automation (All except Stripe)
- [x] Embed Cal.com demo booking directly on "Book a Demo" CTA (modal with iframe embed, dark theme)
- [x] Wire nurture heartbeat job at /api/scheduled/nurture (handler registered, ready for manus-heartbeat create after deploy)
- [x] Build onboarding checklist for trial users (already exists with tRPC backend: read docs, complete quiz, bookmark, create reading list, set preferences, search)
- [x] Add UTM-aware landing page hero variants (travel, healthcare, saas, manufacturing, linkedin, google + default)
- [x] Build referral/affiliate program (unique code, /referral page with stats, history, share link, track signups)
- [x] Add chat-to-CRM escalation (keyword detection for sales intent, auto-flags lead as 'chat_sales_escalation' in Close CRM)
- [x] Create changelog/product updates page (/changelog with timeline, 8 version entries, type badges, CTA)
- [x] Add A/B testing for hero CTA (useABTest hook, sticky localStorage assignment, analytics tracking, 50/50 split)
- [x] Build admin email template editor (/admin/email-templates with 5 templates, edit/preview/reset, variable reference)

## Batch 9: Growth & Conversion Optimization
- [x] Activate nurture heartbeat scheduled job (task_uid: 83gVzPoow39LA7YmuRzuzf, daily 9am UTC)
- [x] Build custom demo request form (/request-demo with team size, industry, pain points, timeline qualification, CRM lead)
- [x] Build admin analytics dashboard (/admin/growth with KPIs, trial funnel, lead sources, UTM attribution, A/B test results)
- [x] Add interactive product tour for new visitors (7-step walkthrough overlay, auto-triggers for new visitors, localStorage persistence)
- [x] Add testimonial video embed section (4 industry testimonials with metrics, ratings, expandable quotes)
- [x] Build smart lead scoring system (0-100 score, hot/warm/cool/cold tiers, company fit + engagement + behavioral factors, /api endpoint)
- [x] Create competitive battle cards for sales team (/admin/battle-cards: Notion, Confluence, Guru with objections + responses)
- [x] Build customer success metrics page (/success-metrics with 6 KPIs, before/after benchmarks, industry results)
- [x] Add webhook notifications for key conversion events (trial_started, demo_requested, hot_lead, chat_escalation, referral via notifyOwner)
- [x] Add footer with sitemap links across all public pages (4-column: Product, Solutions, Company, Legal)

## Batch 10: Enterprise Polish & Engagement

- [x] Build Resources hub page (/resources with 12 resources, type filters, search, featured section, category badges)
- [x] Build admin lead scoring dashboard (/admin/lead-scores with sortable table, tier cards, score bars, email/call actions)
- [x] Add SEO meta tags and Open Graph for all public pages (SEO component with react-helmet-async, applied to 8 public pages)
- [x] Build admin notification center (already exists at /admin/notifications with status icons, retry, channel badges, timestamps)
- [x] Create knowledge base FAQ page (/faq with 21 questions, 5 categories, search, accordion, contact CTA)
- [x] Add team activity feed for admin (already exists at /admin/activity with action types, downloads tab, visitor tracking)
- [x] Build document templates gallery (already exists at /templates/gallery with tRPC CRUD, preview, category sections, admin create/delete)
- [x] Add smart search suggestions (already exists: SearchAutocomplete with recent searches, 8-result suggestions, keyboard nav, search history)
- [x] Add performance monitoring dashboard (/admin/performance with 6 KPIs, API endpoint table, P95 latency, insights)
- [x] Create API documentation page (already exists at /api-docs with 9 endpoint groups, auth guide, tRPC-over-HTTP examples, clipboard copy)

## Batch 11: Enterprise-Grade Features & Sales Readiness

- [x] Build white-label customization panel (enhanced /admin/branding with tabs: identity, colors, typography, assets, advanced + live preview)
- [x] Add SSO/SAML configuration page (/admin/sso with Okta/Azure/Google/OneLogin/Custom, SP metadata, test connection, provisioning settings)
- [x] Build comprehensive audit log viewer (already exists at /admin/audit with AdminAuditTrailPage + AdminComplianceReportPage)
- [x] Add SLA monitoring and public uptime status page (/status with 8 services, 90-day bar, SLA tiers, incidents, subscribe)
- [x] Build custom domain branding settings (/admin/domains with DNS records, SSL cert, verification, add/remove, setup instructions)
- [x] Add multi-language support infrastructure (I18nContext with EN/FR/AR/ES, RTL support, LanguageSwitcher, localStorage persistence)
- [x] Build GDPR/data export compliance tools (/admin/compliance with data requests, consent mgmt, retention policies, compliance checklist)
- [x] Add advanced role permissions matrix (/admin/permissions with 19 permissions across 5 categories, 4 roles, toggle UI)
- [x] Create integration marketplace page (/integrations with 18 connectors, categories, search, connect/manage buttons)
- [x] Build enterprise onboarding wizard (/admin/onboarding-wizard with 7-step setup: org profile, team invites, auth/SSO, import, branding, integrations, go-live checklist)
- [x] Wire enterprise onboarding wizard to backend tRPC procedure (onboarding_wizard_state table, getWizardState/saveWizardState helpers, onboardingWizard.getState/saveState tRPC procedures, auto-load/auto-save on frontend)

## Batch 12: Operational Depth & Revenue Readiness

- [x] Auto-redirect new admins to onboarding wizard (detect incomplete setup on login, redirect to /admin/onboarding-wizard)
- [x] Wire onboarding wizard Step 2 to invite system (dispatch real invite tokens from team invite step)
- [x] Add "Reset Onboarding" button in admin settings (clear wizard state, allow re-run)
- [x] Build admin dashboard home with live KPI cards (active users, docs created this week, pending approvals, system health)
- [x] Add document approval workflow (submit for review, approve/reject with comments, status badges, admin queue)
- [x] Build bulk user import via CSV upload (parse CSV, validate emails, assign roles, preview before import, error report)
- [x] Add scheduled report generation page (/admin/reports/scheduled with weekly/monthly digest config, recipients, format)
- [x] Build API rate limiting dashboard (/admin/rate-limits with per-endpoint limits, usage meters, throttle config)
- [x] Create custom webhook builder (/admin/webhooks/builder with event picker, URL config, headers, test fire, delivery log)
- [x] Add admin system health monitor (/admin/health with DB connection, API latency, storage usage, uptime, alerts config)

## Batch 13: AI-Empowered Services & Intelligent Automation

- [x] Build AI document summarizer (/ai/summarize — paste or select doc, get executive summary, key points, action items via LLM)
- [x] Add smart content recommendations engine (/ai/recommendations — suggest related docs, next reads, trending content based on user behavior)
- [x] Create AI writing assistant (/ai/writer — generate drafts, rewrite tone, expand outlines, translate content with streaming output)
- [x] Build predictive lead scoring with AI (/ai/lead-scoring — analyze lead data patterns, predict conversion probability, explain scoring factors)
- [x] Add AI-powered semantic search (/ai/search — natural language queries, intent detection, contextual results with relevance explanation)
- [x] Create automated content tagging system (/ai/auto-tag — analyze documents, suggest categories/tags, batch-tag with confidence scores)
- [x] Build AI meeting notes generator (/ai/meeting-notes — paste transcript or upload audio, extract action items, decisions, attendees, follow-ups)
- [x] Add intelligent workflow automation builder (/ai/workflows — describe workflow in plain English, AI generates trigger-action sequences)
- [x] Create sentiment analysis dashboard (/ai/sentiment — analyze feedback, comments, support tickets for sentiment trends and alerts)
- [x] Build AI model configuration panel (/admin/ai-config — select models, set temperature/tokens, manage prompts, usage tracking, cost estimates)

## Batch 14: Platform Maturity & Client-Facing Intelligence

- [x] Build AI Services Hub page (/ai — central navigation listing all 9 AI tools with descriptions, icons, usage stats, quick-launch cards)
- [x] Persist AI model configs to database (wire /admin/ai-config to tRPC procedures, save temperature/prompt/model per service, apply to LLM calls)
- [x] Add AI Chat Assistant (/ai/chat — conversational interface using AIChatBox component, context-aware about all docs, streaming responses)
- [x] Build client-facing portal (/portal — branded read-only view for external clients with shared docs, progress updates, filtered access)
- [x] Create team collaboration workspace (/team — shared tasks, discussions, file sharing, member status, real-time presence)
- [x] Add AI template generator (/ai/templates — describe desired doc type in plain English, AI generates full document template with sections)
- [x] Build usage analytics & billing dashboard (/settings/usage — API calls per service, token usage, cost estimates, plan tiers, billing history)
- [x] Create API key management page (/settings/api-keys — generate/revoke keys, set scopes, usage tracking per key, expiry dates)
- [x] Add notification preferences center (/settings/notifications — per-channel toggles, digest frequency, quiet hours, 8 categories)
- [x] Build admin command center (/admin/command-center — unified searchable quick-actions panel, 18 actions, keyboard shortcut ⌘K)

## Batch 15: Enterprise Readiness & Production Infrastructure

- [x] Add global ⌘K command palette overlay (keyboard shortcut from any page, search actions/pages/docs, fuzzy match, recent commands)
- [x] Persist team workspace to database (tasks, discussions, file refs saved to DB via tRPC, load on mount, real-time sync)
- [x] Wire webhook builder deliveries to database (log each delivery attempt, status, response code, retry count, searchable history)
- [x] Add document version restore (click any version in history to restore it as current, with confirmation dialog and audit log)
- [x] Persist AI usage metering to database (track tokens consumed per service per user, daily aggregation, cost calculation)
- [x] Build unified export center (/admin/export-center — queue and download bulk exports: docs, analytics, audit logs, user data as CSV/JSON/PDF)
- [x] Add admin impersonation mode (/admin/impersonation — view platform as specific user, read-only, visible banner, audit logged)
- [x] Create custom field definitions system (/admin/custom-fields — define custom metadata fields per category, CRUD with DB persistence)
- [x] Add document workflow SLA tracking (/admin/workflow-sla — set max time per stage, breach alerts, resolve breaches, compliance dashboard)
- [x] Build platform changelog with release notes (/platform/changelog — version timeline, type filters, 8 releases documented)

## Batch 16: Detailed Process Document Seeding (Riad & Routes + ArtKech Design Studio)

- [x] Seed 16 detailed Riad & Routes day-to-day process documents (guest check-in, housekeeping, tour booking, driver dispatch, VIP handling, complaints, procurement, F&B, pricing, WhatsApp concierge, hammam/spa, night audit, staff training, reputation management, medina tours, checkout)
- [x] Seed 16 detailed ArtKech Design Studio day-to-day process documents (creative brief intake, design review, client onboarding, brand identity, print production, social media pipeline, pricing/quotation, daily operations, freelancer management, client feedback, file management, portfolio/case studies, QA/preflight, financial management, lead generation, photography)

## Batch 17: Persona-Linked Operations & Real-World Usability

- [x] Link persona pages to their seeded documents (TravelConcierge shows RR docs, CreativeStudio shows AK docs with quick-access cards and category tabs)
- [x] Build persona-specific document browser (/persona/riad-routes and /persona/artkech — filtered views showing only that persona's process docs)
- [x] Add process timeline visualization component (visual step-by-step flowchart rendering for any process document, auto-parsed from markdown headers)
- [x] Create daily operational checklist generator (/daily-checklist — 18-item daily ops checklist per persona with time-of-day filters and progress tracking)
- [x] Build shift handover notes system (/shift-handover — structured handover note creator with priority/category tagging)
- [x] Add emergency escalation matrix page (/escalation-matrix — 5-scenario emergency escalation matrix per persona with 3-level protocols)
- [x] Create seasonal operations calendar (/seasonal-calendar — month view showing seasonal events, peak periods, deadlines, and preparation periods per persona)
- [x] Build cross-persona document linking (CrossPersonaLinksPanel component showing related processes from the other persona when viewing RR/AK documents)
- [x] Add operational KPI scorecards per persona (/operational-kpis — 12 KPIs per persona with targets, trends, and status indicators)
- [x] Push Batch 16-17 results to Notion ARG-Builder hub (sync new document titles, categories, and summaries to Notion workspace)

## Batch 18: RR Reframe + Provider Collaboration + Persistence

- [x] Reframe RR housekeeping/accommodation content: RR is a travel concierge working WITH luxury riad/hotel providers, not operating them — update seeded docs, checklist items, escalation scenarios, KPIs, and seasonal calendar to reflect anticipatory concierge-provider collaboration
- [x] Add DB persistence for daily checklist completions (save/load per user per day)
- [x] Add DB persistence for shift handover notes (save/load history)
- [x] Push Batch 17-18 summary to Notion ARG-Builder hub
- [x] Build Provider Partner Directory (/provider-directory — CRUD for luxury riad/hotel partners with tier, quality score, contact info)
- [x] Build Guest Anticipation Playbook (/guest-anticipation — 14 proactive actions across pre-arrival/during-stay/pre-departure coordinated with providers)
- [x] Build Provider Quality Tracking (/provider-quality/:id — quality observations, ratings, and history per provider)
- [x] Build Provider Onboarding Checklist (/provider-onboarding — 12-step partner onboarding process with deliverables and timelines)
- [x] Build Provider SLA Dashboard (/provider-sla — 12 service level metrics with target/performance tracking and status indicators)
- [x] Build Provider Commissions page (/provider-commissions — commission tiers, seasonal rates, payment tracking)

## Batch 19: Persistence Wiring + Provider Ops Depth

- [x] Wire DailyChecklistPage to tRPC checklist.toggle/getCompletions for cross-session persistence
- [x] Wire ShiftHandoverPage to tRPC handover.create/list/resolve for cross-session persistence
- [x] Seed 8 real-world luxury riad/hotel providers into the database (Riad Yasmine, Royal Mansour, La Mamounia, Riad Kniza, etc.)
- [x] Build WhatsApp message templates page (/whatsapp-templates — standardized provider communication templates for booking confirmations, special requests, escalations)
- [x] Build Provider Performance Comparison page (/provider-compare — side-by-side comparison of provider metrics, response times, guest ratings)
- [x] Build Guest-Provider Matching Intelligence (/guest-matching — preference-based provider recommendations with scoring algorithm)
- [x] Build Pre-Arrival Coordination Checklist (/pre-arrival-checklist — 12-step provider coordination before guest arrival)
- [x] Build Revenue & Booking Analytics page (/revenue-analytics — monthly performance, provider revenue breakdown, commission tracking)
- [x] Build Incident Log page (/incident-log — track and resolve operational incidents per persona with severity/status)
- [x] Build Team Contact Directory (/team-directory — searchable team member list with roles, contacts, availability per persona)
- [x] Push Batch 19 results to Notion ARG-Builder hub

## Batch 20: Guest CRM + Incident Persistence + Operational Depth

- [x] Add provider quick-links to Home page RR persona tab (direct shortcuts to provider tools)
- [x] Build Guest CRM page (/guest-crm — track returning guests with preferences, stay history, provider assignments)
- [x] Wire Incident Log to DB persistence (/incidents — create/resolve incidents stored in database)
- [x] Build Provider Communication Hub (/provider-comm-hub — log all provider comms with quick templates)
- [x] Build Booking Pipeline page (/booking-pipeline — Kanban-style booking tracker from inquiry to checkout)
- [x] Build Guest Feedback Aggregator (/guest-feedback — collect and analyze reviews across providers)
- [x] Build Seasonal Pricing Matrix (/pricing-matrix — provider rate cards by season with markup calculations)
- [x] Build Operations Dashboard (/ops-dashboard — real-time overview of incidents, providers, guests, KPIs)
- [x] Build Quality Audit Checklist (/quality-audit — structured property inspection with 25-item scoring)
- [x] Push Batch 20 results to Notion ARG-Builder hub

## Batch 21: AI Guest Inference + Provider Scoreboard + Integrations

- [ ] Build AI-powered guest preference inference (analyze guest feedback + stay history → auto-populate Guest CRM preference fields)
- [ ] Build Provider Performance Scoreboard (/provider-scoreboard — real-time metrics: response time, guest satisfaction, SLA compliance with alerts)
- [ ] Add WhatsApp Business API integration (connect Provider Communication Hub templates to WhatsApp for one-click sending)
- [ ] Build Automated Alert System (/alerts — configurable alerts for SLA breaches, quality drops, capacity issues, booking anomalies)
- [ ] Build Guest Lifecycle Timeline (/guest-timeline/:id — visual timeline of guest interactions, stays, feedback, preferences across all visits)
- [ ] Create Provider Recommendation Engine (/recommend-provider — AI-powered matching of new guests to best-fit providers based on preferences + history)
- [ ] Build Dynamic Pricing Optimizer (/pricing-optimizer — suggest optimal pricing per provider per season based on demand, occupancy, competition)
- [ ] Add Revenue Forecasting Dashboard (/revenue-forecast — predict monthly/quarterly revenue based on booking pipeline + historical trends)
- [ ] Build Competitor Intelligence page (/competitor-intel — track competitor providers' offerings, pricing, guest reviews, market positioning)
- [ ] Create Operational Insights Dashboard (/insights — AI-generated insights: trends, anomalies, recommendations for improving operations)
- [ ] Push Batch 21 results to Notion ARG-Builder hub
