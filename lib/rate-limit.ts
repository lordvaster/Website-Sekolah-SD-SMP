// Author: Zeday | https://join.co.id
// Rate limit sederhana berbasis memori per instance server.
// Cukup untuk mencegah spam form pada skala trafik sekolah biasa;
// untuk skala besar/multi-instance (mis. Vercel serverless, tiap
// invocation/cold start punya Map kosong sendiri) gunakan solusi
// terpusat seperti Upstash Redis.

import { NextResponse, type NextRequest } from "next/server";

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

// Menyapu entri kedaluwarsa setiap kali dipanggil agar Map tidak bertumbuh
// tanpa batas selama proses server berjalan lama (setiap IP/kunci berbeda
// yang pernah singgah sebelumnya kalau tidak dibersihkan akan tertinggal
// selamanya).
function pruneExpired(now: number) {
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }
}

export function isRateLimited(key: string) {
  const now = Date.now();
  pruneExpired(now);

  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

// x-forwarded-for adalah header yang bisa diisi bebas oleh klien. Reverse
// proxy yang jujur (Nginx dengan `proxy_set_header X-Forwarded-For
// $proxy_add_x_forwarded_for;`, atau Vercel) MENAMBAHKAN alamat asli
// koneksi ke ujung nilai yang sudah ada, bukan menimpanya - jadi entri yang
// bisa dipercaya adalah entri PALING KANAN (hop terakhir yang ditambahkan
// proxy kita sendiri), bukan entri pertama yang masih bisa dipalsukan
// bebas oleh klien. x-real-ip biasanya diisi langsung oleh reverse proxy
// tepercaya sehingga diprioritaskan lebih dulu bila tersedia. Jika
// deployment anda ada di belakang proxy/CDN lain dengan konvensi berbeda,
// sesuaikan logika ini agar rate limit tidak mudah dilewati.
export function getClientIp(request: NextRequest) {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor.split(",").map((h) => h.trim());
    return hops[hops.length - 1];
  }

  return "unknown";
}

// Helper bersama dipakai oleh setiap route yang perlu dibatasi lajunya,
// agar bentuk key (prefix per-endpoint) dan respons 429 konsisten tanpa
// diduplikasi di setiap route.ts.
export function rateLimitGuard(request: NextRequest, prefix: string) {
  const ip = getClientIp(request);
  if (isRateLimited(`${prefix}:${ip}`)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan, coba lagi dalam beberapa menit." },
      { status: 429 }
    );
  }
  return null;
}
