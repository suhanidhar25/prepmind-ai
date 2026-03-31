import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface RequestBody {
  note: string;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  text: string;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { note } = (await req.json()) as RequestBody;

    if (!note || !note.trim()) {
      return NextResponse.json(
        { error: "No note provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(
      `Summarize these notes in bullet points and add 5 viva questions:\n${note}`
    );

    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
