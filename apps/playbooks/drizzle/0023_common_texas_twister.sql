CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`company` varchar(255),
	`jobTitle` varchar(255),
	`teamSize` varchar(50),
	`source` varchar(100) DEFAULT 'landing_page',
	`message` text,
	`status` varchar(50) NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
