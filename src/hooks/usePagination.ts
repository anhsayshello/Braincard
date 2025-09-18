import path from "@/constants/path";
import useQueryConfig from "@/hooks/useQueryConfig";
import { useCallback, useMemo } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router";

export interface PaginationProps {
  dataPagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalCards: number;
  };
  isAllCards?: boolean;
}

export default function usePagination({
  dataPagination,
  isAllCards,
}: PaginationProps) {
  const { deckId } = useParams();
  const queryConfig = useQueryConfig();
  const navigate = useNavigate();
  const handlePageChange = useCallback(
    (newPage: number) => {
      const newParams = { ...queryConfig, page: newPage.toString() };
      return isAllCards
        ? navigate({
            pathname: path.allCards,
            search: createSearchParams(newParams).toString(),
          })
        : navigate({
            pathname: `/decks/${deckId}/cards`,
            search: createSearchParams(newParams).toString(),
          });
    },
    [queryConfig, deckId, navigate, isAllCards]
  );

  const generatePageNumbers = useCallback(
    (currentPage: number, totalPages: number) => {
      const pages = [];
      const maxVisiblePages = 3;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 2) {
          pages.push(1, 2, 3);
        } else if (currentPage >= totalPages - 1) {
          pages.push(totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(currentPage - 1, currentPage, currentPage + 1);
        }
      }

      return pages;
    },
    []
  );

  const currentPage = useMemo(
    () => dataPagination.currentPage || 1,
    [dataPagination.currentPage]
  );
  const totalPages = useMemo(
    () => dataPagination.totalPages || 1,
    [dataPagination.totalPages]
  );
  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages, generatePageNumbers]
  );

  return { handlePageChange, totalPages, currentPage, pageNumbers };
}
