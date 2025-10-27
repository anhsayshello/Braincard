import deckApi from "@/apis/deck.api";
import Deck from "@/types/deck.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteDeck(deck: Deck | null) {
  const queryClient = useQueryClient();

  const deleteDeckMutation = useMutation({
    mutationFn: deckApi.deleteDeck,
    onSuccess: () => {
      toast.success(`Deck "${deck?.name}" has been deleted`, {
        duration: 1500,
      });

      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (error) => {
      console.error("Error deleting deck:", error);
    },
  });

  return deleteDeckMutation;
}
