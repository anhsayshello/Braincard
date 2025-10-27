import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FunnelX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSearchParams, Link } from "react-router";
import path from "@/constants/path";
import Pagination from "@/components/Pagination";
import AllCardsSkeleton from "./components/AllCardsSkeleton";
import Metadata from "@/components/Metadata";
import CardNotFound from "./components/CardNotFound";
import CardPreviewItem from "@/components/CardPreviewItem";
import AppTitle from "@/components/shared/app-title";
import SearchBar from "@/components/shared/search-bar";
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
import { useNavigate } from "react-router";
import useQueryConfig from "@/hooks/useQueryConfig";
import { omit } from "lodash";

import { useCallback, useRef } from "react";
import searchHandler from "@/helpers/searchHandler";
import useSearchCard from "@/hooks/useSearchCard";

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

export default function AllCards() {
  const { isPending, dataAllCardsPagination, dataAllCards } = useSearchCard();
  const queryConfig = useQueryConfig();
  const { filter: currentFilter, sortBy, sortOrder } = useQueryConfig();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

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

  if (isPending) return <AllCardsSkeleton isPending={isPending} />;

  return (
    <>
      <Metadata title="Seach | BrainCard" content="search" />
      <AppTitle title="Search" />

      <SearchBar inputRef={inputRef} handleSearchChange={handleSearchChange} />
      <div className="flex items-center justify-between my-5 flex-wrap gap-2.5">
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
            dataAllCardsPagination ?? {
              limit: 0,
              currentPage: 1,
              totalPages: 1,
              totalCards: 0,
            }
          }
        />
      </div>
      <div
        className={
          dataAllCards && dataAllCards.length === 0
            ? "grow flex items-center justify-center"
            : ""
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
          {dataAllCards && dataAllCards.length === 0 && <CardNotFound />}
          {dataAllCards &&
            dataAllCards.map((card) => (
              <CardPreviewItem key={card.id} card={card} isAllCards={true} />
            ))}
        </div>
      </div>
    </>
  );
}
