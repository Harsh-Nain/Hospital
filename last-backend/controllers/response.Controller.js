import { doctors, notifications, patients, users } from "../db/schema.js";
import { reviews } from "../db/schema.js";
import { eq, desc, count } from "drizzle-orm";
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
        const { notificationId } = req.query;

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
        const { notificationId } = req.query;

        await db.delete(notifications).where(eq(notifications.id, notificationId));

        res.json({ success: true, message: "Notification deleted" });

    } catch (error) {
        console.error("DeleteNotification Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserIds = async ({ doctorId, patientId, allUsers = false }) => {
    if (allUsers) {
        const all = await db.select({ userId: users.id }).from(users);
        return all.map(u => u.userId);
    }

    let userIds = [];

    if (doctorId) {
        const doctor = await db.select({ userId: doctors.userId }).from(doctors).where(eq(doctors.id, doctorId));

        if (doctor.length) {
            userIds.push(doctor[0].userId);
        }
    }

    if (patientId) {
        const patient = await db.select({ userId: patients.userId }).from(patients).where(eq(patients.id, patientId));

        if (patient.length) {
            userIds.push(patient[0].userId);
        }
    }
    return userIds;
};

export const CreateNotification = async ({ doctorId, patientId, message, allUsers }) => {
    try {
        if (!message) {
            return ({ message: "Message is required", });
        }

        if (!doctorId && !patientId && !allUsers) {
            return ({ message: "Provide doctorId, patientId, or allUsers=true", });
        }

        const userIds = await getUserIds({ doctorId, patientId, allUsers });

        if (!userIds.length) {
            return ({ message: "No users found", });
        }

        const values = userIds.map((userId) => ({ userId, message, }));
        await db.insert(notifications).values(values);
        return ({ success: true, sentTo: userIds.length, message: "Notification sent successfully", });

    } catch (error) {
        console.error(error);
        return ({ message: "Server error", });
    }
};