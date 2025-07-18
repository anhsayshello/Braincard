import { Router } from "express";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";

const notificationRoute = Router();

notificationRoute.use(authenticateToken);

notificationRoute.get("/unread-count", async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.userId,
      isRead: false,
    });
    return res.status(200).json({ unreadCount });
  } catch (error) {
    next(error);
  }
});

notificationRoute.get("/", async (req, res, next) => {
  try {
    const allNotifications = await Notification.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(allNotifications);
  } catch (error) {
    next(error);
  }
});

notificationRoute.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ error: "userId missing or not valid" });
    }

    if (!title || title.trim() === "" || !content || content.trim() === "") {
      return res.status(400).json({ error: "title or content is missing" });
    }
    const newNotification = await Notification.create({
      title,
      content,
      isRead: false,
      userId: req.userId,
    });
    return res.status(201).json(newNotification);
  } catch (error) {
    next(error);
  }
});

notificationRoute.put("/all", async (_req, res, next) => {
  try {
    const updateAllNotifications = await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );
    if (!updateAllNotifications) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.status(200).json({
      message: `Successfully marked ${updateAllNotifications.modifiedCount} notification(s) as read`,
      matchedCount: updateAllNotifications.matchedCount,
      modifiedCount: updateAllNotifications.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
});

notificationRoute.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateNotification = await Notification.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      { new: true, runValidators: true }
    );
    if (!updateNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    return res.status(200).json(updateNotification);
  } catch (error) {
    next(error);
  }
});

notificationRoute.delete("/all", async (_req, res, next) => {
  try {
    const deleteResult = await Notification.deleteMany({});

    return res.status(200).json({
      message: `Successfully deleted all ${deleteResult.deletedCount} notification(s)`,
    });
  } catch (error) {
    next(error);
  }
});

notificationRoute.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteResult = await Notification.findByIdAndDelete(id);
    if (!deleteResult) {
      return res.status(404).json({ error: "Notification not found" });
    }
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default notificationRoute;
