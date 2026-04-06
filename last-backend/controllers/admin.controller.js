import db from "../db/index.js";
import { eq, and, or, sql, desc, inArray } from "drizzle-orm";
import { sendApprovalMail, sendReactivationMail, sendRejectionMail, sendSuspensionMail } from "../utils/mailer.js";
import { users, patients, appointments, doctors, specializations, doctorSlots, payments, chatMessages, contactMessages } from "../db/schema.js";
import { CreateNotification } from "./response.Controller.js";
import { alias } from "drizzle-orm/gel-core";

export const AdminDashboard = async (req, res) => {
    try {
        const usersList = await db.select().from(users);
        const doctorsList = await db.select().from(doctors);
        const patientsList = await db.select().from(patients);
        const appointmentList = await db.select({ appointmentId: appointments.id, status: appointments.status, doctorId: appointments.doctorId, patientId: appointments.patientId, }).from(appointments);

        const doctorsForApproval = await db
            .select({ doctorId: doctors.id, ...doctors, ...users, specialization: specializations.name, symptoms: specializations.symptoms, })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(and(eq(doctors.status, "pending"), eq(doctors.isApproved, false)));

        const paymentsList = await db
            .select({ paymentId: payments.id, amount: payments.amount, paymentStatus: payments.paymentStatus, paymentMethod: payments.paymentMethod, transactionId: payments.transactionId, paidAt: payments.paidAt, appointmentId: appointments.id, appointmentStatus: appointments.status, patientId: patients.id, patientName: users.fullName, doctorId: doctors.id, specialization: specializations.name, date: doctorSlots.date, startTime: doctorSlots.startTime, })
            .from(payments)
            .leftJoin(appointments, eq(appointments.id, payments.appointmentId))
            .leftJoin(patients, eq(patients.id, appointments.patientId))
            .leftJoin(users, eq(users.id, patients.userId))
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId));

        const totalRevenue = paymentsList.reduce((sum, p) => sum + (p.amount || 0), 0);
        res.json({ success: true, totalUsers: usersList.length, totalDoctors: doctorsList.length, totalPatients: patientsList.length, totalAppointments: appointmentList.length, doctorsForApproval, appointments: appointmentList, payments: paymentsList, totalRevenue, });

    } catch (error) {
        console.error("AdminDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const AllPatients = async (req, res) => {
    try {
        const data = await db.select({ patientId: patients.id, age: patients.age, gender: patients.gender, phone: patients.phone, address: patients.address, disease: patients.disease, bloodGroup: patients.bloodGroup, userId: users.id, fullName: users.fullName, email: users.email, image: users.image, appointmentId: appointments.id, appointmentStatus: appointments.status, doctorId: doctors.id, appointmentDoctor: specializations.name, })
            .from(patients)
            .leftJoin(users, eq(users.id, patients.userId))
            .leftJoin(appointments, eq(appointments.patientId, patients.id))
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId));

        const groupedPatients = {};

        data.forEach((item) => {
            if (!groupedPatients[item.patientId]) {
                groupedPatients[item.patientId] = { patientId: item.patientId, age: item.age, gender: item.gender, phone: item.phone, address: item.address, disease: item.disease, bloodGroup: item.bloodGroup, userId: item.userId, fullName: item.fullName, email: item.email, image: item.image, appointments: [], };
            }

            if (item.appointmentId) {
                groupedPatients[item.patientId].appointments.push({ appointmentId: item.appointmentId, status: item.appointmentStatus, doctorId: item.doctorId, doctor: item.appointmentDoctor, });
            }
        });

        const result = Object.values(groupedPatients);

        res.json({ success: true, patients: result, });

    } catch (error) {
        console.error("AllPatients Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const Webdata = async (req, res) => {
    try {
        const patientsList = (await db.select().from(patients)).length;




        const doctorsdata = await db
            .select({
                doctorId: doctors.id,
                experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, bio: doctors.bio,
                userId: users.id, fullName: users.fullName, email: users.email, image: users.image,
                specialization: specializations.name,
            })
            .from(doctors)
            .where(or(eq(doctors.isApproved, true), eq(doctors.status, "suspanded")))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))

        const doctorsMap = {};

        doctorsdata.forEach((row) => {
            if (!doctorsMap[row.doctorId]) {
                doctorsMap[row.doctorId] = { doctorId: row.doctorId, fullName: row.fullName, email: row.email, image: row.image, specialization: row.specialization, experienceYears: row.experienceYears, consultationFee: row.consultationFee, };
            }


        });

        const doctorsList = Object.values(doctorsMap);




        res.json({ success: true, patients: patientsList, doctorsList: doctorsList });

    } catch (error) {
        console.error("webdata Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
}

export const AllDoctors = async (req, res) => {
    try {
        const data = await db
            .select({
                doctorId: doctors.id,
                experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, license: doctors.licenseNumber, bio: doctors.bio, status: doctors.status, isApproved: doctors.isApproved,
                userId: users.id, fullName: users.fullName, email: users.email, image: users.image,
                specialization: specializations.name,
                startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, date: doctorSlots.date,
                appointmentId: appointments.id, appointmentStatus: appointments.status,
            })
            .from(doctors)
            .where(or(eq(doctors.isApproved, true), eq(doctors.status, "suspanded")))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(appointments, eq(appointments.doctorId, doctors.id))
            .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id));

        const doctorsMap = {};

        data.forEach((row) => {
            if (!doctorsMap[row.doctorId]) {
                doctorsMap[row.doctorId] = { doctorId: row.doctorId, fullName: row.fullName, email: row.email, image: row.image, specialization: row.specialization, experienceYears: row.experienceYears, consultationFee: row.consultationFee, license: row.license, bio: row.bio, status: row.status, isApproved: row.isApproved, slots: [], appointments: [], };
            }

            if (row.startTime) {
                doctorsMap[row.doctorId].slots.push({ startTime: row.startTime, endTime: row.endTime, date: row.date, });
            }

            if (row.appointmentId) {
                doctorsMap[row.doctorId].appointments.push({ id: row.appointmentId, status: row.appointmentStatus, });
            }
        });

        const result = Object.values(doctorsMap);

        res.json({ success: true, doctors: result, });

    } catch (error) {
        console.error("ApprovedDoctors Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const ApproveDoctor = async (req, res) => {
    try {
        let { status, doctorId, name, email } = req.body;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required", });
        }

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required", });
        }

        const normalizedStatus = status.toLowerCase();
        const isApproved = normalizedStatus === "approved";

        if (isApproved) {
            await sendApprovalMail(email, name);
        } else {
            const reason = "Your application has been rejected due to inaccurate or unverifiable information.";
            await sendRejectionMail(email, name, reason);
        }

        const result = await db.update(doctors).set({ status: normalizedStatus, isApproved: isApproved, }).where(eq(doctors.id, Number(doctorId)));

        if (!result) {
            return res.status(404).json({ success: false, message: "Doctor not found", });
        }

        if (!isApproved) {
            setTimeout(async () => {
                try {
                    const doctor = await db.query.doctors.findFirst({ where: eq(doctors.id, doctorId), });

                    if (doctor) {
                        await db.delete(notifications).where(eq(notifications.userId, doctor.userId));
                        await db.delete(doctors).where(eq(doctors.id, doctorId));
                        await db.delete(users).where(eq(users.id, doctor.userId));

                        console.log("Doctor deleted after rejection:", doctorId);
                    }
                } catch (err) { console.error("Delete failed:", err); }
            }, 1000 * 60 * 5);
        }

        return res.status(200).json({ success: true, message: "Doctor status updated", });

    } catch (error) {
        console.error("Update Doctor Status Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update doctor status", });
    }
};

