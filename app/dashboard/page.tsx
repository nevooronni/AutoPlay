import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Briefcase, FileText } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch job counts by status
  const { data: jobs } = await supabase
    .from("jobs")
    .select("status")
    .eq("user_id", user.id);

  const statusCounts = {
    draft: jobs?.filter((j) => j.status === "draft").length ?? 0,
    applied: jobs?.filter((j) => j.status === "applied").length ?? 0,
    interviewing: jobs?.filter((j) => j.status === "interviewing").length ?? 0,
    total: jobs?.length ?? 0,
  };

  // Fetch resume count
  const { count: resumeCount } = await supabase
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <>
      {/* Welcome */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {profile?.full_name?.split(" ")[0] || "there"} 👋
        </h2>
        <p className="text-slate-400 mt-1">
          Here&apos;s an overview of your job applications.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Total Applications"
          value={statusCounts.total}
          color="indigo"
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Drafts"
          value={statusCounts.draft}
          color="amber"
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Applied"
          value={statusCounts.applied}
          color="emerald"
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Resumes"
          value={resumeCount ?? 0}
          color="cyan"
        />
      </div>

      {/* Empty State */}
      {statusCounts.total === 0 && (
        <div className="text-center py-20 bg-slate-900/30 border border-slate-800 rounded-2xl">
          <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300">
            No applications yet
          </h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            Start by adding a resume and a job description to get your first
            automated application going.
          </p>
        </div>
      )}
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "indigo" | "amber" | "emerald" | "cyan";
}) {
  const colorMap = {
    indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-400",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400",
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    cyan: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5 transition-transform hover:scale-[1.02]`}
    >
      <div className={`${colorMap[color].split(" ").pop()} mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
}
