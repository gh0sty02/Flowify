"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { deleteListSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-logs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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

    list = await db.list.delete({
      where: {
        boardId,
        id: listId,
        board: {
          orgId,
        },
      },
    });

    await createAuditLog({
      action: ACTION.DELETE,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: list.title,
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/organization/board/${boardId}`);
  // redirect(`/organization/board/${orgId}`);

  return { data: list };
};

export const deleteList = createSafeAction(deleteListSchema, handler);
