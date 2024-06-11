import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookFormData } from "@/types/book";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";

interface BookCardProps {
  book: BookFormData;
  isRecommended?: boolean;
}

const BookCard: FC<BookCardProps> = ({ book, isRecommended = false }) => {
  const { title, author, status, images, categories, id } = book;

  if (isRecommended) {
    return (
      <Link href={`/books/${id}`} prefetch={false}>
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
      </Link>
    );
  }

  return (
    <Link href={`/books/${id}`} prefetch={false}>
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
          <p
            className={`text-sm ${
              status === "Available" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
          {categories && (
            <div className="text-sm text-gray-600">
              {categories.map((c) => (
                <Badge key={c} className="mr-1 mb-1" variant="outline">
                  {c}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default BookCard;
