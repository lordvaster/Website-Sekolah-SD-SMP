// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/require-admin";
import { readSettings, writeSettings } from "@/lib/settings";
import { iconPresets, type IconPresetKey } from "@/lib/icon-presets";
import { rateLimitGuard } from "@/lib/rate-limit";
import { validationErrorResponse } from "@/lib/api-helpers";
import { logActivity } from "@/lib/repositories/activity-log";

const optionalUrl = z.union([z.literal(""), z.string().trim().url("URL tidak valid")]);

const updateSchema = z.object({
  activeIcon: z.enum(Object.keys(iconPresets) as [string, ...string[]]),
  siteTagline: z.string().trim().min(3).max(120),
  schoolDescription: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(500),
  schoolAddress: z.string().trim().min(5, "Alamat minimal 5 karakter").max(300),
  schoolPhone: z.string().trim().min(5, "Nomor telepon minimal 5 karakter").max(30),
  schoolWhatsapp: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, "Format: angka saja tanpa spasi/+, contoh 6281234567890"),
  schoolEmail: z.string().trim().email("Format email tidak valid"),
  operationalHours: z.string().trim().min(3, "Wajib diisi").max(100),
  socialInstagram: optionalUrl,
  socialFacebook: optionalUrl,
  socialYoutube: optionalUrl,
  mapsEmbedSrc: z.string().trim().min(1, "Wajib diisi").max(2000),
  privacyPolicyContent: z.string().trim().min(1, "Wajib diisi").max(20000),
});

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  // Endpoint ini memverifikasi signature sesi di setiap panggilan, jadi
  // tetap diberi rate limit walau sudah di belakang cookie httpOnly -
  // mengurangi ruang percobaan brute-force/timing terhadap verifikasi itu.
  const limited = rateLimitGuard(request, "settings");
  if (limited) return limited;

  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  try {
    const updated = await writeSettings({
      ...parsed.data,
      activeIcon: parsed.data.activeIcon as IconPresetKey,
    });
    // Info kontak/sosial media tampil di footer app/(site)/layout.tsx, yang
    // membungkus SEMUA halaman publik - revalidate seluruh layout itu (bukan
    // cuma satu path) supaya perubahan tampil seketika di mana pun, tidak
    // menunggu ISR 60 detik favicon/tagline di app/layout.tsx (root, beda
    // dari layout ini).
    revalidatePath("/", "layout");
    logActivity({ userId: auth.user.id, username: auth.user.username, action: "settings.update" });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[api/settings] Gagal menyimpan data/settings.json:", error);
    return NextResponse.json(
      {
        error:
          "Gagal menyimpan pengaturan. Pastikan berkas data/settings.json dapat ditulis di server (tidak read-only), lalu coba lagi.",
      },
      { status: 500 }
    );
  }
}
