// Author: Zeday | https://join.co.id
import nodemailer from "nodemailer";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
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
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
  });
  return { sent: true as const };
}
