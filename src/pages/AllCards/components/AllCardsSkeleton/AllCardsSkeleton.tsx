import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CardListSkeleton = () => (
  <Card className="mb-1">
    <CardHeader>
      <div className="flex justify-between">
        <Skeleton className="h-6 w-32 rounded animate-pulse"></Skeleton>
        <Skeleton className="h-5 w-6 rounded animate-pulse"></Skeleton>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-start gap-5">
        <Skeleton className="h-4.5 w-20 rounded animate-pulse"></Skeleton>
        <Skeleton className="h-4.5 w-16 rounded animate-pulse"></Skeleton>
        <Skeleton className="h-4.5 w-25 rounded animate-pulse"></Skeleton>
      </div>
    </CardContent>
  </Card>
);

export default function AllCardsSkeleton({
  isPending,
}: {
  isPending?: boolean;
}) {
  return (
    <>
      {isPending && (
        <div>
          {/* Search Input Section */}
          <div className="flex grow h-9 items-center gap-2 border-b px-5 mt-3">
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <Input
              type="email"
              placeholder="Enter a word to search"
              className="!border-0 !outline-0 !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus-visible:!border-0 focus-visible:!ring-0 aria-invalid:!border-0"
              disabled
            />
          </div>

          {/* Filters and Sort Section */}
          <div className="flex items-center justify-between mt-5 flex-wrap gap-2.5">
            <div className="flex items-center flex-wrap gap-2.5">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Filter Buttons Skeleton */}
                <Button variant="outline" disabled>
                  <Skeleton className="w-3.5 h-3.5 rounded animate-pulse" />
                  New Cards
                </Button>
                <Button variant="outline" disabled>
                  <Skeleton className="w-3.5 h-3.5 rounded animate-pulse" />
                  In Review
                </Button>
                <Button variant="outline" disabled>
                  <Skeleton className="w-3.5 h-3.5 rounded animate-pulse" />
                  Mastered
                </Button>
              </div>

              {/* Sort Select Skeleton */}
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded animate-pulse" />
                  <Skeleton className="w-24.5 h-4 rounded animate-pulse" />
                </Button>

                {/* Clear Filter Button Skeleton */}
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled
                >
                  <Skeleton className="w-4 h-4 rounded animate-pulse" />
                  Clear
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled
            >
              <Skeleton className="w-50 h-4 rounded animate-pulse" />
            </Button>
          </div>

          {/* Card List Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 mt-4.5">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardListSkeleton key={index} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
