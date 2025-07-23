import express from "express";
import userService from "../services/user.service.js";

const registerRouter = express.Router();

registerRouter.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    const result = await userService.register(username, name, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
export default registerRouter;
