import OpenAI from "openai";

export interface EmailVariant {
  subject: string;
  body: string;
  tone: string;
}

export interface GenerateEmailsInput {
  product: string;
  prospectName: string;
  company: string;
  industry: string;
  tone: string;
}

export async function generateColdEmails(
  input: GenerateEmailsInput
): Promise<EmailVariant[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const systemPrompt = `Return ONLY valid JSON: {variants:[{subject:string,body:string,tone:string}]}
Generate 3 cold emails. Each 100-150 words. Include industry pain point, one value prop, soft CTA. Tones: professional, casual, bold.`;

  const userPrompt = `Product/Service: ${input.product}
Prospect: ${input.prospectName}
Company: ${input.company}
Industry: ${input.industry}
Preferred tone: ${input.tone}

Generate 3 cold email variants (professional, casual, bold). Return ONLY valid JSON with no markdown or extra text.`;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-4-scout:free",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("No response from OpenRouter");
  }

  // Strip markdown code blocks if present
  let jsonStr = content;
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr) as { variants?: EmailVariant[] };
  const variants = parsed.variants;

  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error("Invalid response format from OpenRouter");
  }

  return variants.slice(0, 3).map((v) => ({
    subject: String(v.subject ?? ""),
    body: String(v.body ?? ""),
    tone: String(v.tone ?? "professional"),
  }));
}
