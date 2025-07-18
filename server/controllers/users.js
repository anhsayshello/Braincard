import { Router } from "express";
import User from "../models/user.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";

const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.use(authenticateToken);

usersRouter.get("/stats", async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const stats = await user.getStats();

    res.json({
      ...stats,
    });
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
