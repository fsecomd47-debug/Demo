import { NextResponse } from "next/server";

const VOICE_PROMPT = `You are the AI receptionist of Panthi Dental Clinic. You are speaking on the phone with a patient.

Rules:
- Keep responses VERY BRIEF — 1 to 3 sentences max.
- Speak naturally, like a real receptionist.
- NEVER use markdown, emojis, bullet points, or formatting.
- NEVER include {function:...} markers.
- Be warm and professional.

Clinic: Panthi Dental Clinic, Hospital Line, Ghorahi, Dang, Nepal.
Phone: +977 9847857569
Hours: Sunday-Friday 8:00 AM - 6:00 PM, Saturday Closed.
Services: General Dentistry, Orthodontics, Dental Implants, Teeth Whitening, Root Canal, Cosmetic Dentistry, Oral Surgery, Pediatric Dentistry.

Never diagnose or prescribe medicine. Recommend professional examination for any medical concerns.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { transcript, history } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterKey) {
      return NextResponse.json({
        reply: "Thank you for your message. To book an appointment, please call us at 984-7857569.",
      });
    }

    const messages: { role: string; content: string }[] = [
      { role: "system", content: VOICE_PROMPT },
      ...(history || []).slice(-6),
      { role: "user", content: transcript },
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey}`,
        "HTTP-Referer": "https://panthi-dental.vercel.app",
        "X-Title": "Panthi Dental Clinic",
      },
      body: JSON.stringify({
        model: "google/gemma-4-26b-a4b-it:free",
        messages,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenRouter error:", errText);
      throw new Error("OpenRouter API error");
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "I apologize, but I'm unable to respond right now. Please call us at 984-7857569 for assistance.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Please call us directly at 984-7857569.",
    });
  }
}
