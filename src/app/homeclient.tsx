"use client";

import useBooks from "@/hooks/useBook";
import { BookFormData, categories } from "@/types/book";
import UserGreeting from "@/components/main/usergreeting";
import RecommendedBooks from "@/components/main/recommendedbooks";
import AvailabilityToggle from "@/components/main/availabilitytogle";
import CategoryButtons from "@/components/main/categorybuttons";
import BookList from "@/components/main/booklist";

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
    <div className="w-full max-w-2xl mb-8">
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
    </div>
  );
};

export default HomeClient;
