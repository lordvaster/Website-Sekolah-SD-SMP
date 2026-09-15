// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/require-admin";
import { listActivity } from "@/lib/repositories/activity-log";

export async function GET(request: NextRequest) {
  const auth = await requireOwner(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const beforeIdParam = request.nextUrl.searchParams.get("beforeId");
  const beforeId = beforeIdParam ? Number(beforeIdParam) : undefined;
  if (beforeIdParam && !Number.isInteger(beforeId)) {
    return NextResponse.json({ error: "beforeId tidak valid." }, { status: 400 });
  }

  return NextResponse.json(listActivity(beforeId));
}
