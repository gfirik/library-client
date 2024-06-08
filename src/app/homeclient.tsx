"use client";

import { useTelegram } from "@/context/telegram";
import { useState } from "react";
import BookCard from "@/components/main/bookcard";
import { BookFormData } from "@/types/book";

interface HomeClientProps {
  books: BookFormData[];
}

const HomeClient: React.FC<HomeClientProps> = ({ books: initialBooks }) => {
  const { isTelegramWebApp, username } = useTelegram();
  const [showAvailable, setShowAvailable] = useState(true);
  const recommendedBooks = initialBooks.slice(
    0,
    Math.min(5, initialBooks.length)
  );
  const filteredBooks = showAvailable
    ? initialBooks.filter((book) => book.status === "Available")
    : initialBooks;

  return (
    <>
      <div className="text-lg mb-4">
        {isTelegramWebApp
          ? username
            ? `Hello, ${username}!`
            : "Use the app via Telegram to access full features."
          : "Use the app via Telegram to access full features."}
      </div>

      {recommendedBooks && recommendedBooks.length > 0 && (
        <div className="mb-8 w-full">
          <h2 className="text-xl font-semibold mb-2">Recommended Books</h2>
          <div className="flex overflow-x-auto space-x-4">
            {recommendedBooks.map((book: BookFormData) => (
              <BookCard key={book.id} book={book} />
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

      <div className="grid grid-cols-2 gap-4">
        {filteredBooks.map((book: BookFormData) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
};

export default HomeClient;
