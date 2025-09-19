import CardDetailItem from "@/components/CardDetailItem";
import Metadata from "@/components/Metadata";
import AppTitle from "@/components/shared/app-title";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import useCardReview from "@/hooks/useCardReview";
import { Reply } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";

export default function CardReview() {
  const navigate = useNavigate();
  const { dataCardsReview, progress, show, setShow, currentCard, isPending } =
    useCardReview();
  const variants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0.5, x: -10 },
    exit: { opacity: 0, x: 10 },
  };

  return (
    <>
      <Metadata title="Practice | BrainCard" content="practice" />
      <AppTitle title="Pratice" />
      <div className="flex items-center justify-center grow">
        {!isPending && (
          <div className="w-full max-w-md flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {!show && currentCard && (
                <motion.div
                  key="front"
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                  className="flex flex-col p-6 border rounded-md"
                >
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
                </motion.div>
              )}
              {show && currentCard && (
                <motion.div
                  key="back"
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                  className="border rounded-lg p-6"
                >
                  <CardDetailItem
                    card={currentCard}
                    onClick={() => setShow(false)}
                  />
                </motion.div>
              )}
              {dataCardsReview && dataCardsReview?.data.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-col justify-center items-center gap-4"
                >
                  <div className="text-base font-medium text-gray-600">
                    No cards available for review
                  </div>
                  <Button size="sm" onClick={() => navigate(-1)}>
                    <Reply size={22} />
                    Go back
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            {dataCardsReview && dataCardsReview?.data.length > 0 && (
              <div className="flex flex-col">
                <div className="text-right mb-2 text-sm text-black/50">
                  remaining: {dataCardsReview?.data.length}
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            )}
          </div>
        )}
        {isPending && <Spinner />}
      </div>
    </>
  );
}
