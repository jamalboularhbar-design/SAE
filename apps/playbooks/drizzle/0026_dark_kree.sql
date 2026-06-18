CREATE TABLE `invite_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`invitedBy` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`acceptedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invite_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `invite_tokens_token_unique` UNIQUE(`token`)
);
