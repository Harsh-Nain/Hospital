ALTER TABLE `appointments` DROP INDEX `appointment_slot_unique`;--> statement-breakpoint
ALTER TABLE `doctor_slots` ADD `isCancelled` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `doctor_slots` ADD `cancelReason` text;--> statement-breakpoint
ALTER TABLE `doctor_slots` ADD `capacity` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `unique_patient_slot` UNIQUE(`patient_id`,`slot_id`);--> statement-breakpoint
CREATE INDEX `appointment_slot_idx` ON `appointments` (`slot_id`);--> statement-breakpoint
ALTER TABLE `doctor_slots` DROP COLUMN `is_booked`;--> statement-breakpoint
ALTER TABLE `doctor_slots` DROP COLUMN `is_cancelled`;--> statement-breakpoint
ALTER TABLE `doctor_slots` DROP COLUMN `cancel_reason`;