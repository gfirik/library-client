"use client";

import useSWR from "swr";
import BookTable from "@/components/admin/books/booktable";
import UploadBookDialog from "@/components/admin/books/uploadbookdialog";
import { supabase } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

  const { data, error } = await supabase.storage
    .from("books")
    .remove(imagePaths);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const deleteBook = async (bookId: string, images: string[]) => {
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

  const { toast } = useToast();

  const handleDeleteBook = async (bookId: string, images: string[]) => {
    try {
      console.log(`Deleting book with ID: ${bookId}`);
      await deleteBook(bookId, images);
      console.log(`Book with ID: ${bookId} deleted`);
      toast({
        title: "Book Deleted",
        description: `Book with ID: ${bookId} has been deleted successfully`,
      });
      mutate();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-background text-foreground">
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Books Management</h2>
          <p className="text-muted">Manage all books in the Ilm Library</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <UploadBookDialog mutate={mutate} />
          </div>
          {books && (
            <BookTable
              books={books}
              onDelete={handleDeleteBook}
              mutate={mutate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BooksPage;
