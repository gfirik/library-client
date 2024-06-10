import React from "react";
import { Button } from "@/components/ui/button";

interface CategoryButtonsProps {
  categories: string[];
  selectedCategories: string[];
  handleCategoryClick: (category: string) => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  categories,
  selectedCategories,
  handleCategoryClick,
}) => (
  <div className="mb-4 w-full flex flex-wrap gap-2">
    {categories.map((category) => (
      <Button
        key={category}
        variant={selectedCategories.includes(category) ? "default" : "outline"}
        onClick={() => handleCategoryClick(category)}
      >
        {category}
      </Button>
    ))}
  </div>
);

export default CategoryButtons;
