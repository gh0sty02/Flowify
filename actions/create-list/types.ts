import { z } from "zod";
import { Board, List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateListSchema } from "./schema";

export type InputType = z.infer<typeof CreateListSchema>;
export type ReturnType = ActionState<InputType, List>;
