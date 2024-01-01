import { z } from "zod";

export const deleteListSchema = z.object({
  listId: z.string({
    required_error: "Board Id is Required",
    invalid_type_error: "Board Id is Required",
  }),
  boardId: z.string({
    required_error: "List Id is Required",
    invalid_type_error: "List Id is Required",
  }),
});
