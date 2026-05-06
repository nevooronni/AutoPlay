import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import KanbanBoard from "@/components/jobs/KanbanBoard";

export default async function JobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, resumes(title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Jobs Dashboard</h2>
          <p className="text-slate-400 mt-1">
            Track and manage your job applications across different stages.
          </p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Job
        </Link>
      </div>

      <KanbanBoard initialJobs={jobs || []} />
    </>
  );
}
