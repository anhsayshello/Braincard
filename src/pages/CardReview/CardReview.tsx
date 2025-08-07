import cardApi from "@/apis/card.api";
import CardItem from "@/components/CardItem";
import Metadata from "@/components/Metadata";

import { Progress } from "@/components/ui/progress";
import { Card } from "@/types/card.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

export default function CardReview() {
  const [progress, setProgress] = useState(0);
  // const [show, setShow] = useState(false);
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

  return (
    <>
      <Metadata title="Practice | BrainCard" content="practice" />
      <div className="flex items-center gap-3 mt-2">
        <div className="text-2xl font-semibold">Practice</div>
      </div>
      <div className="flex items-center justify-center grow">
        <div className="w-full max-w-md flex flex-col gap-6">
          {currentCard && (
            <div className="border rounded-lg p-6">
              <CardItem card={currentCard} />
            </div>
          )}
          <div className="flex flex-col">
            <div className="text-right mb-2 text-sm text-black/50">
              remaining: {dataCardsReview?.data.length}
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </div>
      </div>
    </>
  );
}
