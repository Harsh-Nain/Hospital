import { relations } from "drizzle-orm";
import { users, doctors, patients, specializations, doctorSlots, appointments, payments, reviews, chatMessages, medicalReports, notifications, } from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  doctorProfile: one(doctors, { fields: [users.id], references: [doctors.userId], }),
  patientProfile: one(patients, { fields: [users.id], references: [patients.userId], }),
  sentMessages: many(chatMessages, { relationName: "sender", }),
  receivedMessages: many(chatMessages, { relationName: "receiver", }),
  notifications: many(notifications),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, { fields: [doctors.userId], references: [users.id], }),
  specialization: one(specializations, { fields: [doctors.specializationId], references: [specializations.id], }),
  slots: many(doctorSlots),
  appointments: many(appointments),
  reviews: many(reviews),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, { fields: [patients.userId], references: [users.id], }),
  appointments: many(appointments),
  reports: many(medicalReports),
}));

export const doctorSlotsRelations = relations(
  doctorSlots,
  ({ one, many }) => ({
    doctor: one(doctors, { fields: [doctorSlots.doctorId], references: [doctors.id], }),
    appointments: many(appointments),
  })
);

export const appointmentsRelations = relations(
  appointments,
  ({ one, many }) => ({
    doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id], }),
    patient: one(patients, { fields: [appointments.patientId], references: [patients.id], }),
    slot: one(doctorSlots, { fields: [appointments.slotId], references: [doctorSlots.id], }),

    payments: many(payments),
    messages: many(chatMessages),
  })
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  appointment: one(appointments, { fields: [payments.appointmentId], references: [appointments.id], }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  doctor: one(doctors, { fields: [reviews.doctorId], references: [doctors.id], }),
  patient: one(patients, { fields: [reviews.patientId], references: [patients.id], }),
}));

export const chatMessagesRelations = relations(
  chatMessages,
  ({ one }) => ({
    appointment: one(appointments, { fields: [chatMessages.appointmentId], references: [appointments.id], }),
    sender: one(users, { fields: [chatMessages.senderId], references: [users.id], relationName: "sender", }),
    receiver: one(users, { fields: [chatMessages.receiverId], references: [users.id], relationName: "receiver", }),
  })
);

export const medicalReportsRelations = relations(
  medicalReports,
  ({ one }) => ({ patient: one(patients, { fields: [medicalReports.patientId], references: [patients.id], }), })
);

export const notificationsRelations = relations(
  notifications,
  ({ one }) => ({ user: one(users, { fields: [notifications.userId], references: [users.id], }), })
);