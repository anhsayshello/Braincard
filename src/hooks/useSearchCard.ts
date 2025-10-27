import useQueryConfig from "@/hooks/useQueryConfig";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CardQueryParams } from "@/types/card.type";
import allCardsApi from "@/apis/allCards.api";
import { useMemo } from "react";

export default function useSearchCard() {
  const queryConfig = useQueryConfig();

  const { data, isPending } = useQuery({
    queryKey: ["allCards", queryConfig],
    queryFn: () => allCardsApi.search(queryConfig as CardQueryParams),
    placeholderData: keepPreviousData,
  });

  const dataAllCards = useMemo(() => data?.data.cards, [data]);
  const dataAllCardsPagination = useMemo(() => data?.data.pagination, [data]);

  return {
    isPending,
    dataAllCardsPagination,
    dataAllCards,
  };
}
