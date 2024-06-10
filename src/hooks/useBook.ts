import { useState, useEffect } from "react";
import useSWR from "swr";
import { BookFormData } from "@/types/book";
import { fetchBooks } from "@/utils/book/fetchbooks";
import { getRandomElements } from "@/utils/functions/random";

const fetcher = () => fetchBooks();

const useBooks = (initialBooks: BookFormData[]) => {
  const { data: books, error } = useSWR("books", fetcher, {
    fallbackData: initialBooks,
  });

  const [showAvailable, setShowAvailable] = useState(true);
  const [randomBooks, setRandomBooks] = useState<BookFormData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (books) {
      setRandomBooks(getRandomElements(books, 5));
    }
  }, [books]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredBooks = books?.filter((book) => {
    const matchesAvailability = showAvailable
      ? book.status === "Available"
      : true;
    const matchesCategory = selectedCategories.every((category) =>
      book.categories?.includes(category)
    );
    return matchesAvailability && matchesCategory;
  });

  return {
    books,
    randomBooks,
    filteredBooks,
    error,
    showAvailable,
    setShowAvailable,
    selectedCategories,
    handleCategoryClick,
  };
};

export default useBooks;
