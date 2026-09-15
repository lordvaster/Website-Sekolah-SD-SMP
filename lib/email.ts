// Author: Zeday | https://join.co.id
import nodemailer, { type Transporter } from "nodemailer";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

// Transporter (dan connection pool SMTP di baliknya) dibuat sekali dan
// dipakai ulang, bukan dibangun ulang di setiap panggilan sendMail -
// menghindari handshake SMTP baru untuk tiap email yang dikirim.
let cachedTransport: Transporter | null = null;

function getTransport() {
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return cachedTransport;
}

// Jaga-jaga tambahan (defense in depth) di luar penanganan bawaan
// nodemailer: header subject/nama pengirim tidak boleh memuat CR/LF,
// supaya tidak ada celah header injection walau input lolos validasi zod.
function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!isEmailConfigured()) {
    console.info("[email] SMTP belum dikonfigurasi, melewati pengiriman:", options.subject);
    return { sent: false as const };
  }

  const transport = getTransport();
  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: sanitizeHeaderValue(options.to),
    replyTo: options.replyTo ? sanitizeHeaderValue(options.replyTo) : undefined,
    subject: sanitizeHeaderValue(options.subject),
    html: options.html,
  });
  return { sent: true as const };
}
