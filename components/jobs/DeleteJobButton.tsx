"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteJob } from "@/app/actions/jobs";
import { toast } from "sonner";

interface DeleteJobButtonProps {
  jobId: string;
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job application? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteJob(jobId);
      toast.success("Job deleted successfully");
      router.push("/dashboard/jobs");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete job");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-medium rounded-xl border border-red-500/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete Job"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      Delete
    </button>
  );
}
