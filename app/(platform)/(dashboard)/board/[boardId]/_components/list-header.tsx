"use client";

import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";

interface ListHeaderProps {
  data: List;
}

export const ListHeader = ({ data }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  const onBlurHandler = () => {
    console.log("bur");
    formRef.current?.requestSubmit();
  };

  const onSubmitHandler = (formData: FormData) => {
    const title = formData.get("title") as string;
    const listId = formData.get("listId") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) {
      return disableEditing();
    }

    execute({
      title,
      listId,
      boardId,
    });
  };

  useEventListener("keydown", onKeyDown);

  return (
    <div
      className="pt-2 px-2 text-sm font-semibold flex items-start justify-between gap-x-2"
      onClick={enableEditing}
    >
      {isEditing ? (
        <form
          ref={formRef}
          className="flex-1 px-[2px]"
          action={onSubmitHandler}
        >
          <input
            id="listId"
            name="listId"
            hidden
            value={data.id}
            onChange={() => {}}
          />
          <input
            id="boardId"
            name="boardId"
            hidden
            value={data.boardId}
            onChange={() => {}}
          />
          <FormInput
            id="title"
            ref={inputRef}
            onBlur={onBlurHandler}
            placeholder="Enter List Title"
            defaultValue={data.title}
            className="font-medium text-sm px-[7px] py-1 h-7 border-transparent hover:border-input focus:border-inherit truncate transition bg-transparent focus:bg-white"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
          {title}
        </div>
      )}
    </div>
  );
};
