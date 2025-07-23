import Notification from "../models/notification.js";
import User from "../models/user.js";

const notificationService = {
  async getAllNotifications(userId) {
    const allNotifications = await Notification.find({
      userId: userId,
    }).sort({
      createdAt: -1,
    });
    return allNotifications;
  },

  async getUnreadNotification(userId) {
    const unreadCount = await Notification.countDocuments({
      userId: userId,
      isRead: false,
    });
    return unreadCount;
  },

  async createNotification(userId, title, content) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("userId missing or not valid");
    }

    if (!title || title.trim() === "" || !content || content.trim() === "") {
      throw new Error("title or content is missing");
    }
    const newNotification = await Notification.create({
      title,
      content,
      isRead: false,
      userId: userId,
    });

    return newNotification;
  },

  async readOneNotification(id) {
    const updateNotification = await Notification.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      { new: true, runValidators: true }
    );
    if (!updateNotification) {
      throw new Error("Notification not found");
    }
    return updateNotification;
  },

  async readAllNotification() {
    const updateAllNotifications = await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );
    if (!updateAllNotifications) {
      throw new Error("Notification not found");
    }
    return {
      message: `Successfully marked ${updateAllNotifications.modifiedCount} notification(s) as read`,
      matchedCount: updateAllNotifications.matchedCount,
      modifiedCount: updateAllNotifications.modifiedCount,
    };
  },

  async deleteNotificationById(id) {
    const deleteResult = await Notification.findByIdAndDelete(id);
    if (!deleteResult) {
      throw new Error("Notification not found");
    }
  },

  async deleteAllNotifications() {
    const deleteResult = await Notification.deleteMany({});
    return {
      message: `Successfully deleted all ${deleteResult.deletedCount} notification(s)`,
    };
  },
};

export default notificationService;
