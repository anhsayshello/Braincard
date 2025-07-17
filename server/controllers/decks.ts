import { NextFunction, Response, Router } from "express";
import User from "../models/user.ts";
import authenticateToken from "../middlewares/authenticateToken.middleware.ts";
import { AuthenticatedRequest } from "../models/requests/user.request.ts";
import Deck from "../models/deck.ts";

const decksRouter = Router();

decksRouter.use(authenticateToken);

decksRouter.get(
  "/",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const allDecks = await Deck.find({
        userId: req.userId,
      })
        .populate(["totalCards", "newCards", "cardsInReview", "masteredCards"])
        .sort({ createdAt: -1 });

      console.log(allDecks);
      res.status(200).json(allDecks);
    } catch (error) {
      next(error);
    }
  }
);

decksRouter.post(
  "/",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(400).json({ error: "userId missing or not valid" });
      }

      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          error: "Name is required and must be a valid name",
        });
      }
      if (await Deck.findOne({ name })) {
        return res.status(400).json({ error: "Name already exist" });
      }

      const trimmedName = name.trim();

      if (trimmedName.length > 255) {
        return res.status(400).json({
          error: "Name must be less than 255 characters",
        });
      }

      console.log("Creating deck with name:", trimmedName);

      const newDeck = await Deck.create({
        name: trimmedName,
        userId: req.userId,
      });

      const response = {
        ...newDeck.toJSON(),
        totalCards: 0,
        newCards: 0,
        cardsInReview: 0,
        masteredCards: 0,
      };

      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

decksRouter.put(
  "/:id",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      console.log(id, name);
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          error: "Name is required and must be a valid name",
        });
      }
      const trimmedName = name.trim();

      const deck = await Deck.findOne({ _id: id, userId: req.userId });
      if (!deck) {
        return res.status(404).json({ error: "Deck not found" });
      }

      const existingDeck = await Deck.findOne({
        name: trimmedName,
        _id: { $ne: id },
        userId: req.userId,
      });
      if (existingDeck) {
        return res.status(400).json({ error: "Name already exist" });
      }

      const newDeckName = await Deck.findByIdAndUpdate(
        id,
        { name: trimmedName },
        { new: true, runValidators: true }
      ).populate(["totalCards", "newCards", "cardsInReview", "masteredCards"]);

      res.status(200).json(newDeckName);
    } catch (error) {
      next(error);
    }
  }
);

decksRouter.delete(
  "/:id",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteDeck = await Deck.findByIdAndDelete({
        _id: id,
        userId: req.userId,
      });

      if (!deleteDeck) {
        return res.status(400).json({ error: "Deck not found" });
      }

      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default decksRouter;
