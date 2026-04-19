import { NextRequest, NextResponse } from "next/server";
import { generateJSON, generateText, generateWithImage } from "@/lib/gemini";
import { readFile } from "fs/promises";
import path from "path";
import {
  competitorsPrompt,
  elevatorPitchPrompt,
  contentPillarsPrompt,
  audienceDescriptionPrompt,
  hashtagsPrompt,
  postingFrequencyPrompt,
  brandVoicePrompt,
  logoColorsPrompt,
  postingTimesPrompt,
} from "@/lib/prompts";
import type { AISuggestionType } from "@/types/onboarding";

export async function POST(req: NextRequest) {
  try {
    const { type, context } = (await req.json()) as {
      type: AISuggestionType;
      context: Record<string, unknown>;
    };

    if (!type) {
      return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    let suggestions: unknown;

    switch (type) {
      case "competitors": {
        suggestions = await generateJSON<string[]>(
          competitorsPrompt({
            industry: String(context.industry ?? ""),
            businessName: String(context.businessName ?? ""),
            productsServices: (context.productsServices as string[]) ?? [],
          })
        );
        break;
      }

      case "elevator-pitch": {
        const res = await generateJSON<{ pitch: string }>(
          elevatorPitchPrompt({
            businessName: String(context.businessName ?? ""),
            industry: String(context.industry ?? ""),
            productsServices: (context.productsServices as string[]) ?? [],
            uniqueSellingProposition: String(context.uniqueSellingProposition ?? ""),
          })
        );
        suggestions = res.pitch;
        break;
      }

      case "content-pillars": {
        suggestions = await generateJSON<{ name: string; description: string }[]>(
          contentPillarsPrompt({
            industry: String(context.industry ?? ""),
            businessName: String(context.businessName ?? ""),
            productsServices: (context.productsServices as string[]) ?? [],
            targetAudience: String(context.targetAudience ?? ""),
            archetypes: (context.archetypes as string[]) ?? [],
          })
        );
        break;
      }

      case "audience-description": {
        const res = await generateJSON<{ description: string }>(
          audienceDescriptionPrompt({
            industry: String(context.industry ?? ""),
            businessName: String(context.businessName ?? ""),
            ageMin: Number(context.ageMin ?? 18),
            ageMax: Number(context.ageMax ?? 45),
            locations: (context.locations as string[]) ?? [],
            interests: (context.interests as string[]) ?? [],
            painPoints: String(context.painPoints ?? ""),
          })
        );
        suggestions = res.description;
        break;
      }

      case "hashtags": {
        suggestions = await generateJSON<{ pillar: string; hashtags: string[] }[]>(
          hashtagsPrompt({
            industry: String(context.industry ?? ""),
            platforms: (context.platforms as string[]) ?? [],
            contentPillars: (context.contentPillars as string[]) ?? [],
            competitors: (context.competitors as string[]) ?? [],
            targetAudience: String(context.targetAudience ?? ""),
          })
        );
        break;
      }

      case "posting-frequency": {
        suggestions = await generateJSON<
          { platform: string; postsPerWeek: number; reasoning: string }[]
        >(
          postingFrequencyPrompt({
            platforms: (context.platforms as string[]) ?? [],
            industry: String(context.industry ?? ""),
            adBudget: String(context.adBudget ?? "unknown"),
          })
        );
        break;
      }

      case "brand-voice": {
        const res = await generateJSON<{ voiceDescription: string }>(
          brandVoicePrompt({
            archetypes: (context.archetypes as string[]) ?? [],
            toneKeywords: (context.toneKeywords as string[]) ?? [],
            industry: String(context.industry ?? ""),
            targetAudience: String(context.targetAudience ?? ""),
          })
        );
        suggestions = res.voiceDescription;
        break;
      }

      case "logo-colors": {
        // Read the uploaded image from disk and send as base64 to Gemini
        const imageUrl = String(context.imageUrl ?? "");
        const filename = imageUrl.split("/").pop();
        if (!filename) {
          return NextResponse.json({ error: "No image URL" }, { status: 400 });
        }
        // Try temp uploads first, then client uploads
        const DATA_DIR = path.join(process.cwd(), "..", "data");
        const segments = imageUrl.replace("/api/upload/", "").split("/");
        let filepath: string;
        if (segments.length === 1) {
          filepath = path.join(DATA_DIR, "uploads", segments[0]);
        } else {
          filepath = path.join(DATA_DIR, "clients", segments[0], "uploads", ...segments.slice(1));
        }
        const buffer = await readFile(filepath);
        const base64 = buffer.toString("base64");
        const ext = filename.split(".").pop()?.toLowerCase() ?? "png";
        const mimeMap: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml", webp: "image/webp" };
        const mimeType = mimeMap[ext] ?? "image/png";

        suggestions = await generateWithImage<
          { hex: string; name: string; role: "primary" | "secondary" | "accent" }[]
        >(
          `Analyse this brand logo and extract the 3-5 most prominent colors.
Return a JSON array: [{ "hex": "#RRGGBB", "name": "Color Name", "role": "primary|secondary|accent" }]
Use accurate hex codes matching the actual colors visible in the logo. The primary color should be the most dominant.`,
          base64,
          mimeType
        );
        break;
      }

      case "posting-times": {
        suggestions = await generateJSON<
          { platform: string; times: { day: string; time: string }[] }[]
        >(
          postingTimesPrompt({
            platforms: (context.platforms as string[]) ?? [],
            industry: String(context.industry ?? ""),
            locations: (context.locations as string[]) ?? [],
            targetAudience: String(context.targetAudience ?? ""),
          })
        );
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown suggestion type" }, { status: 400 });
    }

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("AI suggest error:", err);
    const message = err instanceof Error ? err.message : "AI suggestion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
