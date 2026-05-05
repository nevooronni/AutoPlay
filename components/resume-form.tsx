"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight, Type, FileUp, FileText } from "lucide-react";
import { FileDropzone } from "@/components/file-dropzone";
import {
  createResume,
  updateResume,
} from "@/app/dashboard/resumes/actions";

// Dynamic import for react-quill (it uses browser APIs)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

type Tab = "editor" | "pdf" | "docx";

interface ResumeFormProps {
  mode: "create" | "edit";
  resumeId?: string;
  initialTitle?: string;
  initialHtml?: string;
}

export function ResumeForm({
  mode,
  resumeId,
  initialTitle = "",
  initialHtml = "",
}: ResumeFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [title, setTitle] = useState(initialTitle);
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "editor", label: "Paste & Edit", icon: <Type className="h-4 w-4" /> },
    { id: "pdf", label: "Upload PDF", icon: <FileUp className="h-4 w-4" /> },
    { id: "docx", label: "Upload DOCX", icon: <FileText className="h-4 w-4" /> },
  ];

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    // Strip HTML tags to check actual content
    const plainText = htmlContent.replace(/<[^>]*>/g, "").trim();
    if (!plainText) {
      newErrors.content = "Resume content cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsParsing(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Failed to parse file.");
          return;
        }

        setHtmlContent(data.html);
        setActiveTab("editor");
        toast.success("File parsed! Review your resume in the editor.");
      } catch {
        toast.error("Failed to parse file. Please try again.");
      } finally {
        setIsParsing(false);
      }
    },
    []
  );

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    const plainText = htmlContent.replace(/<[^>]*>/g, "").trim();

    try {
      const result =
        mode === "create"
          ? await createResume(title.trim(), htmlContent, plainText)
          : await updateResume(resumeId!, title.trim(), htmlContent, plainText);

      if (!result.success) {
        toast.error(result.error || "Something went wrong.");
        return;
      }

      toast.success(
        mode === "create"
          ? "Resume created successfully!"
          : "Resume updated successfully!"
      );
      router.push("/dashboard/resumes");
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="resume-title"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          Resume Title <span className="text-red-400">*</span>
        </label>
        <input
          id="resume-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder='e.g. "Software Engineer Resume"'
          className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${
            errors.title ? "border-red-500" : "border-slate-700"
          }`}
        />
        {errors.title && (
          <p className="text-sm text-red-400 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Tabs */}
      <div>
        <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "editor" && (
          <div className="resume-editor">
            <ReactQuill
              theme="snow"
              value={htmlContent}
              onChange={(value) => {
                setHtmlContent(value);
                if (errors.content)
                  setErrors((prev) => ({ ...prev, content: undefined }));
              }}
              modules={quillModules}
              placeholder="Paste your resume content here, or upload a file using the tabs above..."
              className="bg-slate-800/30 rounded-xl border border-slate-700 text-slate-100"
            />
            {errors.content && (
              <p className="text-sm text-red-400 mt-2">{errors.content}</p>
            )}
          </div>
        )}

        {activeTab === "pdf" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Upload a PDF file and we&apos;ll extract the text for you to review and
              edit.
            </p>
            <FileDropzone
              accept=".pdf"
              label="Click to upload a PDF resume"
              maxSizeMB={5}
              onFileSelected={handleFileUpload}
              isLoading={isParsing}
            />
            {isParsing && (
              <div className="flex items-center gap-2 text-sm text-indigo-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Parsing PDF...
              </div>
            )}
          </div>
        )}

        {activeTab === "docx" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Upload a Word document and we&apos;ll convert it for you to review and
              edit.
            </p>
            <FileDropzone
              accept=".docx"
              label="Click to upload a DOCX resume"
              maxSizeMB={5}
              onFileSelected={handleFileUpload}
              isLoading={isParsing}
            />
            {isParsing && (
              <div className="flex items-center gap-2 text-sm text-indigo-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting DOCX...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-indigo-600/50 disabled:to-indigo-500/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:shadow-none cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : (
            <>
              {mode === "create" ? "Create Resume" : "Save Changes"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
