import mongoose from "mongoose";
import Deck from "../models/deck.js";
import User from "../models/user.js";

const deckService = {
  async getAllDecks(userId) {
    const allDecks = await Deck.aggregate([
      // Match decks của user
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
        },
      },

      // Lookup cards và tính toán stats
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "deckId",
          as: "cards",
        },
      },

      // Add computed fields
      {
        $addFields: {
          totalCards: { $size: "$cards" },
          newCards: {
            $size: {
              $filter: {
                input: "$cards",
                cond: { $eq: ["$$this.reviewCount", 0] },
              },
            },
          },
          cardsInReview: {
            $size: {
              $filter: {
                input: "$cards",
                cond: { $lte: ["$$this.nextReview", new Date()] },
              },
            },
          },
          masteredCards: {
            $size: {
              $filter: {
                input: "$cards",
                cond: { $gte: ["$$this.interval", 14] },
              },
            },
          },
        },
      },

      // Remove cards array (không cần thiết trong response)
      {
        $project: {
          cards: 0,
        },
      },

      // Sort by creation date
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return allDecks;
  },

  async createDeck(name, userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("userId missing or not valid");
    }

    if (!name || name.trim().length === 0) {
      throw new Error("Name is required and must be a valid name");
    }
    if (await Deck.findOne({ name })) {
      throw new Error("Name already exist");
    }

    const trimmedName = name.trim();

    if (trimmedName.length > 255) {
      throw new Error("Name must be less than 255 characters");
    }

    console.log("Creating deck with name:", trimmedName);

    const newDeck = await Deck.create({
      name: trimmedName,
      userId: userId,
    });

    const response = {
      ...newDeck.toJSON(),
      totalCards: 0,
      newCards: 0,
      cardsInReview: 0,
      masteredCards: 0,
    };
    return response;
  },

  async updateDeck(deckId, userId, name) {
    if (!name || name.trim().length === 0) {
      throw new Error("Name is required and must be a valid name");
    }
    const trimmedName = name.trim();

    const deck = await Deck.findOne({ _id: deckId, userId: userId });
    if (!deck) {
      throw new Error("Deck not found");
    }

    const existingDeck = await Deck.findOne({
      name: trimmedName,
      _id: { $ne: deckId },
      userId: userId,
    });
    if (existingDeck) {
      throw new Error("Name already exist");
    }

    const updatedDeck = await Deck.findByIdAndUpdate(
      deckId,
      { name: trimmedName },
      { new: true, runValidators: true }
    );

    if (!updatedDeck) {
      throw new Error("Failed to update deck");
    }

    // Get deck with stats using aggregate (consistent với getAllDecks)
    const deckWithStats = await Deck.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(deckId),
        },
      },
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "deckId",
          as: "cards",
        },
      },
      {
        $addFields: {
          totalCards: { $size: "$cards" },
          newCards: {
            $size: {
              $filter: {
                input: "$cards",
                cond: { $eq: ["$this.reviewCount", 0] },
              },
            },
          },
          cardsInReview: {
            $size: {
              $filter: {
                input: "$cards",
                cond: { $lte: ["$this.nextReview", new Date()] },
              },
            },
          },
          masteredCards: {
            $size: {
              $filter: {
                input: "$cards",
                cond: { $gte: ["$this.interval", 14] },
              },
            },
          },
        },
      },
      {
        $project: {
          cards: 0,
        },
      },
    ]);

    return deckWithStats[0];
  },

  async deleteDeck(deckId, userId) {
    const deleteDeck = await Deck.findByIdAndDelete({
      _id: deckId,
      userId: userId,
    });

    if (!deleteDeck) {
      throw new Error("Deck not found");
    }
  },
};

export default deckService;
