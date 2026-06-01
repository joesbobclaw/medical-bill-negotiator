import { GoogleGenerativeAI } from "@google/generative-ai";
import { ANALYSIS_PROMPT } from "@/lib/prompts";
import { AnalysisResult } from "@/lib/types";

export async function POST(req: Request) {
  const { billText }: { billText: string } = await req.json();

  if (!billText?.trim()) {
    return Response.json({ error: "No bill text provided." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
    systemInstruction: ANALYSIS_PROMPT,
  });

  const result = await model.generateContent(
    `Please analyze this medical bill:

${billText}`
  );

  const raw = result.response.text();

  let parsed: AnalysisResult | { error: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Failed to parse analysis." }, { status: 500 });
  }

  return Response.json(parsed);
}
