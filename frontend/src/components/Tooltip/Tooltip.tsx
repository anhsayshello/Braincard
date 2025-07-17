import {
  Tooltip as TooltipWrapper,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface Props {
  trigger: React.ReactElement;
  content: string;
}

export default function Tooltip({ trigger, content }: Props) {
  return (
    <TooltipWrapper>
      <TooltipTrigger className="hover:opacity-60">{trigger}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </TooltipWrapper>
  );
}
