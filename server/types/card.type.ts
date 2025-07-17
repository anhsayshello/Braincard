import { CardStatus } from "../constants/enum";
import { Types } from "mongoose";

export default interface Card {
  _id: Types.ObjectId;
  frontCard: string;
  backCard: string;
  status: CardStatus;
  nextReview: NativeDate;
  deckId: Types.ObjectId;
  reviewCount: number;
  forgetCount: number;
  interval: number;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
