import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import {
  prefillStep2Prompt,
  prefillStep3Prompt,
  prefillStep4Prompt,
  prefillStep5Prompt,
  prefillStep6Prompt,
} from "@/lib/prefill-prompts";

export async function POST(req: NextRequest) {
  try {
    const { targetStep, context } = (await req.json()) as {
      targetStep: number;
      context: Record<string, unknown>;
    };

    if (!targetStep || targetStep < 2 || targetStep > 6) {
      return NextResponse.json({ error: "Invalid target step" }, { status: 400 });
    }

    let prefill: unknown;

    switch (targetStep) {
      case 2: {
        prefill = await generateJSON(
          prefillStep2Prompt({
            businessName: String(context.businessName ?? ""),
            description: String(context.description ?? ""),
            keywords: (context.keywords as string[]) ?? undefined,
            socialLinks: (context.socialLinks as Record<string, string>) ?? undefined,
          })
        );
        break;
      }
      case 3: {
        prefill = await generateJSON(
          prefillStep3Prompt({
            businessName: String(context.businessName ?? ""),
            industry: String(context.industry ?? ""),
            elevatorPitch: String(context.elevatorPitch ?? ""),
            productsServices: (context.productsServices as string[]) ?? [],
            uniqueSellingProposition: String(context.uniqueSellingProposition ?? ""),
            scrapedDescription: context.scrapedDescription as string | undefined,
          })
        );
        break;
      }
      case 4: {
        prefill = await generateJSON(
          prefillStep4Prompt({
            businessName: String(context.businessName ?? ""),
            industry: String(context.industry ?? ""),
            elevatorPitch: String(context.elevatorPitch ?? ""),
            productsServices: (context.productsServices as string[]) ?? [],
            archetypes: (context.archetypes as string[]) ?? [],
            toneKeywords: (context.toneKeywords as string[]) ?? [],
            scrapedDescription: context.scrapedDescription as string | undefined,
          })
        );
        break;
      }
      case 5: {
        prefill = await generateJSON(
          prefillStep5Prompt({
            businessName: String(context.businessName ?? ""),
            industry: String(context.industry ?? ""),
            productsServices: (context.productsServices as string[]) ?? [],
            competitors: (context.competitors as string[]) ?? [],
            archetypes: (context.archetypes as string[]) ?? [],
            toneKeywords: (context.toneKeywords as string[]) ?? [],
            audienceDescription: String(context.audienceDescription ?? ""),
            locations: (context.locations as string[]) ?? [],
            scrapedSocialLinks: (context.scrapedSocialLinks as Record<string, string>) ?? undefined,
          })
        );
        break;
      }
      case 6: {
        prefill = await generateJSON(
          prefillStep6Prompt({
            businessName: String(context.businessName ?? ""),
            industry: String(context.industry ?? ""),
            platforms: (context.platforms as string[]) ?? [],
            audienceDescription: String(context.audienceDescription ?? ""),
            locations: (context.locations as string[]) ?? [],
            contentPillars: (context.contentPillars as string[]) ?? [],
          })
        );
        break;
      }
    }

    return NextResponse.json({ prefill });
  } catch (err) {
    console.error("AI prefill error:", err);
    const message = err instanceof Error ? err.message : "AI prefill failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
