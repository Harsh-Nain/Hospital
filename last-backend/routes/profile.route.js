import express from "express";
const router = express.Router();
import { upload } from "../utils/uplodes.js";
import { GetOwnProfile, GetDoctorProfile, GetPatientProfile, getDoctorsBySymptom, EditOwnProfile } from "../controllers/profile.Controller.js"

router.get("/own", GetOwnProfile);
router.get("/patient", GetPatientProfile);
router.get("/doctor", GetDoctorProfile);
router.get("/doctor-search", getDoctorsBySymptom);

router.put("/edit", upload.single("image"), EditOwnProfile);
export default router;