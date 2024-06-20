import { FC } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BookFormData } from "@/types/book";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BookDetailsPageProps {
  params: { id: string };
}

const fetchBook = async (id: string): Promise<BookFormData | null> => {
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching book:", error.message);
    return null;
  }

  if (book && book.images && book.images.length > 0) {
    const imageUrls = book.images.map(
      (imagePath: string) =>
        supabase.storage.from("books").getPublicUrl(imagePath).data.publicUrl
    );
    return { ...book, images: imageUrls };
  }

  return book;
};

const BookDetailsPage: FC<BookDetailsPageProps> = async ({ params }) => {
  const { id } = params;
  const book = await fetchBook(id);

  if (!book) {
    notFound();
  }

  const { title, author, status, categories, description, images } = book;

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white py-10 px-4">
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
        <div className="w-64 h-96 relative mb-8 shadow-lg rounded-lg overflow-hidden">
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
        <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
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
            Categories: {categories.join(", ")}
          </div>
          <div className="text-sm text-gray-800">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
