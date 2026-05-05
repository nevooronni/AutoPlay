import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResumeForm } from "@/components/resume-form";

export default function NewResumePage() {
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
        <h2 className="text-2xl font-bold text-white">Add New Resume</h2>
        <p className="text-slate-400 mt-1">
          Paste your resume content, or upload a PDF/DOCX file.
        </p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <ResumeForm mode="create" />
      </div>
    </>
  );
}
