import db from "../db/index.js";
import { payments } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const createPayment = async (req, res) => {
    try {
        const { appointmentId, amount, paymentMethod } = req.body;

        if (!appointmentId || !amount) {
            return res.status(400).json({ success: false, message: "Appointment ID and amount are required", });
        }

        const existingPayment = await db.select().from(payments).where(eq(payments.appointmentId, Number(appointmentId)));

        if (existingPayment.length > 0) {
            return res.status(400).json({ success: false, message: "Payment already exists for this appointment", });
        }

        const [payment] = await db.insert(payments).values({ appointmentId: Number(appointmentId), amount: Number(amount), paymentMethod, paymentStatus: "pending", });
        return res.status(201).json({ success: true, message: "Payment created successfully", payment, });

    } catch (error) {
        console.error("Create Payment Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { appointmentId, transactionId } = req.body;

        if (!appointmentId || !transactionId) {
            return res.status(400).json({ success: false, message: "Appointment ID and Transaction ID required", });
        }

        await db.update(payments).set({ paymentStatus: "paid", transactionId, paidAt: new Date(), }).where(eq(payments.appointmentId, appointmentId));
        return res.json({ success: true, message: "Payment verified successfully", });

    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};