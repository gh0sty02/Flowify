import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({
  params: { boardId },
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    return {
      title: "Board",
    };
  }
  const board = await db.board.findFirst({
    where: {
      id: boardId,
      orgId,
    },
  });

  return {
    title: board?.title || "Board",
  };
}

async function BoardIdLayout({
  children,
  params: { boardId },
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: {
      id: boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center "
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar board={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
}

export default BoardIdLayout;
