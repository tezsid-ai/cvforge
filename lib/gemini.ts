import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const geminiClient = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateContent(
  prompt: string,
  systemPrompt: string,
  returnJson?: boolean,
): Promise<string> {
  if (!geminiClient) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const model = geminiClient.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent({
    generationConfig: returnJson
      ? { responseMimeType: "application/json" }
      : {},
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
      },
    ],
  });

  return result.response.text();
}
