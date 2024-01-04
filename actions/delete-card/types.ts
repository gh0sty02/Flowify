import { z } from "zod";

import { Card } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { deleteCardSchema } from "./schema";

export type InputType = z.infer<typeof deleteCardSchema>;

export type ReturnType = ActionState<InputType, Card>;
