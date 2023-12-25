"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface HintProps {
  sideOffset?: number;
  side?: "left" | "right" | "top" | "bottom";
  description: string;
  children: React.ReactNode;
}

function Hint({
  children,
  description,
  sideOffset,
  side = "bottom",
}: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          side={side}
          className="text-xs max-w-[220px] break-words"
        >
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default Hint;
