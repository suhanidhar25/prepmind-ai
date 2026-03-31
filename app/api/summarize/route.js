import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { note } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize these notes in bullet points and add 5 viva questions:\n${note}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const text = completion.choices[0].message.content;

    return Response.json({ text });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}