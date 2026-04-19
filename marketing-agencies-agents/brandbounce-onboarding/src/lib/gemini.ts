import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient() {
  if (!client) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set in .env.local");
    client = new GoogleGenAI({ apiKey: key });
  }
  return client;
}

export async function generateText(prompt: string): Promise<string> {
  const response = await getClient().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text ?? "";
}

export async function generateWithImage<T>(prompt: string, imageBase64: string, mimeType: string): Promise<T> {
  const fullPrompt = `${prompt}

IMPORTANT: Respond with ONLY valid JSON. No markdown, no code blocks, no explanation. Just the raw JSON.`;

  const response = await getClient().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: fullPrompt },
        ],
      },
    ],
  });

  const text = (response.text ?? "").trim()
    .replace(/^```(?:json)?\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();

  return JSON.parse(text) as T;
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const fullPrompt = `${prompt}

IMPORTANT: Respond with ONLY valid JSON. No markdown, no code blocks, no explanation. Just the raw JSON.`;

  const text = await generateText(fullPrompt);

  // Strip any accidental markdown fences
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}
