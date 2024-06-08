import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import dynamic from "next/dynamic";

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

  return <AdminClientPage email={email} />;
}
