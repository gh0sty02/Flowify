import { z } from "zod";

export const updateBoardSchema = z.object({
  title: z.string({
    required_error: "Title is Required",
    invalid_type_error: "Title is Required",
  }),
  id: z.string({
    required_error: "Board Id is Required",
    invalid_type_error: "Board Id is Required",
  }),
});
