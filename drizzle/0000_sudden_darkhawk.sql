CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lists_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`listId` integer NOT NULL,
	`itemId` integer NOT NULL,
	PRIMARY KEY(`itemId`, `listId`),
	FOREIGN KEY (`listId`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
