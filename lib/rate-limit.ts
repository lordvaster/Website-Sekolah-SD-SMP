// Author: Zeday | https://join.co.id
// Rate limit sederhana berbasis memori per instance server.
// Cukup untuk mencegah spam form pada skala trafik sekolah biasa;
// untuk skala besar/multi-instance gunakan solusi seperti Upstash Redis.

import type { NextRequest } from "next/server";

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

export function isRateLimited(key: string) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

// x-forwarded-for adalah header yang bisa diisi bebas oleh klien; hanya
// bisa dipercaya jika reverse proxy/CDN anda MENIMPA (bukan menambah) nilai
// header ini sebelum diteruskan ke aplikasi. x-real-ip biasanya diisi oleh
// reverse proxy tepercaya (mis. Nginx) sehingga lebih sulit dipalsukan
// klien secara langsung. Jika deployment anda ada di belakang proxy/CDN
// lain, sesuaikan header tepercaya di sini agar rate limit tidak mudah
// dilewati dengan memalsukan header.
export function getClientIp(request: NextRequest) {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return "unknown";
}