export const SuspandDoctor = async (req, res) => {
    try {
        let { doctorId, name, email } = req.body;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required", });
        }

        const reason = "Your Account has been Suspanded due to ubnormal activity/performance.";
        await sendSuspensionMail(email, name, reason);

        const result = await db.update(doctors).set({ status: "suspanded", isApproved: false, }).where(eq(doctors.id, Number(doctorId)));

        if (!result) {
            return res.status(404).json({ success: false, message: "Doctor not found", });
        }

        return res.status(200).json({ success: true, message: "Doctor suspanded successfully", });

    } catch (error) {
        console.error("suspand Doctor Status Error:", error);
        return res.status(500).json({ success: false, message: "Failed to supand doctor status", });
    }
};

export const ReActivate = async (req, res) => {
    try {
        let { doctorId, name, email } = req.body;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required", });
        }

        await sendReactivationMail(email, name);
        const result = await db.update(doctors).set({ status: "approved", isApproved: true, }).where(eq(doctors.id, Number(doctorId)));

        if (!result) {
            return res.status(404).json({ success: false, message: "Doctor not found", });
        }

        await CreateNotification({ doctorId, message: "Congratulations, your account has been reactivated." });
        return res.status(200).json({ success: true, message: "Doctor ReActivate successfully", });

    } catch (error) {
        console.error("ReActivate Doctor Status Error:", error);
        return res.status(500).json({ success: false, message: "Failed to ReActivate doctor status", });
    }
};

