// Author: Zeday | https://join.co.id
// Terpisah dari lib/admin-auth.ts karena file ini mengimpor lib/db.ts
// (better-sqlite3, modul native Node) - hanya aman dipakai di route handler
// app/api/** (Node.js runtime), TIDAK BOLEH diimpor oleh proxy.ts (Edge
// Runtime, akan gagal build kalau better-sqlite3 ikut ter-bundle ke sana).
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/admin-auth";
import { getAdminUserById, type AdminUser } from "@/lib/repositories/admin-users";

type AuthResult = { user: AdminUser } | { unauthorized: NextResponse };

const UNAUTHORIZED = () => NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

async function resolveUser(request: NextRequest): Promise<AdminUser | null> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const userId = await isValidSessionToken(token);
  if (userId === null) return null;

  const user = getAdminUserById(userId);
  if (!user || !user.active) return null;
  return user;
}

// Dipakai bersama oleh setiap route handler admin (selain login) supaya
// pengecekan cookie + verifikasi token + status aktif pengguna tidak
// disalin-tempel di tiap route - proxy.ts sudah melindungi navigasi halaman
// /admin/** (tapi hanya lewat validitas token, tanpa cek database karena
// berjalan di Edge Runtime), helper ini melindungi route API /api/admin/**
// (dan /api/settings) dengan pengecekan penuh termasuk status nonaktif.
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const user = await resolveUser(request);
  return user ? null : UNAUTHORIZED();
}

// Untuk route yang perlu tahu SIAPA yang melakukan aksi (mis. untuk activity
// log, atau endpoint 2FA yang beroperasi atas akun milik sendiri).
export async function requireAdminUser(request: NextRequest): Promise<AuthResult> {
  const user = await resolveUser(request);
  return user ? { user } : { unauthorized: UNAUTHORIZED() };
}

// Untuk route yang hanya boleh diakses role "owner" (manajemen pengguna,
// riwayat aktivitas semua staf).
export async function requireOwner(request: NextRequest): Promise<AuthResult> {
  const user = await resolveUser(request);
  if (!user) return { unauthorized: UNAUTHORIZED() };
  if (user.role !== "owner") {
    return {
      unauthorized: NextResponse.json(
        { error: "Hanya pemilik akun (owner) yang bisa mengakses ini." },
        { status: 403 }
      ),
    };
  }
  return { user };
}

// Untuk Server Component halaman /admin/** (bukan route handler API) -
// next/headers, bukan NextRequest, adalah cara membaca cookie di sana.
// Dipakai untuk merender nav sesuai peran dan menjaga halaman khusus owner
// (mis. /admin/pengguna) sebagai lapisan pertahanan kedua di luar API-nya
// sendiri yang sudah dilindungi requireOwner.
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const userId = await isValidSessionToken(token);
  if (userId === null) return null;

  const user = getAdminUserById(userId);
  if (!user || !user.active) return null;
  return user;
}
