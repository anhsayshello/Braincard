import mongoose from "mongoose";
import { configureJSON } from "../utils/utils.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    passwordHash: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("totalDecks", {
  ref: "Deck",
  localField: "_id",
  foreignField: "userId",
  count: true,
});

userSchema.methods.getStats = async function () {
  await this.populate("totalDecks");
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
        "deck.userId": this._id,
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
    totalDecks: this.totalDecks,
    ...cardStatsResult,
  };
};

configureJSON(userSchema);

const User = mongoose.model("User", userSchema);

export default User;
