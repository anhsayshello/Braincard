import { useLocation, useNavigate, useParams } from "react-router";
import useQueryConfig from "@/hooks/useQueryConfig";
import { Card, CardQueryParams } from "@/types/card.type";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import cardApi from "@/apis/card.api";
import { useEffect, useMemo, useRef, useState } from "react";
import searchHandler from "@/helpers/searchHandler";
import { toast } from "sonner";

interface ExtendedCard extends Card {
  checked: boolean;
}

export default function useDeckCards() {
  const { deckId } = useParams();
  const [cards, setCards] = useState<ExtendedCard[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryConfig = useQueryConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const { deckName } = location.state;

  const { data, isPending, refetch } = useQuery({
    queryKey: ["deckCards", deckId, queryConfig],
    queryFn: () =>
      cardApi.getCards(deckId as string, queryConfig as CardQueryParams),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data) {
      setCards(data?.data.cards.map((card) => ({ ...card, checked: false })));
    }
  }, [data]);

  const dataPagination = useMemo(() => data?.data.pagination, [data]);

  const handleSearchChange = searchHandler({
    queryConfig,
    pathName: `/decks/${deckId}/cards`,
    navigate,
    location: location,
  });

  const handleCheck = (id: string) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, checked: !card.checked } : card
      )
    );
  };
  console.log(cards);

  const handleCheckAll = () => {
    setCards(cards.map((card) => ({ ...card, checked: true })));
  };

  const handleUncheckAll = () => {
    setCards(cards.map((card) => ({ ...card, checked: false })));
  };

  const checkedCardCount = useMemo(
    () => cards.filter((card) => card.checked).length,
    [cards]
  );
  const someCheckCards = useMemo(
    () => cards.some((card) => card.checked),
    [cards]
  );

  const deleteCardsMutation = useMutation({
    mutationFn: cardApi.deleteCard,
    onSuccess: () => {
      refetch();
      toast.success(`Cards has been deleted`, {
        duration: 1500,
      });
      setOpenDeleteDialog(false);
    },
    onError: (error) => {
      console.error("Error deleting card:", error);
    },
  });

  const handleDeleteMany = () => {
    if (deckId) {
      const cardIds = cards
        .filter((card) => card.checked)
        .map((card) => card.id);
      deleteCardsMutation.mutate({ deckId, cardIds });
    }
  };

  return {
    data,
    cards,
    deckId,
    refetch,
    openDeleteDialog,
    setOpenDeleteDialog,
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
  };
}
