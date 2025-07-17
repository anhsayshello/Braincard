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

  // Lần đầu tiên review (từ forget -> status khác)
  if (reviewCount === 0) {
    switch (newStatus) {
      case CARD_STATUS.FORGET:
        nextReview = new Date(now.getTime() + 10 * 60 * 1000); // 10 phút
        newInterval = 0;
        break;
      case CARD_STATUS.HARD:
        nextReview = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 ngày
        newInterval = 2;
        break;
      case CARD_STATUS.GOOD:
        nextReview = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 ngày
        newInterval = 3;
        break;
      case CARD_STATUS.EASY:
        nextReview = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 ngày
        newInterval = 4;
        break;
      default:
        nextReview = new Date(now.getTime() + 60 * 1000); // 1 phút
        newInterval = 0;
    }
  } else {
    // Từ lần review thứ 2 trở đi
    switch (newStatus) {
      case CARD_STATUS.FORGET:
        nextReview = new Date(now.getTime() + 10 * 60 * 1000);
        newInterval = 0;
        break;
      case CARD_STATUS.HARD:
        // Hard: giữ nguyên interval, nhưng có thể điều chỉnh theo currentStatus
        if (currentStatus === CARD_STATUS.FORGET) {
          // Từ FORGET lên HARD: tăng nhẹ
          newInterval = Math.max(1, currentInterval + 1);
        } else {
          // Từ GOOD/EASY xuống HARD: giữ nguyên
          newInterval = currentInterval;
        }
        nextReview = new Date(
          now.getTime() + newInterval * 24 * 60 * 60 * 1000
        );
        break;
      case CARD_STATUS.GOOD:
        // Good: logic khác nhau tùy currentStatus
        if (currentStatus === CARD_STATUS.FORGET) {
          // Từ FORGET lên GOOD: tăng ít hơn
          newInterval = currentInterval + 1;
        } else if (currentStatus === CARD_STATUS.HARD) {
          // Từ HARD lên GOOD: tăng bình thường
          newInterval = currentInterval + 2;
        } else {
          // Từ GOOD/EASY giữ GOOD: tăng bình thường
          newInterval = currentInterval + 3;
        }
        nextReview = new Date(
          now.getTime() + newInterval * 24 * 60 * 60 * 1000
        );
        break;
      case CARD_STATUS.EASY:
        // Easy: bonus tùy currentStatus
        if (currentStatus === CARD_STATUS.EASY) {
          // Liên tiếp EASY: bonus thêm
          newInterval = currentInterval + 4;
        } else if (currentStatus === CARD_STATUS.GOOD) {
          // Từ GOOD lên EASY: tăng nhiều
          newInterval = currentInterval + 3;
        } else {
          // Từ FORGET/HARD lên EASY: tăng bình thường
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

// Helper function để format thời gian hiển thị
export const formatTimeUntilReview = (nextReview: Date, status: number) => {
  const now = new Date();
  const timeDiff = nextReview.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return "Ready to review";
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  // Format theo status: Forget hiển thị phút, các status khác hiển thị ngày
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
