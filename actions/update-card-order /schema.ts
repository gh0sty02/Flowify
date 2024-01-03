import { z } from "zod";

export const UpdateCardOrderSchema = z.object({
  boardId: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      id: z.string(),
      order: z.number(),
      listId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});
