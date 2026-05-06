"use client";

import { useState } from "react";
import { Loader2, Download, FileText, FileEdit } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface TailoredAssetsReviewProps {
  jobId: string;
  companyName?: string;
  tailoredResumeHtml?: string | null;
  coverLetterHtml?: string | null;
}

export function TailoredAssetsReview({ 
  jobId,
  companyName = "Company",
  tailoredResumeHtml, 
  coverLetterHtml
}: TailoredAssetsReviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);

  const [resumeContent, setResumeContent] = useState(tailoredResumeHtml || "");
  const [coverLetterContent, setCoverLetterContent] = useState(coverLetterHtml || "");

  const hasAssets = !!tailoredResumeHtml || !!coverLetterHtml;

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate assets.");
      }

      toast.success("Successfully generated tailored resume and cover letter!");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPdf = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Dynamically import html2pdf to prevent SSR 'self is not defined' errors
    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;
    
    // We create a clone to strip UI elements and ensure it renders properly for print
    const clone = element.cloneNode(true) as HTMLElement;
    
    // STRIP Tailwind classes that use oklab() colors which crash html2canvas
    clone.className = "";
    
    // Create a temporary container
    const container = document.createElement("div");
    container.id = "pdf-export-container";
    container.style.padding = "40px";
    container.style.color = "#000000"; // Force standard hex black text for PDF
    container.style.background = "#ffffff"; // Force standard hex white background for PDF
    container.style.fontFamily = "Arial, Helvetica, sans-serif";
    container.style.fontSize = "14px";
    container.style.lineHeight = "1.5";

    // Inject safe standard CSS to replace the removed prose classes, SCOPED to the container!
    const style = document.createElement("style");
    style.innerHTML = `
      #pdf-export-container h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #000000; }
      #pdf-export-container h2 { font-size: 20px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; color: #000000; }
      #pdf-export-container h3 { font-size: 16px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; color: #000000; }
      #pdf-export-container p { margin-bottom: 12px; color: #000000; }
      #pdf-export-container ul { margin-bottom: 12px; padding-left: 24px; list-style-type: disc; }
      #pdf-export-container li { margin-bottom: 4px; color: #000000; }
      #pdf-export-container strong { font-weight: bold; }
      #pdf-export-container em { font-style: italic; }
      #pdf-export-container * { background-color: transparent !important; }
    `;
    container.appendChild(style);
    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
      margin:       10,
      filename:     filename,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(container).save().then(() => {
      document.body.removeChild(container);
    });
  };

  if (!hasAssets && !isGenerating) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
        <h3 className="text-lg font-medium text-slate-200 mb-2">No Tailored Assets Yet</h3>
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Generate an ATS-optimized resume and a custom cover letter based on your base resume and this job description.
        </p>
        <button onClick={handleGenerate} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-9 px-4 py-2">
          <FileText className="mr-2 h-4 w-4" />
          Generate Tailored Application
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <div>
          <h3 className="text-lg font-medium text-slate-200">AI is working...</h3>
          <p className="text-sm text-slate-400">Analyzing job description and tailoring your experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tailored Resume */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/20">
          <h3 className="font-medium text-slate-200 flex items-center">
            <FileText className="mr-2 h-4 w-4 text-indigo-400" />
            Tailored Resume
          </h3>
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-slate-700 hover:bg-slate-800 h-8 px-3" onClick={() => setIsEditingResume(!isEditingResume)}>
              <FileEdit className="mr-2 h-3 w-3" />
              {isEditingResume ? "View Mode" : "Edit"}
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-8 px-3" onClick={() => downloadPdf("pdf-resume", `${companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cv.pdf`)}>
              <Download className="mr-2 h-3 w-3" />
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {isEditingResume ? (
            <div className="bg-white rounded-md text-black">
              <ReactQuill 
                theme="snow" 
                value={resumeContent} 
                onChange={setResumeContent} 
                className="min-h-[400px]"
              />
              <div className="p-2 flex justify-end">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-700 h-8 px-3" onClick={() => setIsEditingResume(false)}>Save Changes</button>
              </div>
            </div>
          ) : (
            <div 
              id="pdf-resume"
              className="prose prose-invert prose-indigo max-w-none break-words [overflow-wrap:anywhere] bg-slate-800/30 p-6 rounded-lg min-h-[400px]"
              dangerouslySetInnerHTML={{ __html: resumeContent || tailoredResumeHtml || "" }}
            />
          )}
        </div>
      </div>

      {/* Cover Letter */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/20">
          <h3 className="font-medium text-slate-200 flex items-center">
            <FileText className="mr-2 h-4 w-4 text-emerald-400" />
            Cover Letter
          </h3>
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-slate-700 hover:bg-slate-800 h-8 px-3" onClick={() => setIsEditingCoverLetter(!isEditingCoverLetter)}>
              <FileEdit className="mr-2 h-3 w-3" />
              {isEditingCoverLetter ? "View Mode" : "Edit"}
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-8 px-3" onClick={() => downloadPdf("pdf-cover-letter", `${companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover_letter.pdf`)}>
              <Download className="mr-2 h-3 w-3" />
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {isEditingCoverLetter ? (
            <div className="bg-white rounded-md text-black">
              <ReactQuill 
                theme="snow" 
                value={coverLetterContent} 
                onChange={setCoverLetterContent} 
                className="min-h-[300px]"
              />
              <div className="p-2 flex justify-end">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-700 h-8 px-3" onClick={() => setIsEditingCoverLetter(false)}>Save Changes</button>
              </div>
            </div>
          ) : (
            <div 
              id="pdf-cover-letter"
              className="prose prose-invert prose-emerald max-w-none break-words [overflow-wrap:anywhere] bg-slate-800/30 p-6 rounded-lg min-h-[300px]"
              dangerouslySetInnerHTML={{ __html: coverLetterContent || coverLetterHtml || "" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
