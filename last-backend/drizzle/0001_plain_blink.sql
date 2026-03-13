DROP TABLE `disease_symptoms`;--> statement-breakpoint
DROP TABLE `diseases`;--> statement-breakpoint
DROP TABLE `symptoms`;--> statement-breakpoint
ALTER TABLE `patients` DROP FOREIGN KEY `patients_disease_id_diseases_id_fk`;
--> statement-breakpoint
ALTER TABLE `doctor_slots` MODIFY COLUMN `date` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `doctor_slots` MODIFY COLUMN `start_time` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `doctor_slots` MODIFY COLUMN `end_time` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `doctors` MODIFY COLUMN `bio` varchar(50);--> statement-breakpoint
ALTER TABLE `patients` MODIFY COLUMN `allergy` varchar(30);--> statement-breakpoint
ALTER TABLE `patients` MODIFY COLUMN `bio` varchar(50);--> statement-breakpoint
ALTER TABLE `patients` MODIFY COLUMN `address` varchar(70);--> statement-breakpoint
ALTER TABLE `patients` ADD `disease` varchar(100);--> statement-breakpoint
ALTER TABLE `patients` ADD `bloodGroup` varchar(10);--> statement-breakpoint
ALTER TABLE `patients` DROP COLUMN `disease_id`;--> statement-breakpoint
ALTER TABLE `patients` DROP COLUMN `blood_group`;