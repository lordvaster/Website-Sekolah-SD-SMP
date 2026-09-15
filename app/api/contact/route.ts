// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendMail } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(`contact:${ip}`)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan, coba lagi dalam beberapa menit." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, phone, message } = parsed.data;

  try {
    await sendMail({
      to: process.env.CONTACT_RECEIVER_EMAIL || siteConfig.email,
      subject: `Pesan baru dari ${name} melalui website`,
      replyTo: email,
      html: `
        <h2>Pesan Kontak Baru</h2>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telepon:</strong> ${phone}</p>
        <p><strong>Pesan:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/contact] Gagal mengirim email:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
