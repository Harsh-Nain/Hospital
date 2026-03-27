import express from "express";
import { upload } from "../utils/uplodes.js";
import { sendMessage, deleteMessage, markMessageSeen, getChatUsers, getMessages } from "../controllers/chat.Controller.js"
const router = express.Router();

router.post("/message", upload.array("files", 10), sendMessage);
router.get("/messages", getMessages);
router.get("/user", getChatUsers);
router.delete("/message", deleteMessage);
router.put("/messages/seen", markMessageSeen);

export default router;