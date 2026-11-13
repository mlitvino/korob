CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`key` text,
	`name` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`archivedAt` integer
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD `categoryId` text;--> statement-breakpoint
INSERT INTO `categories` (`id`, `type`, `key`, `sortOrder`) VALUES
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
	WHERE `type` || '-' || `category` IN (SELECT `id` FROM `categories`);
