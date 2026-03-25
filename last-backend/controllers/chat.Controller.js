import db from "../db/index.js";
import { users, chatMessages, appointments, doctors, patients } from "../db/schema.js";
import { eq, desc, and, or, sql, inArray } from "drizzle-orm";

export const getChatUsers = async (req, res) => {
    try {
        const { id } = req.user;
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
};

export const sendMessage = async (req, res) => {
    try {
        let { appointmentId, receiverId, message } = req.body;
        const { id: senderId } = req.user;

        const fileUrl = req.file ? req.file.path : null;

        if (!appointmentId || !receiverId) {
            return res.status(400).json({ success: false, message: "Required fields missing", });
        }

        if (!message && !fileUrl) {
            return res.status(400).json({ success: false, message: "Message or file required", });
        }

        let finalMessage = message?.trim() || "";

        if (!finalMessage && fileUrl) {
            finalMessage = "📷 Image";
        }

        const [inserted] = await db.insert(chatMessages).values({ appointmentId: Number(appointmentId), senderId, receiverId: Number(receiverId), message: finalMessage, fileUrl, isSeen: false, }).$returningId();
        const insertedId = inserted.id;

        const [saved] = await db.select().from(chatMessages).where(eq(chatMessages.id, insertedId));
        const io = req.app.get("io");
        saved.isMe = false

        const payload = { ...saved, imageUrl: saved.fileUrl, };
        console.log(receiverId, senderId);

        io.to(String(receiverId)).emit("newMessage", payload);
        // io.to(String(senderId)).emit("newMessage", payload);

        res.status(201).json({ success: true, data: payload, });

    } catch (error) {
        console.error("❌ sendMessage error:", error);
        res.status(500).json({ success: false, message: "Message send error", });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id } = req.user;
        const { userId } = req.query;

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

export const editMessage = async (req, res) => {
    try {

        const { messageId } = req.query;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message required" });
        }

        await db.update(chatMessages).set({ message: message.trim() }).where(eq(chatMessages.id, Number(messageId)));
        return res.json({ success: true, message: "Message updated" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error editing message" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.query;

        await db.delete(chatMessages).where(eq(chatMessages.id, Number(messageId)));
        return res.json({ success: true, message: "Message deleted" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Delete message error" });
    }
};

export const markMessageSeen = async (req, res) => {
    try {
        const { appointmentId } = req.query;

        await db.update(chatMessages).set({ isSeen: true }).where(eq(chatMessages.appointmentId, Number(appointmentId)));
        return res.json({ success: true, message: "Messages marked as seen" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error marking messages" });
    }
};