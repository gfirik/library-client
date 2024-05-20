import { z } from "zod";

const envSchema = z.object({
  SUPABASE_PROJECT_URL: z.string().url(),
  SUPABASE_PUBLIC_ANON_KEY: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;
