import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import deckApi from "@/apis/deck.api";
import { useCallback, useState } from "react";
import Deck from "@/types/deck.type";
import { toast } from "sonner";

export default function useDeckList() {
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

  return {
    dataDeck,
    isPending,
    deleteDeckMutation,
    handleDeleteConfirm,
    getDropdownOptions,
    openDeleteDialog,
    setOpenDeleteDialog,
    openUpdateDialog,
    setOpenUpdateDialog,
    selectedDeck,
  };
}
