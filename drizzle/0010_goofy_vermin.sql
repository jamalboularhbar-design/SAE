CREATE TABLE `category_ordering` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryName` varchar(100) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `category_ordering_id` PRIMARY KEY(`id`),
	CONSTRAINT `category_ordering_categoryName_unique` UNIQUE(`categoryName`)
);
--> statement-breakpoint
CREATE TABLE `document_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`sentiment` enum('positive','negative') NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_feedback_id` PRIMARY KEY(`id`)
);
