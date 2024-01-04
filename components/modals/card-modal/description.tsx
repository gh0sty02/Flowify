"use client";

import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FormTextArea } from "@/components/form/form-textarea";
import { FormSubmitButton } from "@/components/form/form-submit";

interface DescriptionProps {
  card: CardWithList;
}

export const Description = ({ card }: DescriptionProps) => {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const queryClient = useQueryClient();

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess(data) {
      toast.success(`Card ${data.title} updated !`);
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      disableEditing();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onBlurHandler = () => {
    textAreaRef.current?.form?.requestSubmit();
  };
  const onSubmitHandler = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;
    execute({ description, boardId, cardId: card.id });
  };

  const onKeyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDownHandler);
  useOnClickOutside(formRef, disableEditing);

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>

        {isEditing ? (
          <form action={onSubmitHandler} ref={formRef} className="space-y-2">
            <FormTextArea
              id="description"
              className="w-full mt-2"
              placeholder="Add a Description"
              defaultValue={card.description || undefined}
              onBlur={onBlurHandler}
              ref={textAreaRef}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmitButton>Save</FormSubmitButton>
              <Button
                variant="ghost"
                onClick={disableEditing}
                size="sm"
                type="button"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {card.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
