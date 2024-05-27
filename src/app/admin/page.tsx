import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AdminClientPage = dynamic(() => import("./adminclient"), {
  ssr: false,
});

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/admin/login");
  }

  const email = data?.user.email || "";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminClientPage email={email} />
    </Suspense>
  );
}
