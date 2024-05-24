import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import dynamic from "next/dynamic";

const PrivatePageClient = dynamic(() => import("./AdminClientPage"), {
  ssr: false,
});

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">
        Xush keldingiz {data.user.email} admin janoblari!
      </h1>
      <PrivatePageClient />
    </div>
  );
}
