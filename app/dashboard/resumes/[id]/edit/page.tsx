import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ResumeForm } from "@/components/resume-form";

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!resume) notFound();

  const htmlContent =
    typeof resume.content === "object" && resume.content !== null
      ? (resume.content as { html?: string }).html || ""
      : "";

  return (
    <>
      <div className="mb-8">
        <Link
          href="/dashboard/resumes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resumes
        </Link>
        <h2 className="text-2xl font-bold text-white">Edit Resume</h2>
        <p className="text-slate-400 mt-1">
          Update your resume content below.
        </p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <ResumeForm
          mode="edit"
          resumeId={resume.id}
          initialTitle={resume.title}
          initialHtml={htmlContent}
        />
      </div>
    </>
  );
}
