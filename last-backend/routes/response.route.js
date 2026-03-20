import express from "express";
const router = express.Router();
import { CreateReview, GetDoctorReviews, DeleteNotification, DeleteReview, getNotifications, MarkNotificationRead } from "../controllers/response.Controller.js"

router.post("/review", CreateReview);
router.get("/reviews", GetDoctorReviews);
router.delete("/review", DeleteReview);

router.get("/notifications", getNotifications);
router.put("/notification", MarkNotificationRead);
router.delete("/notification", DeleteNotification);

export default router;