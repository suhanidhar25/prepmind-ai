
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const note = body.note;

    if (typeof note !== "string" || !note.trim()) {
      return NextResponse.json(
        { error: "Please provide notes to summarize" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the following notes in clear bullet points.
Then generate 5 viva questions with short answers.

Notes:
${note}`,
    });

    return NextResponse.json({
      summary: response.text ?? "",
    });
  } catch (error) {
    console.error("Summarization error:", error);

    return NextResponse.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 }
    );
  }
}
