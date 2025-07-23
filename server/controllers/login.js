import express from "express";
import userService from "../services/user.service.js";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const result = await userService.login(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.json({ error: error.message });
    next(error);
  }
});

export default loginRouter;
