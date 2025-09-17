import CARD_STATUS from "@/constants/card";

export const calculateNextReviewTime = (
  currentStatus: number,
  newStatus: number,
  reviewCount: number,
  currentInterval: number
) => {
  const now = new Date();
  let nextReview: Date;
  let newInterval: number;

  if (reviewCount === 0) {
    switch (newStatus) {
      case CARD_STATUS.FORGET:
        nextReview = new Date(now.getTime() + 10 * 60 * 1000);
        newInterval = 0;
        break;
      case CARD_STATUS.HARD:
        nextReview = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        newInterval = 2;
        break;
      case CARD_STATUS.GOOD:
        nextReview = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        newInterval = 3;
        break;
      case CARD_STATUS.EASY:
        nextReview = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
        newInterval = 4;
        break;
      default:
        nextReview = new Date(now.getTime() + 60 * 1000);
        newInterval = 0;
    }
  } else {
    switch (newStatus) {
      case CARD_STATUS.FORGET:
        nextReview = new Date(now.getTime() + 10 * 60 * 1000);
        newInterval = 0;
        break;
      case CARD_STATUS.HARD:
        if (currentStatus === CARD_STATUS.FORGET) {
          newInterval = Math.max(1, currentInterval + 1);
        } else {
          newInterval = currentInterval;
        }
        nextReview = new Date(
          now.getTime() + newInterval * 24 * 60 * 60 * 1000
        );
        break;
      case CARD_STATUS.GOOD:
        if (currentStatus === CARD_STATUS.FORGET) {
          newInterval = currentInterval + 1;
        } else if (currentStatus === CARD_STATUS.HARD) {
          newInterval = currentInterval + 2;
        } else {
          newInterval = currentInterval + 4;
        }
        nextReview = new Date(
          now.getTime() + newInterval * 24 * 60 * 60 * 1000
        );
        break;
      case CARD_STATUS.EASY:
        if (currentStatus === CARD_STATUS.EASY) {
          newInterval = currentInterval + 4;
        } else if (currentStatus === CARD_STATUS.GOOD) {
          newInterval = currentInterval + 3;
        } else {
          newInterval = currentInterval + 2;
        }
        nextReview = new Date(
          now.getTime() + newInterval * 24 * 60 * 60 * 1000
        );
        break;
      default:
        nextReview = new Date(
          now.getTime() + currentInterval * 24 * 60 * 60 * 1000
        );
        newInterval = currentInterval;
    }
  }

  return { nextReview, newInterval };
};

export const formatTimeUntilReview = (nextReview: Date, status: number) => {
  const now = new Date();
  const timeDiff = nextReview.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return "Ready to review";
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (status === CARD_STATUS.FORGET) {
    if (minutes <= 1) {
      return "1 minute";
    } else {
      return `${minutes} minutes`;
    }
  } else {
    if (days <= 0) {
      return "1 day";
    } else if (days === 1) {
      return "1 day";
    } else {
      return `${days} days`;
    }
  }
};
