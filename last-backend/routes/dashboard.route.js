import express from "express";
const router = express.Router();
import { PatientInfo, PatientDashboard, DoctorDashboard, DoctorInfo } from "../controllers/dashbord.Controller.js"

router.get("/patient-info", PatientInfo);
router.get("/patient", PatientDashboard);
router.get("/doctor", DoctorDashboard);

router.get("/doctor-info", DoctorInfo);

export default router;