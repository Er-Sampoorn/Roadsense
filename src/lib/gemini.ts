import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export const geminiVisionModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export async function analyzeRoadImage(imageBase64: string, mimeType: string) {
  const result = await geminiVisionModel.generateContent([
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
    `You are a road infrastructure analyst AI. Analyze this image and respond ONLY with valid JSON:
    {
      "category": "pothole" | "crack" | "waterlogging" | "debris" | "signage" | "other",
      "severity": <number 1-10>,
      "description": "<brief description of the issue>",
      "estimated_size": "<approximate size in meters>",
      "urgency": "low" | "medium" | "high" | "critical"
    }
    
    Severity scale: 1-3 minor cosmetic, 4-6 moderate damage, 7-8 significant hazard, 9-10 life-threatening.`,
  ]);

  const text = result.response.text();
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      category: "other",
      severity: 5,
      description: "Unable to parse AI analysis",
      estimated_size: "unknown",
      urgency: "medium",
    };
  }
}

export async function chatWithGemini(
  message: string,
  history: { role: string; content: string }[]
) {
  const chat = geminiModel.startChat({
    history: history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    })),
  });

  const result = await chat.sendMessage(
    `You are RoadSense AI, a helpful road safety assistant. Help citizens report road issues, check area safety, and understand road conditions. Be concise. Respond in the same language the user writes in (Hindi, English, etc.).

User: ${message}`
  );

  return result.response.text();
}
