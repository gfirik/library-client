import BookCard from "@/components/main/bookcard";
import { BookFormData } from "@/types/book";

interface RecommendedBooksProps {
  books: BookFormData[];
}

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({ books }) => (
  <div className="mb-8 w-full">
    <h2 className="text-lg font-semibold mb-4">Bugungi tavsiyalar</h2>
    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
      {books.map((book: BookFormData) => (
        <BookCard key={book.id} book={book} isRecommended />
      ))}
    </div>
  </div>
);

export default RecommendedBooks;
