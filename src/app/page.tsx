// app/page.tsx
import MainFeed from "@/components/main/feed";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Our Library Books</h1>
      <MainFeed />
    </main>
  );
}
