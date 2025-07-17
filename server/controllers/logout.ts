import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getTokenFrom } from "../utils/utils.ts";
import config from "../utils/config.ts";
import { TokenPayload } from "../models/requests/user.request.ts";

const logoutRouter = express.Router();

logoutRouter.post(
  "/",
  // eslint-disable-next-line @typescript-eslint/require-await
  (
    request: Request,
    response: Response,
    next: NextFunction
  ): Response | void => {
    try {
      const token = getTokenFrom(request);

      if (!token) {
        return response.status(400).json({ error: "No token provided" });
      }

      const decodedToken = jwt.verify(
        token,
        config.SECRET as string
      ) as TokenPayload;
      if (!decodedToken.id) {
        return response.status(401).json({ error: "Invalid token" });
      }

      response.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default logoutRouter;
