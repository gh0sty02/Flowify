import { z } from "zod";

export const copyListSchema = z.object({
  listId: z.string(),
  boardId: z.string(),
});
