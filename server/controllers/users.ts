import { NextFunction, Response, Router } from "express";
import User, { UserDocument } from "../models/user.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";
import { AuthenticatedRequest } from "../models/requests/user.request.js";

const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.use(authenticateToken);

usersRouter.get(
  "/stats",
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const user: UserDocument | null = await User.findById(req.userId);
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
  }
);

export default usersRouter;
