CREATE TABLE `onboarding_state` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStep` int NOT NULL DEFAULT 0,
	`completedSteps` json NOT NULL DEFAULT ('[]'),
	`formData` json NOT NULL DEFAULT ('{}'),
	`isComplete` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `onboarding_state_id` PRIMARY KEY(`id`)
);
