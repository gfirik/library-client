"use client";

import { useEffect, useState } from "react";
import BookTable from "@/components/admin/booktable";
import UploadBookDialog from "@/components/admin/uploadbookdialog";
import { BookFormData } from "@/types/book";
import { supabase } from "@/utils/supabase/client";
import { ToastProvider } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const PrivatePageClient = () => {
  const [books, setBooks] = useState<BookFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) {
      console.error("Error fetching books:", error.message);
      return;
    }
    setBooks(data as BookFormData[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleNewBook = () => {
    fetchBooks();
    toast({
      title: "Book uploaded",
      description: "The new book has been added successfully.",
    });
  };

  return (
    <ToastProvider>
      <div className="flex justify-between items-center mb-4">
        <div>Dashboard to manage Ilm Library Bot Platform</div>
        <UploadBookDialog onNewBook={handleNewBook} />
      </div>
      <BookTable books={books} loading={loading} />
    </ToastProvider>
  );
};

export default PrivatePageClient;
