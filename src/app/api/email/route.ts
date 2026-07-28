import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, date, time, name, phone, email, notes } = body;

    if (!name || !phone || !service || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const emailjsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_email: "Panthidentalservice2064@gmail.com",
          from_name: name,
          from_email: email || "Not provided",
          phone,
          service,
          date,
          time,
          notes: notes || "None",
        },
      }),
    });

    if (!emailjsRes.ok) {
      const errText = await emailjsRes.text();
      console.error("EmailJS error:", errText);
      return NextResponse.json({ error: "Failed to send email notification" }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: "Appointment request submitted successfully. We will contact you shortly.",
    });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
