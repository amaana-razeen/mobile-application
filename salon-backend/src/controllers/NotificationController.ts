import { Request, Response } from "express";
import Notification from "../models/Notifications";

export const createNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
};
// controllers/NotificationController.ts
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};


export const deleteNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};
export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching notifications",
    });
    
  }
};