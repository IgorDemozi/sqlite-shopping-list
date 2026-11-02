PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` text PRIMARY KEY DEFAULT '2abd75d3-31bb-46ea-a83e-cc350700dc35' NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_items`("id", "name") SELECT "id", "name" FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_lists` (
	`id` text PRIMARY KEY DEFAULT 'af03a199-a084-47f1-85a9-fa023fb9da45' NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_lists`("id", "name") SELECT "id", "name" FROM `lists`;--> statement-breakpoint
DROP TABLE `lists`;--> statement-breakpoint
ALTER TABLE `__new_lists` RENAME TO `lists`;--> statement-breakpoint
CREATE TABLE `__new_lists_items` (
	`id` text PRIMARY KEY DEFAULT '9e0b2fbc-7873-407f-b2a0-0765f193b111' NOT NULL,
	`listId` text NOT NULL,
	`itemId` text NOT NULL,
	PRIMARY KEY(`itemId`, `listId`),
	FOREIGN KEY (`listId`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_lists_items`("id", "listId", "itemId") SELECT "id", "listId", "itemId" FROM `lists_items`;--> statement-breakpoint
DROP TABLE `lists_items`;--> statement-breakpoint
ALTER TABLE `__new_lists_items` RENAME TO `lists_items`;