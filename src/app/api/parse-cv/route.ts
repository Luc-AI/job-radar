import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { extractText } from "unpdf";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 5MB. Please upload a smaller file." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = "";

    if (file.type === "text/plain") {
      text = buffer.toString("utf-8");
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (file.type === "application/pdf") {
      const result = await extractText(arrayBuffer);
      text = result.text.join("\n");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }

    // Clean up the text
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!text) {
      const isPdf = file.type === "application/pdf";
      const errorMessage = isPdf
        ? "No text could be extracted from this PDF. This can happen with scanned documents or flattened PDFs (image-only). Please paste your CV text directly instead."
        : "The file appears to be empty. Please try another file or paste your CV text directly.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ text, fileName: file.name });
  } catch (error) {
    console.error("Error parsing CV:", error);
    return NextResponse.json(
      { error: "Failed to parse file. Please try another file or paste your CV directly." },
      { status: 500 }
    );
  }
}
