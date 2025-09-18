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
import useAllCards from "@/hooks/useAllCards";

export default function AllCards() {
  const {
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
  } = useAllCards();

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
