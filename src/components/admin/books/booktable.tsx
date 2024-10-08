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
import { Badge } from "@/components/ui/badge";
import UploadBookDialog from "./uploadbookdialog";

interface BookTableProps {
  books: BookFormData[];
  onDelete: (bookId: string, images: any[]) => void;
  mutate: () => void;
}

const BookTable = ({ books, onDelete, mutate }: BookTableProps) => {
  const [statuses, setStatuses] = useState<
    Array<{ id: string; status: BookFormData["status"] }>
  >(
    books
      .filter((book) => book.id !== undefined)
      .map((book) => ({ id: book.id as string, status: book.status }))
  );
  const { toast } = useToast();

  const handleStatusChange = async (
    bookId: string,
    newStatus: BookFormData["status"]
  ) => {
    try {
      const { data, error } = await supabase
        .from("books")
        .update({ status: newStatus })
        .eq("id", bookId);
      if (error) throw error;

      setStatuses((prevStatuses) =>
        prevStatuses.map((status) =>
          status.id === bookId ? { ...status, status: newStatus } : status
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

  const handleDeleteClick = (bookId: string, images: any[]) => {
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
            <TableCell>Categories</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Rented by</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Price per Week</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>

        {books.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={10}>No books found</TableCell>
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
                {book.categories?.map((category, index) => (
                  <Badge key={index} className="m-1">
                    {category}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <Select
                  value={
                    statuses.find((status) => status.id === book.id)?.status ??
                    "Available"
                  }
                  onValueChange={(value) =>
                    handleStatusChange(
                      book.id as string,
                      value as BookFormData["status"]
                    )
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
              <TableCell>{book.price_per_week}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() =>
                    book.id !== undefined &&
                    handleDeleteClick(book.id, book.images)
                  }
                >
                  Delete
                </Button>
                <UploadBookDialog bookToEdit={book} mutate={mutate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookTable;
