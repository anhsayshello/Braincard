import { Router } from "express";
import {
  isValidStatus,
  calculateNextReview,
  formatCardResponse,
} from "../utils/utils.js";
import Card from "../models/card.js";

import Deck from "../models/deck.js";

const cardsRouter = Router();

// Lấy tất cả cards của một deck
cardsRouter.get("/:deckId/cards", async (req, res, next) => {
  try {
    const { deckId } = req.params;
    const { q, page = "1" } = req.query; // Thêm filter theo status nếu cần

    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    // Tạo base query
    const searchQuery = {
      deckId: deckId,
    };
    // Thêm search query nếu có
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

    // Đếm tổng số kết quả
    const totalCards = await Card.countDocuments(searchQuery);

    // Tính toán pagination
    const limitNum = 15;
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(totalCards / limitNum);

    const cards = await Card.find(searchQuery).skip(skip).limit(limitNum);

    const formattedCards = cards.map((card) => formatCardResponse(card));

    res.status(200).json({
      cards: formattedCards,
      pagination: {
        limit: limitNum,
        currentPage: pageNum,
        totalPages,
        totalCards,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Lấy cards cần review (đã đến thời gian review)
cardsRouter.get("/:deckId/cards/review", async (req, res, next) => {
  try {
    const { deckId } = req.params;
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    const now = new Date();
    const cardsToReview = await Card.find({
      deckId,
      nextReview: { $lte: now },
    });

    const formattedCards = cardsToReview.map((card) =>
      formatCardResponse(card)
    );
    res.status(200).json(formattedCards);
  } catch (error) {
    next(error);
  }
});

// Tạo card mới
cardsRouter.post("/:deckId/cards", async (req, res, next) => {
  try {
    const { deckId } = req.params;
    const { frontCard, backCard } = req.body;

    if (
      !frontCard ||
      frontCard.trim() === "" ||
      !backCard ||
      backCard.trim() === ""
    ) {
      return res.status(400).json({ error: "Missing front or back card" });
    }

    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    // Card mới có status mặc định là FORGET (0), review sau 1 phút
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

    res.status(201).json(formatCardResponse(newCard));
  } catch (error) {
    next(error);
  }
});

// Cập nhật card (chỉnh sửa nội dung)
cardsRouter.put("/:deckId/cards/:cardId", async (req, res, next) => {
  try {
    const { deckId, cardId } = req.params;
    const { frontCard, backCard } = req.body;

    if (
      (!frontCard || frontCard.trim() === "") &&
      (!backCard || backCard.trim() === "")
    ) {
      return res.status(400).json({ error: "Missing front or back card" });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (!card.deckId.equals(deckId)) {
      return res
        .status(400)
        .json({ error: "Card doesn't belong to this deck" });
    }

    // Cập nhật nội dung card (không thay đổi status và review time)
    card.frontCard = frontCard;
    card.backCard = backCard;

    await card.save();
    res.status(200).json(formatCardResponse(card));
  } catch (error) {
    next(error);
  }
});

// Review card - Endpoint riêng để xử lý việc review
cardsRouter.patch("/:deckId/cards/:cardId/review", async (req, res, next) => {
  try {
    const { deckId, cardId } = req.params;
    const { status } = req.body;

    // Validate status với enum số
    if (status === undefined || !isValidStatus(status)) {
      return res.status(400).json({
        error:
          "Invalid status. Must be one of: 0 (forget), 1 (hard), 2 (good), 3 (easy)",
      });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (!card.deckId.equals(deckId)) {
      return res
        .status(400)
        .json({ error: "Card doesn't belong to this deck" });
    }

    const numericStatus = Number(status);

    // Tính toán thời gian review tiếp theo dựa trên status
    const { nextReview, newInterval } = calculateNextReview(
      card.status,
      numericStatus,
      card.reviewCount,
      card.interval
    );

    // Cập nhật card với thông tin review mới
    card.status = numericStatus;
    card.nextReview = nextReview;
    card.interval = newInterval;
    card.reviewCount += 1;
    if (numericStatus === 0) {
      card.forgetCount += 1;
    }

    await card.save();
    res.status(200).json(formatCardResponse(card));
  } catch (error) {
    next(error);
  }
});

// Xóa card
cardsRouter.delete("/:deckId/cards", async (req, res, next) => {
  try {
    const { deckId } = req.params;
    const { cardIds } = req.body; // Array các card IDs

    if (!cardIds || !Array.isArray(cardIds)) {
      return res.status(400).json({ error: "cardIds must be an array" });
    }

    const result = await Card.deleteMany({
      _id: { $in: cardIds },
      deckId: deckId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No cards found to delete" });
    }

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default cardsRouter;
