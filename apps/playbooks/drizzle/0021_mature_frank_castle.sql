CREATE TABLE `bulk_export_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestedBy` varchar(255) NOT NULL,
	`format` varchar(20) NOT NULL DEFAULT 'markdown',
	`documentIds` text NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`fileUrl` text,
	`totalDocs` int NOT NULL DEFAULT 0,
	`processedDocs` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `bulk_export_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_change_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`documentTitle` varchar(500),
	`changeType` varchar(50) NOT NULL,
	`changeDescription` text,
	`changedBy` varchar(255) NOT NULL,
	`changedByName` varchar(255),
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_change_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_cross_references` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceDocId` int NOT NULL,
	`targetDocId` int NOT NULL,
	`relevanceScore` float NOT NULL DEFAULT 0,
	`reason` varchar(500),
	`status` varchar(50) NOT NULL DEFAULT 'suggested',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_cross_references_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scheduled_announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'info',
	`scheduledFor` timestamp NOT NULL,
	`expiresAt` timestamp,
	`createdBy` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'scheduled',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scheduled_announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_engagement_scorecard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(255) NOT NULL,
	`userName` varchar(255),
	`docsRead` int NOT NULL DEFAULT 0,
	`quizzesTaken` int NOT NULL DEFAULT 0,
	`commentsMade` int NOT NULL DEFAULT 0,
	`streakDays` int NOT NULL DEFAULT 0,
	`bookmarkCount` int NOT NULL DEFAULT 0,
	`totalTimeMinutes` int NOT NULL DEFAULT 0,
	`engagementScore` float NOT NULL DEFAULT 0,
	`lastActiveAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_engagement_scorecard_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_engagement_scorecard_userOpenId_unique` UNIQUE(`userOpenId`)
);
--> statement-breakpoint
CREATE TABLE `user_landing_preference` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(255) NOT NULL,
	`landingPage` varchar(100) NOT NULL DEFAULT '/',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_landing_preference_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_landing_preference_userOpenId_unique` UNIQUE(`userOpenId`)
);
