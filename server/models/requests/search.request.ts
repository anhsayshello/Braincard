export type sortBy =
  | "front-card"
  | "created-at"
  | "review-count"
  | "forget-count"
  | "interval";

export interface SearchQueryReq {
  q?: string;
  deckId: string;
  filter?: "in-review" | "new-cards" | "mastered";
  sortBy?: sortBy;
  sortOrder?: "desc" | "asc";
  page?: string;
}
