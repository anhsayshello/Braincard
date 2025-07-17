import mongoose from "mongoose";
import { configureJSON } from "../utils/utils.js";
// Define the base user interface
interface IUser {
  username: string;
  name?: string;
  passwordHash?: string;
}

// Define the stats interface
interface IUserStats {
  totalDecks: number;
  totalCards: number;
  cardsStudied: number;
  cardsNotLearning: number;
  cardsStudying: number;
  difficultCards: number;
  masteredCards: number;
}

// Define the virtual fields interface
interface IUserVirtuals {
  totalDecks?: number;
}

// Define the methods interface
interface IUserMethods {
  getStats(): Promise<IUserStats>;
}

// Combine all interfaces for the document type
export type UserDocument = mongoose.Document &
  IUser &
  IUserVirtuals &
  IUserMethods;

const userSchema = new mongoose.Schema<
  IUser,
  mongoose.Model<UserDocument>,
  IUserMethods
>(
  {
    username: {
      type: String,
      required: true,
      unique: true, // this ensures the uniqueness of username
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

// Có thể combine multiple queries thành 1 aggregation
userSchema.methods.getStats = async function (
  this: UserDocument
): Promise<IUserStats> {
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    totalDecks: this.totalDecks,
    ...cardStatsResult,
  };
};

configureJSON(userSchema);

const User = mongoose.model("User", userSchema);

export default User;
