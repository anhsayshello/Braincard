import mongoose from "mongoose";
import { configureJSON } from "../utils/utils.js";

mongoose.set("strictQuery", false);
const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [3, "Name must be at least 3 character"],
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

deckSchema.virtual("totalCards", {
  ref: "Card",
  localField: "_id",
  foreignField: "deckId",
  count: true,
});

deckSchema.virtual("newCards", {
  ref: "Card",
  localField: "_id",
  foreignField: "deckId",
  match: { reviewCount: { $eq: 0 } },
  count: true,
});

deckSchema.virtual("cardsInReview", {
  ref: "Card",
  localField: "_id",
  foreignField: "deckId",
  match: function () {
    return { nextReview: { $lte: new Date() } };
  },
  count: true,
});

deckSchema.virtual("masteredCards", {
  ref: "Card",
  localField: "_id",
  foreignField: "deckId",
  match: { interval: { $gte: 14 } },
  count: true,
});

configureJSON(deckSchema);

export default mongoose.model("Deck", deckSchema);
