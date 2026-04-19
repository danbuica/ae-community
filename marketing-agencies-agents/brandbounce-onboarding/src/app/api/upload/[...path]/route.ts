import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "..", "data");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Prevent path traversal
  if (segments.some((s) => s.includes("..") || s.includes("~"))) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    let filepath: string;

    if (segments.length === 1) {
      // /api/upload/{filename} — temp uploads
      filepath = path.join(DATA_DIR, "uploads", segments[0]);
    } else {
      // /api/upload/{slug}/{filename} — client uploads
      filepath = path.join(DATA_DIR, "clients", segments[0], "uploads", ...segments.slice(1));
    }

    const buffer = await readFile(filepath);

    const filename = segments[segments.length - 1];
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
      svg: "image/svg+xml", webp: "image/webp", pdf: "application/pdf",
    };
    const contentType = (ext && mimeTypes[ext]) ?? "application/octet-stream";

    return new NextResponse(buffer, {
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000" },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
