import { useMutation, useQueryClient } from "@tanstack/react-query";
import cardApi from "@/apis/card.api";
import { toast } from "sonner";

export default function useDeleteCard() {
  const queryClient = useQueryClient();

  const deleteCardMutation = useMutation({
    mutationFn: cardApi.deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["deckCards"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allCards"],
      });

      toast.success(`Card has been deleted`, {
        duration: 1500,
      });
    },
    onError: (error) => {
      console.error("Error deleting card:", error);
    },
  });

  return deleteCardMutation;
}
