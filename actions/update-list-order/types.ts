import { z } from "zod";
import { Board, List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateListOrderSchema } from "./schema";

export type InputType = z.infer<typeof UpdateListOrderSchema>;
export type ReturnType = ActionState<InputType, List[]>;
