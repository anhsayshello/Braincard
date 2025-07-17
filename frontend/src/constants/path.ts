const path = {
  home: "/",
  login: "/login",
  register: "/register",
  deck: "/decks",
  cards: "/decks/:deckId/cards",
  cardReview: "/decks/:deckId/cards/review",
  allCards: "/cards/search",
  feedback: "/feedback",
  notifications: "/notifications",
  notification: "/notifications/:notificationId",
  account: "/account",
} as const;

export default path;
