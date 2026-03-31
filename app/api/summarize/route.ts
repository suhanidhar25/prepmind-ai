import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    const { note } = await req.json();

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Summarize this in bullet points and add 5 viva questions:\n${note}`,
        },
      ],
    });

    const text = completion.choices[0].message.content || "";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}