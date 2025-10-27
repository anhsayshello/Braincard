import useQueryConfig from "@/hooks/useQueryConfig";
import { CardQueryParams } from "@/types/card.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import cardApi from "@/apis/card.api";

import { useParams } from "react-router";
import { useMemo } from "react";

export default function useDeckCards() {
  const { deckId } = useParams();
  const queryConfig = useQueryConfig();

  const { data, isPending, refetch } = useQuery({
    queryKey: ["deckCards", deckId, queryConfig],
    queryFn: () =>
      cardApi.getCards(deckId as string, queryConfig as CardQueryParams),
    placeholderData: keepPreviousData,
  });

  const dataPagination = useMemo(() => data?.data.pagination, [data]);

  return {
    data,
    deckId,
    refetch,
    isPending,
    dataPagination,
  };
}
