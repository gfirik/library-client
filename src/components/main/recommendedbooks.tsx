import BookCard from "@/components/main/bookcard";
import { BookFormData } from "@/types/book";

interface RecommendedBooksProps {
  books: BookFormData[];
}

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({ books }) => (
  <div className="mb-8 w-full">
    <h2 className="text-xl font-semibold mb-2">Tavsiyalar</h2>
    <div className="flex overflow-x-auto space-x-4">
      {books.map((book: BookFormData) => (
        <BookCard key={book.id} book={book} isRecommended />
      ))}
    </div>
  </div>
);

export default RecommendedBooks;
