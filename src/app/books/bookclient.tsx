"use client";

import { FC, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTelegram } from "@/context/telegram";
import { BookFormData } from "@/types/book";

interface BookDetailsClientProps {
  book: BookFormData;
}

const BookDetailsClient: FC<BookDetailsClientProps> = ({ book }) => {
  const { title, author, status, categories, description, images, id } = book;
  const { isTelegramWebApp } = useTelegram();

  useEffect(() => {
    if (isTelegramWebApp) {
      const tg = (window as any).Telegram.WebApp;
      const mainButton = tg.MainButton;

      mainButton.text = "Order";
      mainButton.color = "#040303";
      mainButton.show();
      mainButton.onClick(() => {
        tg.WebApp.openLink(`/order/${id}`);
      });

      return () => {
        mainButton.offClick();
        mainButton.hide();
      };
    }
  }, [isTelegramWebApp, id]);

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
                alt={title}
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
              {categories.map((c) => (
                <Badge key={c} className="mr-1 mb-1" variant="outline">
                  {c}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-gray-800">
              <h2 className="text-lg font-semibold mb-2">Batafsil:</h2>
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsClient;
