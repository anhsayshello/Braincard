import { NextFunction, Response, Router } from "express";
import User from "../models/user.ts";
import Feedback from "../models/feedback.ts";
import authenticateToken from "../middlewares/authenticateToken.middleware.ts";
import { AuthenticatedRequest } from "../models/requests/user.request.ts";

const feedbackRoute = Router();

feedbackRoute.use(authenticateToken);

feedbackRoute.post(
  "/",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(400).json({ error: "userId missing or not valid" });
      }

      const { content, type } = req.body;
      if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Content is required" });
      }
      if (type === undefined || type === null || type === "") {
        return res.status(400).json({ error: "Type is required" });
      }

      const newFeedback = await Feedback.create({
        content,
        type,
        userId: req.userId,
      });
      return res.status(201).json(newFeedback);
    } catch (error) {
      next(error);
    }
  }
);

export default feedbackRoute;
