import express from "express";
import logger from "./utils/logger.ts";
import config from "./utils/config.ts";
import mongoose from "mongoose";
import cors from "cors";
import registerRouter from "./controllers/register.ts";
import loginRouter from "./controllers/login.ts";
import logoutRouter from "./controllers/logout.ts";
import usersRouter from "./controllers/users.ts";
import decksRouter from "./controllers/decks.ts";
import searchRouter from "./controllers/search.ts";
import feedbackRoute from "./controllers/feedback.ts";
import notificationRoute from "./controllers/notifications.ts";
import unknownEndpoint from "./middlewares/unknownEndpoint.middleware.ts";
import cardsRouter from "./controllers/cards.ts";
import errorHandler from "./middlewares/error.middleware.ts";

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI as string)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error: Error) => {
    logger.info("error connection to MongoDB", error.message);
  });

app.use(express.json());
app.use(
  cors({
    origin: "https://braincard-frontend.vercel.app",
    credentials: true,
  })
);

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);

app.use("/decks", decksRouter);
app.use("/decks", cardsRouter);

app.use("/", searchRouter);
app.use("/feedback", feedbackRoute);
app.use("/notification", notificationRoute);
app.use("/users", usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
