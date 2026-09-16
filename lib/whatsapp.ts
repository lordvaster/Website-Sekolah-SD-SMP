// Author: Zeday | https://join.co.id
// Notifikasi WhatsApp ke admin sekolah lewat gateway pihak ketiga (Fonnte -
// https://fonnte.com, populer & terjangkau untuk skala sekolah di
// Indonesia, tidak perlu verifikasi Meta Business seperti WhatsApp Cloud
// API resmi). Best-effort seperti lib/email.ts: kegagalan dicatat tapi
// tidak pernah menggagalkan alur yang memanggilnya.
//
// Setup: daftar di fonnte.com -> hubungkan nomor WhatsApp perangkat (scan
// QR sekali di dashboard) -> salin token API -> isi di .env:
//   WHATSAPP_API_TOKEN=<token dari dashboard Fonnte>
//   WHATSAPP_ADMIN_NUMBER=628123456789   (format 62xxx, TANPA tanda +)
//
// Pindah ke gateway lain (mis. Wablas)? Cukup sesuaikan URL/body request
// di sendWhatsAppNotification() - satu-satunya tempat yang tahu bentuk API
// gateway-nya, tidak menyebar ke pemanggilnya (app/api/pendaftaran).
export function isWhatsAppConfigured() {
  return Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_ADMIN_NUMBER);
}

export async function sendWhatsAppNotification(message: string): Promise<{ sent: boolean }> {
  if (!isWhatsAppConfigured()) {
    console.info("[whatsapp] WHATSAPP_API_TOKEN/WHATSAPP_ADMIN_NUMBER belum diisi, melewati notifikasi.");
    return { sent: false };
  }

  const response = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: process.env.WHATSAPP_API_TOKEN!,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      target: process.env.WHATSAPP_ADMIN_NUMBER!,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Fonnte API merespons status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json().catch(() => null);
  // Fonnte membalas 200 OK bahkan untuk beberapa kegagalan (mis. device
  // belum terhubung) dengan { status: false, reason: "..." } di body -
  // cek eksplisit alih-alih hanya mengandalkan response.ok.
  if (data && data.status === false) {
    throw new Error(`Fonnte menolak pesan: ${data.reason || JSON.stringify(data)}`);
  }

  return { sent: true };
}
