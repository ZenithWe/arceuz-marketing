CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`channel` text NOT NULL,
	`status` text NOT NULL,
	`date` text DEFAULT '' NOT NULL,
	`end_date` text DEFAULT '' NOT NULL,
	`budget` real DEFAULT 0 NOT NULL,
	`goal` text DEFAULT '' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_entries_user_updated` ON `entries` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`business` text DEFAULT '' NOT NULL,
	`segment` text DEFAULT '' NOT NULL,
	`audience` text DEFAULT '' NOT NULL,
	`tone` text DEFAULT 'Profissional' NOT NULL
);
