import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function DeckCardsSkeleton() {
  return (
    <div>
      <div className="md:min-w-[450px]">
        <div className="flex items-center gap-4">
          <Button disabled={true} variant="ghost">
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
          <div className="flex grow h-9 items-center gap-2 border-b px-3">
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <Input
              type="text"
              placeholder="Enter a word to search"
              className="!border-0 !outline-0 !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus-visible:!border-0 focus-visible:!ring-0 aria-invalid:!border-0"
              disabled
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-5 mb-4.5">
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" disabled>
              <Skeleton className="w-3.5 h-3.5 rounded animate-pulse"></Skeleton>
              Refresh
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Skeleton className="w-3.5 h-3.5 rounded animate-pulse"></Skeleton>
              Start practicing
            </Button>
            <Button size="sm" variant="outline" disabled>
              <Skeleton className="w-3.5 h-3.5 rounded animate-pulse"></Skeleton>
              Add New Card
            </Button>
          </div>
        </div>

        {/* Loading skeleton grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardListSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
