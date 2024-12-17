"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const fetcher = async () => {
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, books_reading, books_read");

  if (usersError) throw usersError;

  const rentedUsers =
    users?.filter(
      (user) => user.books_reading.length > 0 || user.books_read.length > 0
    ).length || 0;

  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("id, price_per_week, rented_by");

  if (booksError) throw booksError;

  const totalBooks = books?.length || 0;
  const rentedBooks = books?.filter((book) => book.rented_by).length || 0;
  const availableBooks = totalBooks - rentedBooks;
  const profit =
    books
      ?.filter((book) => book.rented_by)
      .reduce((sum, book) => sum + book.price_per_week, 0) || 0;

  return {
    users: {
      totalUsers: users?.length || 0,
      rentedUsers,
    },
    books: {
      totalBooks,
      rentedBooks,
      availableBooks,
    },
    profit,
  };
};

export default function MainAdminPanel() {
  const { data, error } = useSWR("admin-data", fetcher);
  const { toast } = useToast();
  const [isErrorHandled, setIsErrorHandled] = useState(false);

  useEffect(() => {
    if (error && !isErrorHandled) {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
      setIsErrorHandled(true);
    }
  }, [error, toast, isErrorHandled]);

  if (!data) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const { users, books, profit } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Users Section */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold text-primary">Users</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Total Users:{" "}
            <span className="font-bold text-primary">{users.totalUsers}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Users with Rentals:{" "}
            <span className="font-bold text-primary">{users.rentedUsers}</span>
          </p>
        </CardContent>
      </Card>

      {/* Books Section */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold text-primary">Books</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Total Books:{" "}
            <span className="font-bold text-primary">{books.totalBooks}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Rented Books:{" "}
            <span className="font-bold text-primary">{books.rentedBooks}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Available Books:{" "}
            <span className="font-bold text-primary">
              {books.availableBooks}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Profit Section */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold text-primary">Profit</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Total Profit:{" "}
            <span className="font-bold text-primary">${profit.toFixed(2)}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
