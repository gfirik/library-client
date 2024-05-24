"use client";

import { useEffect, useState } from "react";
import BookTable from "@/components/admin/booktable";
import UploadBookDialog from "@/components/admin/uploadbookdialog";
import { BookFormData } from "@/types/book";
import { supabase } from "@/utils/supabase/client";

const PrivatePageClient = () => {
  const [books, setBooks] = useState<BookFormData[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>Dashboard to manage Ilm Library Bot Platform</div>
        <UploadBookDialog fetchBooks={fetchBooks} />
      </div>
      <BookTable books={books} loading={loading} />
    </div>
  );
};

export default PrivatePageClient;
