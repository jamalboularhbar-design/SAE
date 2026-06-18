CREATE TABLE `accessibility_checks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`issueType` varchar(100) NOT NULL,
	`severity` varchar(50) NOT NULL DEFAULT 'warning',
	`description` text,
	`lineReference` text,
	`isResolved` tinyint NOT NULL DEFAULT 0,
	`checkedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accessibility_checks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `co_author_activity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`userName` varchar(255),
	`actionType` varchar(50) NOT NULL,
	`fieldChanged` varchar(100),
	`summary` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `co_author_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`config` text NOT NULL,
	`createdBy` varchar(255) NOT NULL,
	`lastRunAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `custom_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `migration_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`operationType` varchar(50) NOT NULL,
	`filterCriteria` text,
	`targetValue` text,
	`affectedCount` int NOT NULL DEFAULT 0,
	`processedCount` int NOT NULL DEFAULT 0,
	`createdBy` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `migration_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retention_policies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(255) NOT NULL,
	`retentionDays` int NOT NULL DEFAULT 365,
	`action` varchar(50) NOT NULL DEFAULT 'archive',
	`isActive` tinyint NOT NULL DEFAULT 1,
	`lastRunAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `retention_policies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`intervalDays` int NOT NULL DEFAULT 90,
	`assigneeId` varchar(255),
	`lastReviewedAt` timestamp,
	`nextReviewAt` timestamp,
	`escalationDays` int NOT NULL DEFAULT 7,
	`isActive` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `review_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sentiment_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`overallScore` float NOT NULL DEFAULT 0,
	`positiveCount` int NOT NULL DEFAULT 0,
	`negativeCount` int NOT NULL DEFAULT 0,
	`neutralCount` int NOT NULL DEFAULT 0,
	`lastAnalyzedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sentiment_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspace_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'member',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workspace_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`ownerId` varchar(255) NOT NULL,
	`isDefault` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`)
);
