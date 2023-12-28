"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { updateBoardSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id } = data;

  if (!title || !id) {
    return {
      error: "Missing Fields, Failed to Update board",
    };
  }

  let board;

  try {
    board = await db.board.update({
      where: {
        orgId,
        id,
      },
      data: {
        title,
      },
    });

    revalidatePath(`/board/${id}`);

    return { data: board };
  } catch (error) {
    return {
      error: "Failed to Update",
    };
  }
};
export const updateBoard = createSafeAction(updateBoardSchema, handler);
