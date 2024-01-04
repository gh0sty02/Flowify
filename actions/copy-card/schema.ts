import { z } from "zod";

export const copyCardSchema = z.object({
  boardId: z.string(),
  cardId: z.string(),
});
