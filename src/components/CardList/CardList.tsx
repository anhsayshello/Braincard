import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cardApi from "@/apis/card.api";

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
import { UpdateCard } from "@/components/CardFormDialog/CardFormDialog";
import { useCallback, useState } from "react";
import { Card as CardType } from "@/types/card.type";
import Spinner from "@/components/Spinner";
import AppDropDownMenu from "@/components/AppDropDownMenu";
import { toast } from "sonner";
import { motion } from "motion/react";
import EmptyDeckCard from "@/pages/DeckCards/components/EmptyDeckCard";
import CardNotFound from "@/pages/AllCards/components/CardNotFound";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CardItem from "../CardItem";

interface Props {
  dataCards: CardType[];
  isAllCards?: boolean;
}

export default function CardList({ dataCards, isAllCards = true }: Props) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openCardDetail, setOpenCardDetail] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const queryClient = useQueryClient();

  const handleOpenCardDetail = useCallback(
    (card: CardType) => {
      setSelectedCard(card);
      setOpenCardDetail(true);
    },
    [setSelectedCard, setOpenCardDetail]
  );

  const handleEditClick = useCallback(
    (card: CardType) => {
      setSelectedCard(card);
      setOpenUpdateDialog(true);
    },
    [setSelectedCard, setOpenUpdateDialog]
  );

  const handleDeleteClick = useCallback(
    (card: CardType) => {
      setSelectedCard(card);
      setOpenDeleteDialog(true);
    },
    [setSelectedCard, setOpenDeleteDialog]
  );

  const deleteCardMutation = useMutation({
    mutationFn: cardApi.deleteCard,
    onSuccess: () => {
      toast.success(`Card "${selectedCard?.frontCard}" has been deleted`, {
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["deckCards", selectedCard?.deckId],
      });
      queryClient.invalidateQueries({
        queryKey: ["allCards"],
      });
      setOpenDeleteDialog(false);
      setSelectedCard(null);
    },
    onError: (error) => {
      console.error("Error deleting deck:", error);
    },
  });

  const handleDeleteConfirm = useCallback(() => {
    if (selectedCard && selectedCard.deckId) {
      deleteCardMutation.mutate({
        deckId: selectedCard.deckId,
        cardIds: [selectedCard.id],
      });
    }
  }, [selectedCard, deleteCardMutation]);

  const getDropdownOptions = useCallback(
    (card: CardType) => [
      {
        onClick: () => handleEditClick(card),
        name: "Edit",
      },
      {
        onClick: () => handleDeleteClick(card),
        name: "Delete",
      },
    ],
    [handleEditClick, handleDeleteClick]
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
        {dataCards && dataCards.length === 0 ? (
          !isAllCards ? (
            <EmptyDeckCard />
          ) : (
            <CardNotFound />
          )
        ) : (
          ""
        )}
        {dataCards &&
          dataCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.05,
                ease: "linear",
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <Card className="mb-1">
                <CardHeader className="flex justify-between">
                  <CardTitle
                    onClick={() => handleOpenCardDetail(card)}
                    className="text-xl cursor-pointer truncate mr-2"
                  >
                    <div className="truncate">{card.frontCard}</div>
                  </CardTitle>
                  <AppDropDownMenu options={getDropdownOptions(card)} />
                </CardHeader>
                <button
                  className="col-span-1 cursor-pointer"
                  onClick={() => handleOpenCardDetail(card)}
                >
                  <CardContent>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-1.5 text-sm leading-5">
                          <div className="text-black/60">Review</div>
                          <div className="font-semibold">
                            {card.reviewCount}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm leading-5">
                          <div className="text-black/60">Forget</div>
                          <div className="font-semibold">
                            {card.forgetCount}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm leading-5">
                          <div className="text-black/60 truncate font-semibold">
                            {card.timeUntilReview}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </button>
              </Card>
            </motion.div>
          ))}
      </div>

      {/* Open card dialog */}

      <Dialog open={openCardDetail} onOpenChange={setOpenCardDetail}>
        <DialogContent showCloseButton={false} aria-describedby={undefined}>
          <VisuallyHidden asChild>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>
          <CardItem
            card={selectedCard as CardType}
            onClick={() => setOpenCardDetail(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <DeleteDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "
              {selectedCard?.frontCard}" card and remove from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="cursor-pointer bg-red-500 hover:bg-red-400"
              disabled={deleteCardMutation.isPending}
            >
              {deleteCardMutation.isPending ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DeleteDialog>

      {/* Edit */}
      <UpdateCard
        externalOpen={openUpdateDialog}
        setExternalOpen={setOpenUpdateDialog}
        card={selectedCard as CardType}
      />
    </>
  );
}
