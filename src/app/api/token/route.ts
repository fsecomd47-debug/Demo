import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.CARTESIA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Cartesia API key not configured" }, { status: 500 });
  }

  try {
    const { default: Cartesia } = await import("@cartesia/cartesia-js");
    const client = new Cartesia({ apiKey });

    const { token } = await client.accessToken.create({
      grants: { tts: true },
      expires_in: 300,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
