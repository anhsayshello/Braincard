import cardApi from "@/apis/card.api";
import Metadata from "@/components/Metadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import CARD_STATUS from "@/constants/card";
import { Card as CardType } from "@/types/card.type";
import { CardStatus } from "@/types/card.type";
import { calculateNextReviewTime, formatTimeUntilReview } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

const reviewButtons = [
  {
    status: CARD_STATUS.FORGET,
    label: "Forget",
    color: "bg-red-500 hover:bg-red-600",
    textColor: "text-white",
  },
  {
    status: CARD_STATUS.HARD,
    label: "Hard",
    color: "bg-orange-500 hover:bg-orange-600",
    textColor: "text-white",
  },
  {
    status: CARD_STATUS.GOOD,
    color: "bg-green-500 hover:bg-green-600",
    label: "Good",
    textColor: "text-white",
  },
  {
    status: CARD_STATUS.EASY,
    label: "Easy",
    color: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-white",
  },
];

export default function CardReview() {
  const [hoveredStatus, setHoveredStatus] = useState<CardStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const initialTotalRef = useRef<number>(0);

  const { deckId } = useParams();
  const queryClient = useQueryClient();

  const { data: dataCardsReview } = useQuery({
    queryKey: ["cardsReview", deckId],
    queryFn: () => cardApi.getCardsReview(deckId as string),
  });

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

  const reviewCardMutation = useMutation({
    mutationFn: cardApi.reviewCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardsReview", deckId] });
      queryClient.invalidateQueries({ queryKey: ["deckCards", deckId] });
    },
  });

  const handleReview = useCallback(
    (status: CardStatus, card: CardType) => {
      reviewCardMutation.mutate({
        deckId: deckId as string,
        cardId: card.id,
        body: { status: status },
      });
      setShow(false);
    },
    [deckId, reviewCardMutation]
  );

  const getPreviewTime = useCallback((status: CardStatus, card: CardType) => {
    const { nextReview } = calculateNextReviewTime(
      card.status,
      status,
      card.reviewCount,
      card.interval
    );
    return formatTimeUntilReview(nextReview, status);
  }, []);

  return (
    <>
      <Metadata title="Practice | BrainCard" content="practice" />
      <div className="flex items-center gap-3 mt-2">
        <div className="text-2xl font-semibold">Practice</div>
      </div>
      <div className="flex items-center justify-center mt-3">
        <Carousel
          className="w-full max-w-md flex flex-col gap-6"
          opts={{
            align: "center",
            containScroll: false,
            direction: "rtl",
          }}
        >
          <CarouselContent className="flex justify-center items-center">
            {dataCardsReview &&
              dataCardsReview.data.map((card) => (
                <CarouselItem key={card.id}>
                  <Card>
                    <CardContent className="grid grid-rows-10">
                      {/* Front Card */}
                      <div className="row-span-2 flex justify-center items-end border-b border-gray-200">
                        <div className="font-semibold text-xl text-center mb-4">
                          {card.frontCard}
                        </div>
                      </div>

                      {!show && (
                        <div className="flex flex-col justify-center items-center">
                          <Button
                            onClick={() => setShow(true)}
                            variant="outline"
                            className="mt-3 md:mt-4"
                          >
                            Show Answer
                          </Button>
                        </div>
                      )}
                      {show && (
                        <>
                          {/* Back Card */}
                          <div className="row-span-4 md:row-span-5 flex justify-center items-center border-b border-gray-300">
                            <div className="text-lg text-center px-4">
                              {card.backCard}
                            </div>
                          </div>

                          {/* Review Buttons */}
                          <div className="row-span-3 flex flex-col justify-center space-y-8">
                            <>
                              <div className="grid grid-cols-4 gap-4 mt-3">
                                {reviewButtons.map((button) => (
                                  <button
                                    key={button.status}
                                    onClick={() =>
                                      handleReview(button.status, card)
                                    }
                                    onMouseEnter={() =>
                                      setHoveredStatus(button.status)
                                    }
                                    onMouseLeave={() => setHoveredStatus(null)}
                                    disabled={reviewCardMutation.isPending}
                                    className={`
                                    py-3 px-2 rounded-lg font-medium transition-all duration-200
                                    ${button.color} ${button.textColor}
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transform hover:scale-105 active:scale-95
                                  `}
                                  >
                                    {button.label}
                                  </button>
                                ))}
                              </div>

                              {/* Preview Time */}
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mb-1">
                                  Next review in:
                                </div>
                                <div className="text-lg font-semibold text-gray-800">
                                  {hoveredStatus !== null
                                    ? getPreviewTime(hoveredStatus, card)
                                    : card.timeUntilReview || "Not scheduled"}
                                </div>
                              </div>
                            </>
                          </div>

                          {/* Card Info */}
                          <div className="row-span-1 mt-4 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                              <span>Reviews: {card.reviewCount}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Interval: {card.interval} days</span>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
          </CarouselContent>
          <div className="flex flex-col">
            <div className="text-right mb-2 text-sm text-black/50">
              remaining: {dataCardsReview?.data.length}
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </Carousel>
      </div>
    </>
  );
}
