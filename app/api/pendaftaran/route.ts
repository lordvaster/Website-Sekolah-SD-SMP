// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse, after } from "next/server";
import { registrationSchema } from "@/lib/validation";
import { sendMail } from "@/lib/email";
import { rateLimitGuard } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";
import { escapeHtml } from "@/lib/utils";
import { emailNotConfiguredResponse, validationErrorResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "pendaftaran");
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const { childName, childAge, program, parentName, email, phone } = parsed.data;
  const safeChildName = escapeHtml(childName);
  const safeProgram = escapeHtml(program);
  const safeParentName = escapeHtml(parentName);

  try {
    // Notifikasi ke sekolah bersifat wajib - inilah yang membuat pendaftaran
    // "tercatat". Email konfirmasi ke orang tua bersifat best-effort dan
    // dijadwalkan lewat after() supaya tidak memperlambat respons dan tidak
    // menggagalkan pendaftaran bila pengiriman ke orang tua sempat gagal
    // (mencegah pengguna submit ulang dan menggandakan notifikasi ke admin).
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

    if (!adminResult.sent && process.env.NODE_ENV === "production") {
      return emailNotConfiguredResponse();
    }

    after(async () => {
      try {
        await sendMail({
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
      } catch (error) {
        console.error("[api/pendaftaran] Gagal mengirim email konfirmasi ke orang tua:", error);
      }
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
