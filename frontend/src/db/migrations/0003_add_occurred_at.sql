ALTER TABLE `transactions` ADD `occurredAt` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `transactions` SET `occurredAt` = `createdAt`;
