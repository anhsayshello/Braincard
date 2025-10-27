import cardApi from "@/apis/card.api";
import { Card } from "@/types/card.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CardDetailProps {
  card: Card;
  onClick?: () => void;
}

export default function useReviewCard({ card, onClick }: CardDetailProps) {
  const queryClient = useQueryClient();

  const reviewCardMutation = useMutation({
    mutationFn: cardApi.reviewCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deckCards", card.deckId] });
      queryClient.invalidateQueries({ queryKey: ["cardsReview", card.deckId] });
      queryClient.invalidateQueries({ queryKey: ["allCards"] });
      if (onClick) {
        onClick();
      }
    },
  });

  return {
    reviewCardMutation,
  };
}
