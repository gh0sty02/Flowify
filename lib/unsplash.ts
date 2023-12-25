import { env } from "@/env.mjs";
import { createApi } from "unsplash-js";

export const unsplash = createApi({
  accessKey: env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});
