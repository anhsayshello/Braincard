import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "../../components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import deckApi from "@/apis/deck.api";

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

import { useCallback, useState } from "react";
import Deck from "@/types/deck.type";
import AppDropDownMenu from "../../components/AppDropDownMenu";
import {
  CreateDeck,
  UpdateDeck,
} from "../../components/DeckFormDialog/DeckFormDialog";
import Spinner from "../../components/Spinner";
import { toast } from "sonner";
import { motion } from "motion/react";
import Tooltip from "@/components/Tooltip";
import deckImg from "@/assets/images/CreateDeck.svg";
import EmptyDeck from "./components/EmptyDeck";
import Metadata from "@/components/Metadata";
import DeckListSkeleton from "./components/DeckListSkeleton";

export default function DeckList() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const queryClient = useQueryClient();

  const { data: dataDeck, isPending } = useQuery({
    queryKey: ["decks"],
    queryFn: deckApi.getDecks,
  });
  console.log(dataDeck);
  const handleRenameClick = useCallback(
    (deck: Deck) => {
      setSelectedDeck(deck);
      setOpenUpdateDialog(true);
    },
    [setSelectedDeck, setOpenUpdateDialog]
  );

  const deleteDeckMutation = useMutation({
    mutationFn: deckApi.deleteDeck,
    onSuccess: () => {
      toast.success(`Deck "${selectedDeck?.name}" has been deleted`, {
        duration: 1500,
      });
      setOpenDeleteDialog(false);
      setSelectedDeck(null);
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (error) => {
      console.error("Error deleting deck:", error);
    },
  });

  const handleDeleteClick = useCallback(
    (deck: Deck) => {
      setSelectedDeck(deck);
      setOpenDeleteDialog(true);
    },
    [setSelectedDeck, setOpenDeleteDialog]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (selectedDeck) {
      deleteDeckMutation.mutate(selectedDeck.id);
    }
  }, [selectedDeck, deleteDeckMutation]);

  const getDropdownOptions = useCallback(
    (deck: Deck) => [
      {
        onClick: () => handleRenameClick(deck),
        name: "Rename",
      },
      {
        onClick: () => handleDeleteClick(deck),
        name: "Delete",
      },
    ],
    [handleRenameClick, handleDeleteClick]
  );

  console.log(dataDeck, "data");

  if (isPending) {
    return <DeckListSkeleton />;
  }
  return (
    <>
      <Metadata title="Deck | BrainCard" content="deck-list" />
      <div
        className={
          dataDeck && dataDeck?.data.length === 0 ? "grow flex flex-col" : ""
        }
      >
        <div className="sticky top-0 pb-2">
          <div className="flex justify-between items-center bg-white/90">
            <div className="flex items-end gap-5 pt-5">
              <div className="text-2xl font-semibold">Learn</div>
              <CreateDeck
                trigger={
                  <Tooltip
                    trigger={
                      <div className="cursor-pointer hover:opacity-60 -mb-1">
                        <img src={deckImg} alt="" />
                      </div>
                    }
                    content="Add new memory deck"
                  />
                }
              />
            </div>
          </div>
        </div>
        <div
          className={
            dataDeck && dataDeck?.data.length === 0
              ? "grow flex justify-center items-center -mt-20"
              : "pt-3"
          }
        >
          <div>
            {dataDeck &&
              dataDeck?.data.map((deck) => {
                const masterdedCardsProgress =
                  (deck.masteredCards / deck.totalCards) * 100;
                return (
                  <motion.div key={deck.id}>
                    <div className="mb-3">
                      <Link
                        to={`/decks/${deck.id}/cards`}
                        state={{
                          deckName: deck.name,
                        }}
                      >
                        <Card>
                          <CardHeader className="flex justify-between items-center">
                            <div className="flex-1">
                              <CardTitle className="hover:text-primary transition-colors">
                                {deck.name}
                              </CardTitle>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <AppDropDownMenu
                                options={getDropdownOptions(deck)}
                              />
                            </div>
                          </CardHeader>

                          <CardContent>
                            <div className="flex items-center gap-5">
                              <div className="flex items-center gap-1.5 text-sm leading-5">
                                <div className="text-black/60 truncate">
                                  New cards
                                </div>
                                <div className="font-semibold">
                                  {deck.newCards}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm leading-5">
                                <div className="text-black/60 truncate">
                                  Cards to review
                                </div>
                                <div className="font-semibold">
                                  {deck.cardsInReview}
                                </div>
                              </div>
                            </div>
                            <div className="my-2 flex items-center gap-4">
                              <Progress value={masterdedCardsProgress} />
                              <div className="mb-1 font text-sm text-black/60">
                                {`${deck.masteredCards}/${deck.totalCards}`}
                              </div>
                            </div>
                            <div className="text-black/60 text-sm leading-5">
                              Mastered{" "}
                              {!Number.isNaN(masterdedCardsProgress)
                                ? masterdedCardsProgress.toFixed(1)
                                : 0}
                              %
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            {(!dataDeck || dataDeck.data.length === 0) && <EmptyDeck />}

            {/* Delete */}
            <DeleteDialog
              open={openDeleteDialog}
              onOpenChange={setOpenDeleteDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the deck "{selectedDeck?.name}" and remove all its cards
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    className="cursor-pointer bg-red-500 hover:bg-red-400"
                    disabled={deleteDeckMutation.isPending}
                  >
                    {deleteDeckMutation.isPending ? <Spinner /> : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </DeleteDialog>

            {/* Rename */}
            <UpdateDeck
              externalOpen={openUpdateDialog}
              setExternalOpen={setOpenUpdateDialog}
              deck={selectedDeck as Deck}
            />
          </div>
        </div>
      </div>
    </>
  );
}
