import express from "express";
const router = express.Router();
import { upload } from "../utils/uplodes.js";
import { UploadMedicalReport, CreateAppointment, GetDoctorSlots, GetDoctorAppointments, GetPatientAppointments, CancelAppointment, ConfirmAppointment, DeleteMedicalReport, GetMedicalReports, CreateDoctorSlot } from "../controllers/medical.Controller.js"

router.post("/add-report", upload.any(), UploadMedicalReport);
router.get("/reports", GetMedicalReports);

router.delete("/report", DeleteMedicalReport);

router.post("/slot", CreateDoctorSlot);
router.get("/slots", GetDoctorSlots);

router.post("/appointment-add", CreateAppointment);

router.put("/appointment-confirm", ConfirmAppointment);
router.put("/appointment-cancel", CancelAppointment);

router.get("/appointments-patient", GetPatientAppointments);
router.get("/appointments-doctor", GetDoctorAppointments);

export default router;