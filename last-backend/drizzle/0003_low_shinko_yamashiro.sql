ALTER TABLE `users` DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `doctors` ADD `age` int;--> statement-breakpoint
ALTER TABLE `doctors` ADD `address` varchar(70);--> statement-breakpoint
ALTER TABLE `doctors` ADD `gender` varchar(10);--> statement-breakpoint
ALTER TABLE `doctors` ADD `phone` varchar(20);