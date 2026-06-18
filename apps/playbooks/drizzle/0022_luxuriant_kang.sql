CREATE TABLE `broken_link_scans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`documentTitle` varchar(500),
	`linkUrl` text NOT NULL,
	`linkType` varchar(50) NOT NULL DEFAULT 'external',
	`statusCode` int,
	`errorMessage` varchar(500),
	`scannedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `broken_link_scans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dashboard_widget_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(255) NOT NULL,
	`widgetKey` varchar(100) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	`visible` tinyint NOT NULL DEFAULT 1,
	`width` varchar(20) NOT NULL DEFAULT 'half',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dashboard_widget_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `duplicate_content_scans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceDocId` int NOT NULL,
	`sourceDocTitle` varchar(500),
	`targetDocId` int NOT NULL,
	`targetDocTitle` varchar(500),
	`similarityScore` float NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`scannedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `duplicate_content_scans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_benchmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricKey` varchar(100) NOT NULL,
	`metricLabel` varchar(255) NOT NULL,
	`baselineValue` float NOT NULL,
	`currentValue` float NOT NULL,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`trend` varchar(20) NOT NULL DEFAULT 'flat',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `performance_benchmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_search_filters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`filterConfig` text NOT NULL,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saved_search_filters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_doc_collection_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`collectionId` int NOT NULL,
	`documentId` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_doc_collection_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_doc_collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isPublic` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_doc_collections_id` PRIMARY KEY(`id`)
);
