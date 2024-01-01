"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { copyListSchema } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { listId, boardId } = data;
  let list;

  try {
    const board = await db.board.findFirst({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    const listToCopy = await db.list.findUnique({
      where: {
        boardId,
        id: listId,
        board: {
          orgId,
        },
      },
      include: {
        cards: true,
      },
    });

    if (!listToCopy) {
      return {
        error: "List not found",
      };
    }

    const lastList = await db.list.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = lastList?.order ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              order: card.order,
              title: card.title,
              description: card.description,
            })),
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to Copy.",
    };
  }

  revalidatePath(`/organization/board/${boardId}`);
  // redirect(`/organization/board/${orgId}`);

  return { data: list };
};

export const copyList = createSafeAction(copyListSchema, handler);
