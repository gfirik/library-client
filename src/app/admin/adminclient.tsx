"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import BookTable from "@/components/admin/booktable";
import UploadBookDialog from "@/components/admin/uploadbookdialog";
import { BookFormData } from "@/types/book";
import { supabase } from "@/utils/supabase/client";

const AdminClientPage = ({ email }: { email: string }) => {
  const [books, setBooks] = useState<BookFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("books");

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

  const renderContent = () => {
    switch (selectedTab) {
      case "main":
        return <div>Main Content</div>;
      case "users":
        return <div>Users Content</div>;
      case "books":
        return (
          <div className="p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-semibold">
                Dashboard to manage Ilm Library Bot Platform
              </h5>
              <UploadBookDialog fetchBooks={fetchBooks} />
            </div>
            <BookTable books={books} loading={loading} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar email={email} onTabSelect={setSelectedTab} />
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default AdminClientPage;
