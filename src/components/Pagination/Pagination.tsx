import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import path from "@/constants/path";
import useQueryConfig from "@/hooks/useQueryConfig";
import { useCallback, useMemo } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router";

interface Props {
  dataPagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalCards: number;
  };
  isAllCards?: boolean;
}

export default function Pagination({
  dataPagination,
  isAllCards = true,
}: Props) {
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

  return (
    <div>
      {dataPagination && totalPages > 1 && (
        <PaginationWrapper>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageNumbers[0] > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(1)}
                    className="cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {pageNumbers[0] > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={pageNum === currentPage}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(totalPages)}
                    className="cursor-pointer"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationWrapper>
      )}
    </div>
  );
}
