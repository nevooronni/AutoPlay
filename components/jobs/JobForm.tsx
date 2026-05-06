"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createJob, updateJob, JobFormData } from "@/app/actions/jobs";
import { Loader2, ArrowLeft, Briefcase, Building, Link as LinkIcon, FileText } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Database } from "@/lib/supabase/database.types";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Resume = Database["public"]["Tables"]["resumes"]["Row"];
type Job = Database["public"]["Tables"]["jobs"]["Row"];

interface JobFormProps {
  initialData?: Job;
  resumes: Pick<Resume, "id" | "title" | "is_default">[];
}

export default function JobForm({ initialData, resumes }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const defaultResumeId = resumes.find((r) => r.is_default)?.id || "";

  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || "",
    company: initialData?.company || "",
    url: initialData?.url || "",
    description: initialData?.description || "",
    resume_id: initialData?.resume_id || defaultResumeId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) {
      toast.error("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && initialData) {
        await updateJob(initialData.id, formData);
        toast.success("Job updated successfully");
      } else {
        await createJob(formData);
        toast.success("Job added successfully");
      }
      router.push("/dashboard/jobs");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Jobs
        </Link>
        <h2 className="text-2xl font-bold text-white">
          {isEditing ? "Edit Job" : "Add New Job"}
        </h2>
        <p className="text-slate-400 mt-1">
          {isEditing
            ? "Update the details of your job application."
            : "Enter the details of the job you want to apply for."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-400" />
              Job Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-2.5 bg-slate-800/50 border rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all border-slate-700"
              required
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Building className="h-4 w-4 text-indigo-400" />
              Company <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-2.5 bg-slate-800/50 border rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all border-slate-700"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-indigo-400" />
              Job URL (Optional)
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-slate-800/50 border rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all border-slate-700"
            />
          </div>

          {/* Default Resume */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              Target Resume (Optional)
            </label>
            <select
              name="resume_id"
              value={formData.resume_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-800/50 border rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all border-slate-700 appearance-none"
            >
              <option value="">-- Select a resume --</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title} {resume.is_default ? "(Default)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Description (Rich Text) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Job Description (Optional)
          </label>
          <div className="resume-editor">
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Paste the job description here..."
              className="bg-slate-800/30 rounded-xl border border-slate-700 text-slate-100"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
