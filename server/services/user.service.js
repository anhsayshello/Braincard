import mongoose from "mongoose";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../utils/config.js";
import { getTokenFrom } from "../utils/utils.js";

const userService = {
  async getStats(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const totalDecks = await mongoose.model("Deck").countDocuments({
      userId: mongoose.Types.ObjectId.createFromHexString(userId),
    });

    const cardStats = await mongoose.model("Card").aggregate([
      {
        $lookup: {
          from: "decks",
          localField: "deckId",
          foreignField: "_id",
          as: "deck",
        },
      },
      {
        $match: {
          "deck.userId": mongoose.Types.ObjectId.createFromHexString(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalCards: { $sum: 1 },
          cardsStudied: {
            $sum: {
              $cond: [{ $gt: ["$reviewCount", 0] }, 1, 0],
            },
          },
          cardsNotLearning: {
            $sum: {
              $cond: [{ $eq: ["$reviewCount", 0] }, 1, 0],
            },
          },
          cardsStudying: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$reviewCount", 0] },
                    { $lt: ["$interval", 14] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          difficultCards: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$forgetCount", 5] },
                    { $lt: ["$interval", 14] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          masteredCards: {
            $sum: {
              $cond: [{ $gte: ["$interval", 14] }, 1, 0],
            },
          },
        },
      },
    ]);

    const cardStatsResult = cardStats[0] || {
      totalCards: 0,
      cardsStudied: 0,
      cardsStudying: 0,
      cardsNotLearning: 0,
      difficultCards: 0,
      masteredCards: 0,
    };

    return {
      totalDecks,
      ...cardStatsResult,
    };
  },

  async login(username, password) {
    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      throw new Error("Login failed: username or password is incorrect");
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, config.SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    console.log(token);

    return {
      access_token: token,
      expires: "1d",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
    };
  },

  async register(username, name, password) {
    if (!username || !name || !password) {
      //   return response
      //     .status(400)
      //     .json({ error: "Username, name and password are required" });
      throw new Error("Username, name and password are required");
    }

    const usernameChecking = await User.findOne({ username: username });
    if (usernameChecking) {
      //   return response.status(400).json({
      //     error: "username already exists",
      //   });
      throw new Error("username already exists");
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };

    const token = jwt.sign(userForToken, config.SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    return {
      access_token: token,
      expires: "1d",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        name: savedUser.name,
      },
    };
  },

  async logout(req) {
    const token = getTokenFrom(req);

    if (!token) {
      //   return response.status(400).json({ error: "No token provided" });
      throw new Error("No token provided");
    }

    const decodedToken = jwt.verify(token, config.SECRET);
    if (!decodedToken.id) {
      //   return response.status(401).json({ error: "Invalid token" });
      throw new Error("Invalid token");
    }

    return {
      message: "Logged out successfully",
    };
  },
};

export default userService;
