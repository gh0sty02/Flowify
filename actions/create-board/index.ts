"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-logs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { list } from "unsplash-js/dist/methods/photos";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const canCreate = await hasAvailableCount();

  if (!canCreate) {
    return {
      error:
        "You have reached your limit of free boards, Please upgrade to create more boards !",
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

    await incrementAvailableCount();

    await createAuditLog({
      action: ACTION.CREATE,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      entityTitle: board.title,
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
