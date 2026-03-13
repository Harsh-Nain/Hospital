CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`doctor_id` int NOT NULL,
	`patient_id` int NOT NULL,
	`slot_id` int NOT NULL,
	`status` varchar(20) DEFAULT 'upcoming',
	`meeting_link` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`),
	CONSTRAINT `appointment_slot_unique` UNIQUE(`slot_id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointment_id` int NOT NULL,
	`sender_id` int NOT NULL,
	`receiver_id` int NOT NULL,
	`message` text NOT NULL,
	`file_url` varchar(500),
	`is_seen` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `doctor_slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`doctor_id` int NOT NULL,
	`date` date NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`is_booked` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `doctor_slots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doctors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`specialization_id` int NOT NULL,
	`experience_years` int DEFAULT 0,
	`license_number` varchar(100) NOT NULL,
	`consultation_fee` int NOT NULL,
	`bio` varchar(200),
	`status` varchar(20) DEFAULT 'pending',
	`is_approved` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `doctors_id` PRIMARY KEY(`id`),
	CONSTRAINT `doctor_user_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `medical_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_id` int NOT NULL,
	`file_url` text NOT NULL,
	`disease_name` varchar(150),
	`uploaded_at` timestamp DEFAULT (now()),
	CONSTRAINT `medical_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`message` text NOT NULL,
	`is_read` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`age` int,
	`disease_id` int,
	`gender` varchar(10),
	`phone` varchar(20),
	`blood_group` varchar(10),
	`allergy` varchar(100),
	`bio` varchar(200),
	`address` varchar(150),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `patient_user_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointment_id` int NOT NULL,
	`amount` int NOT NULL,
	`payment_status` varchar(20) DEFAULT 'pending',
	`payment_method` varchar(50),
	`transaction_id` varchar(150),
	`paid_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_appointment_unique` UNIQUE(`appointment_id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`doctor_id` int NOT NULL,
	`patient_id` int NOT NULL,
	`rating` int NOT NULL,
	`review_text` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `specializations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `specializations_id` PRIMARY KEY(`id`),
	CONSTRAINT `specialization_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `symptoms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `symptoms_id` PRIMARY KEY(`id`),
	CONSTRAINT `symptom_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role` varchar(20) NOT NULL,
	`full_name` varchar(30) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` text NOT NULL,
	`image` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_doctor_id_doctors_id_fk` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_slot_id_doctor_slots_id_fk` FOREIGN KEY (`slot_id`) REFERENCES `doctor_slots`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_appointment_id_appointments_id_fk` FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_sender_id_users_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_receiver_id_users_id_fk` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disease_symptoms` ADD CONSTRAINT `disease_symptoms_disease_id_diseases_id_fk` FOREIGN KEY (`disease_id`) REFERENCES `diseases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disease_symptoms` ADD CONSTRAINT `disease_symptoms_symptom_id_symptoms_id_fk` FOREIGN KEY (`symptom_id`) REFERENCES `symptoms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `diseases` ADD CONSTRAINT `diseases_specialization_id_specializations_id_fk` FOREIGN KEY (`specialization_id`) REFERENCES `specializations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `doctor_slots` ADD CONSTRAINT `doctor_slots_doctor_id_doctors_id_fk` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_specialization_id_specializations_id_fk` FOREIGN KEY (`specialization_id`) REFERENCES `specializations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_reports` ADD CONSTRAINT `medical_reports_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patients` ADD CONSTRAINT `patients_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patients` ADD CONSTRAINT `patients_disease_id_diseases_id_fk` FOREIGN KEY (`disease_id`) REFERENCES `diseases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_appointment_id_appointments_id_fk` FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_doctor_id_doctors_id_fk` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_patient_id_patients_id_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `appointment_doctor_idx` ON `appointments` (`doctor_id`);--> statement-breakpoint
CREATE INDEX `appointment_patient_idx` ON `appointments` (`patient_id`);--> statement-breakpoint
CREATE INDEX `chat_appointment_idx` ON `chat_messages` (`appointment_id`);--> statement-breakpoint
CREATE INDEX `chat_sender_idx` ON `chat_messages` (`sender_id`);--> statement-breakpoint
CREATE INDEX `chat_receiver_idx` ON `chat_messages` (`receiver_id`);--> statement-breakpoint
CREATE INDEX `chat_created_idx` ON `chat_messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `disease_symptom_disease_idx` ON `disease_symptoms` (`disease_id`);--> statement-breakpoint
CREATE INDEX `disease_symptom_symptom_idx` ON `disease_symptoms` (`symptom_id`);--> statement-breakpoint
CREATE INDEX `disease_specialization_idx` ON `diseases` (`specialization_id`);--> statement-breakpoint
CREATE INDEX `slot_doctor_idx` ON `doctor_slots` (`doctor_id`);--> statement-breakpoint
CREATE INDEX `doctor_specialization_idx` ON `doctors` (`specialization_id`);--> statement-breakpoint
CREATE INDEX `medical_patient_idx` ON `medical_reports` (`patient_id`);--> statement-breakpoint
CREATE INDEX `notification_user_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `review_doctor_idx` ON `reviews` (`doctor_id`);