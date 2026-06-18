CREATE TABLE `document_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`visitorId` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `document_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`tag` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` mediumtext,
	`editedBy` varchar(100),
	`changeNote` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`query` varchar(500) NOT NULL,
	`resultCount` int DEFAULT 0,
	`visitorId` varchar(100),
	`clickedSlug` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `search_analytics_id` PRIMARY KEY(`id`)
);
