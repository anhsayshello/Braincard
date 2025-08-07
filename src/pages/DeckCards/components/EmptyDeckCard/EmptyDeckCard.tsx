import { CreateCard } from "@/components/CardFormDialog/CardFormDialog";
import { Button } from "@/components/ui/button";
import { Sprout, Plus } from "lucide-react";

export default function EmptyDeckCard() {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center -mt-20">
      <Sprout className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-base font-medium text-gray-600 mb-2">No cards yet</h3>
      <p className="text-gray-400 mb-6 text-sm max-w-sm">
        Get started by creating your first flashcard to begin learning
      </p>
      <CreateCard
        trigger={
          <Button size="sm">
            <Plus />
            Create your first card
          </Button>
        }
        onSuccess={() => console.log("Card created!")}
      />
    </div>
  );
}
