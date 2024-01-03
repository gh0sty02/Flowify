"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { updateListSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, listId, boardId } = data;

  if (!title || !listId || !boardId) {
    return {
      error: "Missing Fields, Failed to Update board",
    };
  }

  let list;

  try {
    list = await db.list.update({
      where: {
        boardId,
        id: listId,
        board: {
          orgId,
        },
      },
      data: {
        title,
      },
    });

    revalidatePath(`/board/${boardId}`);

    return { data: list };
  } catch (error) {
    return {
      error: "Failed to Update",
    };
  }
};
export const updateList = createSafeAction(updateListSchema, handler);
