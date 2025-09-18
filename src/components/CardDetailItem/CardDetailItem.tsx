import useCardDetail, { CardDetailProps } from "@/hooks/useCardDetail";

export default function CardDetailItem({ card, onClick }: CardDetailProps) {
  const {
    hoveredStatus,
    setHoveredStatus,
    handleReview,
    getPreviewTime,
    reviewButtons,
    reviewCardMutation,
  } = useCardDetail({ card, onClick });

  return (
    <div className="flex flex-col">
      {/* Front Card */}
      <div className="h-30 pb-2 overflow-y-scroll flex justify-center border-b border-gray-200">
        <div className="flex justify-center gap-4 ">
          <div className="font-semibold text-base text-center break-normal wrap-anywhere">
            {card.frontCard}
          </div>
          {/* <Volume2
            onClick={handleSpeech}
            className="hover:opacity-50 cursor-pointer mt-1"
            size={18}
          /> */}
          <div></div>
        </div>
      </div>

      {/* Back Card */}
      <div className="h-65 pt-1 overflow-y-scroll flex justify-center border-b border-gray-300">
        <div className="text-base text-center px-4 break-normal wrap-anywhere">
          {card.backCard}
        </div>
      </div>

      {/* Review Buttons */}
      <div className="flex flex-col justify-center space-y-8">
        <>
          <div className="grid grid-cols-4 gap-4 mt-3">
            {reviewButtons.map((button) => (
              <button
                key={button.status}
                onClick={() => handleReview(button.status)}
                onMouseEnter={() => setHoveredStatus(button.status)}
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
            <div className="text-sm text-gray-600 mb-1">Next review in:</div>
            <div className="text-lg font-semibold text-gray-800">
              {hoveredStatus !== null
                ? getPreviewTime(hoveredStatus)
                : card.timeUntilReview || "Not scheduled"}
            </div>
          </div>
        </>
      </div>

      {/* Card Info */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500">
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
    </div>
  );
}
