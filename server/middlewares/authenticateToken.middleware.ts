import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";

import {
  AuthenticatedRequest,
  TokenPayload,
} from "../models/requests/user.request.ts";
import { getTokenFrom } from "../utils/utils.ts";
import config from "../utils/config.ts";

export default function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void {
  try {
    const token = getTokenFrom(req);
    // Handle null token case
    if (!token) {
      return res.status(401).json({ error: "token missing" });
    }

    const decodedToken = jwt.verify(
      token,
      config.SECRET as string
    ) as TokenPayload;
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    next(error);
  }
}
