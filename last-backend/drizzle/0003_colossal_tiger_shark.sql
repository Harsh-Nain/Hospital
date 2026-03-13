CREATE TABLE `disease_symptoms` (
	`disease_id` int NOT NULL,
	`symptom_id` int NOT NULL,
	CONSTRAINT `disease_symptom_unique` UNIQUE(`disease_id`,`symptom_id`)
);
--> statement-breakpoint
CREATE TABLE `diseases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`specialization_id` int NOT NULL,
	CONSTRAINT `diseases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `symptoms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `symptoms_id` PRIMARY KEY(`id`),
	CONSTRAINT `symptom_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `patients` RENAME COLUMN `disease` TO `disease_id`;--> statement-breakpoint
ALTER TABLE `doctor_slots` MODIFY COLUMN `date` date NOT NULL;--> statement-breakpoint
ALTER TABLE `doctor_slots` MODIFY COLUMN `start_time` time NOT NULL;--> statement-breakpoint
ALTER TABLE `doctor_slots` MODIFY COLUMN `end_time` time NOT NULL;--> statement-breakpoint
ALTER TABLE `patients` MODIFY COLUMN `disease_id` int;--> statement-breakpoint
ALTER TABLE `doctors` ADD `bio` varchar(200);--> statement-breakpoint
ALTER TABLE `patients` ADD `blood_group` varchar(10);--> statement-breakpoint
ALTER TABLE `patients` ADD `allergy` varchar(100);--> statement-breakpoint
ALTER TABLE `patients` ADD `bio` varchar(200);--> statement-breakpoint
ALTER TABLE `patients` ADD `address` varchar(150);--> statement-breakpoint
ALTER TABLE `disease_symptoms` ADD CONSTRAINT `disease_symptoms_disease_id_diseases_id_fk` FOREIGN KEY (`disease_id`) REFERENCES `diseases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disease_symptoms` ADD CONSTRAINT `disease_symptoms_symptom_id_symptoms_id_fk` FOREIGN KEY (`symptom_id`) REFERENCES `symptoms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `diseases` ADD CONSTRAINT `diseases_specialization_id_specializations_id_fk` FOREIGN KEY (`specialization_id`) REFERENCES `specializations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `disease_symptom_disease_idx` ON `disease_symptoms` (`disease_id`);--> statement-breakpoint
CREATE INDEX `disease_symptom_symptom_idx` ON `disease_symptoms` (`symptom_id`);--> statement-breakpoint
CREATE INDEX `disease_specialization_idx` ON `diseases` (`specialization_id`);--> statement-breakpoint
ALTER TABLE `patients` ADD CONSTRAINT `patients_disease_id_diseases_id_fk` FOREIGN KEY (`disease_id`) REFERENCES `diseases`(`id`) ON DELETE no action ON UPDATE no action;