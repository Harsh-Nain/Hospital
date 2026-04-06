import { mysqlTable, int, varchar, text, timestamp, boolean, uniqueIndex, index, json, } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users",
  {
    id: int("id").primaryKey().autoincrement(),
    role: varchar("role", { length: 20 }).notNull(),
    fullName: varchar("full_name", { length: 30 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    password: text("password").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    idUnique: uniqueIndex("users_id_unique").on(table.id),
  })
);

export const specializations = mysqlTable("specializations",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
    symptoms: json("symptoms").notNull(),
  },
  (table) => ({
    nameIndex: uniqueIndex("specialization_name_unique").on(table.name),
  })
);

export const doctors = mysqlTable("doctors",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    specializationId: int("specialization_id").notNull().references(() => specializations.id),
    experienceYears: int("experience_years").default(0),
    licenseNumber: varchar("license_number", { length: 100 }).notNull(),
    consultationFee: int("consultation_fee").notNull(),
    age: int("age"),
    address: varchar("address", { length: 70 }),
    gender: varchar("gender", { length: 10 }),
    phone: varchar("phone", { length: 20 }),
    bio: varchar("bio", { length: 50 }),
    status: varchar("status", { length: 20 }).default("pending"),
    isApproved: boolean("is_approved").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    doctorUserIdx: uniqueIndex("doctor_user_unique").on(table.userId),
    specializationIdx: index("doctor_specialization_idx").on(
      table.specializationId
    ),
  })
);

export const patients = mysqlTable("patients",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    age: int("age"),
    disease: varchar("disease", { length: 100 }),
    gender: varchar("gender", { length: 10 }),
    phone: varchar("phone", { length: 20 }),
    bloodGroup: varchar("bloodGroup", { length: 10 }),
    allergy: varchar("allergy", { length: 30 }),
    bio: varchar("bio", { length: 50 }),
    address: varchar("address", { length: 70 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    patientUserIdx: uniqueIndex("patient_user_unique").on(table.userId),
  })
);

export const medicalReports = mysqlTable("medical_reports",
  {
    id: int("id").primaryKey().autoincrement(),
    patientId: int("patient_id").notNull().references(() => patients.id),
    fileUrl: text("file_url").notNull(),
    diseaseName: varchar("disease_name", { length: 150 }),
    uploadedAt: timestamp("uploaded_at").defaultNow(),
  },
  (table) => ({
    patientIdx: index("medical_patient_idx").on(table.patientId),
  })
);

export const doctorSlots = mysqlTable(
  "doctor_slots",
  {
    id: int("id").primaryKey().autoincrement(),
    doctorId: int("doctor_id").notNull().references(() => doctors.id),
    date: varchar("date", { length: 20 }).notNull(),
    startTime: varchar("start_time", { length: 10 }).notNull(),
    endTime: varchar("end_time", { length: 10 }).notNull(),
    isCancelled: boolean("isCancelled").default(false),
    capacity: int("capacity").default(1),
    createdAt: timestamp("created_at").defaultNow(),
    slotstage: text("slotstage"),

  },
  (table) => ({
    doctorIdx: index("slot_doctor_idx").on(table.doctorId),
  })
);

export const appointments = mysqlTable(
  "appointments",
  {
    id: int("id").primaryKey().autoincrement(),
    doctorId: int("doctor_id").notNull().references(() => doctors.id),
    patientId: int("patient_id").notNull().references(() => patients.id),
    slotId: int("slot_id").notNull().references(() => doctorSlots.id),
    status: varchar("status", { length: 20 }).default("upcoming"),
    meetingLink: text("meeting_link"),
    cancelReason: text("cancelReason"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniquePatientSlot: uniqueIndex("unique_patient_slot").on(table.patientId, table.slotId),
    doctorIdx: index("appointment_doctor_idx").on(table.doctorId),
    patientIdx: index("appointment_patient_idx").on(table.patientId),
    slotIdx: index("appointment_slot_idx").on(table.slotId),
  })
);

export const payments = mysqlTable("payments",
  {
    id: int("id").primaryKey().autoincrement(),
    appointmentId: int("appointment_id").notNull().references(() => appointments.id),
    amount: int("amount").notNull(),
    paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
    paymentMethod: varchar("payment_method", { length: 50 }),
    transactionId: varchar("transaction_id", { length: 150 }),

    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    appointmentIdx: uniqueIndex("payment_appointment_unique").on(table.appointmentId),
  })
);

export const reviews = mysqlTable("reviews",
  {
    id: int("id").primaryKey().autoincrement(),
    doctorId: int("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    patientId: int("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
    rating: int("rating").notNull(),
    reviewText: text("review_text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    doctorIdx: index("review_doctor_idx").on(table.doctorId),
    patientIdx: index("review_patient_idx").on(table.patientId),
  })
);

export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").primaryKey().autoincrement(),
  appointmentId: int("appointment_id").notNull().references(() => appointments.id, { onDelete: "cascade" }),
  senderId: int("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: int("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  fileUrl: json("file_url").default([]),
  isSeen: boolean("is_seen").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
},
  (table) => ({
    appointmentIdx: index("chat_appointment_idx").on(table.appointmentId),
    senderIdx: index("chat_sender_idx").on(table.senderId),
    receiverIdx: index("chat_receiver_idx").on(table.receiverId),
    createdIdx: index("chat_created_idx").on(table.createdAt),
  })
);

export const callLogs = mysqlTable("call_logs",
  {
    id: int("id").primaryKey().autoincrement(),
    appointmentId: int("appointment_id").references(() => appointments.id, { onDelete: "cascade" }),
    callerId: int("caller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    receiverId: int("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    callType: varchar("call_type", { length: 20 }).notNull(),
    status: varchar("status", { length: 20 }).default("missed"),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    duration: int("duration").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    callerIdx: index("call_caller_idx").on(table.callerId),
    receiverIdx: index("call_receiver_idx").on(table.receiverId),
    appointmentIdx: index("call_appointment_idx").on(table.appointmentId),
    createdIdx: index("call_created_idx").on(table.createdAt),
  })
);

export const notifications = mysqlTable("notifications",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("notification_user_idx").on(table.userId),
  })
);


export const contactMessages = mysqlTable(
  "contact_messages",
  {
    id: int("id").primaryKey().autoincrement(),

    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    message: text("message").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
  }
);