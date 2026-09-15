// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  // Halaman login (/admin) sendiri harus tetap bisa diakses tanpa sesi -
  // kalau tidak, admin tidak akan pernah bisa login. Selain path persis
  // itu, seluruh subtree /admin/** dianggap perlu login, termasuk halaman
  // baru yang mungkin ditambahkan nanti - jadi tidak perlu diingat untuk
  // didaftarkan satu per satu ke matcher di bawah.
  if (request.nextUrl.pathname === "/admin") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  if ((await isValidSessionToken(token)) === null) {
    const loginUrl = new URL("/admin", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
