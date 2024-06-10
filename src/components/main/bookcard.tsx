import { FC } from "react";
import { BookFormData } from "@/types/book";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

interface BookCardProps {
  book: BookFormData;
  isRecommended?: boolean;
}

const BookCard: FC<BookCardProps> = ({ book, isRecommended = false }) => {
  const { title, author, status, images, categories } = book;

  if (isRecommended) {
    return (
      <Card className="flex flex-col items-center p-4 shadow-sm w-full min-w-[200px] mb-3">
        <CardHeader className="w-full flex justify-center mb-4">
          {images && images.length > 0 && (
            <div className="relative w-32 h-48">
              <Image
                src={images[0]}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="w-full text-center">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {author}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex items-center p-4 shadow-sm w-full">
      {images && images.length > 0 && (
        <div className="relative w-32 h-48 mr-4">
          <Image
            src={images[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover rounded-sm"
          />
        </div>
      )}
      <CardContent className="w-full">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {author}
        </CardDescription>
        <p className="text-sm">{status}</p>
        {categories && (
          <div className="text-sm text-gray-600">
            Categories: {categories.join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard;
