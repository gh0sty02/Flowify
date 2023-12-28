import { Board } from "@prisma/client";
import React from "react";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavBarProps {
  board: Board;
}

export const BoardNavbar = ({ board }: BoardNavBarProps) => {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm board={board} />
      <div className="ml-auto">
        <BoardOptions id={board.id} />
      </div>
    </div>
  );
};
