import { z } from "zod";

import { Card } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { updateCardSchema } from "./schema";

export type InputType = z.infer<typeof updateCardSchema>;

export type ReturnType = ActionState<InputType, Card>;
