// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/lib/i18n/dictionaries";
import { LOCALE_COOKIE } from "@/lib/i18n/get-locale";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const locale = body?.locale;

  if (typeof locale !== "string" || !(locales as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: "Bahasa tidak dikenali." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(LOCALE_COOKIE, locale, {
    // Bukan httpOnly - preferensi bahasa bukan data sensitif, dan tidak
    // ada kebutuhan mencegah JS di sisi client membacanya.
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
  });
  return response;
}
