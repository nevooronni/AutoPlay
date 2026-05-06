import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { TailoredApplicationSchema } from "@/lib/ai/schema";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    // Fetch Job and associated Resume
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*, resumes(*)")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!job.resumes) {
      return NextResponse.json({ error: "No resume attached to this job." }, { status: 400 });
    }

    if (!job.description) {
      return NextResponse.json({ error: "Job description is missing." }, { status: 400 });
    }

    // Extract HTML content from resume
    const baseResumeContent = typeof job.resumes.content === "object" && job.resumes.content !== null
      ? (job.resumes.content as { html?: string }).html || ""
      : "";

    if (!baseResumeContent) {
      return NextResponse.json({ error: "Resume has no content." }, { status: 400 });
    }

    // Call Google Gemini to tailor the resume and cover letter
    const { object } = await generateObject({
      model: google("gemini-flash-latest"),
      schema: TailoredApplicationSchema,
      system: SYSTEM_PROMPT,
      prompt: `
      ## Job Title: ${job.title}
      ## Company: ${job.company}
      
      ## Job Description:
      ${job.description}

      ## Base Resume:
      ${baseResumeContent}

      ## INSTRUCTIONS:
      1. Format Enforcement: Keep the current base resume format exactly as it is attached. Do NOT add new sections or remove current ones.
      2. Tone Guidance: Make the cover letter and resume punchy and modern. Avoid generic buzzwords like "dynamic" or "synergy". Limit the cover letter to 3 short paragraphs.
      3. Content Constraints: DO NOT cut out important work history, education, or skills from the base resume. 
      4. Length & Relevance: Output should align with the given JD. Tweak the base CV content to fit without changing the structure. Ensure the final resume is 2 pages max.
      `,
    });

    // Update the database with the generated assets
    const { error: updateError } = await supabase
      .from("jobs")
      .update({
        tailored_resume: { html: object.tailored_resume_html },
        cover_letter: object.cover_letter_html,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (updateError) {
      console.error("Failed to update job with tailored assets:", updateError);
      return NextResponse.json({ error: "Failed to save generated assets." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: object });

  } catch (error: any) {
    console.error("AI Tailoring Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during AI generation." },
      { status: 500 }
    );
  }
}
