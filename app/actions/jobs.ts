"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type JobStatus = 'draft' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';

// Define the Job interface extending the Supabase types for easier usage
export interface JobFormData {
  title: string;
  company: string;
  description?: string;
  url?: string;
  resume_id?: string;
}

export async function getJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*, resumes(title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getJobById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*, resumes(title)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching job:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function createJob(formData: JobFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert([
      {
        ...formData,
        user_id: user.id,
        status: 'draft'
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating job:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/jobs");
  return data;
}

export async function updateJob(id: string, formData: Partial<JobFormData>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("jobs")
    .update(formData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating job:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/jobs");
  revalidatePath(`/dashboard/jobs/${id}`);
  return data;
}

export async function updateJobStatus(id: string, status: JobStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating job status:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/jobs");
  return data;
}

export async function deleteJob(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting job:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/jobs");
  return true;
}
