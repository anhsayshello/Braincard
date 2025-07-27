import { Card, CardList, CardQueryParams, CardStatus } from "@/types/card.type";
import http from "@/utils/http";

const CARDS_BASE_URL = (deckId: string) => `decks/${deckId}/cards`;

const cardApi = {
  getCards: (deckId: string, queryParams: CardQueryParams) =>
    http.get<CardList>(CARDS_BASE_URL(deckId), { params: queryParams }),
  getCardsReview: (deckId: string) =>
    http.get<Card[]>(`${CARDS_BASE_URL(deckId)}/review`),
  createCard: ({
    deckId,
    body,
  }: {
    deckId: string;
    body: { frontCard: string; backCard: string };
  }) => http.post<Card>(`${CARDS_BASE_URL(deckId)}`, body),
  updateCard: ({
    deckId,
    cardId,
    body,
  }: {
    deckId: string;
    cardId: string;
    body: { frontCard: string; backCard: string };
  }) => http.put<Card>(`${CARDS_BASE_URL(deckId)}/${cardId}`, body),
  reviewCard: ({
    deckId,
    cardId,
    body,
  }: {
    deckId: string;
    cardId: string;
    body: { status: CardStatus };
  }) => http.patch<Card>(`${CARDS_BASE_URL(deckId)}/${cardId}/review`, body),
  deleteCard: ({ deckId, cardIds }: { deckId: string; cardIds: string[] }) =>
    http.delete<string>(`${CARDS_BASE_URL(deckId)}`, { data: { cardIds } }),
};

export default cardApi;
