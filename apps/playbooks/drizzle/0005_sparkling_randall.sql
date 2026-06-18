CREATE TABLE `activity_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`action` varchar(50) NOT NULL,
	`documentSlug` varchar(255),
	`visitorId` varchar(100),
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`message` text NOT NULL,
	`type` enum('info','warning','success') NOT NULL DEFAULT 'info',
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`color` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `custom_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `custom_categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `download_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`visitorId` varchar(100),
	`format` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `download_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `documents` ADD `status` enum('draft','review','published') DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE `documents` ADD `pinned` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `documents` ADD `reviewBy` timestamp;