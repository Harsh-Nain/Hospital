import { doctors, notifications, patients, users } from "../db/schema.js";
import { reviews } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
import db from "../db/index.js";

export const CreateReview = async (req, res) => {
    try {
        const { doctorId, rating, reviewText } = req.body;
        const { id: userId } = req.user;

        const [patient] = await db.select({ patientId: patients.id }).from(patients).where(eq(patients.userId, userId));

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found", });
        }

        await db.insert(reviews).values({ doctorId, patientId: patient.patientId, rating, reviewText, });

        const [user] = await db.select().from(users).where(eq(users.id, userId));
        const [review] = await db.select().from(reviews).where(and(eq(reviews.doctorId, doctorId), eq(reviews.patientId, patient.patientId), eq(reviews.rating, rating), eq(reviews.reviewText, reviewText)));

        return res.json({ success: true, message: "Review submitted", review: { ...review, patientImage: user?.image || null, patientName: user?.fullName }, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNotifications = async (req, res) => {
    try {
        let { id } = req.user;
        const { notifId } = req.query;
        if (notifId) {
            id = notifId
        }

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
        const { doctorId, page = 1, limit = 7 } = req.query;

        if (!doctorId) {
            return res.json({ success: false, message: "Doctor ID is required", });
        }

        const pageNumber = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);
        const offset = (pageNumber - 1) * pageLimit;

        const doctorReviews = await db
            .select({ id: reviews.id, patientId: patients.id, rating: reviews.rating, reviewText: reviews.reviewText, createdAt: reviews.createdAt, patientName: users.fullName, patientImage: users.image, })
            .from(reviews)
            .leftJoin(patients, eq(patients.id, reviews.patientId))
            .leftJoin(users, eq(users.id, patients.userId))
            .where(eq(reviews.doctorId, Number(doctorId)))
            .orderBy(desc(reviews.createdAt))
            .limit(pageLimit)
            .offset(offset);

        res.json({ success: true, page: pageNumber, limit: pageLimit, reviews: doctorReviews, });

    } catch (error) {
        console.error("GetDoctorReviews Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch doctor reviews", });
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

export const getUserIds = async ({ doctorId, patientId, messageFor }) => {
    if (messageFor == "allUsers") {
        const all = await db.select({ userId: users.id }).from(users);
        return all.map((u) => u.userId);
    }

    if (messageFor == "allDoctors") {
        const allDoctorUsers = await db.select({ userId: doctors.userId }).from(doctors);
        return allDoctorUsers.map((d) => d.userId);
    }

    if (messageFor == "allPatients") {
        const allPatientUsers = await db.select({ userId: patients.userId }).from(patients);
        return allPatientUsers.map((p) => p.userId);
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

export const CreateNotification = async ({ userId, doctorId, patientId, message, messageFor }) => {
    try {
        if (!message) {
            return { success: false, message: "Message is required" };
        }

        if (!userId && !doctorId && !patientId && !messageFor) {
            return { success: false, message: "Provide userId or doctorId/patientId with messageFor" };
        }

        let userIds = [];

        if (userId) {
            userIds = [userId];
        } else {
            userIds = await getUserIds({ doctorId, patientId, messageFor });

            if (!userIds || userIds.length === 0) {
                return { success: false, message: "No users found" };
            }
        }

        const values = userIds.map((id) => ({ userId: id, message, }));
        await db.insert(notifications).values(values);

        return { success: true, sentTo: userIds.length, message: "Notification sent successfully", };

    } catch (error) {
        console.error(error);
        return { success: false, message: "Server error" };
    }
};