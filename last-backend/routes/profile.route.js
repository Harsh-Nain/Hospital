import express from "express";
const router = express.Router();
import { upload } from "../utils/uplodes.js";
import { GetOwnProfile, GetDoctorProfile, GetPatientProfile, EditOwnProfile } from "../controllers/profile.Controller.js"

router.get("/own", GetOwnProfile);
router.get("/patient", GetPatientProfile);
router.get("/doctor", GetDoctorProfile);

router.put("/edit", upload.single("image"), EditOwnProfile);
export default router;