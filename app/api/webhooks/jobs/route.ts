import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate request
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (token !== process.env.JOB_SCRAPER_SECRET) {
      return NextResponse.json({ error: "Invalid authorization token" }, { status: 401 });
    }

    // 2. Parse payload
    const body = await req.json();
    const { email, jobs } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Missing or invalid email" }, { status: 400 });
    }

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json({ error: "Missing or empty jobs array" }, { status: 400 });
    }

    // 3. Find user by email using Admin Client
    const supabaseAdmin = createAdminClient();
    
    // We can lookup users in auth.users by email using admin API
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error fetching users:", userError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const targetUser = userData.users.find(u => u.email === email);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found for email: " + email }, { status: 404 });
    }

    const userId = targetUser.id;

    // 4. Prepare and insert jobs
    const jobsToInsert = jobs.map((job: any) => {
      // Build a comprehensive description from the scraper's extra fields
      const descriptionLines = [];
      if (job.location) descriptionLines.push(`**Location:** ${job.location}`);
      if (job.salary) descriptionLines.push(`**Salary:** ${job.salary}`);
      if (job.work_type) descriptionLines.push(`**Work Type:** ${job.work_type}`);
      if (job.date_posted) descriptionLines.push(`**Date Posted:** ${job.date_posted}`);
      if (job.site) descriptionLines.push(`**Source Site:** ${job.site}`);
      if (job.id) descriptionLines.push(`**Scraper ID:** ${job.id}`);

      return {
        user_id: userId,
        title: job.title,
        company: job.company || "Unknown Company",
        url: job.url || null,
        description: descriptionLines.length > 0 ? descriptionLines.join("\n") : null,
        status: "draft"
      };
    });

    const { data: insertedJobs, error: insertError } = await supabaseAdmin
      .from("jobs")
      .insert(jobsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting jobs:", insertError);
      return NextResponse.json({ error: "Failed to insert jobs", details: insertError }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully inserted ${insertedJobs.length} jobs for ${email}`,
      jobs: insertedJobs 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
