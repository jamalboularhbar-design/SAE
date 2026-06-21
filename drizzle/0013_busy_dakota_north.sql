CREATE TABLE `ai_summaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`summary` mediumtext NOT NULL,
	`language` varchar(10) NOT NULL DEFAULT 'en',
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_summaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`language` varchar(10) NOT NULL,
	`translatedTitle` varchar(500) NOT NULL,
	`translatedContent` mediumtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_streak_leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`userName` varchar(255),
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`totalDocsRead` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reading_streak_leaderboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`notificationFrequency` enum('realtime','daily','weekly','off') NOT NULL DEFAULT 'realtime',
	`defaultSort` varchar(20) DEFAULT 'newest',
	`readingSpeedWpm` int DEFAULT 200,
	`preferredTheme` varchar(10) DEFAULT 'dark',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_preferences_userOpenId_unique` UNIQUE(`userOpenId`)
);
