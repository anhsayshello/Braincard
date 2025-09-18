import { Card } from "@/types/card.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import cardApi from "@/apis/card.api";

export default function useCardReview() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [currentCard, setCurrentCard] = useState<Card>();
  const initialTotalRef = useRef<number>(0);

  const { deckId } = useParams();

  const { data: dataCardsReview } = useQuery({
    queryKey: ["cardsReview", deckId],
    queryFn: () => cardApi.getCardsReview(deckId as string),
  });

  useEffect(() => {
    setCurrentCard(dataCardsReview?.data[0]);
  }, [dataCardsReview]);

  console.log(dataCardsReview?.data);

  useEffect(() => {
    if (dataCardsReview?.data) {
      const currentTotal = dataCardsReview.data.length;

      if (initialTotalRef.current === 0) {
        initialTotalRef.current = currentTotal;
        setProgress(0);
      } else {
        const reviewed = initialTotalRef.current - currentTotal;

        const progressPercentage = (reviewed / initialTotalRef.current) * 100;
        setProgress(progressPercentage);
      }
    }
  }, [dataCardsReview]);

  useEffect(() => {
    initialTotalRef.current = 0;
    setProgress(0);
  }, [deckId]);

  return { dataCardsReview, progress, show, setShow, currentCard };
}
