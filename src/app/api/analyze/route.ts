import OpenAI from 'openai';
import { ANALYSIS_PROMPT } from '@/lib/prompts';
import { AnalysisResult } from '@/lib/types';

export async function POST(req: Request) {
  const { billText }: { billText: string } = await req.json();

  if (!billText?.trim()) {
    return Response.json({ error: 'No bill text provided.' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key not configured.' }, { status: 500 });
  }

  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: ANALYSIS_PROMPT },
      {
        role: 'user',
        content: `Please analyze this medical bill:\n\n${billText}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';

  let result: AnalysisResult | { error: string };
  try {
    result = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'Failed to parse analysis.' }, { status: 500 });
  }

  return Response.json(result);
}
