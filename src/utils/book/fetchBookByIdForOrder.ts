import { supabase } from "@/utils/supabase/client";

export const fetchBookByIdForOrder = async (
  id: string
): Promise<{
  id: string;
  title: string;
  author: string;
  price_per_week: number;
} | null> => {
  const { data: book, error } = await supabase
    .from("books")
    .select("id, title, author, price_per_week")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching book:", error.message);
    return null;
  }

  if (book) {
    console.log("Fetched book data:", book);
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      price_per_week: Number(book.price_per_week),
    };
  }

  return null;
};
