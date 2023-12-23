"use client";

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import React from "react";

interface BoardProps {
  id: string;
  title: string;
}
export const Board = ({ id, title }: BoardProps) => {
  return (
    <form
      action={deleteBoard.bind(null, id)}
      key={id}
      className="flex flex-row gap-x-2 items-center"
    >
      <p>Board Title : {title}</p>
      <Button type="submit" size="sm" variant="destructive">
        Delete
      </Button>
    </form>
  );
};
