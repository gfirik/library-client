"use client";

import React from "react";
import useBooks from "@/hooks/useBook";
import { BookFormData, categories } from "@/types/book";
import UserGreeting from "@/components/main/usergreeting";
import CategoryButtons from "@/components/main/categorybuttons";
import AvailabilityToggle from "@/components/main/availabilitytogle";
import BookList from "@/components/main/booklist";
import RecommendedBooks from "@/components/main/recommendedbooks";

interface HomeClientProps {
  initialBooks: BookFormData[];
}

const HomeClient: React.FC<HomeClientProps> = ({ initialBooks }) => {
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
      <UserGreeting />

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
