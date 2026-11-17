-- Rows that 0004 could not link (type/category mismatch) get their type's "other".
UPDATE `transactions` SET `categoryId` = `type` || '-other' WHERE `categoryId` IS NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`categoryId` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`occurredAt` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer DEFAULT 0 NOT NULL,
	`description` text,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "type", "categoryId", "amount", "currency", "occurredAt", "createdAt", "updatedAt", "description") SELECT "id", "type", "categoryId", "amount", "currency", "occurredAt", "createdAt", "updatedAt", "description" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;