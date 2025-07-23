import Card from "../models/card.js";
import Deck from "../models/deck.js";
import {
  calculateNextReview,
  formatCardResponse,
  isValidStatus,
} from "../utils/utils.js";

const cardService = {
  async getAllCards(deckId, q = null, page = "1") {
    const deck = await Deck.findById(deckId);
    if (!deck) {
      throw new Error("Deck not found");
    }

    const searchQuery = {
      deckId: deckId,
    };
    if (q && typeof q === "string" && q.trim() !== "") {
      const searchRegex = new RegExp(
        q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      searchQuery.$or = [
        { frontCard: { $regex: searchRegex } },
        { backCard: { $regex: searchRegex } },
      ];
    }

    const totalCards = await Card.countDocuments(searchQuery);
    const limitNum = 15;
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(totalCards / limitNum);

    const cards = await Card.find(searchQuery).skip(skip).limit(limitNum);
    const formattedCards = cards.map((card) => formatCardResponse(card));

    return {
      cards: formattedCards,
      pagination: {
        limit: limitNum,
        currentPage: pageNum,
        totalPages,
        totalCards,
      },
    };
  },

  async getCardByDeckId(deckId) {
    const deck = await Deck.findById(deckId);
    if (!deck) {
      throw new Error("Deck not found");
    }

    const now = new Date();
    const cardsToReview = await Card.find({
      deckId,
      nextReview: { $lte: now },
    });

    const formattedCards = cardsToReview.map((card) =>
      formatCardResponse(card)
    );
    return formattedCards;
  },

  async createNewCard(deckId, frontCard, backCard) {
    if (
      !frontCard ||
      frontCard.trim() === "" ||
      !backCard ||
      backCard.trim() === ""
    ) {
      throw new Error("Missing front or back card");
    }

    const deck = await Deck.findById(deckId);
    if (!deck) {
      throw new Error("Deck not found");
    }

    const newCard = await Card.create({
      frontCard,
      backCard,
      deckId,
      status: 0,
      nextReview: new Date(),
      reviewCount: 0,
      forgetCount: 0,
      interval: 0,
    });
    return newCard;
  },

  async updateCardContent(deckId, cardId, frontCard, backCard) {
    if (
      (!frontCard || frontCard.trim() === "") &&
      (!backCard || backCard.trim() === "")
    ) {
      throw new Error("Missing front or back card");
    }

    const card = await Card.findById(cardId);
    if (!card) {
      throw new Error("Deck not found");
    }
    if (!card.deckId.equals(deckId)) {
      throw new Error("Card doesn't belong to this deck");
    }
    card.frontCard = frontCard;
    card.backCard = backCard;
    await card.save();

    return formatCardResponse(card);
  },

  async reviewCard(deckId, cardId, status) {
    if (status === undefined || !isValidStatus(status)) {
      throw new Error("Invalid status");
    }

    const card = await Card.findById(cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    if (!card.deckId.equals(deckId)) {
      throw new Error("Card doesn't belong to this deck");
    }

    const numericStatus = Number(status);

    const { nextReview, newInterval } = calculateNextReview(
      card.status,
      numericStatus,
      card.reviewCount,
      card.interval
    );

    card.status = numericStatus;
    card.nextReview = nextReview;
    card.interval = newInterval;
    card.reviewCount += 1;
    if (numericStatus === 0) {
      card.forgetCount += 1;
    }
    await card.save();

    return formatCardResponse(card);
  },

  async deleteCard(deckId, cardIds) {
    if (!cardIds || !Array.isArray(cardIds)) {
      throw new Error("cardIds must be an array");
    }

    const result = await Card.deleteMany({
      _id: { $in: cardIds },
      deckId: deckId,
    });

    if (result.deletedCount === 0) {
      throw new Error("No cards found to delete");
    }
  },
};
export default cardService;
