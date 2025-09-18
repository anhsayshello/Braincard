const path = {
  dashboard: "/",
  login: "/login",
  register: "/register",
  deck: "/decks",
  cards: "/decks/:deckId/cards",
  cardReview: "/decks/:deckId/cards/review",
  allCards: "/search",
  feedback: "/feedback",
  notifications: "/notifications",
  notification: "/notifications/:notificationId",
  account: "/account",
} as const;

export default path;
