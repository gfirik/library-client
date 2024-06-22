import { FC } from "react";
import { notFound } from "next/navigation";
import { fetchBookById } from "@/utils/book/fetchbookbyid";
import BookDetailsClient from "../bookclient";

interface BookDetailsPageProps {
  params: { id: string };
}

const BookDetailsPage: FC<BookDetailsPageProps> = async ({ params }) => {
  const { id } = params;
  const book = await fetchBookById(id);

  if (!book) {
    notFound();
  }

  return <BookDetailsClient initialBook={book} id={id} />;
};

export default BookDetailsPage;
