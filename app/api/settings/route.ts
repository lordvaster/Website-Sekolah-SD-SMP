// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUser } from "@/lib/require-admin";
import { readSettings, writeSettings } from "@/lib/settings";
import { iconPresets, type IconPresetKey } from "@/lib/icon-presets";
import { rateLimitGuard } from "@/lib/rate-limit";
import { validationErrorResponse } from "@/lib/api-helpers";
import { logActivity } from "@/lib/repositories/activity-log";

const updateSchema = z.object({
  activeIcon: z.enum(Object.keys(iconPresets) as [string, ...string[]]),
  siteTagline: z.string().trim().min(3).max(120),
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
      activeIcon: parsed.data.activeIcon as IconPresetKey,
      siteTagline: parsed.data.siteTagline,
    });
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
