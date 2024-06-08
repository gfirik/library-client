import { fetchBooks } from "@/utils/book/fetchbooks";
import HomeClient from "./homeclient";
import { BookFormData } from "@/types/book";

export default async function Home() {
  const books: BookFormData[] = await fetchBooks();

  return (
    <main className="flex flex-col items-center p-4">
      <HomeClient books={books} />
    </main>
  );
}
