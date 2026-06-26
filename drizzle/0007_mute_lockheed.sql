CREATE TABLE `document_audit_trail` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentSlug` varchar(255) NOT NULL,
	`action` varchar(50) NOT NULL,
	`field` varchar(100),
	`oldValue` text,
	`newValue` text,
	`changedBy` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_audit_trail_id` PRIMARY KEY(`id`)
);
