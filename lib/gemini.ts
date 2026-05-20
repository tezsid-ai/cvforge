import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const geminiClient = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MODEL_CANDIDATES = ["gemini-2.5-flash"];
const RETRYABLE_STATUS = new Set([429, 503]);

function getStatus(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const candidate = error as {
    status?: number;
    statusCode?: number;
    message?: string;
  };
  if (typeof candidate.status === "number") return candidate.status;
  if (typeof candidate.statusCode === "number") return candidate.statusCode;
  if (candidate.message?.includes("429")) return 429;
  if (candidate.message?.includes("503")) return 503;
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateContent(
  prompt: string,
  systemPrompt: string,
  returnJson?: boolean,
): Promise<string> {
  if (!geminiClient) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  let lastError: unknown;

  for (const modelName of MODEL_CANDIDATES) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const model = geminiClient.getGenerativeModel({
          model: modelName,
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
      } catch (error) {
        lastError = error;
        const status = getStatus(error);
        if (!status || !RETRYABLE_STATUS.has(status)) {
          break;
        }
        await sleep(350 + attempt * 500);
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to generate content.");
}
