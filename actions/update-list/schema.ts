import { z } from "zod";

export const updateListSchema = z.object({
  title: z.string({
    required_error: "Title is Required",
    invalid_type_error: "Title is Required",
  }),
  listId: z.string({
    required_error: "Board Id is Required",
    invalid_type_error: "Board Id is Required",
  }),
  boardId: z.string({
    required_error: "Board Id is Required",
    invalid_type_error: "Board Id is Required",
  }),
});
