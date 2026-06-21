CREATE TABLE `document_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`rating` enum('up','down') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_list_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listId` int NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reading_list_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_lists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reading_lists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `documents` ADD `viewCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `documents` ADD `upvotes` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `documents` ADD `downvotes` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `documents` ADD `summary` text;