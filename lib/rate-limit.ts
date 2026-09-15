// Author: Zeday | https://join.co.id
// Rate limit sederhana berbasis memori per instance server.
// Cukup untuk mencegah spam form pada skala trafik sekolah biasa;
// untuk skala besar/multi-instance gunakan solusi seperti Upstash Redis.

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
