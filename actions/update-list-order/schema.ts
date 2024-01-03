import { z } from "zod";

export const UpdateListOrderSchema = z.object({
  boardId: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      id: z.string(),
      order: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});
