"use client";

import React from "react";
import { useTelegram } from "@/context/telegram";
import useBooks from "@/hooks/useBook";
import { BookFormData, categories } from "@/types/book";
import CategoryButtons from "@/components/main/categorybuttons";
import AvailabilityToggle from "@/components/main/availabilitytogle";
import BookList from "@/components/main/booklist";
import RecommendedBooks from "@/components/main/recommendedbooks";

interface HomeClientProps {
  initialBooks: BookFormData[];
}

const HomeClient: React.FC<HomeClientProps> = ({ initialBooks }) => {
  const { isTelegramWebApp, username } = useTelegram();
  const {
    books,
    randomBooks,
    filteredBooks,
    error,
    showAvailable,
    setShowAvailable,
    selectedCategories,
    handleCategoryClick,
  } = useBooks(initialBooks);

  if (error) return <div>Failed to load books.</div>;
  if (!books) return <div>Loading...</div>;

  return (
    <>
      <div className="text-lg mb-4">
        {isTelegramWebApp
          ? username
            ? `Hello, ${username}!`
            : "Use the app via Telegram to access full features."
          : "Use the app via Telegram to access full features."}
      </div>

      {randomBooks.length > 0 && <RecommendedBooks books={randomBooks} />}

      <AvailabilityToggle
        showAvailable={showAvailable}
        setShowAvailable={setShowAvailable}
      />

      <CategoryButtons
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryClick={handleCategoryClick}
      />

      <BookList books={filteredBooks} />
    </>
  );
};

export default HomeClient;
