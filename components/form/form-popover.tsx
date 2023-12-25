"use client";
import React, { Children } from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormInput } from "./form-input";
import { FormSubmitButton } from "./form-submit";
import { createBoard } from "@/actions/create-board";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";

interface FromPopoverProps {
  align?: "center" | "start" | "end";
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  align,
  side,
  sideOffset,
}: FromPopoverProps) => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log({ data });
      toast.success("Board Created");
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error);
    },
  });
  const onSubmitHandler = (formData: FormData) => {
    const title = formData.get("title") as string;

    execute({ title });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="w-80 pt-3"
      >
        <div className="text-sm font-medium text-center text-neutral-700 pb-4">
          Create Board
        </div>
        <PopoverClose asChild>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 text-neutral-600 w-auto h-auto p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form className="space-y-4" action={onSubmitHandler}>
          <div className="space-y-4">
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmitButton className="w-full">Submit</FormSubmitButton>
        </form>
      </PopoverContent>
    </Popover>
  );
};
