// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse, after } from "next/server";
import { registrationSchema } from "@/lib/validation";
import { sendMail } from "@/lib/email";
import { rateLimitGuard } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";
import { escapeHtml } from "@/lib/utils";
import { validationErrorResponse } from "@/lib/api-helpers";
import { createRegistration } from "@/lib/repositories/registrations";

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

  // Menyimpan ke database adalah langkah wajib - inilah yang membuat
  // pendaftaran benar-benar "tercatat" dan bisa dilihat admin di
  // /admin/pendaftaran, tidak lagi bergantung sepenuhnya pada email
  // terkirim atau tidak seperti sebelumnya.
  let registrationId: number;
  try {
    const registration = createRegistration({ childName, childAge, program, parentName, email, phone });
    registrationId = registration.id;
  } catch (error) {
    console.error("[api/pendaftaran] Gagal menyimpan pendaftaran ke database:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pendaftaran. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }

  // Notifikasi email bersifat best-effort di kedua sisi (sekolah & orang
  // tua) - kegagalannya dicatat tapi tidak menggagalkan pendaftaran yang
  // datanya sudah aman tersimpan di database. Keduanya dijalankan lewat
  // after() (bukan di-await sebelum respons) supaya orang tua tidak
  // menunggu round-trip SMTP tambahan hanya untuk melihat halaman sukses.
  after(async () => {
    try {
      await sendMail({
        to: process.env.CONTACT_RECEIVER_EMAIL || siteConfig.email,
        subject: `Pendaftaran siswa baru: ${childName}`,
        replyTo: email,
        html: `
          <h2>Pendaftaran Siswa Baru #${registrationId}</h2>
          <p><strong>Nama Anak:</strong> ${safeChildName}</p>
          <p><strong>Usia:</strong> ${childAge} tahun</p>
          <p><strong>Jenjang Dituju:</strong> ${safeProgram}</p>
          <p><strong>Nama Orang Tua:</strong> ${safeParentName}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Telepon:</strong> ${escapeHtml(phone)}</p>
        `,
      });
    } catch (error) {
      console.error("[api/pendaftaran] Gagal mengirim notifikasi email ke sekolah:", error);
    }
  });

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
}
