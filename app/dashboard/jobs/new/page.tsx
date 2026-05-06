import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobForm from "@/components/jobs/JobForm";

export default async function NewJobPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch available resumes to select as a target resume
  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, title, is_default")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <JobForm resumes={resumes || []} />;
}
