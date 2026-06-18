CREATE TABLE `ai_usage_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`service` varchar(50) NOT NULL,
	`tokens_input` int NOT NULL DEFAULT 0,
	`tokens_output` int NOT NULL DEFAULT 0,
	`cost_estimate` varchar(20) NOT NULL DEFAULT '0.00',
	`model` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_usage_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_field_definitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`label` varchar(200) NOT NULL,
	`field_type` varchar(30) NOT NULL DEFAULT 'text',
	`options` json,
	`category` varchar(100),
	`is_required` int NOT NULL DEFAULT 0,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `custom_field_definitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_field_values` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_id` int NOT NULL,
	`document_id` int NOT NULL,
	`value` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `custom_field_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_discussion_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`discussion_id` int NOT NULL,
	`content` text NOT NULL,
	`author_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_discussion_replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_discussions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`author_id` int NOT NULL,
	`is_pinned` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_discussions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`assignee_id` int,
	`status` varchar(50) NOT NULL DEFAULT 'todo',
	`priority` varchar(20) NOT NULL DEFAULT 'medium',
	`due_date` timestamp,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhook_deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`webhook_id` varchar(100) NOT NULL,
	`event_type` varchar(100) NOT NULL,
	`target_url` varchar(500) NOT NULL,
	`request_payload` json,
	`response_status` int,
	`response_body` text,
	`delivery_status` varchar(20) NOT NULL DEFAULT 'pending',
	`retry_count` int NOT NULL DEFAULT 0,
	`next_retry_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `webhook_deliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflow_sla_breaches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`document_id` int NOT NULL,
	`stage` varchar(50) NOT NULL,
	`entered_at` timestamp NOT NULL,
	`breached_at` timestamp NOT NULL DEFAULT (now()),
	`resolved_at` timestamp,
	`max_hours` int NOT NULL,
	CONSTRAINT `workflow_sla_breaches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflow_sla_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stage` varchar(50) NOT NULL,
	`max_hours` int NOT NULL DEFAULT 48,
	`alert_email` varchar(255),
	`is_active` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workflow_sla_config_id` PRIMARY KEY(`id`)
);
