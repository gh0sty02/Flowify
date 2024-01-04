import { z } from "zod";

export const updateCardSchema = z.object({
  title: z.optional(
    z.string({
      required_error: "Title is Required",
      invalid_type_error: "Title is Required",
    })
  ),
  description: z.optional(
    z
      .string({
        required_error: "Description is Required",
        invalid_type_error: "Description is Required",
      })
      .min(3, {
        message: "Description is too short",
      })
  ),
  cardId: z.string(),
  boardId: z.string(),
});
