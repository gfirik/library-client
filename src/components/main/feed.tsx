"use client";

import useSWR from "swr";
import BookCard from "./bookcard";
import { supabase } from "@/utils/supabase/client";
import { BookFormData } from "@/types/book";

const fetchBooks = async () => {
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

const MainFeed = () => {
  const {
    data: books,
    error,
    isLoading,
  } = useSWR("books", fetchBooks, {
    revalidateOnMount: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {books?.map((book: BookFormData) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default MainFeed;
