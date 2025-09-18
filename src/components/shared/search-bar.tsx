import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

export default function SearchBar({
  inputRef,
  handleSearchChange,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex h-9 items-center gap-2 border-b px-5 mt-3">
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter a word to search"
        className="!border-0 !outline-0 !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus-visible:!border-0 focus-visible:!ring-0 aria-invalid:!border-0"
        onChange={handleSearchChange}
      />
    </div>
  );
}
