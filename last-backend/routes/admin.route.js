import express from "express";
const router = express.Router();
import { AdminDashboard, AllDoctors, AllPatients, ApproveDoctor, SuspandDoctor, ReActivate ,getChatList,getChatUser,getChatData} from "../controllers/admin.controller.js"

router.get("/admin_", AdminDashboard);
router.put("/approve_doctor", ApproveDoctor);

router.get("/admin_patients", AllPatients);
router.get("/admin_doctors", AllDoctors);

router.get("/admin_chatlist", getChatList);
router.get("/admin_chatuser", getChatUser);
router.get("/admin_chatdata", getChatData);

router.put("/suspand_doctor", SuspandDoctor);
router.put("/reactivate_doctor", ReActivate);

export default router;