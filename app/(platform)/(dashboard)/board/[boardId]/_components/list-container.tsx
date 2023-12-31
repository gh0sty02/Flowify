import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
import React from "react";
import { ListForm } from "./list-form";

interface ListContainerProps {
  boardId: string;
  lists: ListWithCards[];
}

export const ListContainer = ({ boardId, lists }: ListContainerProps) => {
  return (
    <ol>
      <ListForm />
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
};
