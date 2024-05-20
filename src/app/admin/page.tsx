import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import BookTable from "@/components/admin/booktable";

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Xush keldingiz {data.user.email} admin janoblari!
      </h1>
      <Suspense fallback={<p>Loading...</p>}>
        <BookTable />
      </Suspense>
    </div>
  );
}
