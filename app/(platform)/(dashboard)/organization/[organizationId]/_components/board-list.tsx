import { HelpCircle, User2 } from "lucide-react";
import React from "react";
import Hint from "./hint";
import { FormPopover } from "@/components/form/form-popover";

function BoardList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <FormPopover sideOffset={10} side="right">
          <div
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            role="button"
          >
            <p className="text-sm">Create New Board</p>
            <span className="text-xs">5 Remaining</span>
            <Hint
              sideOffset={40}
              description={`Free Workspaces can have upto 5 open boards. For Unlimited boards upgrade this workspace`}
            >
              <HelpCircle className="h-[14px] w-[14px] absolute bottom-2 right-2" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
}

export default BoardList;
