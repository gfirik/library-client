"use client";

import { FC, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTelegram } from "@/context/telegram";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookFormData } from "@/types/book";
import { fetchBookById } from "@/utils/book/fetchbookbyid";

interface BookDetailsClientProps {
  initialBook: BookFormData;
  id: string;
}

const fetcher = (id: string) => fetchBookById(id);

const BookDetailsClient: FC<BookDetailsClientProps> = ({ initialBook, id }) => {
  const { data: book } = useSWR(id, fetcher, { fallbackData: initialBook });
  const {
    title,
    author,
    status,
    categories,
    description,
    images,
    price_per_week,
  } = book || {};
  const { username } = useTelegram();
  const router = useRouter();

  const handleOrder = useCallback(
    () => router.push(`/order/${id}`),
    [router, id]
  );

  useEffect(() => {
    if (username) {
      const tg = (window as any).Telegram.WebApp;
      const mainButton = tg.MainButton;

      mainButton.text = "Order";
      mainButton.color = "#040303";
      if (status !== "Available") {
        mainButton.color = "#333333";
        mainButton.disable();
      } else {
        mainButton.enable();
      }
      mainButton.show();
      mainButton.onClick(handleOrder);
      return () => {
        mainButton.offClick();
        mainButton.hide();
      };
    }
  }, [username, id, status, handleOrder]);

  if (!book) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white p-4">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <span className="text-lg font-semibold">{title}</span>
            <div className="w-6"></div> {/* Placeholder for future content */}
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <div className="w-64 h-96 relative mb-8 shadow-lg rounded-lg overflow-hidden mx-auto">
            {images && images.length > 0 && (
              <Image
                src={images[0]}
                alt={title ? title : "Book Image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-lg font-semibold mb-1">{author}</p>
            <p
              className={`text-sm mb-3 ${
                status === "Available" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </p>
            <div className="text-sm text-gray-600 mb-3">
              {categories &&
                categories.map((c) => (
                  <Badge key={c} className="mr-1 mb-1" variant="outline">
                    {c}
                  </Badge>
                ))}
            </div>
            <p className="text-sm font-semibold mb-3 text-gray-500">
              Price per week: {price_per_week} KRW
            </p>
            <div className="text-sm text-gray-800">
              <h2 className="text-lg font-semibold mb-2">Batafsil:</h2>
              <p>{description}</p>
            </div>
          </div>
          {!username && (
            <div className="w-full max-w-2xl ">
              {status === "Available" ? (
                <Link href={`/order/${id}`}>
                  <Button className="w-full">Order</Button>
                </Link>
              ) : (
                <Button className="w-full" disabled>
                  Order
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsClient;
