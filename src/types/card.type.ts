export type CardStatus = 0 | 1 | 2 | 3;

export interface Card {
  id: string;
  deckId: string;
  frontCard: string;
  backCard: string;
  status: CardStatus;
  timeUntilReview: string;
  isReadyForReview: boolean;
  nextReview: string;
  reviewCount: number;
  forgetCount: number;
  interval: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardList {
  cards: Card[];
  pagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalCards: number;
  };
}

export interface CardQueryParams {
  q?: string;
  page?: number | string;
  filter?: "in-review" | "new-cards" | "mastered";
  sortOrder?: "asc" | "desc";
  sortBy?:
    | "front-card"
    | "created-at"
    | "review-count"
    | "forget-count"
    | "interval";
}
