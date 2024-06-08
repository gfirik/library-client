import { supabase } from "@/utils/supabase/client";
import { BookFormData } from "@/types/book";

export const fetchBooks = async (): Promise<BookFormData[]> => {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    throw new Error(error.message);
  }

  const booksWithImageUrls = data.map((book) => {
    if (book.images && book.images.length > 0) {
      const imageUrls = book.images.map(
        (imagePath: string) =>
          supabase.storage.from("books").getPublicUrl(imagePath).data.publicUrl
      );
      return { ...book, images: imageUrls };
    }
    return book;
  });

  return booksWithImageUrls;
};
