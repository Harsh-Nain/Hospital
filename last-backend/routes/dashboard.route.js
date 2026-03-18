import express from "express";
const router = express.Router();
import { PatientInfo, AdminDashboard, PatientDashboard, updateDoctorStatus, AllDoctors, AllPatients, patientAppointments, doctorAppointments, DoctorInfo } from "../controllers/dashbord.Controller.js"

router.get("/patient-info", PatientInfo);
router.get("/Patient", PatientDashboard);
router.get("/patient-appoitment", patientAppointments);

router.get("/doctor-info", DoctorInfo);
router.get("/doctor-appointment", doctorAppointments);

router.get("/admin_", AdminDashboard);
router.get("/admin_patients", AllPatients);
router.get("/admin_doctors", AllDoctors);
router.put("/approve_doctor", updateDoctorStatus);

export default router;