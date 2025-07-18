import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import User from "../models/user.js";
import config from "../utils/config.js";

const loginRouter = express.Router();

loginRouter.post("/", async (request, response, next) => {
  try {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

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
    const token = jwt.sign(userForToken, config.SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    console.log(token);

    response.status(200).json({
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
});

export default loginRouter;
