import { z } from "zod";

export const deleteBoardSchema = z.object({
  id: z.string({
    required_error: "Board Id is Required",
    invalid_type_error: "Board Id is Required",
  }),
});
