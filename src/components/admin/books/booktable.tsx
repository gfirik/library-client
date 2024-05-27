"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookFormData } from "@/types/book";

interface BookTableProps {
  books: BookFormData[];
  onDelete: (bookId: number, images: any[]) => void;
}

const BookTable = ({ books, onDelete }: BookTableProps) => {
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
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.published}</TableCell>
              <TableCell>{book.status}</TableCell>
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
