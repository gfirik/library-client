import React from "react";
import BookCard from "@/components/main/bookcard";
import { BookFormData } from "@/types/book";

interface BookListProps {
  books: BookFormData[];
}

const BookList: React.FC<BookListProps> = ({ books }) => (
  <div className="flex flex-col gap-4">
    {books.map((book: BookFormData) => (
      <BookCard key={book.id} book={book} />
    ))}
  </div>
);

export default BookList;
