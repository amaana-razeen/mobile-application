import express from "express";
import {
  createNotification,
  getNotifications,
  deleteNotification,
  getUnreadCount,
  markAsRead
} from "../controllers/NotificationController";

const router = express.Router();

router.post("/", createNotification);

router.get("/", getNotifications);
router.delete("/:id", deleteNotification);
router.get("/unread-count", getUnreadCount); // ← add
router.patch("/mark-read", markAsRead); 

export default router;