import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import User from "../models/user.js";
import config from "../utils/config.js";

const registerRouter = express.Router();

registerRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    // Validation
    if (!username || !name || !password) {
      return response
        .status(400)
        .json({ error: "Username, name and password are required" });
    }

    // Check if user exist
    const usernameChecking = await User.findOne({ username: username });
    if (usernameChecking) {
      return response.status(400).json({
        error: "username already exists",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    console.log(user);

    const savedUser = await user.save();

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };

    // token expires in 60*60 seconds, that is, in one hour
    const token = jwt.sign(userForToken, config.SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    response.status(201).json({
      access_token: token,
      expires: "1d",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        name: savedUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
});
export default registerRouter;
