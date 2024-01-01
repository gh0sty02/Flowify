"use client";

import { FormSubmitButton } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { List } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

import { MoreHorizontal, X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/delete-list";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copy-list";

interface ListOptionProps {
  list: List;
  onAddCard: () => void;
}

export const ListOptions = ({ list, onAddCard }: ListOptionProps) => {
  const closePopoverRef = useRef<ElementRef<"button">>(null);
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess(data) {
      toast.success(`List ${data.title} deleted successfully`);
      closePopoverRef.current?.click();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess(data) {
      toast.success(`List ${data.title} Copied successfully`);
      closePopoverRef.current?.click();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onListDeleteHandler = (formData: FormData) => {
    const listId = formData.get("listId") as string;
    const boardId = formData.get("boardId") as string;

    executeDelete({ listId, boardId });
  };

  const onListCopyHandler = (formData: FormData) => {
    const listId = formData.get("listId") as string;
    const boardId = formData.get("boardId") as string;

    executeCopy({ listId, boardId });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-auto h-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="px-0 py-3">
        <div className="font-medium text-sm text-neutral-600 text-center pb-4">
          Popover Content
        </div>
        <PopoverClose asChild ref={closePopoverRef}>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start p-2 px-5 font-normal text-sm rounded-none"
        >
          Add Card...
        </Button>
        <form action={onListCopyHandler}>
          <input type="hidden" name="listId" id="listId" value={list.id} />
          <input
            type="hidden"
            name="boardId"
            id="boardId"
            value={list.boardId}
          />
          <FormSubmitButton
            variant="ghost"
            className="h-auto w-full justify-start p-2 px-5 font-normal text-sm rounded-none"
          >
            Copy List...
          </FormSubmitButton>
        </form>
        <Separator />
        <form action={onListDeleteHandler}>
          <input type="hidden" name="listId" id="listId" value={list.id} />
          <input
            type="hidden"
            name="boardId"
            id="boardId"
            value={list.boardId}
          />
          <FormSubmitButton
            variant="ghost"
            className="h-auto w-full justify-start p-2 px-5 font-normal text-sm rounded-none"
          >
            Delete List...
          </FormSubmitButton>
        </form>
      </PopoverContent>
    </Popover>
  );
};
