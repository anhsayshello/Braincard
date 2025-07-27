import { createSearchParams, Link, useNavigate, useParams } from "react-router";

import { Input } from "@/components/ui/input";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import cardApi from "@/apis/card.api";
import Tooltip from "@/components/Tooltip";
import path from "@/constants/path";
import { Axe, SearchIcon, Plus } from "lucide-react";

import { CreateCard } from "@/components/CardFormDialog/CardFormDialog";
import { Button } from "@/components/ui/button";
import CardList from "@/components/CardList";
import useQueryConfig from "@/hooks/useQueryConfig";
import { CardQueryParams } from "@/types/card.type";
import Pagination from "@/components/Pagination";
import DeckCardsSkeleton from "./components/DeckCardsSkeleton";
import { useCallback } from "react";
import Metadata from "@/components/Metadata";

export default function DeckCards() {
  const { deckId } = useParams();
  const queryConfig = useQueryConfig();
  const navigate = useNavigate();

  const {
    data: dataCards,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["deckCards", deckId, queryConfig],
    queryFn: () =>
      cardApi.getCards(deckId as string, queryConfig as CardQueryParams),
    placeholderData: keepPreviousData,
  });

  const handleTextSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.trim() !== queryConfig.q) {
        navigate({
          pathname: `/decks/${deckId}/cards`,
          search: createSearchParams({
            ...queryConfig,
            q: e.target.value.trim(),
          }).toString(),
        });
      }
    },
    [queryConfig, navigate, deckId]
  );
  console.log(dataCards);

  if (isPending) {
    return <DeckCardsSkeleton />;
  }

  return (
    <>
      <Metadata title="Card | BrainCard" content="card-list" />
      <div className="md:min-w-[450px]">
        <div className="flex items-center gap-4">
          <Link to={path.deck} className="p-1 mt-1">
            <Tooltip
              trigger={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.2}
                  stroke="currentColor"
                  className="size-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              }
              content="back"
            />
          </Link>
          <div className="flex grow h-9 items-center gap-2 border-b px-3">
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <Input
              type="text"
              placeholder="Enter a word to search"
              className="!border-0 !outline-0 !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus-visible:!border-0 focus-visible:!ring-0 aria-invalid:!border-0"
              onChange={handleTextSearch}
            />
          </div>
        </div>
        <div className="flex items-center flex-wrap md:justify-between gap-3 mt-5 mb-4.5">
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </Button>
            <Button
              onClick={() =>
                navigate({ pathname: `/decks/${deckId}/cards/review` })
              }
              variant="outline"
              size="sm"
            >
              <Axe />
              Start practicing
            </Button>
            <CreateCard
              trigger={
                <Button size="sm" variant="outline">
                  <Plus />
                  Add New Card
                </Button>
              }
              onSuccess={() => console.log("Card created!")}
            />
            {/* {isCheckAll ? (
            <Button variant="outline" onClick={() => setIsCheckAll(false)}>
              <X />
              Uncheck
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsCheckAll(true)}>
              <CircleCheckBig />
              Check All
            </Button>
          )} */}
          </div>
          <Pagination
            dataPagination={
              dataCards
                ? dataCards.data.pagination
                : {
                    limit: 0,
                    currentPage: 1,
                    totalPages: 0,
                    totalCards: 0,
                  }
            }
            isAllCards={false}
          />
        </div>
        <CardList
          dataCards={dataCards ? dataCards.data.cards : []}
          isAllCards={false}
        />
      </div>
    </>
  );
}
