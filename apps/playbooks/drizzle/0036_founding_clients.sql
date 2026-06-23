ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `membershipTier` enum('none','founding','membership') DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `companyName` varchar(255);--> statement-breakpoint
ALTER TABLE `invite_tokens` ADD `companyName` varchar(255);--> statement-breakpoint
ALTER TABLE `invite_tokens` ADD `inviteeName` varchar(255);--> statement-breakpoint
ALTER TABLE `invite_tokens` ADD `membershipTier` enum('team','founding') DEFAULT 'team' NOT NULL;--> statement-breakpoint
ALTER TABLE `invite_tokens` ADD `workspaceId` int;
