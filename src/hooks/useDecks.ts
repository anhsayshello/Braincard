import { useQuery } from "@tanstack/react-query";
import deckApi from "@/apis/deck.api";

export default function useDecks() {
  const { data: dataDeck, isPending } = useQuery({
    queryKey: ["decks"],
    queryFn: deckApi.getDecks,
  });

  return {
    dataDeck,
    isPending,
  };
}
