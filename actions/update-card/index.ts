"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { updateCardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-logs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { boardId, cardId, ...values } = data;

  let card;

  try {
    card = await db.card.update({
      where: {
        id: cardId,
        list: { board: { orgId } },
      },
      data: {
        ...values,
      },
    });

    await createAuditLog({
      action: ACTION.UPDATE,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: card.title,
    });
    revalidatePath(`/board/${boardId}`);

    return { data: card };
  } catch (error) {
    return {
      error: "Failed to Update",
    };
  }
};
export const updateCard = createSafeAction(updateCardSchema, handler);
