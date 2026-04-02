import { NextRequest, NextResponse } from "next/server";
import { chatWithGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await chatWithGemini(message, history || []);

    return NextResponse.json({ response });
  } catch (err) {
    console.error("Chatbot API error:", err);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
