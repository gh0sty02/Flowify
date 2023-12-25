"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoardSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // until this point, the data has already been checked for correct format
  const { title, image } = data;
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML! ||
    !imageUserName
  ) {
    return {
      error: "Missing Fields, failed to create board.",
    };
  }
  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        imageFullUrl,
        imageId,
        imageThumbUrl,
        imageUserName,
        imageLinkHTML,
        orgId,
      },
    });
  } catch (error) {
    return {
      error: "Failed to Create",
    };
  }

  revalidatePath(`/board/${board.id}`);

  return { data: board };
};

export const createBoard = createSafeAction(CreateBoardSchema, handler);
