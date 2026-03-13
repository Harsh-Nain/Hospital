import express from "express";
import { createPayment, verifyPayment, getPaymentByAppointment, getAllPayments, } from "../controllers/payment.Controller.js";
const router = express.Router();

router.post("/create", createPayment);
router.post("/verify", verifyPayment);
router.get("/appointment", getPaymentByAppointment);
router.get("/all", getAllPayments);

export default router;