import express from "express";
import userService from "../services/user.service.js";

const logoutRouter = express.Router();

logoutRouter.post("/", async (req, res, next) => {
  try {
    const result = await userService.logout(req);
    res.status(200).json(result);
  } catch (error) {
    res.json({ error: error.message });
    next(error);
  }
});

export default logoutRouter;
