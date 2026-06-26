CREATE TABLE `document_annotations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`highlightText` text NOT NULL,
	`note` text,
	`color` varchar(20) NOT NULL DEFAULT 'yellow',
	`startOffset` int NOT NULL,
	`endOffset` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_annotations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`questions` mediumtext NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_reminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`reviewDate` timestamp NOT NULL,
	`frequency` enum('once','weekly','monthly','quarterly') NOT NULL DEFAULT 'once',
	`lastNotified` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `review_reminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_filters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`filterConfig` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_filters_id` PRIMARY KEY(`id`)
);
