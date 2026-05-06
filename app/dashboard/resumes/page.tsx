import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, FileText, Star } from "lucide-react";
import { ResumeActions } from "./resume-actions";

export default async function ResumesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Resumes</h2>
          <p className="text-slate-400 mt-1">
            Manage your resumes for job applications.
          </p>
        </div>
        <Link
          href="/dashboard/resumes/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Resume
        </Link>
      </div>

      {/* Resume Grid */}
      {resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {resume.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {new Date(resume.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {resume.is_default && (
                  <span className="flex items-center gap-1 text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    <Star className="h-3 w-3" />
                    Default
                  </span>
                )}
              </div>

              {/* Preview snippet */}
              <p className="text-sm text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                {resume.raw_text
                  ? resume.raw_text.substring(0, 150) + "..."
                  : "No preview available"}
              </p>

              {/* Actions */}
              <ResumeActions
                resumeId={resume.id}
                isDefault={resume.is_default ?? false}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-slate-900/30 border border-slate-800 rounded-2xl">
          <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300">
            No resumes yet
          </h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            Add your first resume to start applying for jobs automatically.
          </p>
          <Link
            href="/dashboard/resumes/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl transition-all text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Your First Resume
          </Link>
        </div>
      )}
    </>
  );
}
