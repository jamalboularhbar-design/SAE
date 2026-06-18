CREATE TABLE `document_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`targetType` enum('document','category') NOT NULL,
	`targetValue` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`query` varchar(255) NOT NULL,
	`resultCount` int DEFAULT 0,
	`searchedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `search_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`changeType` enum('created','updated','published') NOT NULL,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscription_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_reading_position` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`scrollPercent` int NOT NULL DEFAULT 0,
	`lastReadAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_reading_position_id` PRIMARY KEY(`id`)
);
