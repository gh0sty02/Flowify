"use client";

import { createCard } from "@/actions/create-card";
import { FormSubmitButton } from "@/components/form/form-submit";
import { FormTextArea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  useRef,
} from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ disableEditing, enableEditing, isEditing, listId }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);
    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess(data) {
        toast.success(`Card "${data.title}" added successfully`);
        formRef.current?.reset();

        // disableEditing();
      },
      onError(error) {
        toast.error(error);
      },
    });

    const onSubmitHandler = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      console.log(title, listId, boardId);

      execute({ title, listId, boardId });
    };

    const onKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    const onTextAreaKeyDownHandler: KeyboardEventHandler<
      HTMLTextAreaElement
    > = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDownHandler);

    if (isEditing) {
      return (
        <form
          className="m-1 py-0.5 px-1 space-y-4"
          action={onSubmitHandler}
          ref={formRef}
        >
          <FormTextArea
            id="title"
            onKeyDown={onTextAreaKeyDownHandler}
            ref={ref}
            placeholder="Enter a title for this card..."
            errors={fieldErrors}
          />
          <input
            type="hidden"
            name="listId"
            id="listId"
            value={listId}
            onChange={() => {}}
          />
          <div className="flex items-center gap-x-1">
            <FormSubmitButton>Submit</FormSubmitButton>
            <Button
              onClick={disableEditing}
              className="h-auto w-auto"
              variant="ghost"
              size="sm"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </form>
      );
    }
    return (
      <div className="pt-2 px-2">
        <Button
          className="w-full h-auto text-sm px-2 py-1.5 justify-start text-muted-foreground"
          variant="ghost"
          size="sm"
          onClick={enableEditing}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a Card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
