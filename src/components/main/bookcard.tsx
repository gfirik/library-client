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
}

const BookCard: FC<BookCardProps> = ({ book }) => {
  const { title, author, status, images } = book;

  return (
    <Card className="flex flex-col items-center p-4">
      <CardHeader className="w-full flex justify-center">
        {images && images.length > 0 && (
          <Image
            src={images[0]}
            alt={title}
            width={150}
            height={200}
            className="object-cover"
          />
        )}
      </CardHeader>
      <CardContent className="w-full text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{author}</CardDescription>
        <p>Status: {status}</p>
      </CardContent>
    </Card>
  );
};

export default BookCard;
