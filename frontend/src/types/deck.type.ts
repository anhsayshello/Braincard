export default interface Deck {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  totalCards: number;
  newCards: number;
  cardsInReview: number;
  masteredCards: number;
  forgetCards: number;
}
