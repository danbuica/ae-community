import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, readFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { onboardingFormSchema } from "@/lib/validation";

const CLIENTS_DIR = path.join(process.cwd(), "..", "data", "clients");

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = onboardingFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 422 }
      );
    }

    const id = uuidv4();
    const businessName = result.data.businessOverview?.businessName || "unknown";
    const slug = slugify(businessName);
    const clientDir = path.join(CLIENTS_DIR, slug);

    const submission = {
      id,
      slug,
      submittedAt: new Date().toISOString(),
      data: result.data,
    };

    await mkdir(path.join(clientDir, "uploads"), { recursive: true });
    await writeFile(
      path.join(clientDir, "onboarding.json"),
      JSON.stringify(submission, null, 2)
    );

    // Move uploaded logo into client folder if it exists
    const logoUrl = result.data.brandIdentity?.logoUrl;
    if (logoUrl) {
      const filename = logoUrl.split("/").pop();
      if (filename) {
        const oldUploadsDir = path.join(process.cwd(), "..", "data", "uploads");
        const oldPath = path.join(oldUploadsDir, filename);
        try {
          const logoBuffer = await readFile(oldPath);
          const ext = filename.split(".").pop() ?? "png";
          const newLogoPath = path.join(clientDir, "uploads", `logo.${ext}`);
          await writeFile(newLogoPath, logoBuffer);
          // Update the logo URL in the submission
          submission.data.brandIdentity.logoUrl = `/api/upload/${slug}/logo.${ext}`;
          await writeFile(
            path.join(clientDir, "onboarding.json"),
            JSON.stringify(submission, null, 2)
          );
        } catch {
          // Old file doesn't exist — skip
        }
      }
    }

    return NextResponse.json({ success: true, id: slug });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await mkdir(CLIENTS_DIR, { recursive: true });
    const dirs = await readdir(CLIENTS_DIR, { withFileTypes: true });
    const clientDirs = dirs.filter((d) => d.isDirectory());

    const submissions = await Promise.all(
      clientDirs.map(async (d) => {
        try {
          const raw = await readFile(path.join(CLIENTS_DIR, d.name, "onboarding.json"), "utf-8");
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })
    );

    const valid = submissions.filter(Boolean);
    valid.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json({ submissions: valid });
  } catch {
    return NextResponse.json({ submissions: [] });
  }
}
