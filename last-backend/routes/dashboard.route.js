import express from "express";
const router = express.Router();
import { PatientInfo, PatientDashboard, DoctorDashboard, PatientGetDoctor, DoctorInfo } from "../controllers/dashbord.Controller.js"

router.get("/patient-info", PatientInfo);
router.get("/patient", PatientDashboard);
router.get("/doctor-info", DoctorInfo);
router.get("/doctor", DoctorDashboard);

router.get("/patientgetdoctor", PatientGetDoctor);

export default router;