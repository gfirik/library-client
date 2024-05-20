"use server";
import { createClient } from "@supabase/supabase-js";
import env from "@/utils/zod/env";

const supabaseUrl = env.SUPABASE_PROJECT_URL;
const supabaseAnonKey = env.SUPABASE_PUBLIC_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
