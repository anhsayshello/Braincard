import {
  ArrowUpZA,
  ArrowDownAZ,
  Baby,
  Dumbbell,
  Anchor,
  Telescope,
  Soup,
  Laugh,
  Webhook,
} from "lucide-react";
import { createSearchParams, useNavigate } from "react-router";
import path from "@/constants/path";
import useQueryConfig from "@/hooks/useQueryConfig";
import { omit } from "lodash";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CardQueryParams } from "@/types/card.type";
import allCardsApi from "@/apis/allCards.api";
import { useCallback, useMemo, useRef } from "react";
import searchHandler from "@/helpers/searchHandler";

export const filters = [
  {
    title: "New Cards",
    icon: Baby,
    query: "new-cards",
  },
  {
    title: "In Review",
    icon: Dumbbell,
    query: "in-review",
  },
  {
    title: "Mastered",
    icon: Anchor,
    query: "mastered",
  },
];

export const sorts = [
  {
    title: "Newest",
    value: "newest",
    icon: Soup,
    sortBy: "created-at",
    sortOrder: "desc",
  },
  {
    title: "Interval",
    value: "interval",
    icon: Webhook,
    sortBy: "interval",
    sortOrder: "desc",
  },
  {
    title: "Review times",
    value: "review-times",
    icon: Telescope,
    sortBy: "review-count",
    sortOrder: "desc",
  },
  {
    title: "Forget times",
    value: "forget-times",
    icon: Laugh,
    sortBy: "forget-count",
    sortOrder: "desc",
  },
  {
    title: "Alphabet A-Z",
    value: "a-z",
    icon: ArrowDownAZ,
    sortBy: "front-card",
    sortOrder: "asc",
  },
  {
    title: "Alphabet Z-A",
    value: "z-a",
    icon: ArrowUpZA,
    sortBy: "front-card",
    sortOrder: "desc",
  },
];

export default function useAllCards() {
  const { filter: currentFilter, sortBy, sortOrder } = useQueryConfig();
  const queryConfig = useQueryConfig();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isPending } = useQuery({
    queryKey: ["allCards", queryConfig],
    queryFn: () => allCardsApi.search(queryConfig as CardQueryParams),
    placeholderData: keepPreviousData,
  });

  const dataAllCards = useMemo(() => data?.data.cards, [data]);
  const dataAllCardsPagination = useMemo(() => data?.data.pagination, [data]);

  const handleSearchChange = useCallback(
    searchHandler({
      queryConfig,
      pathName: path.allCards,
      navigate,
    }),
    [queryConfig, navigate]
  );

  const getCurrentSortValue = useCallback(() => {
    const currentSort = sorts.find(
      (sort) => sort.sortBy === sortBy && sort.sortOrder === sortOrder
    );
    return currentSort ? currentSort.value : "newest";
  }, [sortOrder, sortBy]);

  const handleSortChange = useCallback(
    (value: string) => {
      const selectedSort = sorts.find((s) => s.value === value);
      const newParams = { ...queryConfig };

      if (selectedSort) {
        newParams.sortBy = selectedSort.sortBy;
        newParams.sortOrder = selectedSort.sortOrder;
      }

      navigate({
        pathname: path.allCards,
        search: createSearchParams(newParams).toString(),
      });
    },
    [queryConfig, navigate]
  );

  const handleClearFilter = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    navigate({
      pathname: path.allCards,
      search: createSearchParams(
        omit({ ...queryConfig, sortBy: "created-at" }, ["filter", "q"])
      ).toString(),
    });
  }, [navigate, queryConfig]);

  return {
    isPending,
    inputRef,
    handleSearchChange,
    filters,
    currentFilter,
    queryConfig,
    getCurrentSortValue,
    handleSortChange,
    sorts,
    handleClearFilter,
    dataAllCardsPagination,
    dataAllCards,
  };
}
