"use client";

import { useTelegram } from "@/context/telegram";
import { useState, useEffect } from "react";
import BookCard from "@/components/main/bookcard";
import { BookFormData } from "@/types/book";
import useSWR from "swr";
import { fetchBooks } from "@/utils/book/fetchbooks";
import { getRandomElements } from "@/utils/book/random";

interface HomeClientProps {
  initialBooks: BookFormData[];
}

const fetcher = () => fetchBooks();

const HomeClient: React.FC<HomeClientProps> = ({ initialBooks }) => {
  const { isTelegramWebApp, username } = useTelegram();
  const [showAvailable, setShowAvailable] = useState(true);
  const [randomBooks, setRandomBooks] = useState<BookFormData[]>([]);

  const { data: books, error } = useSWR("books", fetcher, {
    fallbackData: initialBooks,
  });

  useEffect(() => {
    if (books) {
      setRandomBooks(getRandomElements(books, 5));
    }
  }, [books]);

  if (error) return <div>Failed to load books.</div>;
  if (!books) return <div>Loading...</div>;

  const filteredBooks = showAvailable
    ? books.filter((book) => book.status === "Available")
    : books;

  return (
    <>
      <div className="text-lg mb-4">
        {isTelegramWebApp
          ? username
            ? `Hello, ${username}!`
            : "Use the app via Telegram to access full features."
          : "Use the app via Telegram to access full features."}
      </div>

      {randomBooks && randomBooks.length > 0 && (
        <div className="mb-8 w-full">
          <h2 className="text-xl font-semibold mb-2">Recommended Books</h2>
          <div className="flex overflow-x-auto space-x-4">
            {randomBooks.map((book: BookFormData) => (
              <BookCard key={book.id} book={book} isRecommended />
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 w-full">
        <button
          className={`px-4 py-2 ${
            showAvailable ? "bg-zinc-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowAvailable(true)}
        >
          #available
        </button>
        <button
          className={`px-4 py-2 ${
            !showAvailable ? "bg-zinc-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowAvailable(false)}
        >
          #all
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredBooks.map((book: BookFormData) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
};

export default HomeClient;
