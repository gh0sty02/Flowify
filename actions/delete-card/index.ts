"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { deleteCardSchema } from "./schema";
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

  const { cardId, boardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id: cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
    });

    await createAuditLog({
      action: ACTION.DELETE,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: card.title,
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/organization/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(deleteCardSchema, handler);
