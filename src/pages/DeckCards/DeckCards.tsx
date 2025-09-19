import { Axe, Plus, X, CircleCheckBig, Trash2 } from "lucide-react";
import {
  AlertDialog as DeleteDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CreateCard } from "@/components/CardFormDialog/CardFormDialog";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import DeckCardsSkeleton from "./components/DeckCardsSkeleton";
import Metadata from "@/components/Metadata";
import EmptyDeckCard from "./components/EmptyDeckCard";
import CardPreviewItem from "@/components/CardPreviewItem";
import Spinner from "@/components/Spinner";
import AppTitle from "@/components/shared/app-title";
import SearchBar from "@/components/shared/search-bar";
import useDeckCards from "@/hooks/useDeckCards";
import path from "@/constants/path";

export default function DeckCards() {
  const {
    data,
    cards,
    openDeleteDialog,
    setOpenDeleteDialog,
    deckId,
    refetch,
    inputRef,
    navigate,
    deckName,
    isPending,
    dataPagination,
    handleSearchChange,
    handleCheck,
    handleCheckAll,
    handleUncheckAll,
    checkedCardCount,
    someCheckCards,
    handleDeleteMany,
    deleteCardsMutation,
  } = useDeckCards();

  if (isPending) {
    return <DeckCardsSkeleton />;
  }

  return (
    <>
      <Metadata title="Card | BrainCard" content="card-list" />
      <>
        <div className="flex items-end gap-4">
          <Button
            onClick={() => navigate({ pathname: path.deck })}
            variant="ghost"
            className="cursor-pointer"
          >
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
          </Button>
          <AppTitle title="Deck" deckName={deckName} />
        </div>
        <SearchBar
          inputRef={inputRef}
          handleSearchChange={handleSearchChange}
        />
        <div className="flex items-center flex-wrap md:justify-between gap-3 my-5">
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

            {!someCheckCards && (
              <Button
                variant="outline"
                onClick={handleCheckAll}
                disabled={data?.data.cards.length === 0}
              >
                <CircleCheckBig />
                Select All
              </Button>
            )}
            {someCheckCards && (
              <>
                <Button variant="outline" onClick={handleUncheckAll}>
                  <X />
                  Uncheck
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Trash2 />
                  {`Delete (${checkedCardCount})`}
                </Button>
              </>
            )}
          </div>
          <Pagination
            dataPagination={
              dataPagination ?? {
                limit: 0,
                currentPage: 1,
                totalPages: 0,
                totalCards: 0,
              }
            }
            isAllCards={false}
          />
        </div>
        <div
          className={
            cards?.length === 0 ? "grow flex items-center justify-center" : ""
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
            {cards && cards.length === 0 && <EmptyDeckCard />}
            {cards &&
              cards.map((card) => (
                <CardPreviewItem
                  key={card.id}
                  card={card}
                  handleCheck={() => handleCheck(card.id)}
                  isChecked={card.checked}
                />
              ))}
          </div>
        </div>
      </>

      {/* Delete */}
      <DeleteDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {checkedCardCount > 1
                ? `This action cannot be undone. All cards in the "${deckName}" deck will be permanently deleted from our servers.`
                : `This action cannot be undone. This card will be permanently deleted from our servers.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMany}
              className="cursor-pointer bg-red-500 hover:bg-red-400"
              disabled={deleteCardsMutation.isPending}
            >
              {deleteCardsMutation.isPending ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DeleteDialog>
    </>
  );
}
