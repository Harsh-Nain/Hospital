import express from "express";
const router = express.Router();
import { SavePatient, SaveDoctor, forgetpassword, LoginUser, updateDoctorStatus, sendOtp, verifyOtp } from "../controllers/access.Controller.js"
import { updatePassword } from "../controllers/profile.Controller.js";

router.post("/forget-password", forgetpassword);
router.post("/updatePassword", updatePassword);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/register-doctor", SaveDoctor);
router.post("/register-patient", SavePatient);
router.put("/doctor-updated", updateDoctorStatus);

router.post("/login-patient", async (req, res) => {
    await LoginUser(req, res, "patient");
});

router.post("/login-doctor", async (req, res) => {
    await LoginUser(req, res, "doctor");
});

export default router;