import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobForm from "@/components/jobs/JobForm";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch the job
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!job) {
    redirect("/dashboard/jobs");
  }

  // Fetch available resumes
  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, title, is_default")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <JobForm initialData={job} resumes={resumes || []} />;
}
