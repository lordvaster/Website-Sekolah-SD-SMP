// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendMail } from "@/lib/email";
import { rateLimitGuard } from "@/lib/rate-limit";
import { readSettings } from "@/lib/settings";
import { escapeHtml } from "@/lib/utils";
import { emailNotConfiguredResponse, validationErrorResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "contact");
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const { name, email, phone, message } = parsed.data;

  try {
    const { schoolEmail } = await readSettings();
    const result = await sendMail({
      to: process.env.CONTACT_RECEIVER_EMAIL || schoolEmail,
      subject: `Pesan baru dari ${name} melalui website`,
      replyTo: email,
      html: `
        <h2>Pesan Kontak Baru</h2>
        <p><strong>Nama:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telepon:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Pesan:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (!result.sent && process.env.NODE_ENV === "production") {
      return emailNotConfiguredResponse();
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/contact] Gagal mengirim email:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
