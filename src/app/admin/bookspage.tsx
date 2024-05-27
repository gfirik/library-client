"use client";

import useSWR from "swr";
import BookTable from "@/components/admin/books/booktable";
import UploadBookDialog from "@/components/admin/books/uploadbookdialog";
import { supabase } from "@/utils/supabase/client";

const fetchBooks = async () => {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const deleteBookImages = async (images: any[]) => {
  if (images.length === 0) return;

  const imagePaths = images.map((image) => {
    return typeof image === "string" ? image : image.path;
  });

  console.log(imagePaths);

  const { data, error } = await supabase.storage
    .from("books")
    .remove(imagePaths);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const deleteBook = async (bookId: number, images: string[]) => {
  try {
    const response = await deleteBookImages(images);
    console.log("Delete Images Response:", response);

    const { data, error } = await supabase
      .from("books")
      .delete()
      .eq("id", bookId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error deleting book and images:", error);
    throw error;
  }
};

const BooksPage = () => {
  const {
    data: books,
    error,
    isLoading,
    mutate,
  } = useSWR("books", fetchBooks, { revalidateOnMount: true });

  const handleDeleteBook = async (bookId: number, images: string[]) => {
    try {
      console.log(`Deleting book with ID: ${bookId}`);
      await deleteBook(bookId, images);
      console.log(`Book with ID: ${bookId} deleted`);
      mutate();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-semibold">
          Books Management of Ilm Library
        </h5>
        <UploadBookDialog mutate={mutate} />
      </div>
      {books && <BookTable books={books} onDelete={handleDeleteBook} />}
    </div>
  );
};

export default BooksPage;
