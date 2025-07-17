import mongoose from "mongoose";
import { configureJSON } from "../utils/utils.ts";

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
    toJSON: { virtuals: true }, // Bao gồm virtual fields khi convert to JSON
    toObject: { virtuals: true },
  }
);

// Thêm virtual field
deckSchema.virtual("totalCards", {
  ref: "Card",
  localField: "_id",
  foreignField: "deckId",
  count: true, // Chỉ đếm, không lấy documents
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
    // Function này được gọi mỗi khi populate, không phải lúc define schema
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
