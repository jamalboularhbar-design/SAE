CREATE TABLE `checklist_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitor_id` varchar(100) NOT NULL,
	`persona` varchar(50) NOT NULL,
	`item_id` varchar(50) NOT NULL,
	`completed_date` varchar(10) NOT NULL,
	`completed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `checklist_completions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `provider_quality_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider_id` int NOT NULL,
	`visitor_id` varchar(100) NOT NULL,
	`type` varchar(50) NOT NULL,
	`content` text NOT NULL,
	`rating` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `provider_quality_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`tier` varchar(20) NOT NULL,
	`location` varchar(255),
	`contact_name` varchar(255),
	`contact_phone` varchar(50),
	`contact_email` varchar(255),
	`room_count` int,
	`price_range` varchar(100),
	`specialties` text,
	`quality_score` float DEFAULT 0,
	`response_time_avg` int,
	`notes` text,
	`status` enum('active','probation','suspended','inactive') NOT NULL DEFAULT 'active',
	`last_audit_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shift_handover_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitor_id` varchar(100) NOT NULL,
	`persona` varchar(50) NOT NULL,
	`priority` varchar(20) NOT NULL,
	`category` varchar(50) NOT NULL,
	`content` text NOT NULL,
	`shift_date` varchar(10) NOT NULL,
	`shift_type` varchar(20) NOT NULL,
	`resolved` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shift_handover_notes_id` PRIMARY KEY(`id`)
);
