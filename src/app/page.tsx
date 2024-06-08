import { fetchBooks } from "@/utils/book/fetchbooks";
import HomeClient from "./homeclient";
import { BookFormData } from "@/types/book";

export default async function Home() {
  const books: BookFormData[] = await fetchBooks();

  return (
    <main className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Ilm Library Books</h1>
      <HomeClient books={books} />
    </main>
  );
}
