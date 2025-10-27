import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import Metadata from "@/components/Metadata";
import AppTitle from "@/components/shared/app-title";
import { BookOpen, Target, Clock, TrendingUp } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import useUserStatistic from "@/hooks/useUserStatistic";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { dataUserStats } = useUserStatistic();

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

  return (
    <>
      <Metadata title="BrainCard" content="Braincard" />
      <div className="flex justify-between items-center pt-3 pb-5">
        <div>
          <AppTitle title="BrainCard" />
          <p className="text-gray-600 ml-1.5 mt-1">
            Master your knowledge, one card at a time
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2.5">
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="overflow-hidden">
                  <p className="text-sm text-gray-600 mb-1 truncate">
                    {stat.label}
                  </p>
                  <p className="text-sm md:text-base font-bold text-gray-900 truncate">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} py-1.5 px-2.5 md:p-2.5 xl:p-3 rounded-lg`}
                >
                  <stat.icon className="aspect-square w-4 md:w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grow flex">
        <Tabs defaultValue="bar" className="w-full">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
          <TabsContent
            value="bar"
            className="mt-12 md:mt-3 md:flex md:justify-center"
          >
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={barData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="stats"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="difficult" fill="#ff6b6b" radius={4} />
                <Bar dataKey="studying" fill="#4ecdc4" radius={4} />
                <Bar dataKey="mastered" fill="#45b7d1" radius={4} />
                <Bar dataKey="notLearning" fill="#ffab91" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="pie" className="flex items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="mb-5 xl:-mt-10 min-h-[270px]"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={isMobile ? 60 : 70}
                  dataKey="value"
                >
                  {pieData.map((pie, index) => (
                    <Cell key={`cell-${index}`} fill={pie.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
