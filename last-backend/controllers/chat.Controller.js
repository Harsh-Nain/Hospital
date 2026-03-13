import db from "../db/index.js";
import { chatMessages } from "../db/schema.js";
import { eq, desc, asc, or } from "drizzle-orm";

export const getChatUsers = async (req, res) => {
    try {
        const { userId } = req.query;

        const uid = Number(userId);

        const chats = await db
            .select(chatMessages)
            .from(chatMessages)
            .where(or(eq(chatMessages.senderId, uid), eq(chatMessages.receiverId, uid)))
            .orderBy(desc(chatMessages.createdAt));
        return res.json({ success: true, chats });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error getting chat users" });
    }
};

export const sendMessage = async (req, res) => {

    try {
        const { appointmentId, senderId, receiverId, message } = req.body;

        const fileUrl = req.file ? req.file.path : null;

        if (!appointmentId || !senderId || !receiverId) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        if (!message && !fileUrl) {
            return res.status(400).json({ success: false, message: "Message or file required" });
        }

        const [newMessage] = await db.insert(chatMessages).values({ appointmentId: Number(appointmentId), senderId: Number(senderId), receiverId: Number(receiverId), message: message?.trim() || null, fileUrl })
        res.status(201).json({ success: true, data: newMessage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Message send error" });
    }

};

export const getMessages = async (req, res) => {
    try {
        const { appointmentId } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const messages = await db.select().from(chatMessages).where(eq(chatMessages.appointmentId, Number(appointmentId))).orderBy(asc(chatMessages.createdAt)).limit(limit).offset((page - 1) * limit);
        return res.status(200).json({ success: true, messages });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error getting messages" });
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