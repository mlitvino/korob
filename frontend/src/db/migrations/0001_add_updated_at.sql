ALTER TABLE `transactions` ADD `updatedAt` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `transactions` SET `updatedAt` = `createdAt`;
