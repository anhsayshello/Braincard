import { Date, ObjectId } from "mongoose";

export interface SearchQueryOneDeck {
  deckId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $or?: Array<Record<string, any>>;
}

export interface SearchQueryAllDecks {
  deckId: {
    $in: ObjectId[] | (string | ParsedQs | (string | ParsedQs)[])[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $or?: Array<Record<string, any>>;
  nextReview?: { $lte: NativeDate };
  reviewCount?: number | { $gt: number };
  interval?: { $gte: number };
}
