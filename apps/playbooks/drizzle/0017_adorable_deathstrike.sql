CREATE TABLE `admin_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`permission` varchar(100) NOT NULL,
	`grantedBy` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `approval_sla_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`maxHoursInReview` int NOT NULL DEFAULT 48,
	`alertEnabled` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `approval_sla_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_access_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`requesterOpenId` varchar(64) NOT NULL,
	`requesterName` varchar(255),
	`reason` text,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`reviewedBy` varchar(64),
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_access_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_citations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`style` varchar(20) NOT NULL,
	`citation` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_citations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `onboarding_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`taskKey` varchar(100) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `onboarding_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhook_event_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`webhookId` int NOT NULL,
	`event` varchar(50) NOT NULL,
	`payload` text,
	`responseStatus` int,
	`responseBody` text,
	`success` boolean NOT NULL DEFAULT false,
	`retriesLeft` int NOT NULL DEFAULT 2,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhook_event_log_id` PRIMARY KEY(`id`)
);
