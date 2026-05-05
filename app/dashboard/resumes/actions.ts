"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ResumeActionResult = {
  success: boolean;
  error?: string;
  id?: string;
};

export async function createResume(
  title: string,
  htmlContent: string,
  rawText: string
): Promise<ResumeActionResult> {
  try {
    if (!title || title.trim().length < 3) {
      return { success: false, error: "Title must be at least 3 characters." };
    }
    if (!htmlContent || htmlContent.replace(/<[^>]*>/g, "").trim().length === 0) {
      return { success: false, error: "Resume content cannot be empty." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in." };
    }

    // Check if this is the user's first resume — make it default
    const { count } = await supabase
      .from("resumes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const isFirst = (count ?? 0) === 0;

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: { html: htmlContent },
        raw_text: rawText,
        is_default: isFirst,
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/resumes");
    return { success: true, id: data.id };
  } catch {
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateResume(
  id: string,
  title: string,
  htmlContent: string,
  rawText: string
): Promise<ResumeActionResult> {
  try {
    if (!title || title.trim().length < 3) {
      return { success: false, error: "Title must be at least 3 characters." };
    }
    if (!htmlContent || htmlContent.replace(/<[^>]*>/g, "").trim().length === 0) {
      return { success: false, error: "Resume content cannot be empty." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in." };
    }

    const { error } = await supabase
      .from("resumes")
      .update({
        title: title.trim(),
        content: { html: htmlContent },
        raw_text: rawText,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/resumes");
    return { success: true, id };
  } catch {
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteResume(id: string): Promise<ResumeActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in." };
    }

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/resumes");
    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function setDefaultResume(
  id: string
): Promise<ResumeActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in." };
    }

    // Unset all defaults for this user
    await supabase
      .from("resumes")
      .update({ is_default: false })
      .eq("user_id", user.id);

    // Set the new default
    const { error } = await supabase
      .from("resumes")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/resumes");
    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred." };
  }
}
