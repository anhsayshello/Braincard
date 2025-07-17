import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express, { NextFunction, Request, Response } from "express";
import User from "../models/user.ts";
import config from "../utils/config.ts";
import { LoginReqBody } from "../models/requests/user.request.ts";

const loginRouter = express.Router();

loginRouter.post(
  "/",
  async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: Request<any, any, LoginReqBody>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { username, password } = request.body;

      const user = await User.findOne({ username });
      const passwordCorrect =
        user === null
          ? false
          : bcrypt.compare(password, user.passwordHash as string);

      if (!(user && passwordCorrect)) {
        return response.status(401).json({
          error: "invalid username or password",
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      // token expires in 60*60 seconds, that is, in one hour
      const token = jwt.sign(userForToken, config.SECRET as string, {
        expiresIn: 60 * 60 * 24,
      });
      console.log(token);

      response.status(200).send({
        access_token: token,
        expires: "1d",
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default loginRouter;
