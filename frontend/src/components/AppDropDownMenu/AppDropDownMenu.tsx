// AppDropDownMenu.tsx
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Tooltip from "../Tooltip";
import className from "classnames";

interface DropdownOption {
  onClick: () => void;
  name: string;
}

interface Props {
  options: DropdownOption[];
}

export default function AppDropDownMenu({ options }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
        <div className="cursor-pointer">
          <Tooltip
            trigger={<MoreHorizontalIcon className="size-4" />}
            content="Options"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={-6}>
        {options.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onClick={option.onClick}
            className={className("font-medium", {
              "text-destructive focus:text-destructive":
                option.name === "Delete",
            })}
          >
            {option.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
