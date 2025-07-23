import { Router } from "express";
import Card from "../models/card.js";
import Deck from "../models/deck.js";
import User from "../models/user.js";
import { formatCardResponse } from "../utils/utils.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";

const searchRouter = Router();

searchRouter.get("/cards/search", authenticateToken, async (req, res, next) => {
  try {
    const {
      q, // search query cho front và back card
      deckId, // filter theo deck cụ thể (optional)
      filter, // filter options: 'in-review', 'new-cards', 'mastered'
      sortBy = "created-at", // field để sort
      sortOrder = "desc", // 'asc' hoặc 'desc'
      page = "1",
    } = req.query;

    // Kiểm tra user có tồn tại không
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Tìm tất cả deck của user hoặc deck cụ thể
    let deckIds;
    if (deckId) {
      // Kiểm tra deck có thuộc về user không
      const deck = await Deck.findOne({ _id: deckId, userId: req.userId });
      if (!deck) {
        return res.status(404).json({
          error: "Deck not found or does not belong to user",
        });
      }
      deckIds = [deckId];
    } else {
      const userDecks = await Deck.find({ userId: req.userId }).select("_id");
      deckIds = userDecks.map((deck) => deck._id);
    }

    if (deckIds.length === 0) {
      return res.json({
        cards: [],
        pagination: {
          limit: 15,
          currentPage: Number(page),
          totalPages: 0,
          totalCards: 0,
        },
      });
    }

    // Tạo base query
    const searchQuery = {
      deckId: { $in: deckIds },
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

    // Thêm filter theo loại card
    if (filter) {
      switch (filter) {
        case "in-review":
          // Cards cần ôn tập (nextReview <= hiện tại)
          searchQuery.nextReview = { $lte: new Date() };
          break;
        case "new-cards":
          // Cards mới (reviewCount = 0)
          searchQuery.reviewCount = 0;
          break;
        case "mastered":
          // Cards đã thành thạo (interval >= 14)
          searchQuery.interval = { $gte: 14 };
          break;
      }
    }

    // Đếm tổng số kết quả
    const totalCards = await Card.countDocuments(searchQuery);

    // Tính toán pagination
    const limitNum = 15;
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(totalCards / limitNum);

    // Mapping frontend sortBy values to database field names
    const sortFieldMap = {
      "front-card": "frontCard",
      "created-at": "createdAt",
      "review-count": "reviewCount",
      "forget-count": "forgetCount",
      interval: "interval",
    };

    // Validation và mapping cho sortBy
    const validSortFields = Object.keys(sortFieldMap);
    const dbSortField = validSortFields.includes(sortBy)
      ? sortFieldMap[sortBy]
      : "createdAt"; // default fallback

    const finalSortOrder = ["asc", "desc"].includes(sortOrder)
      ? sortOrder
      : "desc";

    // Tạo sort object với actual database field name
    const sortObj = {};
    sortObj[dbSortField] = finalSortOrder === "desc" ? -1 : 1;

    // Lấy cards với pagination và populate deck info
    const cards = await Card.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Trả về response với format yêu cầu
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

export default searchRouter;
