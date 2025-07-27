export default interface User {
  id: string;
  username: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export interface Stats {
  totalDecks: number;
  totalCards: number;
  cardsStudied: number;
  cardsStudying: number;
  cardsNotLearning: number;
  difficultCards: number;
  masteredCards: number;
}
