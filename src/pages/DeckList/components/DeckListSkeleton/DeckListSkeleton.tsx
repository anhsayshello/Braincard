import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import deckImg from "@/assets/images/CreateDeck.svg";

const DeckSkeleton = () => (
  <div className="mb-3.5">
    <Card>
      <CardHeader className="flex justify-between items-center">
        <Skeleton className="h-6 w-40 rounded animate-pulse"></Skeleton>
        <Skeleton className="h-5 w-6 rounded animate-pulse"></Skeleton>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-sm leading-5">
            <Skeleton className="h-5.5 w-23 rounded animate-pulse"></Skeleton>
            <Skeleton className="h-5.5 w-6 rounded animate-pulse"></Skeleton>
          </div>
          <div className="flex items-center gap-1.5 text-sm leading-5">
            <Skeleton className="h-5.5 w-32 rounded animate-pulse"></Skeleton>
            <Skeleton className="h-5.5 w-6 rounded animate-pulse"></Skeleton>
          </div>
        </div>
        <div className="my-2 flex items-center gap-4">
          <Skeleton className="h-2.5 w-full rounded-xl animate-pulse"></Skeleton>
          <Skeleton className="h-4 w-6 rounded animate-pulse"></Skeleton>
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-5 w-18 rounded animate-pulse"></Skeleton>
          <Skeleton className="h-5.5 w-6 rounded animate-pulse"></Skeleton>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function DeckListSkeleton() {
  return (
    <div>
      <div className="sticky top-0 pb-2">
        <div className="flex justify-between items-center bg-white/90">
          <div className="flex items-center gap-5 pt-5">
            <div className="text-2xl font-semibold">Learn</div>
            <button
              disabled={true}
              className="cursor-pointer opacity-50 -mb-1.5"
            >
              <img src={deckImg} alt="" />
            </button>
          </div>
        </div>
      </div>
      <div className="pt-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <DeckSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
