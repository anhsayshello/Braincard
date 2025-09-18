import userApi from "@/apis/user.api";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Target, Clock, TrendingUp } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";
import { useMemo } from "react";

export default function useDashboard() {
  const isAuthenticated = useAuthenticatedStore(
    (state) => state.isAuthenticated
  );
  const { data: dataUserStats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => userApi.getStats(),
    enabled: isAuthenticated,
  });
  console.log(dataUserStats);
  const stats = useMemo(() => {
    const {
      totalDecks,
      cardsStudied,
      cardsStudying,
      cardsNotLearning,
      difficultCards,
      masteredCards,
      totalCards,
    } = dataUserStats?.data || {};

    return {
      totalDecks,
      cardsStudied,
      cardsStudying,
      cardsNotLearning,
      difficultCards,
      masteredCards,
      totalCards,
      masteredCardsPercentage:
        masteredCards && totalCards ? (masteredCards / totalCards) * 100 : 0,
      cardsNotLearningPercentage:
        cardsNotLearning && totalCards
          ? (cardsNotLearning / totalCards) * 100
          : 0,
      cardsStudyingPercentage:
        cardsStudying && totalCards ? (cardsStudying / totalCards) * 100 : 0,
      difficultCardsPercentage:
        difficultCards && totalCards ? (difficultCards / totalCards) * 100 : 0,
    };
  }, [dataUserStats?.data]);

  const statsCards = useMemo(
    () => [
      {
        icon: BookOpen,
        label: "Total Decks",
        value: stats.totalDecks || 0,
        color: "bg-blue-500",
      },
      {
        icon: Target,
        label: "Cards Studied",
        value: stats.cardsStudied || 0,
        color: "bg-green-500",
      },
      {
        icon: Clock,
        label: "Study Time",
        value: "not available",
        color: "bg-purple-500",
      },
      {
        icon: TrendingUp,
        label: "Accuracy",
        value: "not available",
        color: "bg-orange-500",
      },
    ],
    [stats]
  );

  const chartConfig = {
    difficult: {
      label: "Difficult",
    },
    studying: {
      label: "Studying",
    },
    notLearning: {
      label: "Not Learning",
    },
    mastered: {
      label: "Mastered",
    },
  } satisfies ChartConfig;

  const barData = useMemo(
    () => [
      {
        stats: "Stats",
        difficult: stats.difficultCards,
        studying: stats.cardsStudying,
        notLearning: stats.cardsNotLearning,
        mastered: stats.masteredCards,
      },
    ],
    [stats]
  );

  const pieData = useMemo(
    () => [
      {
        name: "difficult",
        value: stats.difficultCards,
        fill: "#ff6b6b",
      },
      {
        name: "studying",
        value: stats.cardsStudying,
        fill: "#4ecdc4",
      },
      {
        name: "notLearning",
        value: stats.cardsNotLearning,
        fill: "#ffab91",
      },
      {
        name: "mastered",
        value: stats.masteredCards,
        fill: "#45b7d1",
      },
    ],
    [stats]
  );

  return { statsCards, chartConfig, barData, pieData };
}
