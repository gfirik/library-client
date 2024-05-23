import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import env from "@/utils/zod/env";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY;

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (error) {}
      },
    },
  });
}
