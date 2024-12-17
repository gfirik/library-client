"use client";

import useSWR from "swr";
import { supabase } from "@/utils/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { bookSchema } from "@/types/book";

export const UserSchema = z.object({
  telegram_user_id: z.number().positive(),
  username: z.string().nullable(),
  books_read: z.array(bookSchema).default([]),
  books_reading: z.array(bookSchema).max(2).default([]),
  firstname: z.string().nullable(),
});

const fetchUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const UsersTable = ({ users }: { users: any[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left border-collapse border border-gray-200 bg-card rounded-md">
      <thead>
        <tr className="bg-muted">
          <th className="px-4 py-2 border-b border-gray-300">ID</th>
          <th className="px-4 py-2 border-b border-gray-300">Created At</th>
          <th className="px-4 py-2 border-b border-gray-300">Telegram ID</th>
          <th className="px-4 py-2 border-b border-gray-300">Username</th>
          <th className="px-4 py-2 border-b border-gray-300">First Name</th>
          <th className="px-4 py-2 border-b border-gray-300">Books Read</th>
          <th className="px-4 py-2 border-b border-gray-300">Books Reading</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="odd:bg-muted/50 even:bg-muted">
            <td className="px-4 py-2">{user.id}</td>
            <td className="px-4 py-2">
              {new Date(user.created_at).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">{user.telegram_user_id}</td>
            <td className="px-4 py-2">{user.username || "N/A"}</td>
            <td className="px-4 py-2">{user.firstname || "N/A"}</td>
            <td className="px-4 py-2">
              {user.books_read.length > 0
                ? user.books_read.map((book: any) => book.title).join(", ")
                : "None"}
            </td>
            <td className="px-4 py-2">
              {user.books_reading.length > 0
                ? user.books_reading.map((book: any) => book.title).join(", ")
                : "None"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UsersPage = () => {
  const {
    data: users,
    error,
    isLoading,
  } = useSWR("users", fetchUsers, { revalidateOnMount: true });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-background text-foreground">
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Users Management</h2>
          <p className="text-muted">
            View all registered users in the Ilm Library
          </p>
        </CardHeader>
        <CardContent>{users && <UsersTable users={users} />}</CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
