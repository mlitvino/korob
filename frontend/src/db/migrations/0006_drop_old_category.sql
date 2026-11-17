-- Repair databases where an early draft of 0004 ran without seeding the built-ins.
INSERT OR IGNORE INTO `categories` (`id`, `type`, `key`, `sortOrder`) VALUES
	('income-salary', 'income', 'salary', 0),
	('income-freelance', 'income', 'freelance', 1),
	('income-gift', 'income', 'gift', 2),
	('income-investment', 'income', 'investment', 3),
	('income-other', 'income', 'other', 4),
	('expense-food', 'expense', 'food', 0),
	('expense-transport', 'expense', 'transport', 1),
	('expense-housing', 'expense', 'housing', 2),
	('expense-entertainment', 'expense', 'entertainment', 3),
	('expense-shopping', 'expense', 'shopping', 4),
	('expense-health', 'expense', 'health', 5),
	('expense-other', 'expense', 'other', 6);
--> statement-breakpoint
UPDATE `transactions` SET `categoryId` = `type` || '-' || `category`
	WHERE `categoryId` IS NULL AND `type` || '-' || `category` IN (SELECT `id` FROM `categories`);
--> statement-breakpoint
-- Anything still unlinked, or pointing to a category that does not exist, gets its type's "other".
UPDATE `transactions` SET `categoryId` = `type` || '-other'
	WHERE `categoryId` IS NULL OR `categoryId` NOT IN (SELECT `id` FROM `categories`);
--> statement-breakpoint
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