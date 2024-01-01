import { z } from "zod";

import { Board, List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { deleteListSchema } from "./schema";

export type InputType = z.infer<typeof deleteListSchema>;

export type ReturnType = ActionState<InputType, List>;
