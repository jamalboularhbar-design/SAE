CREATE TABLE `document_seo_meta` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`metaTitle` varchar(255),
	`metaDescription` text,
	`ogTitle` varchar(255),
	`ogDescription` text,
	`ogImage` varchar(500),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `document_seo_meta_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`createdBy` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`documentId` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`correctAnswers` int NOT NULL,
	`score` int NOT NULL,
	`takenAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_correlations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentIdA` int NOT NULL,
	`documentIdB` int NOT NULL,
	`score` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reading_correlations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_notification_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientOpenId` varchar(64),
	`title` varchar(255) NOT NULL,
	`content` text,
	`channel` varchar(50) NOT NULL DEFAULT 'in_app',
	`status` varchar(20) NOT NULL DEFAULT 'sent',
	`retries` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `system_notification_log_id` PRIMARY KEY(`id`)
);
