import { z } from "zod";

import { Board, List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { copyListSchema } from "./schema";

export type InputType = z.infer<typeof copyListSchema>;

export type ReturnType = ActionState<InputType, List>;
