import { CardList, CardQueryParams } from "@/types/card.type";
import http from "@/utils/http";

const allCardsApi = {
  search: (queryParams: CardQueryParams) =>
    http.get<CardList>(`/cards/search`, { params: queryParams }),
};

export default allCardsApi;