export const getChatList = async (req, res) => {
    try {

        const sender = alias(users, "sender");
        const receiver = alias(users, "receiver");

        const usersList = await db
            .select({
                chat: chatMessages,
                sender: sender,
                receiver: receiver,
            })
            .from(chatMessages)
            .leftJoin(sender, eq(sender.id, chatMessages.senderId))
            .leftJoin(receiver, eq(receiver.id, chatMessages.receiverId));

        const Doctorlist = [];

        usersList.forEach(({ sender, receiver }) => {

            if (sender?.role === "doctor") {
                const exists = Doctorlist.find(d => d.id === sender.id);


                if (!exists) {
                    Doctorlist.push({
                        id: sender.id,
                        name: sender.fullName,
                        email: sender.email,
                        image: sender.image,
                    });
                }
            }

            if (receiver?.role === "doctor") {
                const exists = Doctorlist.find(d => d.id === receiver.id);

                if (!exists) {
                    Doctorlist.push({
                        id: receiver.id,
                        name: receiver.fullName,
                        email: receiver.email,
                        image: receiver.image,
                    });
                }
            }

        });

        return res.status(200).json({
            success: true,
            Doctorlist
        });

    } catch (error) {
        console.error("Error fetching chat data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getChatUser = async (req, res) => {
    try {
        const { id } = req.query;
        const doctor = await db.select().from(doctors).where(eq(doctors.userId, id)).limit(1);
        const patient = await db.select().from(patients).where(eq(patients.userId, id)).limit(1);

        let appointmentUsers = [];

        if (doctor.length) {
            const rows = await db.select({ userId: users.id, appointmentId: appointments.id, }).from(appointments).innerJoin(patients, eq(patients.id, appointments.patientId)).innerJoin(users, eq(users.id, patients.userId)).where(eq(appointments.doctorId, doctor[0].id));
            appointmentUsers.push(...rows);
        }

        if (patient.length) {
            const rows = await db.select({ userId: users.id, appointmentId: appointments.id, }).from(appointments).innerJoin(doctors, eq(doctors.id, appointments.doctorId)).innerJoin(users, eq(users.id, doctors.userId)).where(eq(appointments.patientId, patient[0].id));
            appointmentUsers.push(...rows);
        }

        const appointmentMap = new Map();

        for (const row of appointmentUsers) {
            if (!appointmentMap.has(row.userId)) {
                appointmentMap.set(row.userId, row);
            }
        }

        const uniqueAppointments = Array.from(appointmentMap.values());
        const userIds = uniqueAppointments.map(u => u.userId);

        if (userIds.length === 0) {
            return res.json({ success: true, users: [] });
        }

        const chats = await db.select({ appointmentId: chatMessages.appointmentId, otherUserId: sql`CASE WHEN ${chatMessages.senderId} = ${id} THEN ${chatMessages.receiverId} ELSE ${chatMessages.senderId} END`.as("otherUserId"), lastMessage: chatMessages.message, createdAt: chatMessages.createdAt, })
            .from(chatMessages)
            .where(and(or(eq(chatMessages.senderId, id), eq(chatMessages.receiverId, id)), inArray(sql`CASE WHEN ${chatMessages.senderId} = ${id} THEN ${chatMessages.receiverId} ELSE ${chatMessages.senderId} END `, userIds)))
            .orderBy(desc(chatMessages.createdAt));

        const chatMap = new Map();

        for (const chat of chats) {
            if (!chatMap.has(chat.otherUserId)) {
                chatMap.set(chat.otherUserId, chat);
            }
        }

        const usersData = await db.select({ id: users.id, fullName: users.fullName, image: users.image, }).from(users).where(inArray(users.id, userIds));

        const result = usersData.map(user => {
            const chat = chatMap.get(user.id);
            const appointment = appointmentMap.get(user.id);
            return { userId: user.id, fullName: user.id === id ? `${user.fullName} (You)` : user.fullName, image: user.image, appointmentId: appointment.appointmentId, lastMessage: chat?.lastMessage || null, createdAt: chat?.createdAt || null, };
        });
        return res.json({ success: true, users: result, });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error getting chat users", });
    }
}

export const getChatData = async (req, res) => {
    try {

        const { userId, id } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required", });
        }

        const otherUserId = Number(userId);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const messages = await db.select().from(chatMessages).where(or(and(eq(chatMessages.senderId, id), eq(chatMessages.receiverId, otherUserId)), and(eq(chatMessages.senderId, otherUserId), eq(chatMessages.receiverId, id)))).orderBy(desc(chatMessages.createdAt)).limit(limit).offset(offset);
        const totalResult = await db.select({ count: sql`COUNT(*)`, }).from(chatMessages).where(or(and(eq(chatMessages.senderId, id), eq(chatMessages.receiverId, otherUserId)), and(eq(chatMessages.senderId, otherUserId), eq(chatMessages.receiverId, id))));

        const total = Number(totalResult[0]?.count || 0);
        await db.update(chatMessages).set({ isSeen: true }).where(and(eq(chatMessages.senderId, otherUserId), eq(chatMessages.receiverId, id), eq(chatMessages.isSeen, false)));

        messages.map(message => {
            if (message.senderId == id) {
                message.isMe = true
            }
        })

        return res.status(200).json({ success: true, messages: messages.reverse(), pagination: { page, limit, total, totalPages: Math.ceil(total / limit), }, });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error getting messages", });
    }
};

export const addcontactMessages = async (req, res) => {
    try {
        const { name, email, message } = req.body

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        await db.insert(contactMessages).values({
            name,
            email,
            message,
        })

        return res.status(200).json({
            success: true,
            message: "Message send successfully"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    }
}