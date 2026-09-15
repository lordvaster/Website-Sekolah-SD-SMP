// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validation";
import { sendMail } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
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

  try {
    await sendMail({
      to: process.env.CONTACT_RECEIVER_EMAIL || siteConfig.email,
      subject: `Pendaftaran siswa baru: ${childName}`,
      replyTo: email,
      html: `
        <h2>Pendaftaran Siswa Baru</h2>
        <p><strong>Nama Anak:</strong> ${childName}</p>
        <p><strong>Usia:</strong> ${childAge} tahun</p>
        <p><strong>Jenjang Dituju:</strong> ${program}</p>
        <p><strong>Nama Orang Tua:</strong> ${parentName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telepon:</strong> ${phone}</p>
      `,
    });

    await sendMail({
      to: email,
      subject: `Konfirmasi Pendaftaran - ${siteConfig.name}`,
      html: `
        <h2>Terima kasih, ${parentName}!</h2>
        <p>Pendaftaran untuk ananda <strong>${childName}</strong> pada jenjang
        <strong>${program}</strong> telah kami terima.</p>
        <p>Tim admisi kami akan menghubungi anda dalam 1-2 hari kerja untuk
        proses selanjutnya.</p>
        <p>Salam hangat,<br/>${siteConfig.name}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/pendaftaran] Gagal memproses pendaftaran:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pendaftaran. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
