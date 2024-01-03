"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCardSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // until this point, the data has already been checked for correct format
  const { title, listId, boardId } = data;

  let card;

  try {
    // check if the board id is valid
    const currentList = await db.list.findUnique({
      where: {
        id: listId,
        boardId,
        board: {
          orgId,
        },
      },
    });

    if (!currentList) {
      return {
        error: "List Not found",
      };
    }

    // the order of the list is done by a number which is set during the creation of list
    // so we fetch the lists, get the last list by sorting in descending order and take the first one
    // if we have a list from this operation, take the order and increment it which becomes the new order for current list which is to be created
    //else as there are no list, current list is the first to be created, so we give it order as 1

    const lastCard = await db.card.findFirst({
      where: {
        listId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = lastCard?.order ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });
  } catch (error) {
    return {
      error: "Failed to Create",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: card };
};

export const createCard = createSafeAction(CreateCardSchema, handler);
