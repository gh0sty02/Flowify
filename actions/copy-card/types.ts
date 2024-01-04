import { z } from "zod";

import { Card } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { copyCardSchema } from "./schema";

export type InputType = z.infer<typeof copyCardSchema>;

export type ReturnType = ActionState<InputType, Card>;
