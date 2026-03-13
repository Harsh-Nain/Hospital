import express from "express";
import { upload } from "../utils/uplodes.js";
import { sendMessage, deleteMessage, markMessageSeen, getChatUsers, editMessage, getMessages } from "../controllers/chat.Controller.js"
const router = express.Router();

router.post("/message", upload.single("file"), sendMessage);
router.get("/messages", getMessages);
router.get("/user", getChatUsers);
router.put("/edit", editMessage);
router.delete("/messages", deleteMessage);
router.put("/messages/seen", markMessageSeen);

export default router;