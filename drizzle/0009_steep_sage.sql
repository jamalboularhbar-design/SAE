CREATE TABLE `branding_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(100) NOT NULL,
	`settingValue` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `branding_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `branding_settings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `inline_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`highlightText` text NOT NULL,
	`comment` text NOT NULL,
	`parentId` int,
	`resolved` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inline_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recently_viewed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recently_viewed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`events` text NOT NULL,
	`secret` varchar(100),
	`active` int NOT NULL DEFAULT 1,
	`lastTriggeredAt` timestamp,
	`failCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webhooks_id` PRIMARY KEY(`id`)
);
