// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validation";
import { sendMail } from "@/lib/email";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";
import { escapeHtml } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`pendaftaran:${ip}`)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan, coba lagi dalam beberapa menit." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { childName, childAge, program, parentName, email, phone } = parsed.data;
  const safeChildName = escapeHtml(childName);
  const safeProgram = escapeHtml(program);
  const safeParentName = escapeHtml(parentName);

  try {
    const adminResult = await sendMail({
      to: process.env.CONTACT_RECEIVER_EMAIL || siteConfig.email,
      subject: `Pendaftaran siswa baru: ${childName}`,
      replyTo: email,
      html: `
        <h2>Pendaftaran Siswa Baru</h2>
        <p><strong>Nama Anak:</strong> ${safeChildName}</p>
        <p><strong>Usia:</strong> ${childAge} tahun</p>
        <p><strong>Jenjang Dituju:</strong> ${safeProgram}</p>
        <p><strong>Nama Orang Tua:</strong> ${safeParentName}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telepon:</strong> ${escapeHtml(phone)}</p>
      `,
    });

    const parentResult = await sendMail({
      to: email,
      subject: `Konfirmasi Pendaftaran - ${siteConfig.name}`,
      html: `
        <h2>Terima kasih, ${safeParentName}!</h2>
        <p>Pendaftaran untuk ananda <strong>${safeChildName}</strong> pada jenjang
        <strong>${safeProgram}</strong> telah kami terima.</p>
        <p>Tim admisi kami akan menghubungi anda dalam 1-2 hari kerja untuk
        proses selanjutnya.</p>
        <p>Salam hangat,<br/>${siteConfig.name}</p>
      `,
    });

    if ((!adminResult.sent || !parentResult.sent) && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Pendaftaran tidak dapat diproses karena server email belum dikonfigurasi. Silakan hubungi kami via telepon/WhatsApp.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/pendaftaran] Gagal memproses pendaftaran:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pendaftaran. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
