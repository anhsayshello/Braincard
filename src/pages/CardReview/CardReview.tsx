import cardApi from "@/apis/card.api";
import CardItem from "@/components/CardDetailItem";
import Metadata from "@/components/Metadata";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import { Card } from "@/types/card.type";
import { useQuery } from "@tanstack/react-query";
import { Reply } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function CardReview() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [currentCard, setCurrentCard] = useState<Card>();
  const initialTotalRef = useRef<number>(0);

  const { deckId } = useParams();
  const navigate = useNavigate();

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
          {!show && currentCard && (
            <div className="flex flex-col p-6 border rounded-md">
              <div className="h-30 overflow-y-scroll flex justify-center pb-2 border-b border-gray-200">
                <div className="flex justify-center">
                  <div className="font-semibold text-base text-center break-normal wrap-anywhere">
                    {currentCard?.frontCard}
                  </div>
                </div>
              </div>
              <div className="h-110 flex items-center justify-center">
                <Button variant="outline" onClick={() => setShow(true)}>
                  Show answer
                </Button>
              </div>
            </div>
          )}
          {show && currentCard && (
            <>
              <div className="border rounded-lg p-6">
                <CardItem card={currentCard} onClick={() => setShow(false)} />
              </div>
              <div className="flex flex-col">
                <div className="text-right mb-2 text-sm text-black/50">
                  remaining: {dataCardsReview?.data.length}
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            </>
          )}
          {dataCardsReview?.data.length === 0 && (
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="text-base font-medium text-gray-600">
                No cards available for review
              </div>
              <Button size="sm" onClick={() => navigate(-1)}>
                <Reply size={22} />
                Go back
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
