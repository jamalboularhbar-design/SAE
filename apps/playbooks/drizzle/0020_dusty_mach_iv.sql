CREATE TABLE `compliance_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`dateFrom` timestamp NOT NULL,
	`dateTo` timestamp NOT NULL,
	`generatedBy` varchar(255) NOT NULL,
	`reportData` mediumtext,
	`status` varchar(50) NOT NULL DEFAULT 'generated',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `compliance_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`message` text,
	`link` varchar(500),
	`isRead` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `template_marketplace` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`content` mediumtext NOT NULL,
	`category` varchar(100),
	`authorId` varchar(255) NOT NULL,
	`authorName` varchar(255),
	`workspaceId` int,
	`usageCount` int NOT NULL DEFAULT 0,
	`avgRating` float DEFAULT 0,
	`totalRatings` int NOT NULL DEFAULT 0,
	`isPublic` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `template_marketplace_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `template_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`review` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `template_ratings_id` PRIMARY KEY(`id`)
);
