import express from "express";
const router = express.Router();
import { CreateReview, GetDoctorReviews, DeleteNotification, DeleteReview, CreateNotification, getNotifications, MarkNotificationRead } from "../controllers/response.Controller.js"

router.post("/review", CreateReview);
router.get("/reviews", GetDoctorReviews);
router.delete("/review", DeleteReview);

router.post("/notification", CreateNotification);
router.get("/notifications", getNotifications);
router.put("/notification/read", MarkNotificationRead);
router.delete("/notification", DeleteNotification);

export default router;