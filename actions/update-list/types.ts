import { z } from "zod";

import { Board, List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { updateListSchema } from "./schema";

export type InputType = z.infer<typeof updateListSchema>;

export type ReturnType = ActionState<InputType, List>;
