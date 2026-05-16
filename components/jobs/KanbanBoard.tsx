"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateJobStatus, deleteJob, JobStatus } from "@/app/actions/jobs";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, ExternalLink, MoreVertical, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { Database } from "@/lib/supabase/database.types";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"] & {
  resumes?: { title: string } | null;
};

const COLUMNS: { id: JobStatus; title: string; color: string }[] = [
  { id: "draft", title: "Draft", color: "bg-slate-500" },
  { id: "applied", title: "Applied", color: "bg-indigo-500" },
  { id: "interviewing", title: "Interviewing", color: "bg-amber-500" },
  { id: "offered", title: "Offered", color: "bg-emerald-500" },
  { id: "rejected", title: "Rejected", color: "bg-red-500" },
];

interface KanbanBoardProps {
  initialJobs: JobRow[];
}

export default function KanbanBoard({ initialJobs }: KanbanBoardProps) {
  // We need to wait for mount to render DragDropContext to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [jobs, setJobs] = useState<JobRow[]>(initialJobs);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside() {
      if (activeDropdown) setActiveDropdown(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  const handleDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job application? This action cannot be undone.")) {
      try {
        await deleteJob(jobId);
        toast.success("Job deleted successfully");
        setJobs(jobs.filter((j) => j.id !== jobId));
      } catch (error: any) {
        toast.error(error.message || "Failed to delete job");
      }
    }
    setActiveDropdown(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10];
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  };

  // Sync state if initialJobs changes
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedJob = jobs.find((j) => j.id === draggableId);
    if (!draggedJob) return;

    const newStatus = destination.droppableId as JobStatus;
    const oldStatus = source.droppableId as JobStatus;

    // Optimistic UI update
    setJobs((prev) =>
      prev.map((job) =>
        job.id === draggableId ? { ...job, status: newStatus } : job
      )
    );

    try {
      if (newStatus !== oldStatus) {
        await updateJobStatus(draggableId, newStatus);
        toast.success(`Job moved to ${COLUMNS.find(c => c.id === newStatus)?.title}`);
      }
    } catch (error) {
      // Revert on failure
      setJobs(initialJobs);
      toast.error("Failed to update job status");
    }
  };

  if (!mounted) {
    return <div className="animate-pulse h-[600px] bg-slate-900/50 rounded-2xl"></div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)] min-h-[600px] items-start snap-x">
        {COLUMNS.map((column) => {
          const columnJobs = jobs.filter((job) => job.status === column.id);

          return (
            <div key={column.id} className="flex-shrink-0 w-80 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden snap-center max-h-full">
              <div className="p-4 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                  <h3 className="font-semibold text-slate-200">{column.title}</h3>
                </div>
                <span className="text-xs font-medium bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                  {columnJobs.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 overflow-y-auto min-h-[150px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-slate-800/30" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      {columnJobs.map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm group hover:border-indigo-500/30 transition-all ${
                                snapshot.isDragging ? "shadow-lg shadow-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/50 rotate-2" : ""
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <Link href={`/dashboard/jobs/${job.id}`} className="font-medium text-slate-200 hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
                                  {job.title}
                                </Link>
                                <div className="relative">
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setActiveDropdown(activeDropdown === job.id ? null : job.id);
                                    }}
                                    className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  {activeDropdown === job.id && (
                                    <div className="absolute right-0 mt-1 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                      <Link href={`/dashboard/jobs/${job.id}/edit`} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                        <Edit className="h-3 w-3" /> Edit
                                      </Link>
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleDelete(job.id);
                                        }} 
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                                      >
                                        <Trash2 className="h-3 w-3" /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-1.5 text-xs text-slate-400 mb-3">
                                <div className="flex items-center gap-1.5">
                                  <Briefcase className="h-3 w-3" />
                                  <span className="truncate">{job.company}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(job.created_at)}</span>
                                </div>
                              </div>

                              {(job.url || job.resumes?.title) && (
                                <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-wrap gap-2">
                                  {job.resumes?.title && (
                                    <span className="inline-flex items-center text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md truncate max-w-full">
                                      {job.resumes.title}
                                    </span>
                                  )}
                                  {job.url && (
                                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[10px] bg-slate-800 text-slate-300 hover:text-white px-2 py-0.5 rounded-md transition-colors">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Link
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
