import { Ship } from "lucide-react";

export default function CardNotFound() {
  return (
    <>
      <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
        <Ship className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-base font-medium text-gray-600 mb-2">
          No cards available
        </h3>
        <p className="text-gray-400 mb-6 text-sm max-w-sm">
          Try adjusting your search criteria or filters to find more results
        </p>
      </div>
    </>
  );
}
