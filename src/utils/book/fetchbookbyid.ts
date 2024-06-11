import { BookFormData } from "@/types/book";
import { supabase } from "@/utils/supabase/client";

export const fetchBookById = async (
  id: string
): Promise<BookFormData | null> => {
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching book:", error.message);
    return null;
  }

  if (book && book.images && book.images.length > 0) {
    const imageUrls = book.images.map(
      (imagePath: string) =>
        supabase.storage.from("books").getPublicUrl(imagePath).data.publicUrl
    );
    return { ...book, images: imageUrls };
  }

  return book;
};
