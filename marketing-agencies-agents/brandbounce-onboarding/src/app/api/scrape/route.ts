import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import type { ScrapedWebsiteData, Platform } from "@/types/onboarding";

const SOCIAL_PATTERNS: Record<Platform, RegExp> = {
  instagram: /instagram\.com\/([A-Za-z0-9_.]+)/,
  tiktok: /tiktok\.com\/@([A-Za-z0-9_.]+)/,
  facebook: /facebook\.com\/([A-Za-z0-9_.]+)/,
  linkedin: /linkedin\.com\/(?:company|in)\/([A-Za-z0-9_-]+)/,
  x: /(?:twitter|x)\.com\/([A-Za-z0-9_]+)/,
  youtube: /youtube\.com\/(?:c\/|channel\/|@)([A-Za-z0-9_-]+)/,
  pinterest: /pinterest\.com\/([A-Za-z0-9_]+)/,
  threads: /threads\.net\/@([A-Za-z0-9_.]+)/,
};

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string };
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    // Fetch with a browser-like UA and timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let html: string;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = await res.text();
    } finally {
      clearTimeout(timeout);
    }

    const $ = cheerio.load(html);

    // ── Extract data ────────────────────────────────────────────
    const rawTitle = $("title").text().trim();

    const title =
      $('meta[property="og:title"]').attr("content") ||
      rawTitle.split("|")[0].split("-")[0].trim() ||
      "";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      // Fallback: use the full title tag as description (often contains business context)
      (rawTitle.includes("-") || rawTitle.includes("|") ? rawTitle : "");

    const keywords = $('meta[name="keywords"]').attr("content")
      ? $('meta[name="keywords"]')
          .attr("content")!
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
          .slice(0, 10)
      : [];

    // Try to extract any visible text from body (noscript, structured data, etc.)
    const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 500);
    const ldJson = $('script[type="application/ld+json"]').first().html();
    let structuredName = "";
    let structuredDescription = "";
    if (ldJson) {
      try {
        const ld = JSON.parse(ldJson);
        structuredName = ld.name || ld.headline || "";
        structuredDescription = ld.description || "";
      } catch { /* ignore */ }
    }

    // Extract social links from entire HTML text
    const fullText = html;
    const socialLinks: Partial<Record<Platform, string>> = {};
    for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS) as [Platform, RegExp][]) {
      const match = fullText.match(pattern);
      if (match?.[1]) {
        socialLinks[platform] = match[1];
      }
    }

    // Extract brand colors from CSS (simple og:image dominant is done server-side by Gemini later)
    // Here we just grab any meta theme-color
    const themeColor = $('meta[name="theme-color"]').attr("content");
    const colors = themeColor ? [themeColor] : [];

    const finalName = structuredName || title;
    const finalDescription = structuredDescription || description || bodyText;

    const result: ScrapedWebsiteData = {
      businessName: finalName.slice(0, 80),
      description: finalDescription.slice(0, 400),
      keywords: keywords.length > 0 ? keywords : undefined,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      colors: colors.length > 0 ? colors : undefined,
    };

    return NextResponse.json({ data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scrape failed";
    // Return partial success — don't block the user
    return NextResponse.json({ data: null, warning: message });
  }
}
