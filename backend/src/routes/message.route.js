import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
  markMessagesAsRead,
  getGroupMessages,
  sendGroupMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Rate-limit first, then authenticate
router.use(arcjetProtection, protectRoute);

// ─── Static/specific routes first (must come before /:id) ─────────────────────
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);

// ─── Read receipts ─────────────────────────────────────────────────────────────
router.put("/read/:senderId", markMessagesAsRead);

// ─── Group message routes (must come before /:id to avoid conflict) ────────────
router.get("/group/:groupId", getGroupMessages);
router.post("/group/send/:groupId", sendGroupMessage);

// ─── 1-on-1 routes (dynamic :id last) ─────────────────────────────────────────
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
