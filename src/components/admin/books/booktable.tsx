"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookFormData } from "@/types/book";

interface BookTableProps {
  books: BookFormData[];
  onDelete: (bookId: number, images: any[]) => void;
}

const BookTable = ({ books, onDelete }: BookTableProps) => {
  const [statuses, setStatuses] = useState(
    books.map((book) => ({ id: book.id, status: book.status }))
  );
  const { toast } = useToast();

  const handleStatusChange = async (bookId: number, newStatus: string) => {
    try {
      if (!["Available", "Rented", "Pending"].includes(newStatus)) {
        throw new Error("Invalid status");
      }

      const { data, error } = await supabase
        .from("books")
        .update({ status: newStatus })
        .eq("id", bookId);
      if (error) throw error;

      setStatuses((prevStatuses) =>
        prevStatuses.map((status) =>
          status.id === bookId
            ? {
                ...status,
                status: newStatus as "Available" | "Rented" | "Pending",
              }
            : status
        )
      );

      toast({
        title: "Book status updated",
        description: `Book with id ${bookId} has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteClick = (bookId: number, images: any[]) => {
    console.log(`handleDeleteClick called for book ID: ${bookId}`);
    onDelete(bookId, images);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Published</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Rented by</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        {books.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={8}>No books found</TableCell>
            </TableRow>
          </TableBody>
        )}

        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.published}</TableCell>
              <TableCell>
                <Select
                  value={
                    statuses.find((status) => status.id === book.id)?.status ??
                    "Available"
                  }
                  onValueChange={(value) =>
                    book.id !== undefined && handleStatusChange(book.id, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{book.rented_by}</TableCell>
              <TableCell>{book.images.length}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2">
                  Edit
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  onClick={() =>
                    book.id !== undefined &&
                    handleDeleteClick(book.id, book.images)
                  }
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookTable;
