"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const UserGreeting = ({ email }: { email: string }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-700">Hi! {email}</span>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
};

export default UserGreeting;
