import { notifications } from "../db/schema.js";
import { reviews } from "../db/schema.js";
import { eq, desc, } from "drizzle-orm";
import db from "../db/index.js";

export const CreateReview = async (req, res) => {
    try {
        const { doctorId, patientId, rating, reviewText } = req.body;

        await db.insert(reviews).values({ doctorId, patientId, rating, reviewText });
        res.json({ success: true, message: "Review submitted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export default async function CreateNotification(userId, message) {
    try {
        await db.insert(notifications).values({ userId, message });
        return ({ success: true, message: "Notification sent" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const getNotifications = async (req, res) => {

    try {
        const { id } = req.user;

        const notif = await db.select().from(notifications).where(eq(notifications.userId, id)).orderBy(desc(notifications.createdAt));
        res.json({ success: true, notifications: notif });

    } catch (error) {
        console.error("Notifications Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const MarkNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.body;

        await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
        res.json({ success: true, message: "Notification marked as read" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const DeleteReview = async (req, res) => {
    try {
        const { reviewId } = req.query;

        await db.delete(reviews).where(eq(reviews.id, reviewId));
        res.json({ success: true, message: "Review deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const GetDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.query;

        const data = await db.select().from(reviews).where(eq(reviews.doctorId, doctorId));
        res.json({ success: true, reviews: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const DeleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        console.log(notificationId);

        await db.delete(notifications).where(eq(notifications.id, notificationId));

        res.json({ success: true, message: "Notification deleted" });

    } catch (error) {
        console.error("DeleteNotification Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};