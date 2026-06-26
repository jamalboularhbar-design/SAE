CREATE TABLE `guest_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guest_id` int,
	`guest_name` varchar(255) NOT NULL,
	`provider_id` int,
	`provider_name` varchar(255),
	`rating` int NOT NULL,
	`category` varchar(100),
	`comment` text,
	`source` varchar(100),
	`stay_date` timestamp,
	`persona` varchar(50) NOT NULL DEFAULT 'riad-routes',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guest_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`nationality` varchar(100),
	`language` varchar(50),
	`vip_level` enum('standard','silver','gold','platinum') NOT NULL DEFAULT 'standard',
	`preferences` text,
	`dietary_restrictions` text,
	`room_preferences` text,
	`special_occasions` text,
	`total_stays` int NOT NULL DEFAULT 0,
	`last_stay_date` timestamp,
	`preferred_provider_id` int,
	`notes` text,
	`persona` varchar(50) NOT NULL DEFAULT 'riad-routes',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`status` enum('open','investigating','resolved','closed') NOT NULL DEFAULT 'open',
	`persona` varchar(50) NOT NULL DEFAULT 'riad-routes',
	`category` varchar(100),
	`provider_id` int,
	`provider_name` varchar(255),
	`assigned_to` varchar(255),
	`resolution` text,
	`resolved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `incidents_id` PRIMARY KEY(`id`)
);
