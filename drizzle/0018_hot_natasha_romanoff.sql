CREATE TABLE `document_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileType` varchar(50) NOT NULL,
	`fileSize` int NOT NULL DEFAULT 0,
	`caption` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_quality_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`issues` text NOT NULL,
	`score` int NOT NULL DEFAULT 100,
	`auditedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_quality_audits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_digest_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` varchar(100) NOT NULL,
	`frequency` enum('daily','weekly','monthly','disabled') NOT NULL DEFAULT 'weekly',
	`includeMetrics` int NOT NULL DEFAULT 1,
	`includeTopDocs` int NOT NULL DEFAULT 1,
	`includeNewDocs` int NOT NULL DEFAULT 1,
	`lastSentAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_digest_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`durationSeconds` int NOT NULL DEFAULT 0,
	`scrollDepthPercent` int NOT NULL DEFAULT 0,
	`completed` int NOT NULL DEFAULT 0,
	CONSTRAINT `reading_sessions_id` PRIMARY KEY(`id`)
);
