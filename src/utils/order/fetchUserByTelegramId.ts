import { supabase } from "@/utils/supabase/client";

export const fetchUserByTelegramId = async (telegramUserId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("telegram_user_id", telegramUserId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
