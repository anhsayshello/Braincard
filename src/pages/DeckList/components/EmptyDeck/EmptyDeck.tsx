import { CreateDeck } from "@/components/DeckFormDialog/DeckFormDialog";
import { Button } from "@/components/ui/button";
import { Layers, Plus } from "lucide-react";

// Empty deck component
export default function EmptyDeck() {
  return (
    <div className="flex flex-col items-center justify-center py-25 px-4 text-center">
      <Layers className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-base font-medium text-gray-600 mb-2">
        No decks available
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Create your first deck to get started
      </p>
      <CreateDeck
        trigger={
          <Button size="sm">
            <Plus />
            Create your first deck
          </Button>
        }
      />
    </div>
  );
}
