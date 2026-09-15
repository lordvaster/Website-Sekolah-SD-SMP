// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  if (!(await isValidSessionToken(token))) {
    const loginUrl = new URL("/admin", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/pengaturan"],
};
