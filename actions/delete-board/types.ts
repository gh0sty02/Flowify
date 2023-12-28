import { z } from "zod";

import { Board } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { deleteBoardSchema } from "./schema";

export type InputType = z.infer<typeof deleteBoardSchema>;

export type ReturnType = ActionState<InputType, Board>;
