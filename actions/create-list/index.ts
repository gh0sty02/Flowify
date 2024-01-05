"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateListSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-logs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // until this point, the data has already been checked for correct format
  const { title, boardId } = data;

  let list;

  try {
    // check if the board id is valid
    const currentBoard = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!currentBoard) {
      return {
        error: "Board Not found",
      };
    }

    // the order of the list is done by a number which is set during the creation of list
    // so we fetch the lists, get the last list by sorting in descending order and take the first one
    // if we have a list from this operation, take the order and increment it which becomes the new order for current list which is to be created
    //else as there are no list, current list is the first to be created, so we give it order as 1

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
        title,
        boardId,
        order: newOrder,
      },
    });

    await createAuditLog({
      action: ACTION.CREATE,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: list.title,
    });
  } catch (error) {
    return {
      error: "Failed to Create",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: list };
};

export const createList = createSafeAction(CreateListSchema, handler);
