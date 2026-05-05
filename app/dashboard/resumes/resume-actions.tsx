"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Star, Loader2 } from "lucide-react";
import {
  deleteResume,
  setDefaultResume,
} from "@/app/dashboard/resumes/actions";

interface ResumeActionsProps {
  resumeId: string;
  isDefault: boolean;
}

export function ResumeActions({ resumeId, isDefault }: ResumeActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    setIsDeleting(true);
    try {
      const result = await deleteResume(resumeId);
      if (result.success) {
        toast.success("Resume deleted.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      const result = await setDefaultResume(resumeId);
      if (result.success) {
        toast.success("Default resume updated.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to set default.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
      <Link
        href={`/dashboard/resumes/${resumeId}/edit`}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>

      {!isDefault && (
        <button
          type="button"
          onClick={handleSetDefault}
          disabled={isSettingDefault}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSettingDefault ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Star className="h-3.5 w-3.5" />
          )}
          Set Default
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 ml-auto cursor-pointer"
      >
        {isDeleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        Delete
      </button>
    </div>
  );
}
