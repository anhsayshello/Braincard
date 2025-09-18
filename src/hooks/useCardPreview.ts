import { useMutation, useQueryClient } from "@tanstack/react-query";
import cardApi from "@/apis/card.api";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/types/card.type";

export default function useCardPreview() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openCardDetail, setOpenCardDetail] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const queryClient = useQueryClient();

  const handleOpenCardDetail = useCallback(
    (card: Card) => {
      setSelectedCard(card);
      setOpenCardDetail(true);
    },
    [setSelectedCard, setOpenCardDetail]
  );

  const handleEditClick = useCallback(
    (card: Card) => {
      setSelectedCard(card);
      setOpenUpdateDialog(true);
    },
    [setSelectedCard, setOpenUpdateDialog]
  );

  const handleDeleteClick = useCallback(
    (card: Card) => {
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
      console.error("Error deleting card:", error);
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
    (card: Card) => [
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

  return {
    handleDeleteConfirm,
    handleOpenCardDetail,
    getDropdownOptions,
    openCardDetail,
    setOpenCardDetail,
    openDeleteDialog,
    setOpenDeleteDialog,
    openUpdateDialog,
    setOpenUpdateDialog,
    selectedCard,
    deleteCardMutation,
  };
}
