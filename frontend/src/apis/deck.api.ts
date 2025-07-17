import Deck from "@/types/deck.type";
import http from "@/utils/http";

const URL = "decks";

const deckApi = {
  getDecks: () => http.get<Deck[]>(URL),
  createDeck: (body: { name: string }) => http.post<Deck>(URL, body),
  updateDeck: ({ id, body }: { id: string; body: { name: string } }) =>
    http.put<Deck>(`${URL}/${id}`, body),
  deleteDeck: (id: string) => http.delete(`${URL}/${id}`),
};

export default deckApi;
