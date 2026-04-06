import express from "express";
const router = express.Router();
import { upload } from "../utils/uplodes.js";
import { UploadMedicalReport, CreateAppointment, GetDoctorSlots,UpdateDoctorSlot, CancelAppointment, ConfirmAppointment, DeleteMedicalReport, GetMedicalReports, CreateDoctorSlot } from "../controllers/medical.Controller.js"

router.post("/add-report", upload.single("file"), UploadMedicalReport);
router.get("/reports", GetMedicalReports);
router.delete("/delete-report/:reportId", DeleteMedicalReport);

router.post("/slot", CreateDoctorSlot);
router.get("/slots", GetDoctorSlots);
router.put("/slot", UpdateDoctorSlot);

router.post("/appointment-add", CreateAppointment);
router.put("/appointment-confirm", ConfirmAppointment);
router.put("/appointment-cancel", CancelAppointment);

export default router;