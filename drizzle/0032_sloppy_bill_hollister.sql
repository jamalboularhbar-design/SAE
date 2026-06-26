CREATE TABLE `ai_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceName` varchar(100) NOT NULL,
	`model` varchar(100) NOT NULL DEFAULT 'default',
	`temperature` float NOT NULL DEFAULT 0.7,
	`maxTokens` int NOT NULL DEFAULT 2000,
	`systemPrompt` text,
	`isEnabled` int NOT NULL DEFAULT 1,
	`totalCalls` int NOT NULL DEFAULT 0,
	`totalTokensUsed` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `api_keys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`keyHash` varchar(255) NOT NULL,
	`keyPrefix` varchar(12) NOT NULL,
	`scopes` json NOT NULL DEFAULT ('[]'),
	`lastUsedAt` timestamp,
	`expiresAt` timestamp,
	`isRevoked` int NOT NULL DEFAULT 0,
	`totalRequests` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_keys_id` PRIMARY KEY(`id`)
);
