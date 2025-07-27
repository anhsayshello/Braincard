import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowUpZA,
  ArrowDownAZ,
  Baby,
  Dumbbell,
  SearchIcon,
  Anchor,
  Telescope,
  FunnelX,
  Soup,
  Laugh,
  Webhook,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSearchParams, Link, useNavigate } from "react-router";
import path from "@/constants/path";
import useQueryConfig from "@/hooks/useQueryConfig";
import { omit } from "lodash";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CardQueryParams } from "@/types/card.type";
import CardList from "@/components/CardList";
import Pagination from "@/components/Pagination";
import AllCardsSkeleton from "./components/AllCardsSkeleton";
import allCardsApi from "@/apis/allCards.api";
import { useCallback, useRef } from "react";
import Metadata from "@/components/Metadata";

const filters = [
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

const sorts = [
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

export default function AllCards() {
  const { filter: currentFilter, sortBy, sortOrder } = useQueryConfig();
  const queryConfig = useQueryConfig();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: dataAllCards, isPending } = useQuery({
    queryKey: ["allCards", queryConfig],
    queryFn: () => allCardsApi.search(queryConfig as CardQueryParams),
    placeholderData: keepPreviousData,
  });

  console.log(dataAllCards);

  const handleTextSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      if (e.target.value.trim() !== queryConfig.q) {
        navigate({
          pathname: path.allCards,
          search: createSearchParams({
            ...queryConfig,
            q: e.target.value.trim(),
          }).toString(),
        });
      }
    },
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
      search: createSearchParams(omit(queryConfig, ["filter", "q"])).toString(),
    });
  }, [navigate, queryConfig]);

  if (isPending) return <AllCardsSkeleton isPending={isPending} />;

  return (
    <>
      <Metadata title="Seach | BrainCard" content="search" />
      <div className="flex grow h-9 items-center gap-2 border-b px-5 mt-3">
        <SearchIcon className="size-4 shrink-0 opacity-50" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter a word to search"
          className="!border-0 !outline-0 !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus-visible:!border-0 focus-visible:!ring-0 aria-invalid:!border-0"
          onChange={handleTextSearch}
        />
      </div>
      <div className="flex items-center justify-between mt-5 flex-wrap gap-2.5">
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-3 flex-wrap">
            {filters.map((filter, idx) => {
              const isActive = currentFilter === filter.query;
              return (
                <Link
                  key={idx}
                  to={{
                    pathname: path.allCards,
                    search: createSearchParams({
                      ...queryConfig,
                      filter: filter.query,
                    }).toString(),
                  }}
                >
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className="flex items-center"
                  >
                    <filter.icon />
                    {filter.title}
                  </Button>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={getCurrentSortValue()}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sorts.map((sort, idx) => {
                    return (
                      <SelectItem
                        key={idx}
                        className="flex items-center gap-2"
                        value={sort.value}
                      >
                        <sort.icon strokeWidth={2} />
                        <div className="font-medium">{sort.title}</div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={handleClearFilter}
              variant="outline"
              className="flex items-center"
            >
              <FunnelX />
              Clear
            </Button>
          </div>
        </div>

        <Pagination
          dataPagination={
            dataAllCards?.data.pagination || {
              limit: 0,
              currentPage: 1,
              totalPages: 1,
              totalCards: 0,
            }
          }
        />
      </div>
      <div className="mt-4.5">
        <CardList dataCards={dataAllCards ? dataAllCards.data.cards : []} />
      </div>
    </>
  );
}
