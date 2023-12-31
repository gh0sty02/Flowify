"use client";
import React, { ElementRef, useRef, useState } from "react";
import { ListWrapper } from "./list-wrapper";
import { Plus, X } from "lucide-react";
import { FormInput } from "@/components/form/form-input";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams, useRouter } from "next/navigation";
import { FormSubmitButton } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

export const ListForm = () => {
  const params = useParams();
  const router = useRouter();
  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmitHandler = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;

    execute({ title, boardId });
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          action={onSubmitHandler}
          className="w-full rounded-md p-3 space-y-4 bg-white shadow-md"
        >
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            // the id here should be same as that of the field name in schema, else there will be no field errors
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter List title..."
          />
          <input
            hidden
            value={params.boardId}
            name="boardId"
            onChange={() => {}}
          />
          <div className="flex items-center gap-x-2">
            <FormSubmitButton>Add Item</FormSubmitButton>
            <Button variant="ghost" size="sm">
              <X onClick={disableEditing} className="w-5 h-5"></X>
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        className="bg-white/80 w-full flex items-center hover:bg-white/50 p-3 transition font-medium text-sm rounded-md shadow-md"
        onClick={enableEditing}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a List
      </button>
    </ListWrapper>
  );
};
