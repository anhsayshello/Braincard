import express from "express";
import jwt from "jsonwebtoken";
import { getTokenFrom } from "../utils/utils.js";
import config from "../utils/config.js";

const logoutRouter = express.Router();

logoutRouter.post("/", (request, response, next) => {
  try {
    const token = getTokenFrom(request);

    if (!token) {
      return response.status(400).json({ error: "No token provided" });
    }

    const decodedToken = jwt.verify(token, config.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "Invalid token" });
    }

    response.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default logoutRouter;
