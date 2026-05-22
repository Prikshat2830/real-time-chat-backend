import express from "express";
import { createChat, fetchChats, createGroupChat } from "../controllers/ChatController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createChat);
router.get("/", protect, fetchChats);
router.post("/group", protect, createGroupChat);

export default router;