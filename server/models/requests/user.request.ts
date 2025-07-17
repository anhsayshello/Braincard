import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  id: string;
}

// Extend the Express Request interface to include userId
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface LoginReqBody {
  username: string;
  password: string;
}

export interface RegisterReqBody {
  username: string;
  name: string;
  password: string;
}
