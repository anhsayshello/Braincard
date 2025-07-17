import { CardStatus } from "../../constants/enum";

export interface CardParams {
  deckId: string;
  cardId?: string;
}

export interface CardReqBody {
  frontCard: string;
  backCard: string;
}

export interface ReviewCardReqBody {
  status: CardStatus;
}

export interface CardQuery {
  q?: string;
  page: string;
}
