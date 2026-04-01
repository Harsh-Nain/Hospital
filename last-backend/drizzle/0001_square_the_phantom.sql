ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_doctor_id_doctors_id_fk`;
--> statement-breakpoint
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_patient_id_patients_id_fk`;
--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_doctor_id_doctors_id_fk` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `review_patient_idx` ON `reviews` (`patient_id`);