CREATE TABLE `collection_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`collectionId` int NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collection_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`coverColor` varchar(20) DEFAULT '#c9a96e',
	`isPublished` int NOT NULL DEFAULT 0,
	`createdBy` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `document_collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `documents` ADD `visibility` enum('public','private') DEFAULT 'public' NOT NULL;