import express from "express";
import logger from "./utils/logger.js";
import config from "./utils/config.js";
import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./controllers/users.js";
import decksRouter from "./controllers/decks.js";
import searchRouter from "./controllers/search.js";
import feedbackRoute from "./controllers/feedback.js";
import notificationRoute from "./controllers/notifications.js";
import unknownEndpoint from "./middlewares/unknownEndpoint.middleware.js";
import cardsRouter from "./controllers/cards.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRouter from "./controllers/auth.js";

const app = express();

logger.info("connecting to", config.MONGODB_URI);

const option = {
  socketTimeoutMS: 30000,
};

mongoose
  .connect(config.MONGODB_URI, option)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.info("error connection to MongoDB", error.message);
  });

app.use(express.json());
app.use(
  cors({
    origin: ["https://braincard-booster.vercel.app", "http://localhost:3000"],
  })
);

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/decks", decksRouter);
app.use("/decks", cardsRouter);

app.use("/search", searchRouter);
app.use("/feedback", feedbackRoute);
app.use("/notification", notificationRoute);

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
