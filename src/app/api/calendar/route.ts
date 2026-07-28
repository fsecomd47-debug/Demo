import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, date, time, name, phone, email } = body;

    if (!name || !phone || !service || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_CALENDAR_ID
    ) {
      return NextResponse.json({
        success: false,
        message: "Calendar sync not configured",
      });
    }

    const { google } = await import("googleapis");

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar.events"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Dental Appointment - ${service}`,
      description: `Patient: ${name}\nPhone: ${phone}\nEmail: ${email || "Not provided"}\nService: ${service}`,
      start: { dateTime: startTime.toISOString(), timeZone: "Asia/Kathmandu" },
      end: { dateTime: endTime.toISOString(), timeZone: "Asia/Kathmandu" },
      attendees: email ? [{ email }] : [],
    };

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return NextResponse.json({
      success: true,
      message: "Appointment booked and added to calendar.",
    });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 });
  }
}
