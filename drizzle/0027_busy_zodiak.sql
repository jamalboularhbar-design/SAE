CREATE TABLE `nurture_emails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trialId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`sequenceStep` varchar(50) NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`openedAt` timestamp,
	`clickedAt` timestamp,
	CONSTRAINT `nurture_emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`companyName` varchar(255),
	`fullName` varchar(255) NOT NULL,
	`teamSize` varchar(50),
	`useCase` text,
	`status` enum('active','expired','converted','cancelled') NOT NULL DEFAULT 'active',
	`planTier` enum('starter','professional','enterprise') NOT NULL DEFAULT 'professional',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`convertedAt` timestamp,
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`referrer` text,
	`documentsViewed` int DEFAULT 0,
	`searchesPerformed` int DEFAULT 0,
	`featuresUsed` text,
	`lastActiveAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trials_id` PRIMARY KEY(`id`)
);
