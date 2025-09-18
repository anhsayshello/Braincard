import { Badge } from "../ui/badge";

export default function AppTitle({
  title,
  deckName,
}: {
  title: string;
  deckName?: string;
}) {
  return (
    <div className="flex items-end mt-2">
      <Badge variant="secondary" className="text-xl md:text-2xl capitalize">
        {title}
      </Badge>
      {deckName && (
        <Badge className="ml-1.5 text-lg md:text-xl">{deckName}</Badge>
      )}
    </div>
  );
}
