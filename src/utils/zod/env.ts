import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  server: {
    SUPABASE_PROJECT_URL: z.string().url(),
    SUPABASE_PUBLIC_ANON_KEY: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_SUPABASE_PROJECT_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    SUPABASE_PROJECT_URL: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
    SUPABASE_PUBLIC_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PROJECT_URL:
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
    NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY,
  },
});

export default env;
