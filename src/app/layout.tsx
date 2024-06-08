import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TelegramProvider } from "@/context/telegram";
import ScriptsBlock from "@/components/telegram/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noor Library",
  description: "Ilm istaganlar uchun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ScriptsBlock />
      </head>
      <body className={inter.className}>
        <TelegramProvider>{children}</TelegramProvider>
        <Toaster />
      </body>
    </html>
  );
}
