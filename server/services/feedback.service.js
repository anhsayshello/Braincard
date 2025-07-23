import Feedback from "../models/feedback.js";
import User from "../models/user.js";

const feedbackService = {
  async sendFeedback(userId, content, type) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("userId missing or not valid");
    }

    if (!content || content.trim() === "") {
      throw new Error("Content is required");
    }
    if (type === undefined || type === null || type === "") {
      throw new Error("Type is required");
    }

    const newFeedback = await Feedback.create({
      content,
      type,
      userId: userId,
    });
    return newFeedback;
  },
};

export default feedbackService;
