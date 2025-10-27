import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import cardApi from "@/apis/card.api";

export default function useCardsReview() {
  const { deckId } = useParams();

  const { data: dataCardsReview, isPending } = useQuery({
    queryKey: ["cardsReview", deckId],
    queryFn: () => cardApi.getCardsReview(deckId as string),
  });

  return { dataCardsReview, isPending };
}
