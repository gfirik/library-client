"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

const Sidebar = ({
  email,
  onTabSelect,
  selectedTab,
}: {
  email: string;
  onTabSelect: (tab: string) => void;
  selectedTab: string; // Added to track the active tab
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="w-64 bg-zinc-950 text-white flex flex-col justify-between sticky top-0 h-screen">
      <div>
        <div className="p-4 text-lg font-bold">Admin Dashboard</div>
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => onTabSelect("main")}
                className={`w-full text-left py-2 px-4 rounded ${
                  selectedTab === "main"
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                Main
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => onTabSelect("users")}
                className={`w-full text-left py-2 px-4 rounded ${
                  selectedTab === "users"
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                Users
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => onTabSelect("books")}
                className={`w-full text-left py-2 px-4 rounded ${
                  selectedTab === "books"
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                Books
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <div className="mb-4 text-gray-400">{email}</div>
        <Button
          onClick={handleLogout}
          className="w-full bg-zinc-800 rounded hover:bg-red-600"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
