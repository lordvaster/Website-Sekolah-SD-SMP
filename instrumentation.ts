// Author: Zeday | https://join.co.id
// register() dijamin Next.js selesai berjalan sebelum server mulai
// menerima request apa pun, jadi ini tempat yang tepat untuk inisialisasi
// database & seed data awal sekali saat server pertama kali menyala -
// bukan di modul lib/db.ts sendiri, supaya tidak ada race condition antara
// request pertama yang masuk dan proses seeding yang belum selesai.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { ensureSeeded } = await import("./lib/seed");
  await ensureSeeded();
}
