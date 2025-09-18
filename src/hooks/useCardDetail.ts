import CARD_STATUS from "@/constants/card";
import cardApi from "@/apis/card.api";
import { Card, CardStatus } from "@/types/card.type";
import { calculateNextReviewTime, formatTimeUntilReview } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export const reviewButtons = [
  {
    status: CARD_STATUS.FORGET,
    label: "Forget",
    color: "bg-[#ff6b6b] hover:bg-[#ff5252]",
    textColor: "text-white",
  },
  {
    status: CARD_STATUS.HARD,
    label: "Hard",
    color: "bg-[#ffab91] hover:bg-[#ff8a65]",
    textColor: "text-white",
  },
  {
    status: CARD_STATUS.GOOD,
    label: "Good",
    color: "bg-[#4ecdc4] hover:bg-[#26a69a]",
    textColor: "text-white",
  },
  {
    status: CARD_STATUS.EASY,
    label: "Easy",
    color: "bg-[#45b7d1] hover:bg-[#29b6f6]",
    textColor: "text-white",
  },
];

export interface CardDetailProps {
  card: Card;
  onClick?: () => void;
}

export default function useCardDetail({ card, onClick }: CardDetailProps) {
  const [hoveredStatus, setHoveredStatus] = useState<number | null>(null);
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

  const handleReview = useCallback(
    (status: CardStatus) => {
      reviewCardMutation.mutate({
        deckId: card.deckId,
        cardId: card.id,
        body: { status: status },
      });
    },
    [reviewCardMutation, card]
  );

  const getPreviewTime = useCallback(
    (status: number) => {
      const { nextReview } = calculateNextReviewTime(
        card.status,
        status,
        card.reviewCount,
        card.interval
      );
      return formatTimeUntilReview(nextReview, status);
    },
    [card]
  );
  // const handleSpeech = useCallback(() => {
  //   speechSynthesis.speak(new SpeechSynthesisUtterance(card.frontCard));
  // }, [card]);

  // if (!card) {
  //   return null;
  // }

  return {
    hoveredStatus,
    setHoveredStatus,
    handleReview,
    getPreviewTime,
    reviewButtons,
    reviewCardMutation,
  };
}
