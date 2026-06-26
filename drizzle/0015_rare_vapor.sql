CREATE TABLE `activity_feed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`action` varchar(50) NOT NULL,
	`documentId` int,
	`documentTitle` varchar(500),
	`documentSlug` varchar(255),
	`category` varchar(100),
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_feed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `archival_policies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`daysWithoutViews` int NOT NULL DEFAULT 90,
	`enabled` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `archival_policies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `archived_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`archivedAt` timestamp NOT NULL DEFAULT (now()),
	`reason` varchar(255) NOT NULL DEFAULT 'auto',
	CONSTRAINT `archived_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_gap_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`suggestedTitle` varchar(500) NOT NULL,
	`suggestedDescription` text,
	`gap_status` enum('pending','accepted','dismissed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_gap_suggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_workflow_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`statusId` int NOT NULL,
	`assignedBy` varchar(64) NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_workflow_status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `duplicate_content_pairs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId1` int NOT NULL,
	`documentId2` int NOT NULL,
	`similarityScore` int NOT NULL DEFAULT 0,
	`dup_status` enum('pending','resolved','ignored') NOT NULL DEFAULT 'pending',
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `duplicate_content_pairs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflow_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`color` varchar(20) NOT NULL DEFAULT '#6b7280',
	`sortOrder` int NOT NULL DEFAULT 0,
	`isDefault` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workflow_statuses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflow_transitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromStatusId` int NOT NULL,
	`toStatusId` int NOT NULL,
	CONSTRAINT `workflow_transitions_id` PRIMARY KEY(`id`)
);
