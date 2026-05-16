import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, ExternalLink, Briefcase, Building, Calendar, FileText } from "lucide-react";
import DeleteJobButton from "@/components/jobs/DeleteJobButton";
import { TailoredAssetsReview } from "@/components/jobs/TailoredAssetsReview";
import { CollapsibleJobDescription } from "@/components/jobs/CollapsibleJobDescription";
interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: job } = await supabase
    .from("jobs")
    .select("*, resumes(title)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!job) {
    redirect("/dashboard/jobs");
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10];
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  };

  const appliedDate = formatDate(job.applied_at);
  const createdDate = formatDate(job.created_at);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-2 min-w-0">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-3xl font-bold text-white max-w-[23ch] break-words leading-tight">{job.title}</h2>
            
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-400 text-sm">
            <div className="flex items-center gap-1.5">
              <Building className="h-4 w-4" />
              {job.company}
            </div>
            {job.resumes?.title && (
              <div className="flex items-center gap-1.5 text-indigo-300">
                <FileText className="h-4 w-4" />
                Resume: {job.resumes.title}
              </div>
            )}
          <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider w-fit mt-1 sm:mt-0 shrink-0">
              {job.status}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0 mt-2 md:mt-0">
          <div className="flex items-center gap-1.5 text-slate-300 text-sm mr-2 px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-sm">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <span className="font-medium">{appliedDate ? `Applied ${appliedDate}` : `Added ${createdDate}`}</span>
          </div>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all shadow-sm text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              View Job Post
            </a>
          )}
          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-medium rounded-xl border border-indigo-500/20 transition-all text-sm"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <DeleteJobButton jobId={job.id} />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-indigo-400" />
          Job Description
        </h3>
        
        {job.description ? (
          <CollapsibleJobDescription description={job.description} />
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500">No job description provided.</p>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-slate-800 pt-8">
        <h2 className="text-xl font-semibold text-slate-200 mb-6">AI generated CV, Cover Letter and Email</h2>
        <TailoredAssetsReview 
          jobId={job.id}
          companyName={job.company}
          tailoredResumeHtml={job.tailored_resume ? (job.tailored_resume as any).html : null}
          coverLetterHtml={job.cover_letter}
          emailHtml={job.cover_email}
        />
      </div>
    </div>
  );
}
