import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Polyfill DOMMatrix for pdf-parse (pdfjs-dist) in Node.js
if (typeof global !== "undefined" && typeof global.DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor() {}
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    if (fileName.endsWith(".pdf")) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
      const pdfParse = require("pdf-parse") as any;
      const data = await pdfParse(buffer);
      return NextResponse.json({
        html: `<p>${data.text.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`,
        text: data.text,
      });
    }

    if (fileName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.convertToHtml({ buffer });
      const textResult = await mammoth.extractRawText({ buffer });
      return NextResponse.json({
        html: result.value,
        text: textResult.value,
      });
    }

    return NextResponse.json(
      { error: "Unsupported file type. Please upload a PDF or DOCX file." },
      { status: 400 }
    );
  } catch (err) {
    console.error("Resume parse error:", err);
    return NextResponse.json(
      { error: "Failed to parse file. Please try a different file." },
      { status: 500 }
    );
  }
}
